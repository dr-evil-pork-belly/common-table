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
.scene-people {
  background:
    radial-gradient(ellipse at 55% 55%, rgba(180,120,55,.22) 0%, transparent 45%),
    radial-gradient(ellipse at 28% 40%, rgba(200,110,45,.15) 0%, transparent 38%),
    linear-gradient(160deg, #141008 0%, #1C180A 52%, #181408 100%);
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
    const t2 = setTimeout(() => onEnter(), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      <motion.div key="open"
        exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          position: "fixed", inset: 0, zIndex: 9500, background: "var(--linen)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(30,26,20,.06) 100%)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 40px", maxWidth: 580 }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : {}}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.28, 1] }}
            style={{ height: 1, background: "var(--linen3)", marginBottom: 42, transformOrigin: "left" }}
          />
          <motion.p
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: .7, duration: 1.3 }}
            style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(14px,1.7vw,17px)", color: "var(--ink3)", letterSpacing: ".04em", marginBottom: 20, lineHeight: 1.65 }}
          >
            the world got very lonely.
          </motion.p>
          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "108%" }} animate={show ? { y: "0%" } : {}}
              transition={{ delay: .9, duration: 1.0, ease: [0.22, 1, 0.28, 1] }}
              style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(44px,8vw,96px)", lineHeight: .9, letterSpacing: "-.015em", color: "var(--ink)" }}
            >Common Table</motion.div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }} animate={show ? { scaleX: 1 } : {}}
            transition={{ delay: 1.5, duration: 1.4, ease: [0.22, 1, 0.28, 1] }}
            style={{ height: 1, background: "var(--linen3)", margin: "26px 0 24px", transformOrigin: "left" }}
          />
          <motion.p
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 2.0, duration: 1.2 }}
            style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(14px,1.7vw,17px)", color: "var(--terra)", letterSpacing: ".04em", lineHeight: 1.65 }}
          >
            we went the other way.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 3.2, duration: 1.2 }}
            onClick={onEnter}
            style={{ marginTop: 44, fontFamily: "var(--sans)", fontWeight: 300, fontSize: 10, letterSpacing: ".36em", textTransform: "uppercase", background: "none", border: "none", color: "rgba(30,26,20,.3)", cursor: "pointer", transition: "color .4s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--terra)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(30,26,20,.3)"}
          >
            come to the table
          </motion.button>
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
      <div>
        <span style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400, letterSpacing: ".03em", color: "var(--ink)" }}>Common Table</span>
        <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 10, letterSpacing: ".18em", color: "rgba(30,26,20,.35)", marginLeft: 10 }}>by Basalith.org</span>
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        {[["The Mission","#mission"],["Membership","#membership"],["Cities","#cities"],["Table Hosts","#hosts"]].map(([l,h]) => (
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
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 48% 48%, transparent 16%, rgba(16,10,4,.62) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg, var(--linen) 0%, transparent 100%)", pointerEvents: "none" }} />

      <motion.div style={{ y: txtY, opacity: fade }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: .3 }}
      >
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-54%)", left: "var(--pad)", maxWidth: 580, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5, duration: 1.1 }}
            className="eyebrow" style={{ color: "rgba(242,237,228,.48)", marginBottom: 22 }}>
            A Members-Only Fellowship
          </motion.div>
          <div style={{ overflow: "hidden" }}>
            <motion.div initial={{ y: "108%" }} animate={{ y: "0%" }}
              transition={{ delay: .65, duration: 1.0, ease: [0.22,1,0.28,1] }}
              style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(42px,6.5vw,84px)", lineHeight: .92, letterSpacing: "-.015em", color: "#F2EDE4" }}>
              Pull up a chair.
            </motion.div>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 30 }}>
            <motion.div initial={{ y: "108%" }} animate={{ y: "0%" }}
              transition={{ delay: .82, duration: 1.0, ease: [0.22,1,0.28,1] }}
              style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(42px,6.5vw,84px)", lineHeight: .92, letterSpacing: "-.015em", color: "rgba(184,92,56,.9)" }}>
              You belong here.
            </motion.div>
          </div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: .9 }}
            style={{ height: 1, width: 44, background: "rgba(242,237,228,.3)", marginBottom: 24, transformOrigin: "left" }} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.1 }}
            style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: "clamp(15px,1.45vw,17px)", lineHeight: 1.9, color: "rgba(242,237,228,.58)", maxWidth: 420, marginBottom: 36, letterSpacing: ".015em" }}>
            Common Table is a private members fellowship. Every week, in cities around the world, members sit down together for a real meal — in each other's homes, around real fire, without phones.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-terra" onClick={onApply}>Apply for Membership</button>
            <a href="#mission" className="btn btn-light">Learn More</a>
            <button className="btn btn-light" onClick={onDonate} style={{ borderColor: "rgba(242,237,228,.2)", color: "rgba(242,237,228,.5)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(242,237,228,.5)"; e.currentTarget.style.color = "rgba(242,237,228,.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(242,237,228,.2)"; e.currentTarget.style.color = "rgba(242,237,228,.5)"; }}
            >Donate</button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
        style={{ position: "absolute", bottom: "17%", right: "var(--pad)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
        <div style={{ writingMode: "vertical-rl", fontFamily: "var(--sans)", fontWeight: 300, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(242,237,228,.22)" }}>Common Table</div>
        <div style={{ width: 1, height: 30, background: "rgba(242,237,228,.16)" }} />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════
   MISSION
══════════════════════════════════════ */
function Mission() {
  const LINES = [
    { t: "The world got very lonely.", s: "lead" },
    { t: "We went the other way.", s: "terra" },
    { t: "Common Table is a private fellowship of people who believe that a shared meal is the most powerful social technology ever invented.", s: "body" },
    { t: "We gather in each other's homes. We cook real food. We leave our phones at the door.", s: "body" },
    { t: "Not everyone is right for this. But you might be.", s: "lead-small" },
  ];

  return (
    <section id="mission" style={{ padding: "112px 0", background: "var(--linen)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 var(--pad)" }}>
        {LINES.map((line, i) => (
          <Reveal key={i} delay={i * .09} y={12}>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400,
              fontSize: line.s === "lead" ? "clamp(22px,2.8vw,34px)"
                : line.s === "terra" ? "clamp(22px,2.8vw,34px)"
                : line.s === "lead-small" ? "clamp(19px,2.2vw,27px)"
                : "clamp(16px,1.6vw,19px)",
              lineHeight: 1.62,
              color: line.s === "terra" ? "var(--terra)"
                : line.s === "body" ? "var(--ink3)"
                : "var(--ink2)",
              marginBottom: line.s === "terra" ? 44 : line.s === "lead-small" ? 0 : 18,
              opacity: line.s === "body" ? .85 : 1,
            }}>{line.t}</p>
          </Reveal>
        ))}

        <Reveal delay={.5}>
          <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--linen3)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)" }}>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 18 }}>
                Common Table is a program of Basalith.org, a registered nonprofit. Membership is $150 per year — less than a nice dinner out, more meaningful than most things you'll spend it on.
              </p>
            </div>
            <div>
              <Rule align="left" color="var(--sage)" />
              <p className="body" style={{ marginTop: 18 }}>
                Every member is vouched for by someone already inside and reviewed by our committee. This isn't gatekeeping — it's how we protect the culture that makes the table worth sitting at.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   WHAT HAPPENS — the dinner experience
══════════════════════════════════════ */
function WhatHappens() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  const MOMENTS = [
    { n:"01", t:"A member opens their home.", b:"Every dinner is hosted by a Table Host — a member who's chosen to open their space and cook for the room. They set the date, the capacity, and the vibe. We cover every dollar of food." },
    { n:"02", t:"Members RSVP from anywhere.", b:"A member in London can sit at a table in Nairobi. A member in Tokyo can find a seat in São Paulo. Your membership travels with you, everywhere in the world Common Table exists." },
    { n:"03", t:"The food is real.", b:"Slow-cooked, smoky, made with care. The kind of food that takes all day and fills the room before anyone arrives. Not catered. Not ordered. Made." },
    { n:"04", t:"The phones stay away.", b:"Not a rule. A shared understanding. Two hours where nothing you're looking at is a screen. Just faces, wine, and the kind of conversation that only happens when no one is performing for an audience." },
  ];

  return (
    <section style={{ background: "var(--linen)" }}>
      <div ref={ref} style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-14%", y }} className="scene-cook">
          <div style={{ position: "absolute", inset: 0, animation: "flicker 13s ease-in-out infinite" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(12,8,4,.6) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, var(--linen) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg, var(--linen) 0%, transparent 100%)" }} />
        <motion.div
          initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: .2 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--pad)", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px,3.2vw,42px)", lineHeight: 1.45, color: "rgba(242,237,228,.9)", maxWidth: 560 }}>
            "You might not know anyone yet.<br />You will by the end of the night."
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 100px" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>How It Works</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                A real dinner.<br /><em style={{ color: "var(--terra)" }}>In a real home.</em>
              </h2>
            </div>
            <p className="body">
              No restaurants. No event spaces. No name tags or icebreakers. Just a member who decided to cook, a table that seats twelve, and two hours that feel nothing like the rest of your week.
            </p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)" }}>
          {MOMENTS.map((m, i) => (
            <Reveal key={m.n} delay={i * .08}>
              <div style={{
                padding: "44px var(--pad)",
                borderRight: i % 2 === 0 ? "1px solid var(--linen3)" : "none",
                borderTop: "1px solid var(--linen3)",
              }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--terra)", opacity: .6, marginBottom: 16 }}>{m.n}</div>
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
   MEMBERSHIP — the two tiers
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
              Every member is vouched for by someone already inside and reviewed by our committee. Not everyone will be accepted — and that's what makes the table worth sitting at.
            </p>
          </div>
        </Reveal>

        {/* Two tiers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Member */}
          <Reveal delay={.1}>
            <div style={{ padding: "56px var(--pad)", borderRight: "1px solid var(--linen3)", borderTop: "1px solid var(--linen3)" }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Member</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(40px,5vw,64px)", color: "var(--ink)", lineHeight: 1 }}>$150</span>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 14, color: "var(--ink3)", letterSpacing: ".06em" }}>/ year</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px,1.6vw,19px)", color: "var(--ink3)", marginBottom: 32, lineHeight: 1.5 }}>
                Come to the table anywhere in the world.
              </p>
              <Rule align="left" />
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  "RSVP to any Common Table dinner worldwide",
                  "Access to the member directory",
                  "Vouched for by an existing member",
                  "Reviewed and approved by our committee",
                  "Annual membership — renews each year",
                  "Cancel anytime",
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
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(40px,5vw,64px)", color: "var(--terra)", lineHeight: 1 }}>Free</span>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16px,1.6vw,19px)", color: "var(--ink3)", marginBottom: 32, lineHeight: 1.5 }}>
                Open your home. Feed the room. We'll cover every dollar.
              </p>
              <Rule align="left" color="var(--bark)" />
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  "Free membership — no annual fee, ever",
                  "Full food stipend — we cover all hosting costs",
                  "Host as often as you like, minimum quarterly",
                  "Members worldwide can RSVP to your table",
                  "Everything a Member gets, plus the honor of hosting",
                  "Vouched for by a member + committee review",
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
          <div style={{ padding: "52px var(--pad)", borderTop: "1px solid var(--linen3)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1 }}>
            {[
              { n:"01", t:"Apply online.", b:"Tell us who you are, what you do, and why this feels right. Include the name of the member vouching for you." },
              { n:"02", t:"We review.", b:"Our committee reads every application personally. You'll hear back within two weeks." },
              { n:"03", t:"You're in.", b:"Pay your annual fee, activate your membership, and find your first dinner. It's that simple." },
            ].map((s,i) => (
              <div key={s.n} style={{ padding: "0 clamp(16px,3vw,44px) 0", borderRight: i < 2 ? "1px solid var(--linen3)" : "none", paddingLeft: i === 0 ? 0 : "clamp(16px,3vw,44px)" }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11.5, color: "var(--terra)", opacity: .6, marginBottom: 10 }}>{s.n}</div>
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
        <span className="body" style={{ fontSize: 12, color: "var(--ink3)", opacity: .48 }}>{c.region}</span>
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
    <section id="cities" style={{ background: "var(--linen)", borderTop: "1px solid var(--linen3)" }}>
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
                Your membership travels with you. As a member, every Common Table dinner in every city is yours to attend — just RSVP and show up hungry.
              </p>
            </div>
          </div>
        </Reveal>
        {CITIES.map((c,i) => <CityRow key={c.city} c={c} i={i} />)}
        <Reveal delay={.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--linen3)" }}>
            {[["4","Active cities"],["$150","Annual membership"],["Free","For Table Hosts"],["Weekly","The rhythm"]].map(([val,lbl],i) => (
              <div key={lbl} style={{ padding: "26px clamp(20px,3vw,44px)", borderRight: i < 3 ? "1px solid var(--linen3)" : "none" }}>
                <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:"clamp(24px,3vw,40px)", color:"var(--terra)", lineHeight:1, marginBottom:6 }}>{val}</div>
                <div className="eyebrow" style={{ fontSize:9, color:"var(--ink3)", opacity:.48 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TABLE HOSTS — the church-spreaders
══════════════════════════════════════ */
function TableHosts({ onApply }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  return (
    <section id="hosts" style={{ background: "var(--linen2)", borderTop: "1px solid var(--linen3)" }}>
      <div ref={ref} style={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-14%", y }} className="scene-host">
          <div style={{ position: "absolute", inset: 0, animation: "flicker 14s ease-in-out infinite" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(12,8,4,.6) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(180deg, var(--linen2) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(0deg, var(--linen2) 0%, transparent 100%)" }} />
        <motion.div
          initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: .2 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--pad)", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(19px,3vw,40px)", lineHeight: 1.48, color: "rgba(242,237,228,.88)", maxWidth: 540 }}>
            "Every great movement started with someone<br />who just decided to cook for their neighbors."
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Become a Table Host</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                Open your home.<br /><em style={{ color: "var(--terra)" }}>Feed the world.</em>
              </h2>
            </div>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 20 }}>
                Table Hosts are the heart of Common Table. They give their space, their time, and their cooking. In return — free membership for life and a full stipend for every dinner they host. We handle the rest.
              </p>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { n:"01", t:"You cook. We pay.", b:"Every dollar of food is covered by Basalith.org. You bring the home, the fire, and the hospitality. We bring the budget." },
            { n:"02", t:"Members find you.", b:"Your dinner goes on the Common Table calendar. Members in your city — and members passing through — RSVP and show up. You never have to fill a table alone." },
            { n:"03", t:"Weekly is the dream.\nQuarterly is the floor.", b:"We ask for at least one dinner every three months. The hosts who do it weekly are the ones who build something that feels like home." },
          ].map((s,i) => (
            <Reveal key={s.n} delay={i*.1}>
              <div style={{ padding: "44px var(--pad)", borderRight: i < 2 ? "1px solid var(--linen3)" : "none", borderTop: "1px solid var(--linen3)" }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--terra)", opacity: .6, marginBottom: 16 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(19px,2.1vw,25px)", lineHeight: 1.15, color: "var(--ink)", marginBottom: 16, whiteSpace: "pre-line" }}>{s.t}</h3>
                <Rule align="left" />
                <p className="body" style={{ marginTop: 16, fontSize: "clamp(14px,1.35vw,16px)" }}>{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={.2}>
          <div style={{ padding: "52px var(--pad) 0", borderTop: "1px solid var(--linen3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px,2.2vw,26px)", color: "var(--ink2)", maxWidth: 480, lineHeight: 1.5 }}>
              If you cook for love and you have a table that seats more than four — this was made for you.
            </p>
            <button className="btn btn-terra" onClick={onApply}>Apply as a Table Host</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   MODALS — Apply + Donate
══════════════════════════════════════ */
function ApplyModal({ onClose }) {
  const [type, setType] = useState(null);
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState({});
  const [done, setDone] = useState(false);

  const MEMBER_STEPS = [
    { label:"Tell us who you are.", fields:[{k:"name",ph:"Your full name",lbl:"Name"},{k:"city",ph:"Where you live",lbl:"City"},{k:"email",ph:"Email address",lbl:"Email"}] },
    { label:"Who's vouching for you?", fields:[{k:"vouch",ph:"Name of your Common Table member",lbl:"Member vouch"},{k:"relation",ph:"How do you know them?",lbl:"Relationship"}] },
    { label:"Why Common Table?", fields:[{k:"why",ph:"Say it however it comes.",lbl:"In your own words",ta:true}] },
  ];
  const HOST_STEPS = [
    { label:"Tell us who you are.", fields:[{k:"name",ph:"Your full name",lbl:"Name"},{k:"city",ph:"Your city",lbl:"City"},{k:"email",ph:"Email address",lbl:"Email"}] },
    { label:"Tell us about your table.", fields:[{k:"space",ph:"Describe your space and how many it seats",lbl:"Your space"},{k:"cook",ph:"What do you love to cook?",lbl:"Your cooking"}] },
    { label:"How often can you host?", fields:[{k:"freq",ph:"Weekly, monthly, quarterly — be honest",lbl:"Frequency"},{k:"vouch",ph:"Name of your Common Table member vouch",lbl:"Member vouch"}] },
    { label:"Why do you want to host?", fields:[{k:"why",ph:"Say it however it comes.",lbl:"In your own words",ta:true}] },
  ];

  const STEPS = type === "host" ? HOST_STEPS : MEMBER_STEPS;
  const cur = STEPS[step];

  const inp = {
    width:"100%", background:"transparent", border:"none",
    borderBottom:"1px solid var(--linen3)", color:"var(--ink)",
    fontFamily:"var(--sans)", fontWeight:300, fontSize:15,
    letterSpacing:".018em", padding:"11px 0", outline:"none", transition:"border-color .32s",
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}
      style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(30,26,20,.35)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
        transition={{duration:.55,ease:[0.22,1,0.28,1]}}
        style={{width:"100%",maxWidth:500,background:"var(--linen)",border:"1px solid var(--linen3)",padding:"46px 42px",position:"relative",margin:"auto"}}
      >
        <button onClick={onClose}
          style={{position:"absolute",top:18,right:20,background:"none",border:"none",cursor:"pointer",color:"rgba(30,26,20,.3)",fontSize:17,lineHeight:1,transition:"color .3s"}}
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
                Our committee reviews every application personally. In the meantime — find the member who vouched for you and thank them. They opened this door.
              </p>
            </motion.div>
          ) : !type ? (
            <motion.div key="choose" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
              <div className="eyebrow" style={{marginBottom:18}}>Apply to Common Table</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(20px,2.6vw,28px)",color:"var(--ink)",marginBottom:32,lineHeight:1.2}}>
                How would you like to join?
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <button onClick={()=>setType("member")}
                  style={{padding:"22px 24px",border:"1px solid var(--linen3)",background:"transparent",cursor:"pointer",textAlign:"left",transition:"all .28s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--terra)";e.currentTarget.style.background="rgba(184,92,56,.04)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--linen3)";e.currentTarget.style.background="transparent";}}
                >
                  <div style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:18,color:"var(--ink)",marginBottom:6}}>Member</div>
                  <div className="body" style={{fontSize:13}}>$150/year · Attend dinners worldwide · Vouched + committee reviewed</div>
                </button>
                <button onClick={()=>setType("host")}
                  style={{padding:"22px 24px",border:"1px solid var(--linen3)",background:"transparent",cursor:"pointer",textAlign:"left",transition:"all .28s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bark)";e.currentTarget.style.background="rgba(122,92,60,.04)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--linen3)";e.currentTarget.style.background="transparent";}}
                >
                  <div style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:18,color:"var(--ink)",marginBottom:6}}>Table Host</div>
                  <div className="body" style={{fontSize:13}}>Free membership · Full food stipend · Open your home · Quarterly minimum</div>
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div className="eyebrow" style={{opacity:.5,fontSize:9}}>{step+1} / {STEPS.length} · {type === "host" ? "Table Host" : "Member"}</div>
              </div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(19px,2.5vw,26px)",color:"var(--ink)",marginBottom:30,lineHeight:1.25}}>
                {cur.label}
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:22}}>
                {cur.fields.map(f=>(
                  <div key={f.k}>
                    <div className="eyebrow" style={{fontSize:8,marginBottom:7,opacity:.45}}>{f.lbl}</div>
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
                  style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--sans)",fontWeight:300,fontSize:10.5,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(30,26,20,.35)",transition:"color .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--ink)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.35)"}
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

  const inp = {
    width:"100%", background:"transparent", border:"none",
    borderBottom:"1px solid var(--linen3)", color:"var(--ink)",
    fontFamily:"var(--sans)", fontWeight:300, fontSize:16,
    letterSpacing:".018em", padding:"11px 0", outline:"none", transition:"border-color .32s",
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}
      style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(30,26,20,.32)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
        transition={{duration:.55,ease:[0.22,1,0.28,1]}}
        style={{width:"100%",maxWidth:468,background:"var(--linen)",border:"1px solid var(--linen3)",padding:"46px 42px",position:"relative"}}
      >
        <button onClick={onClose}
          style={{position:"absolute",top:18,right:20,background:"none",border:"none",cursor:"pointer",color:"rgba(30,26,20,.3)",fontSize:17,lineHeight:1,transition:"color .3s"}}
          onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.3)"}
        >×</button>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
              <div className="eyebrow" style={{marginBottom:18,color:"var(--sage)"}}>Thank you</div>
              <h3 style={{fontFamily:"var(--serif)",fontWeight:400,fontSize:"clamp(22px,3.5vw,34px)",color:"var(--ink)",lineHeight:1.12,marginBottom:18}}>
                You just kept<br /><em style={{color:"var(--terra)"}}>a table set.</em>
              </h3>
              <Rule align="left" />
              <p className="body" style={{marginTop:18,fontSize:14.5}}>
                Your donation goes to Basalith.org and funds Table Host stipends around the world. Every dollar means a host doesn't have to think twice about cooking.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
              <div className="eyebrow" style={{marginBottom:18}}>Support Common Table</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(20px,2.6vw,28px)",color:"var(--ink)",marginBottom:10,lineHeight:1.2}}>
                The dinners are free.<br />That takes funding.
              </h3>
              <p className="body" style={{marginBottom:32,fontSize:14.5}}>
                Your gift to Basalith.org covers food stipends for Table Hosts worldwide. Tax-deductible. Every dollar feeds someone.
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
              <p style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:11,color:"rgba(30,26,20,.35)",textAlign:"center",marginTop:14,letterSpacing:".04em"}}>
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
    <footer style={{ background: "var(--linen)", borderTop: "1px solid var(--linen3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "88px var(--pad)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "center", borderBottom: "1px solid var(--linen3)" }}>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(30px,4.2vw,54px)", lineHeight: .97, color: "var(--ink)" }}>
              There's a seat<br />
              <em style={{ color: "var(--terra)" }}>with your name on it.</em>
            </h2>
            <div>
              <p className="body" style={{ marginBottom: 28 }}>
                Apply for membership. Become a Table Host. Or simply support the mission so someone else can find their seat.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-terra" onClick={onApply}>Apply Now</button>
                <button className="btn" onClick={onDonate}>Donate</button>
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ padding: "26px var(--pad)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:400, color:"rgba(30,26,20,.5)" }}>Common Table</span>
            <span style={{ fontFamily:"var(--sans)", fontWeight:300, fontSize:10, letterSpacing:".16em", color:"rgba(30,26,20,.3)", marginLeft:10 }}>a program of Basalith.org</span>
          </div>
          <span style={{ fontFamily:"var(--sans)", fontWeight:300, fontSize:11, letterSpacing:".06em", color:"rgba(30,26,20,.28)" }}>
            Basalith.org · 501(c)(3) nonprofit
          </span>
          <div style={{ display:"flex", gap:24 }}>
            {["Mission","Membership","Donate","Contact"].map(l=>(
              <a key={l} href="#" style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:10.5,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(30,26,20,.3)",textDecoration:"none",transition:"color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(30,26,20,.3)"}
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
export default function CommonTable() {
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
            <Mission />
            <WhatHappens />
            <Membership onApply={() => setApplyOpen(true)} />
            <Cities />
            <TableHosts onApply={() => setApplyOpen(true)} />
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