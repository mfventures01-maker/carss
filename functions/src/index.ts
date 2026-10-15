import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();
const REGION = "us-central1";

/**
 * One-time CARSS platform bootstrap identity.
 *
 * These values intentionally identify the already-created Firebase Auth user.
 * Changing them requires a reviewed source change and deployment.
 * This function never accepts a UID, email, or role from the client.
 */
const BOOTSTRAP_UID = "VyUPC4TCnQOiENF7z22QUrFQ2v22";
const BOOTSTRAP_EMAIL = "mfventures01@gmail.com";

const BOOTSTRAP_REF = db.doc("platform_authority/bootstrap");
const PLATFORM_ROLE_REF = db.doc(`platform_roles/${BOOTSTRAP_UID}`);
const AUDIT_REF = db.doc(`audit_events/bootstrap_super_admin_${BOOTSTRAP_UID}`);

type BootstrapState = {
  status?: "reserved" | "completed";
  bootstrapUid?: string;
  bootstrapEmail?: string;
};

export const bootstrapSuperAdmin = onCall(
  { region: REGION, maxInstances: 1 },
  async (request) => {
    // Require a Firebase Auth session. Never trust identity fields from input.
    const caller = request.auth;
    if (!caller) {
      throw new HttpsError("unauthenticated", "Sign in with the designated bootstrap account.");
    }

    if (caller.uid !== BOOTSTRAP_UID || caller.token.email !== BOOTSTRAP_EMAIL) {
      throw new HttpsError("permission-denied", "This identity is not authorized to bootstrap CARSS.");
    }

    if (caller.token.email_verified !== true) {
      throw new HttpsError("failed-precondition", "Verify the bootstrap email address before continuing.");
    }

    // Re-check identity from Firebase Admin, rather than relying only on the client token.
    const authUser = await getAuth().getUser(caller.uid);
    if (
      authUser.uid !== BOOTSTRAP_UID ||
      authUser.email?.toLowerCase() !== BOOTSTRAP_EMAIL ||
      authUser.emailVerified !== true ||
      authUser.disabled
    ) {
      throw new HttpsError("permission-denied", "The designated bootstrap account is not verified and active.");
    }

    // Reserve the single bootstrap slot transactionally. A retry by the same UID
    // is allowed so a failure after reservation can recover; any other UID is denied.
    await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(BOOTSTRAP_REF);
      if (!snapshot.exists) {
        tx.create(BOOTSTRAP_REF, {
          status: "reserved",
          bootstrapUid: BOOTSTRAP_UID,
          bootstrapEmail: BOOTSTRAP_EMAIL,
          reservedAt: FieldValue.serverTimestamp(),
          schemaVersion: 1,
        });
        return;
      }

      const state = snapshot.data() as BootstrapState;
      if (state.bootstrapUid !== BOOTSTRAP_UID) {
        throw new HttpsError("already-exists", "CARSS bootstrap has already been claimed by another identity.");
      }
      if (state.status !== "reserved" && state.status !== "completed") {
        throw new HttpsError("failed-precondition", "CARSS bootstrap state is invalid; manual review is required.");
      }
    });

    // Preserve unrelated custom claims; never replace them with a client-supplied object.
    const existingClaims = authUser.customClaims ?? {};
    await getAuth().setCustomUserClaims(BOOTSTRAP_UID, {
      ...existingClaims,
      carssPlatformRole: "SUPER_ADMIN",
      carssAuthorityVersion: 1,
    });

    // Finalize role, bootstrap state, and deterministic audit record atomically.
    // Repeating this transaction is safe and does not create duplicate audit records.
    await db.runTransaction(async (tx) => {
      const bootstrapSnapshot = await tx.get(BOOTSTRAP_REF);
      const current = bootstrapSnapshot.data() as BootstrapState | undefined;

      if (!current || current.bootstrapUid !== BOOTSTRAP_UID) {
        throw new HttpsError("failed-precondition", "Bootstrap reservation was lost; no completion recorded.");
      }

      tx.set(PLATFORM_ROLE_REF, {
        uid: BOOTSTRAP_UID,
        email: BOOTSTRAP_EMAIL,
        role: "SUPER_ADMIN",
        scope: "PLATFORM",
        status: "ACTIVE",
        authorityVersion: 1,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      tx.set(BOOTSTRAP_REF, {
        status: "completed",
        bootstrapUid: BOOTSTRAP_UID,
        bootstrapEmail: BOOTSTRAP_EMAIL,
        completedAt: FieldValue.serverTimestamp(),
        schemaVersion: 1,
      }, { merge: true });

      tx.set(AUDIT_REF, {
        eventId: `bootstrap_super_admin_${BOOTSTRAP_UID}`,
        eventType: "PLATFORM_SUPER_ADMIN_BOOTSTRAPPED",
        actorUid: BOOTSTRAP_UID,
        subjectUid: BOOTSTRAP_UID,
        scope: "PLATFORM",
        outcome: "SUCCESS",
        authorityVersion: 1,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    return {
      ok: true,
      role: "SUPER_ADMIN",
      scope: "PLATFORM",
      message: "CARSS Super Admin bootstrap completed. Refresh the ID token before checking custom claims.",
    };
  },
);
