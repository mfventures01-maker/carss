import { useMemo, useState } from 'react'
import './App.css'

type Theme = 'bar' | 'lounge' | 'heritage'
type Category = 'All' | 'Signature' | 'Small plates' | 'Zero proof'
const themes: Record<Theme, { label: string; eyebrow: string; headline: string }> = {
  bar: { label: 'Modern bar', eyebrow: 'YOUR NIGHT, WELL SERVED', headline: 'Good taste.\nBetter nights.' },
  lounge: { label: 'Luxury lounge', eyebrow: 'MAKE ROOM FOR THE MOMENT', headline: 'Slow down.\nStay a little.' },
  heritage: { label: 'African heritage', eyebrow: 'ROOTED IN FLAVOUR', headline: 'Local soul.\nNew stories.' },
}
const categories: Category[] = ['All', 'Signature', 'Small plates', 'Zero proof']
const items = [
  { id: '01', name: 'Citrus No. 08', category: 'Signature' as const, description: 'Bright citrus, garden herbs, a clean finish.', price: '₦8,500', accent: 'citrus', tag: 'HOUSE PICK' },
  { id: '02', name: 'Ruby Hour', category: 'Signature' as const, description: 'Deep berry notes with a sparkling lift.', price: '₦9,000', accent: 'ruby', tag: 'POPULAR' },
  { id: '03', name: 'Smoked Suya Bites', category: 'Small plates' as const, description: 'A bold, savoury plate made for sharing.', price: '₦7,500', accent: 'suya', tag: '' },
  { id: '04', name: 'Golden Ginger', category: 'Zero proof' as const, description: 'Fresh ginger, pineapple and a warm glow.', price: '₦6,000', accent: 'gold', tag: '' },
]

