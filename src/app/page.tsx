"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { appConfig } from "@/config/app"
import { SCORING } from "@/config/scoring"

const T = {
  bg: "#F0EFEB",
  panel: "#F8F7F5",
  ink: "#1A1814",
  sub: "#65605A",
  line: "#DDDCD9",
  lineSoft: "#E5E4E0",
  chip: "#E8E6E1",
  accentInk: "#F8F7F5",
}

const PILLARS = [
  { tag: "01", name: "Foundation", sub: "Read",   desc: "Text-first modules. What LLMs actually do. What they're bad at. Build vs. buy. Ethics. Security. Agents.", meta: "Browse modules",   href: "/learn" },
  { tag: "02", name: "Scenarios",   sub: "Decide", desc: "Decision simulations drawn from real pitches, scope fights, biased models, rogue agents, and cost overruns. Write your reasoning, get direct feedback.", meta: "Try a scenario", href: "/scenarios" },
  { tag: "03", name: "Missions",    sub: "Apply",  desc: "Exercises you complete on your real work. Find an AI opportunity. Draft a usage policy. Run a bias check. Write a feature brief.", meta: "Pick a mission",  href: "/missions" },
]

const LEVEL_BLURBS: Record<number, string> = {
  1: "You know the landscape.",
  2: "You can ask the right questions.",
  3: "You make defensible calls.",
  4: "You set the direction for others.",
}

const LEVELS = SCORING.levels.map((l) => ({
  n: l.level,
  name: l.name,
  pts: String(l.minPoints),
  blurb: LEVEL_BLURBS[l.level] ?? "",
}))


const AUDIENCE_ROLES = [
  { tag: "PM", title: "Product managers",        blurb: "You’re evaluating AI opportunities, assessing vendor claims, and aligning initiatives with clear business priorities and measurable outcomes.",  skills: ["Vendor evaluation", "Scope under uncertainty", "ROI you can defend", "Failure-mode planning"] },
  { tag: "EM", title: "Engineering managers",    blurb: "You’re responsible for technical direction, platform decisions, and helping teams deliver reliable systems built on probabilistic technologies.", skills: ["Build-vs-buy", "Eval design", "Cost & latency", "Team enablement"] },
  { tag: "IC", title: "Individual contributors", blurb: "You’re designing, testing, and shipping AI-powered features while determining where AI adds value — and where traditional approaches are more effective.", skills: ["Working with AI tools", "Reliable AI features", "Prompt evaluation", "Red-teaming"] },
]

// ── Atoms ──────────────────────────────────────────────────────────────────
function Mark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M2 18 L8 7 L11 12 L14 4 L20 18 Z" stroke={T.ink} strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        <line x1="2" y1="18.6" x2="20" y2="18.6" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, lineHeight: 1, letterSpacing: "-0.01em", color: T.ink }}>
        Ascent
      </span>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.sub, marginBottom: 22 }}>
      <span style={{ width: 16, height: 1, background: T.sub, display: "inline-block" }} />
      {children}
    </div>
  )
}

function SectionHead({ kicker, title, lede }: { kicker: string; title: React.ReactNode; lede: string }) {
  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-[60px]" style={{ alignItems: "end" }}>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(40px, 4.4vw, 60px)", lineHeight: 1, letterSpacing: "-0.01em", color: T.ink, fontWeight: 400 }}>{title}</h2>
      </div>
      <p style={{ margin: 0, maxWidth: 540, fontSize: 17, lineHeight: 1.6, color: T.sub }}>{lede}</p>
    </div>
  )
}

function Btn({ children, primary, href }: { children: React.ReactNode; primary?: boolean; href?: string }) {
  const [hover, setHover] = useState(false)
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500, padding: "11px 18px", borderRadius: 6, textDecoration: "none", cursor: "pointer", fontFamily: "inherit", border: "1px solid transparent", transition: "all 160ms ease" }
  const styles: React.CSSProperties = primary
    ? { ...base, background: hover ? "#3A4A6B" : T.ink, color: T.accentInk }
    : { ...base, background: "transparent", color: T.ink, borderColor: hover ? T.ink : T.line }
  return (
    <Link href={href ?? "#"} style={styles} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </Link>
  )
}

