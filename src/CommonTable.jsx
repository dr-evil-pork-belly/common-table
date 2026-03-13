import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --linen:   #F2EDE4;
  --linen2:  #EAE3D6;
  --linen3:  #DDD3C0;
  --white:   #FAFAF8;
  --ink:     #1E1A14;
  --ink2:    #3D3326;
  --ink3:    #6A5C48;
  --terra:   #B85C38;
  --terra2:  #954929;
  --bark:    #7A5C3C;
  --sage:    #667A56;
  --serif:   'Lora', Georgia, serif;
  --sans:    'Source Sans 3', sans-serif;
  --pad:     clamp(24px, 6vw, 88px);
}

html { scroll-behavior: smooth; background: var(--linen); }
body {
  background: var(--linen); color: var(--ink);
  font-family: var(--sans); font-weight: 300;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
::selection { background: rgba(184,92,56,.18); }
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: var(--linen); }
::-webkit-scrollbar-thumb { background: rgba(184,92,56,.28); }

body::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px;
}

.scene-table {
  background:
    radial-gradient(ellipse at 50% 68%, rgba(220,130,60,.32) 0%, transparent 44%),
    radial-gradient(ellipse at 30% 45%, rgba(200,110,40,.16) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 35%, rgba(180,90,30,.12) 0%, transparent 36%),
    linear-gradient(168deg, #1C140A 0%, #241A0C 48%, #1A1208 100%);
}
.scene-cook {
  background:
    radial-gradient(ellipse at 42% 62%, rgba(200,140,60,.28) 0%, transparent 42%),
    radial-gradient(ellipse at 68% 38%, rgba(160,100,40,.18) 0%, transparent 38%),
    linear-gradient(155deg, #181208 0%, #201A0C 50%, #181408 100%);
}
.scene-host {
  background:
    radial-gradient(ellipse at 45% 65%, rgba(210,140,60,.3) 0%, transparent 46%),
    radial-gradient(ellipse at 72% 40%, rgba(170,100,40,.18) 0%, transparent 40%),
    linear-gradient(158deg, #1A1208 0%, #221A0C 50%, #1C1408 100%);
}

@keyframes flicker { 0%,100%{opacity:1} 45%{opacity:.94} 72%{opacity:.97} 88%{opacity:.93} }

.eyebrow {
  font-family:var(--sans); font-weight:400; font-size:10.5px;
  letter-spacing:.34em; text-transform:uppercase; color:var(--terra);
}
.body {
  font-family:var(--sans); font-weight:300;
  font-size:clamp(15px,1.45vw,17px); line-height:1.95;
  letter-spacing:.015em; color:var(--ink3);
}
.btn {
  display:inline-block; font-family:var(--sans); font-weight:400;
  font-size:11.5px; letter-spacing:.22em; text-transform:uppercase;
  padding:13px 34px; border:1px solid rgba(30,26,20,.22);
  background:transparent; color:var(--ink); cursor:pointer;
  transition:all .38s ease; text-decoration:none;
}
.btn:hover { border-color:var(--terra); color:var(--terra); }
.btn-solid { background:var(--ink); border-color:var(--ink); color:var(--linen); }
.btn-solid:hover { background:var(--terra2); border-color:var(--terra2); color:#FAFAF8; }
.btn-terra { background:var(--terra); border-color:var(--terra); color:#FAFAF8; }
.btn-terra:hover { background:var(--terra2); border-color:var(--terra2); }
.btn-light { border-color:rgba(242,237,228,.3); color:rgba(242,237,228,.78); background:transparent; }
.btn-light:hover { border-color:rgba(242,237,228,.65); color:#F2EDE4; }
.btn-outline-terra { border-color:var(--terra); color:var(--terra); background:transparent; }
.btn-outline-terra:hover { background:var(--terra); color:#FAFAF8; }
`;

function Reveal({ children, delay = 0, y = 16 }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-55px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.28, 1] }}
    >{children}</motion.div>
  );
}

function Rule({ align = "left", color = "var(--terra)" }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ scaleX: 0 }} animate={v ? { scaleX: 1 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.28, 1] }}
      style={{
        height: 1, width: 44, background: color, opacity: .7,
        transformOrigin: align === "center" ? "center" : "left",
        margin: align === "center" ? "0 auto" : "0",
      }}
    />
  );
}

/* ══════════════════════════════════════
   OPENING
══════════════════════════════════════ */
function Opening({ onEnter }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 300);
    const t2 = setTimeout(() => onEnter(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      <motion.div key="open"
        exit={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeInOut" }}
        style={{ position: "fixed", inset: 0, zIndex: 9500, background: "var(--linen)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(30,26,20,.06) 100%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 40px", maxWidth: 640 }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : {}}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.28, 1] }}
            style={{ height: 1, background: "var(--linen3)", marginBottom: 48, transformOrigin: "left" }}
          />

          {/* Welltable wordmark */}
          <div style={{ overflow: "hidden", marginBottom: 28 }}>
            <motion.div
              initial={{ y: "108%" }} animate={show ? { y: "0%" } : {}}
              transition={{ delay: .6, duration: 1.1, ease: [0.22, 1, 0.28, 1] }}
              style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(52px,9vw,108px)", lineHeight: .88, letterSpacing: "-.02em", color: "var(--ink)" }}
            >Welltable</motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : {}}
            transition={{ delay: 1.4, duration: 1.4, ease: [0.22, 1, 0.28, 1] }}
            style={{ height: 1, background: "var(--linen3)", margin: "0 0 32px", transformOrigin: "left" }}
          />

          {/* Primary tagline */}
          <motion.p
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 2.0, duration: 1.3 }}
            style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(15px,1.85vw,21px)", color: "var(--terra)", letterSpacing: ".03em", lineHeight: 1.6, marginBottom: 8 }}
          >
            Where strangers become the people you call.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 2.6, duration: 1.2 }}
            style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: "clamp(10px,1.1vw,12px)", color: "rgba(30,26,20,.32)", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 44 }}
          >
            A program of Basalith.org
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 3.4, duration: 1.2 }}
            onClick={onEnter}
            style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 10, letterSpacing: ".36em", textTransform: "uppercase", background: "none", border: "none", color: "rgba(30,26,20,.28)", cursor: "pointer", transition: "color .4s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--terra)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(30,26,20,.28)"}
          >come to the table</motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
function Nav({ onApply, onDonate }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: .2 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
        height: 58, padding: "0 var(--pad)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: sc ? "rgba(242,237,228,.96)" : "transparent",
        borderBottom: sc ? "1px solid var(--linen3)" : "1px solid transparent",
        backdropFilter: sc ? "blur(10px)" : "none",
        transition: "all .5s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 400, letterSpacing: "-.01em", color: "var(--ink)" }}>Welltable</span>
        <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 10, letterSpacing: ".18em", color: "rgba(30,26,20,.32)" }}>by Basalith.org</span>
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        {[["Our Story","#story"],["Membership","#membership"],["Host a Table","#host"],["Cities","#cities"]].map(([l,h]) => (
          <a key={l} href={h} style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(30,26,20,.42)", textDecoration: "none", transition: "color .3s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(30,26,20,.42)"}
          >{l}</a>
        ))}
        <button className="btn btn-outline-terra" onClick={onDonate} style={{ padding: "8px 18px", fontSize: 10 }}>Donate</button>
        <button className="btn btn-terra" onClick={onApply} style={{ padding: "8px 18px", fontSize: 10 }}>Apply</button>
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
function Hero({ onApply, onDonate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const bgY  = useTransform(scrollYProgress, [0,1], ["0%","14%"]);
  const txtY = useTransform(scrollYProgress, [0,1], ["0%","8%"]);
  const fade = useTransform(scrollYProgress, [0,.6], [1,0]);

  return (
    <section ref={ref} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: "-10%", y: bgY }} className="scene-table">
        {[[36,0],[48,1],[58,2],[69,3],[79,2]].map(([x,i]) => (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, bottom: "32%",
            width: `${18+i*4}px`, height: `${26+i*7}px`, borderRadius: "50%",
            background: `radial-gradient(ellipse at 50% 80%, rgba(255,195,100,${.2+i*.03}) 0%, transparent 70%)`,
            filter: "blur(5px)",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, animation: "flicker 10s ease-in-out infinite" }} />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 48% 48%, transparent 16%, rgba(16,10,4,.65) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "32%", background: "linear-gradient(0deg, var(--linen) 0%, transparent 100%)", pointerEvents: "none" }} />

      <motion.div style={{ y: txtY, opacity: fade }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: .3 }}
      >
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-54%)", left: "var(--pad)", maxWidth: 600, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5, duration: 1.1 }}
            className="eyebrow" style={{ color: "rgba(242,237,228,.4)", marginBottom: 24 }}>
            A Private Dinner Community
          </motion.div>

          <div style={{ overflow: "hidden" }}>
            <motion.div initial={{ y: "108%" }} animate={{ y: "0%" }}
              transition={{ delay: .65, duration: 1.0, ease: [0.22,1,0.28,1] }}
              style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(38px,6vw,78px)", lineHeight: .92, letterSpacing: "-.015em", color: "#F2EDE4" }}>
              Good food.
            </motion.div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.div initial={{ y: "108%" }} animate={{ y: "0%" }}
              transition={{ delay: .78, duration: 1.0, ease: [0.22,1,0.28,1] }}
              style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(38px,6vw,78px)", lineHeight: .92, letterSpacing: "-.015em", color: "#F2EDE4" }}>
              Real people.
            </motion.div>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 32 }}>
            <motion.div initial={{ y: "108%" }} animate={{ y: "0%" }}
              transition={{ delay: .91, duration: 1.0, ease: [0.22,1,0.28,1] }}
              style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(38px,6vw,78px)", lineHeight: .92, letterSpacing: "-.015em", color: "rgba(184,92,56,.9)" }}>
              No strangers.
            </motion.div>
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.35, duration: .9 }}
            style={{ height: 1, width: 44, background: "rgba(242,237,228,.28)", marginBottom: 26, transformOrigin: "left" }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55, duration: 1.1 }}
            style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.9, color: "rgba(242,237,228,.55)", maxWidth: 430, marginBottom: 38, letterSpacing: ".015em" }}>
            Every week, in cities around the world, Welltable members sit down for a real meal — cooked with love, shared without phones, among people worth knowing.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-terra" onClick={onApply}>Apply for Membership</button>
            <a href="#story" className="btn btn-light">Our Story</a>
            <button className="btn btn-light" onClick={onDonate}
              style={{ borderColor: "rgba(242,237,228,.18)", color: "rgba(242,237,228,.45)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(242,237,228,.5)"; e.currentTarget.style.color = "rgba(242,237,228,.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(242,237,228,.18)"; e.currentTarget.style.color = "rgba(242,237,228,.45)"; }}
            >Donate</button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
        style={{ position: "absolute", bottom: "17%", right: "var(--pad)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
        <div style={{ writingMode: "vertical-rl", fontFamily: "var(--sans)", fontWeight: 300, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(242,237,228,.18)" }}>Welltable</div>
        <div style={{ width: 1, height: 30, background: "rgba(242,237,228,.14)" }} />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════
   ORIGIN STORY
══════════════════════════════════════ */
function Story() {
  const LINES = [
    { t: "The world closed its doors.", s: "lead" },
    { t: "It got angrier. More closed. More afraid of the person across the street.", s: "body" },
    { t: "But somewhere, someone was still cooking.", s: "terra" },
    { t: "In kitchens from Nairobi to Lisbon, from Tokyo to São Paulo — there were always people who would open their door to a stranger, pull them into the warmth, and cook something made entirely from love. No agenda. No transaction. Just food, and the quiet belief that a shared meal could make two people less alone.", s: "body" },
    { t: "Welltable is built on that belief.", s: "lead-small" },
    { t: "We set more tables.", s: "terra" },
  ];

  return (
    <section id="story" style={{ padding: "112px 0", background: "var(--linen)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 var(--pad)" }}>
        {LINES.map((line, i) => (
          <Reveal key={i} delay={i * .09} y={12}>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400,
              fontSize: line.s === "lead" ? "clamp(26px,3.2vw,40px)"
                : line.s === "terra" ? "clamp(22px,2.8vw,34px)"
                : line.s === "lead-small" ? "clamp(19px,2.2vw,27px)"
                : "clamp(16px,1.6vw,20px)",
              lineHeight: 1.65,
              color: line.s === "terra" ? "var(--terra)"
                : line.s === "body" ? "var(--ink3)"
                : "var(--ink2)",
              marginBottom: line.s === "terra" ? 32 : line.s === "lead" ? 20 : line.s === "lead-small" ? 12 : 22,
            }}>{line.t}</p>
          </Reveal>
        ))}

        <Reveal delay={.55}>
          <div style={{ marginTop: 60, paddingTop: 44, borderTop: "1px solid var(--linen3)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)" }}>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 18 }}>
                Every week, members sit down for a real dinner — hosted by a home cook who loves feeding people, or a restaurant owner cooking their most personal dishes for a room that actually wants to be there.
              </p>
            </div>
            <div>
              <Rule align="left" color="var(--sage)" />
              <p className="body" style={{ marginTop: 18 }}>
                Welltable is a program of Basalith.org, a registered nonprofit. Membership is $150 per month — four dinners, any city, any table. Every dollar funds the hosts who make it possible.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════ */
function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  const MOMENTS = [
    { n:"01", t:"The host cooks what they love most.", b:"Every menu is entirely the host's own. A grandmother's recipe. A chef's signature dish that's never made it onto the printed menu. A home cook's slow-braised Sunday best. The only requirement is that it's made with genuine care." },
    { n:"02", t:"The table is always communal.", b:"No private tables. No reserved corners. Everyone sits together, eats the same food, passes the same dishes. The long table has always been where the real conversations happen." },
    { n:"03", t:"Phones stay in your pocket.", b:"Not a rule enforced — a culture understood. Two hours where the most interesting thing in the room is the person across from you. Most people forget they have a phone at all." },
    { n:"04", t:"Your membership travels with you.", b:"A member in London can find a table in Tokyo. Someone passing through Nairobi has somewhere to go on a Saturday night. Every Welltable dinner in every city is yours to attend." },
  ];

  return (
    <section style={{ background: "var(--linen)" }}>
      <div ref={ref} style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-14%", y }} className="scene-cook">
          <div style={{ position: "absolute", inset: 0, animation: "flicker 13s ease-in-out infinite" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(12,8,4,.62) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, var(--linen) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg, var(--linen) 0%, transparent 100%)" }} />
        <motion.div
          initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: .2 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--pad)", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px,3.2vw,42px)", lineHeight: 1.48, color: "rgba(242,237,228,.88)", maxWidth: 600 }}>
            "The smell of the food reaches you before you knock.<br />By the time you sit down, you already feel at home."
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How It Works</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                A real meal.<br /><em style={{ color: "var(--terra)" }}>Made for you.</em>
              </h2>
            </div>
            <p className="body">
              No catered trays. No event spaces pretending to be intimate. Someone decided to cook — for a room full of people, some of whom they've never met. That decision is the whole thing.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {MOMENTS.map((m, i) => (
            <Reveal key={m.n} delay={i * .08}>
              <div style={{ padding: "44px var(--pad)", borderRight: i % 2 === 0 ? "1px solid var(--linen3)" : "none", borderTop: "1px solid var(--linen3)" }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--terra)", opacity: .55, marginBottom: 16 }}>{m.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(19px,2.1vw,25px)", lineHeight: 1.12, color: "var(--ink)", marginBottom: 16 }}>{m.t}</h3>
                <Rule align="left" />
                <p className="body" style={{ marginTop: 16, fontSize: "clamp(14px,1.35vw,16px)" }}>{m.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   MEMBERSHIP
══════════════════════════════════════ */
function Membership({ onApply }) {
  return (
    <section id="membership" style={{ background: "var(--linen2)", borderTop: "1px solid var(--linen3)", borderBottom: "1px solid var(--linen3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Membership</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                Two ways<br /><em style={{ color: "var(--terra)" }}>to belong.</em>
              </h2>
            </div>
            <p className="body">
              Every member is sponsored by someone already inside and reviewed by our team. The best rooms in any city are always curated — and the best tables are no different.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* Member */}
          <Reveal delay={.1}>
            <div style={{ padding: "56px var(--pad)", borderRight: "1px solid var(--linen3)", borderTop: "1px solid var(--linen3)" }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Member</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(40px,5vw,64px)", color: "var(--ink)", lineHeight: 1 }}>$150</span>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 14, color: "var(--ink3)", letterSpacing: ".06em" }}>/ month</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px,1.6vw,19px)", color: "var(--ink3)", marginBottom: 32, lineHeight: 1.5 }}>
                Four dinners a month. Any city. Any table.
              </p>
              <Rule align="left" />
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  "Four dinners per month — RSVP to any table worldwide",
                  "Access to the full member directory",
                  "Sponsored by an existing member",
                  "Reviewed and approved by our team",
                  "Monthly billing — cancel anytime",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--terra)", opacity: .6, marginTop: 8, flexShrink: 0 }} />
                    <span className="body" style={{ fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-solid" onClick={onApply}>Apply as a Member</button>
            </div>
          </Reveal>

          {/* Table Host */}
          <Reveal delay={.2}>
            <div style={{ padding: "56px var(--pad)", borderTop: "1px solid var(--linen3)", background: "var(--white)", position: "relative" }}>
              <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "var(--sans)", fontWeight: 400, fontSize: 9.5, letterSpacing: ".28em", textTransform: "uppercase", color: "var(--terra)", background: "rgba(184,92,56,.08)", padding: "5px 12px", border: "1px solid rgba(184,92,56,.2)" }}>
                Most Generous
              </div>
              <div className="eyebrow" style={{ marginBottom: 20, color: "var(--bark)" }}>Table Host</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(40px,5vw,64px)", color: "var(--terra)", lineHeight: 1 }}>Free</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px,1.6vw,19px)", color: "var(--ink3)", marginBottom: 32, lineHeight: 1.5 }}>
                Cook what you love. We cover everything else.
              </p>
              <Rule align="left" color="var(--bark)" />
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  "Free membership — no monthly fee, ever",
                  "Full food stipend — every hosting cost covered",
                  "Home kitchen or restaurant — both equally welcome",
                  "Members worldwide discover and RSVP to your table",
                  "Free Basalith.xyz Estate membership — a $3,600/year value",
                  "Sponsored by a member + reviewed by our team",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--bark)", opacity: .6, marginTop: 8, flexShrink: 0 }} />
                    <span className="body" style={{ fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-terra" onClick={onApply}>Apply as a Table Host</button>
            </div>
          </Reveal>
        </div>

        {/* How to apply */}
        <Reveal delay={.1}>
          <div style={{ padding: "52px var(--pad)", borderTop: "1px solid var(--linen3)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
            {[
              { n:"01", t:"Apply online.", b:"Tell us who you are and who's sponsoring you. A few honest paragraphs — no resume required." },
              { n:"02", t:"We review.", b:"Our team reads every application personally. You'll hear back within two weeks." },
              { n:"03", t:"Come to the table.", b:"Activate your membership, find a dinner in your city — or anywhere you're traveling — and show up hungry." },
            ].map((s,i) => (
              <div key={s.n} style={{ paddingLeft: i === 0 ? 0 : "clamp(16px,3vw,44px)", borderLeft: i > 0 ? "1px solid var(--linen3)" : "none" }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11.5, color: "var(--terra)", opacity: .55, marginBottom: 10 }}>{s.n}</div>
                <h4 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(17px,1.8vw,22px)", color: "var(--ink)", marginBottom: 10 }}>{s.t}</h4>
                <p className="body" style={{ fontSize: "clamp(13px,1.3vw,15px)" }}>{s.b}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   HOST A TABLE
══════════════════════════════════════ */
function HostATable({ onApply }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  return (
    <section id="host" style={{ background: "var(--linen)" }}>
      <div ref={ref} style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-14%", y: bgY }} className="scene-host">
          <div style={{ position: "absolute", inset: 0, animation: "flicker 14s ease-in-out infinite" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(12,8,4,.62) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(180deg, var(--linen) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(0deg, var(--linen) 0%, transparent 100%)" }} />
        <motion.div
          initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: .2 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--pad)", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(19px,3vw,40px)", lineHeight: 1.5, color: "rgba(242,237,228,.88)", maxWidth: 600 }}>
            "Every door that opens to a stranger<br />makes the world a little less frightening."
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Become a Table Host</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                If you cook<br /><em style={{ color: "var(--terra)" }}>with love —<br />we need you.</em>
              </h2>
            </div>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 20 }}>
                A Welltable host is anyone who believes that feeding people is an act of love. That could be you in your home, cooking the dish your family has made for generations. Or you in your restaurant on a quiet evening — cooking what you're most proud of for a room of people who actually want to be there. Both are equally welcome. Both are celebrated.
              </p>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--linen3)" }}>
          {/* Home Cook */}
          <Reveal delay={.1}>
            <div style={{ padding: "52px var(--pad)", borderRight: "1px solid var(--linen3)" }}>
              <div className="eyebrow" style={{ marginBottom: 18, color: "var(--bark)" }}>The Home Cook</div>
              <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(22px,2.6vw,32px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 18 }}>
                Your kitchen.<br />Your recipe.<br />Your people.
              </h3>
              <Rule align="left" color="var(--bark)" />
              <p className="body" style={{ marginTop: 18, marginBottom: 26 }}>
                You have a kitchen, a table that seats more than four, and dishes you've been making your whole life. That's everything. Cook what you love — your grandmother's recipe, your culture's comfort food, the thing that makes people close their eyes on the first bite. Welltable members come to you. We cover every dollar of the food.
              </p>
              {[
                "Full food stipend — all hosting costs covered by Basalith.org",
                "Free Welltable membership for life",
                "Free Basalith.xyz Estate membership — a $3,600/year value",
                "Host on your schedule — weekly, monthly, or quarterly",
                "Members RSVP — you never fill the table alone",
              ].map((f,i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 11 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--bark)", opacity: .55, marginTop: 8, flexShrink: 0 }} />
                  <span className="body" style={{ fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Restaurant Host */}
          <Reveal delay={.18}>
            <div style={{ padding: "52px var(--pad)", background: "var(--white)" }}>
              <div className="eyebrow" style={{ marginBottom: 18, color: "var(--sage)" }}>The Restaurant Host</div>
              <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(22px,2.6vw,32px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 18 }}>
                Your kitchen.<br />Your best dishes.<br />A full room.
              </h3>
              <Rule align="left" color="var(--sage)" />
              <p className="body" style={{ marginTop: 18, marginBottom: 26 }}>
                We don't want your prix fixe menu or your catering setup. We want your best — the dishes that represent everything you've learned and everything you love about cooking. A Welltable evening is your stage. The members who arrive are there because they care about food, culture, and the story behind every plate. Cook like it matters. Because to them, it does.
              </p>
              {[
                "Full food stipend — the entire evening covered",
                "Free Welltable membership for life",
                "Free Basalith.xyz Estate membership — a $3,600/year value",
                "A pre-filled room of engaged, appreciative guests",
                "Word of mouth that turns first-timers into regulars",
              ].map((f,i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 11 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--sage)", opacity: .55, marginTop: 8, flexShrink: 0 }} />
                  <span className="body" style={{ fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={.2}>
          <div style={{ padding: "52px var(--pad) 0", borderTop: "1px solid var(--linen3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.2vw,27px)", color: "var(--ink2)", maxWidth: 540, lineHeight: 1.55 }}>
              If feeding people brings you joy — whether in a home kitchen or a professional one — this was made for you.
            </p>
            <button className="btn btn-terra" onClick={onApply}>Apply as a Table Host</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   CITIES
══════════════════════════════════════ */
const CITIES = [
  { city:"Los Angeles",  region:"California, US",  next:"Every Saturday",  s:"Active" },
  { city:"New York",     region:"New York, US",     next:"Every Friday",    s:"Active" },
  { city:"London",       region:"England, UK",      next:"Every Sunday",    s:"Active" },
  { city:"Nairobi",      region:"Kenya",            next:"Every Saturday",  s:"Active" },
  { city:"Berlin",       region:"Germany",          next:"Launching soon",  s:"Soon"   },
  { city:"Tokyo",        region:"Japan",            next:"Launching soon",  s:"Soon"   },
  { city:"São Paulo",    region:"Brazil",           next:"Launching soon",  s:"Soon"   },
  { city:"Cape Town",    region:"South Africa",     next:"Launching soon",  s:"Soon"   },
  { city:"Toronto",      region:"Canada",           next:"Seeking a host",  s:"Open"   },
  { city:"Sydney",       region:"Australia",        next:"Seeking a host",  s:"Open"   },
];
const SDOT = { Active:"var(--terra)", Soon:"var(--bark)", Open:"var(--sage)" };

function CityRow({ c, i }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-32px" });
  const [hov, setHov] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}}
      transition={{ duration: .85, delay: i * .05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "grid", gridTemplateColumns: "1fr 200px 110px", alignItems: "center", gap: "clamp(12px,3vw,36px)", padding: "16px var(--pad)", borderBottom: "1px solid var(--linen3)", background: hov ? "var(--white)" : "transparent", transition: "background .28s" }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(17px,2vw,22px)", color: "var(--ink)" }}>{c.city}</span>
        <span className="body" style={{ fontSize: 12, color: "var(--ink3)", opacity: .45 }}>{c.region}</span>
      </div>
      <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 13, color: "var(--ink3)", letterSpacing: ".02em" }}>{c.next}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <motion.div
          animate={{ scale:[1,1.3,1], opacity:[.5,1,.5] }}
          transition={{ duration: 2.2+i*.25, repeat:Infinity, ease:"easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: SDOT[c.s], flexShrink: 0 }}
        />
        <span className="eyebrow" style={{ fontSize: 9, color: SDOT[c.s] }}>{c.s}</span>
      </div>
    </motion.div>
  );
}

function Cities() {
  return (
    <section id="cities" style={{ background: "var(--linen2)", borderTop: "1px solid var(--linen3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Where We Gather</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                Your table,<br /><em style={{ color: "var(--terra)" }}>wherever you are.</em>
              </h2>
            </div>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 20 }}>
                Your membership travels with you. Every Welltable dinner in every city is yours to attend. RSVP and show up. The host will have cooked enough for the room — and then some.
              </p>
            </div>
          </div>
        </Reveal>
        {CITIES.map((c,i) => <CityRow key={c.city} c={c} i={i} />)}
        <Reveal delay={.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--linen3)" }}>
            {[["4","Active cities"],["$150","Per month"],["Free","For Table Hosts"],["Weekly","The rhythm"]].map(([val,lbl],i) => (
              <div key={lbl} style={{ padding: "26px clamp(20px,3vw,44px)", borderRight: i < 3 ? "1px solid var(--linen3)" : "none" }}>
                <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:"clamp(24px,3vw,40px)", color:"var(--terra)", lineHeight:1, marginBottom:6 }}>{val}</div>
                <div className="eyebrow" style={{ fontSize:9, color:"var(--ink3)", opacity:.45 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   MODALS
══════════════════════════════════════ */
function ApplyModal({ onClose }) {
  const [type, setType] = useState(null);
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState({});
  const [done, setDone] = useState(false);

  const MEMBER_STEPS = [
    { label:"Tell us who you are.", fields:[{k:"name",ph:"Your full name",lbl:"Name"},{k:"city",ph:"Where you live",lbl:"City"},{k:"email",ph:"Email address",lbl:"Email"}] },
    { label:"Who's sponsoring you?", fields:[{k:"sponsor",ph:"Name of your Welltable member",lbl:"Your sponsor"},{k:"relation",ph:"How do you know them?",lbl:"Relationship"}] },
    { label:"Why Welltable?", fields:[{k:"why",ph:"Say it however it comes. We'll read every word.",lbl:"In your own words",ta:true}] },
  ];
  const HOST_STEPS = [
    { label:"Tell us who you are.", fields:[{k:"name",ph:"Your full name",lbl:"Name"},{k:"city",ph:"Your city",lbl:"City"},{k:"email",ph:"Email address",lbl:"Email"}] },
    { label:"Tell us about your space.", fields:[{k:"type",ph:"Home kitchen or restaurant?",lbl:"Type of space"},{k:"capacity",ph:"How many can you comfortably seat?",lbl:"Capacity"}] },
    { label:"Tell us about your cooking.", fields:[{k:"cuisine",ph:"What cuisine or style do you cook?",lbl:"Your cuisine"},{k:"dish",ph:"The dish you're most proud of",lbl:"Signature dish"}] },
    { label:"A few last things.", fields:[{k:"freq",ph:"Weekly, monthly, quarterly — be honest",lbl:"How often can you host?"},{k:"sponsor",ph:"Name of your Welltable member sponsor",lbl:"Your sponsor"}] },
    { label:"Why do you want to host?", fields:[{k:"why",ph:"Tell us what feeding people means to you.",lbl:"In your own words",ta:true}] },
  ];

  const STEPS = type === "host" ? HOST_STEPS : MEMBER_STEPS;
  const cur = STEPS[step];
  const inp = { width:"100%", background:"transparent", border:"none", borderBottom:"1px solid var(--linen3)", color:"var(--ink)", fontFamily:"var(--sans)", fontWeight:300, fontSize:15, letterSpacing:".018em", padding:"11px 0", outline:"none", transition:"border-color .32s" };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}
      style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(30,26,20,.38)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
        transition={{duration:.55,ease:[0.22,1,0.28,1]}}
        style={{width:"100%",maxWidth:500,background:"var(--linen)",border:"1px solid var(--linen3)",padding:"46px 42px",position:"relative",margin:"auto"}}
      >
        <button onClick={onClose} style={{position:"absolute",top:18,right:20,background:"none",border:"none",cursor:"pointer",color:"rgba(30,26,20,.3)",fontSize:17,lineHeight:1,transition:"color .3s"}}
          onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.3)"}
        >×</button>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
              <div className="eyebrow" style={{marginBottom:18,color:"var(--sage)"}}>Application Received</div>
              <h3 style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:"clamp(22px,3.5vw,32px)",color:"var(--ink)",lineHeight:1.12,marginBottom:18}}>
                We'll be in touch.<br /><em style={{color:"var(--terra)"}}>Within two weeks.</em>
              </h3>
              <Rule align="left" />
              <p className="body" style={{marginTop:18,fontSize:14.5,lineHeight:1.85}}>
                Our team reads every application personally. Find the member who sponsored you and thank them — they opened this door.
              </p>
            </motion.div>
          ) : !type ? (
            <motion.div key="choose" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
              <div className="eyebrow" style={{marginBottom:18}}>Apply to Welltable</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(20px,2.6vw,28px)",color:"var(--ink)",marginBottom:10,lineHeight:1.2}}>
                How would you like to join?
              </h3>
              <p className="body" style={{marginBottom:28,fontSize:14}}>Both paths require a sponsor — an existing Welltable member who knows you personally.</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <button onClick={()=>setType("member")}
                  style={{padding:"22px 24px",border:"1px solid var(--linen3)",background:"transparent",cursor:"pointer",textAlign:"left",transition:"all .28s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--terra)";e.currentTarget.style.background="rgba(184,92,56,.04)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--linen3)";e.currentTarget.style.background="transparent";}}
                >
                  <div style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:18,color:"var(--ink)",marginBottom:6}}>Member</div>
                  <div className="body" style={{fontSize:13}}>$150/month · Four dinners · Any city · Sponsored + team reviewed</div>
                </button>
                <button onClick={()=>setType("host")}
                  style={{padding:"22px 24px",border:"1px solid var(--linen3)",background:"transparent",cursor:"pointer",textAlign:"left",transition:"all .28s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bark)";e.currentTarget.style.background="rgba(122,92,60,.04)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--linen3)";e.currentTarget.style.background="transparent";}}
                >
                  <div style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:18,color:"var(--ink)",marginBottom:6}}>Table Host</div>
                  <div className="body" style={{fontSize:13}}>Free membership · Full food stipend · Free Basalith.xyz Estate ($3,600/yr) · Home or restaurant</div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`${type}-${step}`} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.3}}>
              <div style={{display:"flex",gap:4,marginBottom:32}}>
                {STEPS.map((_,i)=>(
                  <div key={i} style={{flex:1,height:1.5,background:i<=step?"var(--terra)":"var(--linen3)",transition:"background .38s"}}/>
                ))}
              </div>
              <div className="eyebrow" style={{opacity:.45,fontSize:9,marginBottom:12}}>{step+1} / {STEPS.length} · {type === "host" ? "Table Host" : "Member"}</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(19px,2.5vw,26px)",color:"var(--ink)",marginBottom:30,lineHeight:1.25}}>
                {cur.label}
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:22}}>
                {cur.fields.map(f=>(
                  <div key={f.k}>
                    <div className="eyebrow" style={{fontSize:8,marginBottom:7,opacity:.42}}>{f.lbl}</div>
                    {f.ta ? (
                      <textarea value={vals[f.k]||""} onChange={e=>setVals(v=>({...v,[f.k]:e.target.value}))} placeholder={f.ph} rows={4}
                        style={{...inp,resize:"none"}}
                        onFocus={e=>e.target.style.borderBottomColor="var(--terra)"}
                        onBlur={e=>e.target.style.borderBottomColor="var(--linen3)"} />
                    ) : (
                      <input value={vals[f.k]||""} onChange={e=>setVals(v=>({...v,[f.k]:e.target.value}))} placeholder={f.ph} style={inp}
                        onFocus={e=>e.target.style.borderBottomColor="var(--terra)"}
                        onBlur={e=>e.target.style.borderBottomColor="var(--linen3)"} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:36}}>
                <button onClick={()=>step>0?setStep(s=>s-1):setType(null)}
                  style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--sans)",fontWeight:300,fontSize:10.5,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(30,26,20,.32)",transition:"color .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--ink)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.32)"}
                >← Back</button>
                <button className="btn btn-terra" onClick={()=>step<STEPS.length-1?setStep(s=>s+1):setDone(true)}>
                  {step<STEPS.length-1?"Continue →":"Submit Application"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function DonateModal({ onClose }) {
  const [amt, setAmt] = useState(null);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);
  const AMOUNTS = [25, 50, 100, 250];
  const inp = { width:"100%", background:"transparent", border:"none", borderBottom:"1px solid var(--linen3)", color:"var(--ink)", fontFamily:"var(--sans)", fontWeight:300, fontSize:16, letterSpacing:".018em", padding:"11px 0", outline:"none", transition:"border-color .32s" };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}
      style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(30,26,20,.32)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
        transition={{duration:.55,ease:[0.22,1,0.28,1]}}
        style={{width:"100%",maxWidth:468,background:"var(--linen)",border:"1px solid var(--linen3)",padding:"46px 42px",position:"relative"}}
      >
        <button onClick={onClose} style={{position:"absolute",top:18,right:20,background:"none",border:"none",cursor:"pointer",color:"rgba(30,26,20,.3)",fontSize:17,lineHeight:1,transition:"color .3s"}}
          onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.3)"}
        >×</button>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
              <div className="eyebrow" style={{marginBottom:18,color:"var(--sage)"}}>Thank you</div>
              <h3 style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:"clamp(22px,3.5vw,34px)",color:"var(--ink)",lineHeight:1.12,marginBottom:18}}>
                You just kept<br /><em style={{color:"var(--terra)"}}>a door open.</em>
              </h3>
              <Rule align="left" />
              <p className="body" style={{marginTop:18,fontSize:14.5}}>
                Your donation funds Table Host stipends through Basalith.org — so every host cooks without worrying about the bill. One more door opened to a stranger.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
              <div className="eyebrow" style={{marginBottom:18}}>Support Welltable</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(20px,2.6vw,28px)",color:"var(--ink)",marginBottom:10,lineHeight:1.2}}>
                The world closed its doors.<br /><em style={{color:"var(--terra)"}}>Help us set more tables.</em>
              </h3>
              <p className="body" style={{marginBottom:32,fontSize:14.5}}>
                Your gift to Basalith.org covers food stipends for Table Hosts in cities around the world. Tax-deductible. Every dollar means one more evening where strangers become the people you call.
              </p>
              <div className="eyebrow" style={{fontSize:8,marginBottom:12,opacity:.5}}>Choose an amount</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
                {AMOUNTS.map(a=>(
                  <button key={a} onClick={()=>{setAmt(a);setCustom("");}}
                    style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:14,padding:"11px 8px",border:"1px solid",borderColor:amt===a?"var(--terra)":"var(--linen3)",background:amt===a?"rgba(184,92,56,.08)":"transparent",color:amt===a?"var(--terra)":"var(--ink3)",cursor:"pointer",transition:"all .28s"}}
                  >${a}</button>
                ))}
              </div>
              <div className="eyebrow" style={{fontSize:8,marginBottom:8,opacity:.5}}>Or enter your own</div>
              <input value={custom} onChange={e=>{setCustom(e.target.value);setAmt(null);}} placeholder="$ Other amount" style={inp}
                onFocus={e=>e.target.style.borderBottomColor="var(--terra)"}
                onBlur={e=>e.target.style.borderBottomColor="var(--linen3)"} />
              <button className="btn btn-terra" onClick={()=>setDone(true)} style={{marginTop:32,width:"100%",textAlign:"center"}}>
                Donate {amt?`$${amt}`:custom?`$${custom}`:""} to Basalith.org
              </button>
              <p style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:11,color:"rgba(30,26,20,.32)",textAlign:"center",marginTop:14,letterSpacing:".04em"}}>
                Secure · Tax-deductible · Basalith.org 501(c)(3)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ onApply, onDonate }) {
  return (
    <footer style={{ background: "var(--ink)", borderTop: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "88px var(--pad)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(13px,1.4vw,16px)", color: "rgba(242,237,228,.3)", letterSpacing: ".04em", marginBottom: 20, lineHeight: 1.6 }}>
                The world closed its doors.
              </p>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(30px,4.2vw,58px)", lineHeight: .95, color: "#F2EDE4" }}>
                We set<br />
                <em style={{ color: "var(--terra)" }}>more tables.</em>
              </h2>
            </div>
            <div>
              <p className="body" style={{ marginBottom: 28, color: "rgba(242,237,228,.45)" }}>
                Apply for membership. Open your table as a host. Or support the mission so more doors stay open to more strangers around the world.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-terra" onClick={onApply}>Apply Now</button>
                <button className="btn btn-light" onClick={onDonate}>Donate</button>
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ padding: "26px var(--pad)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:400, color:"rgba(242,237,228,.35)" }}>Welltable</span>
            <span style={{ fontFamily:"var(--sans)", fontWeight:300, fontSize:10, letterSpacing:".16em", color:"rgba(242,237,228,.18)", marginLeft:10 }}>a program of Basalith.org</span>
          </div>
          <span style={{ fontFamily:"var(--sans)", fontWeight:300, fontSize:11, letterSpacing:".06em", color:"rgba(242,237,228,.18)" }}>
            Basalith.org · 501(c)(3) nonprofit
          </span>
          <div style={{ display:"flex", gap:24 }}>
            {["Our Story","Membership","Host a Table","Donate","Contact"].map(l=>(
              <a key={l} href="#" style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:10.5,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(242,237,228,.22)",textDecoration:"none",transition:"color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(242,237,228,.22)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function Welltable() {
  const [entered, setEntered] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  return (
    <>
      <style>{CSS}</style>
      <AnimatePresence>
        {!entered && <Opening onEnter={() => setEntered(true)} />}
      </AnimatePresence>
      {entered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0 }}>
          <Nav onApply={() => setApplyOpen(true)} onDonate={() => setDonateOpen(true)} />
          <main>
            <Hero onApply={() => setApplyOpen(true)} onDonate={() => setDonateOpen(true)} />
            <Story />
            <HowItWorks />
            <Membership onApply={() => setApplyOpen(true)} />
            <HostATable onApply={() => setApplyOpen(true)} />
            <Cities />
          </main>
          <Footer onApply={() => setApplyOpen(true)} onDonate={() => setDonateOpen(true)} />
        </motion.div>
      )}
      <AnimatePresence>
        {applyOpen && <ApplyModal onClose={() => setApplyOpen(false)} />}
        {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      </AnimatePresence>
    </>
  );
}