export default function ExperienceTemplate() {
  const [theme, setTheme] = useState<Theme>('bar')
  const [category, setCategory] = useState<Category>('All')
  const [saved, setSaved] = useState<string[]>([])
  const visibleItems = useMemo(() => items.filter(item => category === 'All' || item.category === category), [category])
  const copy = themes[theme]
  const toggleSaved = (id: string) => setSaved(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])

  return <main className={`experience theme-${theme}`} id="top">
    <div className="preview-banner"><span className="preview-dot" /> CARSS EXPERIENCE ENGINE <span className="banner-divider">/</span> INTERACTIVE TEMPLATE PREVIEW <span className="preview-note">Sample content · not connected to live business data</span></div>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="CARSS home"><span className="brand-mark">C</span><span>CARSS<span className="brand-period">.</span><small>HOSPITALITY, IN MOTION</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#experience">Experience</a><a href="#menu">Explore menu</a><a href="#system">The system</a></nav>
      <a className="header-cta" href="#menu">Explore the menu <span>↗</span></a>
    </header>

    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span /> {copy.eyebrow}</div>
        <h1>{copy.headline.split('\n').map((line, i) => <span key={line} className={i ? 'headline-accent' : ''}>{line}</span>)}</h1>
        <p className="hero-description">A digital front door that feels like your venue. Discover the menu, find your favourites, and let every detail carry the atmosphere.</p>
        <div className="hero-actions"><a className="button-primary" href="#menu">Discover the menu <span>↗</span></a><a className="text-link" href="#experience">See the experience <span>↓</span></a></div>
        <div className="hero-proof"><div className="proof-avatars" aria-hidden="true"><span>J</span><span>A</span><span>K</span></div><p><strong>Designed around the guest</strong><br />One experience. Every touchpoint.</p></div>
      </div>
      <div className="hero-art" aria-label="Animated abstract product composition">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-glow" />
        <div className="floating-fruit fruit-citrus"><span>✳</span></div><div className="floating-fruit fruit-berry"><span>●</span><i>●</i><b>●</b></div><div className="floating-fruit fruit-leaf"><span>⌁</span></div>
        <div className="product-stage"><div className="stage-shadow" /><div className="glass-cup"><div className="drink-liquid" /><div className="glass-rim" /><div className="glass-stem" /><div className="glass-base" /><div className="glass-garnish" /></div><div className="stage-label"><span>CARSS / SIGNATURE</span><strong>Made for the moment.</strong></div></div>
        <div className="art-caption caption-top"><span className="caption-line" /> IMMERSIVE MENU DESIGN</div><div className="art-caption caption-bottom">01 <span>SCROLL TO EXPLORE</span> <b>↓</b></div>
        <div className="float-chip chip-left"><span className="chip-icon">✦</span><span><b>Every detail</b><small>Made to be discovered</small></span></div><div className="float-chip chip-right"><span className="status-pulse" /><span><b>Brand-first</b><small>Built around your venue</small></span></div>
      </div>
      <div className="hero-bottomline"><span>HOSPITALITY, REIMAGINED</span><span>01 / 03</span></div>
    </section>

    <section className="experience-strip" id="experience"><div className="strip-intro"><span className="section-kicker">THE EXPERIENCE ENGINE</span><h2>One system.<br /><em>Distinct atmospheres.</em></h2></div><p className="strip-description">Choose a venue personality. The visual language adapts while the underlying business authority and data rules stay unchanged.</p>
      <div className="theme-switcher" role="group" aria-label="Preview venue themes">{(['bar', 'lounge', 'heritage'] as Theme[]).map((option, i) => <button key={option} className={theme === option ? 'theme-option active' : 'theme-option'} onClick={() => setTheme(option)} aria-pressed={theme === option}><span className={`theme-swatch swatch-${option}`}>{['✳', '◒', '✺'][i]}</span><span>{themes[option].label}</span><span className="option-arrow">↗</span></button>)}</div>
    </section>

    <section className="menu-section" id="menu"><div className="menu-heading"><div><span className="section-kicker">A TASTE OF WHAT'S POSSIBLE</span><h2>Made to <em>tempt.</em></h2><p>Motion draws the eye. Clear details make choosing easy.</p></div><span className="demo-pill"><span /> TEMPLATE CONTENT</span></div>
      <div className="menu-controls"><div className="category-tabs" role="group" aria-label="Filter menu category">{categories.map(value => <button key={value} onClick={() => setCategory(value)} className={category === value ? 'category-tab active' : 'category-tab'} aria-pressed={category === value}>{value}</button>)}</div><span className="item-count">{String(visibleItems.length).padStart(2, '0')} SAMPLE ITEMS</span></div>
      <div className="menu-grid">{visibleItems.map((item, i) => <article className={`menu-card card-${item.accent}`} key={item.id} style={{ animationDelay: `${i * 90}ms` }}>
        <div className="menu-visual">{item.tag && <span className="item-tag">{item.tag}</span>}<button className={saved.includes(item.id) ? 'save-button saved' : 'save-button'} aria-label={saved.includes(item.id) ? `Unsave ${item.name}` : `Save ${item.name}`} aria-pressed={saved.includes(item.id)} onClick={() => toggleSaved(item.id)}>{saved.includes(item.id) ? '♥' : '♡'}</button><div className="visual-ring" /><div className="mini-product"><span className="mini-liquid" /><span className="mini-highlight" /><span className="mini-logo">C.</span></div><div className="visual-fruit fruit-a" /><div className="visual-fruit fruit-b" /><div className="visual-leaf" /><span className="visual-word">{item.accent.toUpperCase()}</span></div>
        <div className="menu-card-copy"><div className="item-meta"><span>{item.category}</span><span>{item.id} / 04</span></div><div className="item-title-row"><h3>{item.name}</h3><strong>{item.price}</strong></div><p>{item.description}</p><button className="item-link" onClick={() => document.getElementById('system')?.scrollIntoView({ behavior: 'smooth' })}>View experience details <span>↗</span></button></div>
      </article>)}</div>
      <div className="menu-footnote"><span>i</span> Menu items, prices and visuals are illustrative. Production content must come from the authorized CARSS source of truth.</div>
    </section>

    <section className="system-section" id="system"><div className="system-visual"><div className="system-window"><div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>CARSS / EXPERIENCE LAYER</span><span className="window-live">PREVIEW</span></div><div className="window-body"><div className="window-sidebar"><span className="sidebar-logo">C.</span><i /><i /><i /><i /></div><div className="window-main"><span className="window-overline">VENUE EXPERIENCE</span><strong>Make it yours.</strong><span className="window-sub">Theme &amp; media controls</span><div className="window-control"><span>Atmosphere</span><b>{copy.label}</b></div><div className="window-control"><span>Motion</span><b>Scroll + reveal</b></div><div className="window-control"><span>Content source</span><b>Authorized CMS</b></div><div className="window-bars"><i /><i /><i /><i /><i /><i /></div></div></div></div><span className="visual-note note-one">01 / THEME LAYER</span><span className="visual-note note-two">02 / CONTENT LAYER</span></div>
      <div className="system-copy"><span className="section-kicker">BEAUTIFUL BY DESIGN. GOVERNED BY DEFAULT.</span><h2>Animation reveals the truth.<br /><em>It never invents it.</em></h2><p>CARSS separates the guest-facing experience from business authority. Themes control presentation. Authorized systems control products, prices, availability, orders and permissions.</p><div className="principle-list">
        <div><span>01</span><p><b>Reusable by venue</b><small>Bar, lounge, restaurant, cafe and resort experiences.</small></p><span className="principle-check">✓</span></div>
        <div><span>02</span><p><b>Media-ready by design</b><small>Swap in optimized product photography and transparent assets.</small></p><span className="principle-check">✓</span></div>
        <div><span>03</span><p><b>Authority stays intact</b><small>Presentation cannot override roles, tenant scope or source data.</small></p><span className="principle-check">✓</span></div>
      </div><a className="button-primary system-cta" href="#top">Back to the experience <span>↑</span></a></div>
    </section>
    <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">C</span><span>CARSS<span className="brand-period">.</span><small>HOSPITALITY, IN MOTION</small></span></a><p>One operating system. Every guest experience.</p><span>DESIGN TEMPLATE PREVIEW · 2026</span></footer>
  </main>
}