// ── Topographic ridge ───────────────────────────────────────────────────────
function Ridge() {
  const lines = [
    { y: 60,  amp: 18, freq: 0.018, phase: 0.2, op: 0.10 },
    { y: 78,  amp: 26, freq: 0.014, phase: 1.1, op: 0.16 },
    { y: 98,  amp: 34, freq: 0.012, phase: 2.4, op: 0.24 },
    { y: 122, amp: 44, freq: 0.010, phase: 3.7, op: 0.36 },
    { y: 152, amp: 56, freq: 0.008, phase: 5.1, op: 0.55 },
  ]
  const W = 1200, H = 220
  const path = (l: typeof lines[0]) => {
    let d = `M 0 ${H}`
    for (let x = 0; x <= W; x += 6) {
      const y = l.y + Math.sin(x * l.freq + l.phase) * l.amp + Math.sin(x * l.freq * 2.3 + l.phase * 0.7) * (l.amp * 0.25)
      d += ` L ${x} ${y}`
    }
    return d + ` L ${W} ${H} Z`
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 180, display: "block" }} aria-hidden>
      {lines.map((l, i) => <path key={i} d={path(l)} fill={T.ink} opacity={l.op} />)}
      {[40, 70, 100, 130, 160, 190].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={T.ink} opacity="0.04" strokeWidth="1" />
      ))}
    </svg>
  )
}

const MAX = 1240
const PAD = "clamp(16px, 4vw, 40px)"
const inner: React.CSSProperties = { maxWidth: MAX, margin: "0 auto", padding: `0 ${PAD}` }

