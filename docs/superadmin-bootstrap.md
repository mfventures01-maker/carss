# CARSS Super Admin Bootstrap

## Status

Implementation scaffold only. It has not been installed, built, tested, or deployed to Firebase by this change.

## Fixed bootstrap identity

- Firebase project: `carss-d7825`
- Email: `mfventures01@gmail.com`
- Firebase UID: `VyUPC4TCnQOiENF7z22QUrFQ2v22`
- Function: `bootstrapSuperAdmin`
- Function region: `us-central1` (selected to align with Firestore multi-region `nam5`)

The function accepts no caller-provided UID, email, or role. It requires the exact UID and email, a verified email in the caller token, and a second verification through Firebase Admin Authentication.

## Idempotence and single-bootstrap protection

The function reserves `platform_authority/bootstrap` transactionally. Only the designated UID can resume a reserved or completed bootstrap. A different UID is rejected. It assigns the platform custom claim, writes the platform role document, marks bootstrap completed, and writes a deterministic audit event.

Custom claims are not reflected in an already-issued ID token. The client must force-refresh its ID token after a successful response.

## Firestore rules

`firestore.rules` intentionally denies all client reads and writes. Do not loosen these rules until authorization rules have been designed and tested. Cloud Functions using the Admin SDK bypass Firestore rules; every privileged function must perform its own authorization checks.

## Required verification before deployment

1. Confirm Firebase CLI project selection explicitly uses `carss-d7825`.
2. Install dependencies and run `npm run build` from `functions/`.
3. Test unauthenticated caller: rejected.
4. Test authenticated wrong UID/email: rejected.
5. Test unverified bootstrap email: rejected.
6. Test designated verified UID: succeeds.
7. Retry as designated UID: succeeds without duplicate audit event.
8. Attempt bootstrap as a different UID after completion: rejected.
9. Verify the custom claim after refreshing the ID token.
10. Verify Firestore rules still deny all client access.

Deploy only the function after review:

```powershell
firebase use carss-d7825
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions:bootstrapSuperAdmin --project carss-d7825
```

Deployment requires the Firebase project owner's explicit action and appropriate billing/permissions. Do not deploy until the build and review steps pass.