// ── Sections ───────────────────────────────────────────────────────────────
function Header() {
  const { data: session } = useSession()
  const signedIn = !!session?.user
  return (
    <header style={{ borderBottom: `1px solid ${T.line}`, background: T.bg, position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)" }}>
      <div style={{ ...inner, padding: `16px ${PAD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Mark />
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[["Foundation", "/learn"], ["Scenarios", "/scenarios"], ["Missions", "/missions"]].map(([label, href]) => (
            <Link key={label} href={href} className="hidden sm:block" style={{ fontSize: 13, color: T.sub, textDecoration: "none" }}>{label}</Link>
          ))}
          <span className="hidden sm:inline-block" style={{ width: 1, height: 18, background: T.line }} />
          {signedIn ? (
            <>
              <span className="hidden sm:block" style={{ fontSize: 13, color: T.sub }}>{session.user?.name ?? session.user?.email}</span>
              <Btn primary href="/dashboard">Dashboard</Btn>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block" style={{ fontSize: 13, color: T.sub, textDecoration: "none" }}>Sign in</Link>
              <Btn primary href="/learn">Start free →</Btn>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${T.line}` }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <Ridge />
        </div>
      </div>
      <div style={{ ...inner, padding: `96px ${PAD} 140px`, position: "relative" }}>
        <Kicker>An AI curriculum for product &amp; engineering</Kicker>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(56px, 7.4vw, 104px)", lineHeight: 0.96, letterSpacing: "-0.02em", color: T.ink, fontWeight: 400, maxWidth: 920 }}>
          Learn AI by making<br />
          the <em style={{ fontStyle: "italic" }}>decisions</em> you&apos;ll<br />
          actually have to make.
        </h1>
        <p style={{ marginTop: 32, maxWidth: 580, fontSize: 17, lineHeight: 1.55, color: T.sub }}>
          Ascent is a structured curriculum for product managers, engineering managers, and ICs. Work through vendor pitches, scope fights, and build-vs-buy calls — the situations your role actually requires you to navigate. Get direct feedback on your reasoning.
        </p>
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Btn primary href="/learn">Start free →</Btn>
          <Btn href="/signup">Create an account</Btn>
        </div>

      </div>
    </section>
  )
}

function Pillars() {
  return (
    <section style={{ borderBottom: `1px solid ${T.line}` }}>
      <div style={{ ...inner, padding: `100px ${PAD}` }}>
        <SectionHead kicker="The shape of the program" title="Three modes. One arc." lede="Read what you need. Decide under pressure. Apply it on your real work. Move between them however suits you." />
        <div className="grid sm:grid-cols-3" style={{ marginTop: 56, gap: 0, borderTop: `1px solid ${T.line}` }}>
          {PILLARS.map((p, i) => (
            <Link key={p.tag} href={p.href} style={{ display: "block", padding: "32px 32px 36px", borderRight: i < 2 ? `1px solid ${T.line}` : "none", borderBottom: `1px solid ${T.line}`, background: T.bg, textDecoration: "none", transition: "background 140ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.panel)}
              onMouseLeave={(e) => (e.currentTarget.style.background = T.bg)}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: T.sub }}>— {p.tag}</span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: T.sub, textTransform: "uppercase" }}>{p.sub}</span>
              </div>
              <h3 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 38, lineHeight: 1, letterSpacing: "-0.01em", color: T.ink, fontWeight: 400 }}>{p.name}</h3>
              <p style={{ marginTop: 18, fontSize: 14.5, lineHeight: 1.6, color: T.sub, minHeight: 88 }}>{p.desc}</p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px dashed ${T.line}`, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: T.ink, textTransform: "uppercase" }}>{p.meta} →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function LevelsSection() {
  return (
    <section style={{ borderBottom: `1px solid ${T.line}` }}>
      <div style={{ ...inner, padding: `100px ${PAD}` }}>
        <SectionHead kicker="The arc" title="Four levels. Earned, not awarded." lede="Progress reflects the decisions you've reasoned through — your position on a defined path from Aware to Leader." />
        <div style={{ marginTop: 24, position: "relative" }}>
          <svg viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden style={{ display: "block", width: "100%", height: "auto" }}>
            <defs>
              <linearGradient id="ridgeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#1A1814" stopOpacity="0.06" />
                <stop offset="1" stopColor="#1A1814" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 200 L60 175 L120 165 L180 145 L240 130 L300 120 L360 100 L420 95 L480 80 L540 70 L600 55 L660 65 L720 45 L780 38 L840 28 L900 35 L960 18 L1020 10 L1080 22 L1140 12 L1200 4 L1200 220 L0 220 Z" fill="url(#ridgeFill)" />
            <path d="M0 200 L60 175 L120 165 L180 145 L240 130 L300 120 L360 100 L420 95 L480 80 L540 70 L600 55 L660 65 L720 45 L780 38 L840 28 L900 35 L960 18 L1020 10 L1080 22 L1140 12 L1200 4" stroke="#1A1814" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
            <circle cx="150" cy="155" r="5" fill="#1A1814" />
            <circle cx="450" cy="87" r="5" fill="#1A1814" />
            <circle cx="750" cy="42" r="5" fill="#F0EFEB" stroke="#1A1814" strokeWidth="1.4" />
            <circle cx="1050" cy="16" r="5" fill="#F0EFEB" stroke="#1A1814" strokeWidth="1.4" />
            <line x1="150" y1="160" x2="150" y2="218" stroke="#1A1814" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
            <line x1="450" y1="92" x2="450" y2="218" stroke="#1A1814" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
            <line x1="750" y1="47" x2="750" y2="218" stroke="#1A1814" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
            <line x1="1050" y1="21" x2="1050" y2="218" stroke="#1A1814" strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
          </svg>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ marginTop: -1, borderTop: `1px solid ${T.ink}` }}>
            {LEVELS.map((l, i) => (
              <div key={l.n} style={{ padding: "18px 22px 22px", borderRight: i < 3 ? `1px solid ${T.line}` : "none", position: "relative" }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: i < 2 ? T.sub : "#A09890", textTransform: "uppercase", marginBottom: 8 }}>L0{l.n} · {l.pts} PTS</div>
                <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, lineHeight: 1, letterSpacing: "-0.01em", color: i < 2 ? T.ink : "#A09890", marginBottom: 8 }}>{l.name}</div>
                <div style={{ fontSize: 13, color: i < 2 ? T.sub : "#B0ABA3", lineHeight: 1.5 }}>{l.blurb}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 56, padding: "20px 24px", border: `1px dashed ${T.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13.5, color: T.sub, maxWidth: 720 }}>Levels and points only apply to signed-in users. Guests can read all modules and try a selection of scenarios and missions without signing up — progress isn&apos;t saved between sessions.</div>
          <Link href="/learn" style={{ fontSize: 13.5, color: T.ink, textDecoration: "none", borderBottom: `1px solid ${T.ink}`, paddingBottom: 2 }}>Browse the curriculum →</Link>
        </div>
      </div>
    </section>
  )
}


function AudienceSection() {
  return (
    <section style={{ borderBottom: `1px solid ${T.line}` }}>
      <div style={{ ...inner, padding: `100px ${PAD}` }}>
        <SectionHead kicker="Who it's for" title="Three roles. One curriculum that diverges where it should." lede="Foundation is shared. Scenarios, missions, and module emphasis shift to match how your role actually intersects with AI." />
        <div className="grid sm:grid-cols-2 md:grid-cols-3" style={{ marginTop: 64, gap: 24 }}>
          {AUDIENCE_ROLES.map((r) => (
            <div key={r.tag} style={{ padding: 28, border: `1px solid ${T.line}`, background: T.panel, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, border: `1px solid ${T.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.06em", color: T.ink, borderRadius: 4 }}>{r.tag}</div>
                <h3 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 26, lineHeight: 1, letterSpacing: "-0.01em", color: T.ink, fontWeight: 400 }}>{r.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: T.sub }}>{r.blurb}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: `1px dashed ${T.line}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {r.skills.map((s) => (
                  <li key={s} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: T.ink }}>
                    <span style={{ width: 4, height: 4, borderRadius: 999, background: T.ink, display: "inline-block" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section style={{ borderBottom: `1px solid ${T.line}`, position: "relative" }}>
      <div style={{ ...inner, padding: `120px ${PAD} 140px`, position: "relative" }}>
        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-10 md:gap-[80px]" style={{ alignItems: "end" }}>
          <div style={{ minWidth: 0 }}>
            <Kicker>Begin the ascent</Kicker>
            <h2 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.02em", color: T.ink, fontWeight: 400 }}>
              Pick a role.<br /><em style={{ fontStyle: "italic" }}>Open a scenario.</em>
            </h2>
            <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.55, color: T.sub, maxWidth: 540 }}>
              Write a real answer. Read the feedback on your reasoning. Work through the curriculum at your own pace.
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn primary href="/learn">Start free →</Btn>
              <Btn href="/signup">Create an account</Btn>
            </div>
          </div>
          <div style={{ border: `1px solid ${T.line}`, padding: 28, background: T.panel, minWidth: 0 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.sub, marginBottom: 16 }}>What an account adds</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[["Progress", "carried across sessions"], ["Points & levels", "Aware → Leader"], ["Recommendations", "next unfinished content for your role"], ["Recent activity", "last 5 scenarios and missions"]].map(([a, b]) => (
                <li key={a} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 0", borderTop: `1px dashed ${T.line}` }}>
                  <span style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{a}</span>
                  <span style={{ fontSize: 13, color: T.sub, textAlign: "right" }}>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.line}`, fontSize: 12.5, color: T.sub, lineHeight: 1.55 }}>
              Create an account with your email and a password.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: T.bg }}>
      <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]" style={{ ...inner, padding: `44px ${PAD} 56px`, gap: 40, alignItems: "start" }}>
        <div>
          <Mark />
          <p style={{ marginTop: 16, fontSize: 13.5, color: T.sub, maxWidth: 320, lineHeight: 1.55 }}>
            A structured AI curriculum for product managers, engineering managers, and ICs.
          </p>
        </div>
        {([
          ["Curriculum", [["Foundation", "/learn"], ["Scenarios", "/scenarios"], ["Missions", "/missions"]]],
          ["Roles",      [["Product Managers", "/learn"], ["Engineering Managers", "/learn"], ["Individual Contributors", "/learn"]]],
          ["Account",    [["Sign in", "/login"], ["Create an account", "/signup"], ["Feedback", "/feedback"], ["Report a Bug", "/bug-report"]]],
        ] as [string, [string, string][]][]).map(([h, items]) => (
          <div key={h}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.sub, marginBottom: 14 }}>{h}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(([label, href]) => (
                <li key={label}><Link href={href} style={{ fontSize: 13.5, color: T.ink, textDecoration: "none" }}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${T.line}`, padding: "20px 40px", maxWidth: MAX, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: T.sub }}>ASCENT · v{appConfig.version}</div>
        <div style={{ fontSize: 12.5, color: T.sub }}>For product managers, engineering managers, and individual contributors.</div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Arial, sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <Header />
      <Hero />
      <Pillars />
      <AudienceSection />
      <LevelsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
