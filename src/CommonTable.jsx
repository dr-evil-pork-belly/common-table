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

/* Simulated photography */
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
.scene-city {
  background:
    radial-gradient(ellipse at 60% 50%, rgba(140,160,180,.14) 0%, transparent 48%),
    radial-gradient(ellipse at 35% 65%, rgba(180,120,50,.18) 0%, transparent 40%),
    linear-gradient(150deg, #0C1014 0%, #141820 52%, #101418 100%);
}

@keyframes flicker { 0%,100%{opacity:1} 45%{opacity:.94} 72%{opacity:.97} 88%{opacity:.93} }
@keyframes slowPan { from{transform:scale(1.06) translateX(0)} to{transform:scale(1.06) translateX(-2%)} }

/* Type */
.eyebrow {
  font-family:var(--sans); font-weight:400; font-size:10.5px;
  letter-spacing:.34em; text-transform:uppercase; color:var(--terra);
}
.body {
  font-family:var(--sans); font-weight:300;
  font-size:clamp(15px,1.45vw,17px); line-height:1.95;
  letter-spacing:.015em; color:var(--ink3);
}
.caption {
  font-family:var(--sans); font-weight:300; font-size:11px;
  letter-spacing:.08em; color:rgba(242,237,228,.45);
}

/* Buttons */
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
   OPENING — the invitation
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
            style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(14px,1.7vw,17px)", color: "var(--ink3)",
              letterSpacing: ".04em", marginBottom: 20, lineHeight: 1.65,
            }}
          >
            the world got very lonely.
          </motion.p>

          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "108%" }} animate={show ? { y: "0%" } : {}}
              transition={{ delay: .9, duration: 1.0, ease: [0.22, 1, 0.28, 1] }}
              style={{
                fontFamily: "var(--serif)", fontWeight: 400,
                fontSize: "clamp(44px,8vw,96px)",
                lineHeight: .9, letterSpacing: "-.015em", color: "var(--ink)",
              }}
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
            style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(14px,1.7vw,17px)", color: "var(--terra)",
              letterSpacing: ".04em", lineHeight: 1.65,
            }}
          >
            we went the other way.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 3.2, duration: 1.2 }}
            onClick={onEnter}
            style={{
              marginTop: 44, fontFamily: "var(--sans)", fontWeight: 300,
              fontSize: 10, letterSpacing: ".36em", textTransform: "uppercase",
              background: "none", border: "none", color: "rgba(30,26,20,.3)",
              cursor: "pointer", transition: "color .4s",
            }}
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
function Nav({ onDonate }) {
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
        <span style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400, letterSpacing: ".03em", color: "var(--ink)" }}>
          Common Table
        </span>
        <span style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: 10, letterSpacing: ".18em", color: "var(--ink3)", opacity: .5, marginLeft: 12 }}>
          by Basalith.org
        </span>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {[["The Mission","#mission"],["The Dinners","#dinners"],["Cities","#cities"],["Host","#host"]].map(([l,h]) => (
          <a key={l} href={h} style={{
            fontFamily: "var(--sans)", fontWeight: 300, fontSize: 11,
            letterSpacing: ".18em", textTransform: "uppercase",
            color: "rgba(30,26,20,.42)", textDecoration: "none", transition: "color .3s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(30,26,20,.42)"}
          >{l}</a>
        ))}
        <button className="btn btn-terra" onClick={onDonate} style={{ padding: "9px 22px", fontSize: 10 }}>
          Donate
        </button>
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════
   HERO — full bleed, editorial left
══════════════════════════════════════ */
function Hero({ onDonate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const bgY  = useTransform(scrollYProgress, [0,1], ["0%","14%"]);
  const txtY = useTransform(scrollYProgress, [0,1], ["0%","8%"]);
  const fade = useTransform(scrollYProgress, [0,.6], [1,0]);

  return (
    <section ref={ref} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: "-10%", y: bgY }} className="scene-table">
        {/* Candle glows — long table */}
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
        <div style={{
          position: "absolute", top: "50%", transform: "translateY(-54%)",
          left: "var(--pad)", maxWidth: 580, zIndex: 10,
        }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5, duration: 1.1 }}
            className="eyebrow" style={{ color: "rgba(242,237,228,.48)", marginBottom: 22 }}>
            A Basalith.org Initiative
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
              There's enough.
            </motion.div>
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: .9 }}
            style={{ height: 1, width: 44, background: "rgba(242,237,228,.3)", marginBottom: 24, transformOrigin: "left" }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.1 }}
            style={{ fontFamily: "var(--sans)", fontWeight: 300, fontSize: "clamp(15px,1.45vw,17px)", lineHeight: 1.9, color: "rgba(242,237,228,.58)", maxWidth: 400, marginBottom: 36, letterSpacing: ".015em" }}>
            Every week, in cities around the world, strangers sit down together for a real meal. No agenda. No phones. Just food, and the kind of conversation that only happens when you're not rushing.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#dinners" className="btn btn-solid"
              style={{ background: "rgba(242,237,228,.92)", borderColor: "transparent", color: "var(--ink)" }}>
              Find a Dinner
            </a>
            <button className="btn btn-light" onClick={onDonate}>Support the Mission</button>
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
   MISSION — the honest story
══════════════════════════════════════ */
function Mission() {
  const LINES = [
    { t: "The world got very lonely.", s: "lead" },
    { t: "We went the other way.", s: "terra" },
    { t: "Common Table is a weekly dinner — free to attend, open to anyone, happening in your city right now.", s: "body" },
    { t: "You don't need to know anyone. You don't need to bring anything. You just need to show up hungry.", s: "body" },
    { t: "By the end of the night, the strangers across from you won't be.", s: "lead-small" },
  ];

  return (
    <section id="mission" style={{ padding: "112px 0", background: "var(--linen)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 var(--pad)" }}>
        {LINES.map((line, i) => (
          <Reveal key={i} delay={i * .09} y={12}>
            <p style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: line.s === "lead" ? "clamp(22px,2.8vw,34px)"
                : line.s === "terra" ? "clamp(22px,2.8vw,34px)"
                : line.s === "lead-small" ? "clamp(19px,2.2vw,27px)"
                : "clamp(16px,1.6vw,19px)",
              lineHeight: 1.62,
              color: line.s === "terra" ? "var(--terra)"
                : line.s === "body" ? "var(--ink3)"
                : "var(--ink2)",
              marginBottom: line.s === "terra" ? 44 : line.s === "lead-small" ? 0 : 18,
              opacity: line.s === "body" ? .82 : 1,
            }}>{line.t}</p>
          </Reveal>
        ))}

        <Reveal delay={.5}>
          <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--linen3)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)" }}>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 18 }}>
                Common Table is a program of Basalith.org, a registered nonprofit. Every dinner is fully funded through donations and grants — so every seat is always free.
              </p>
            </div>
            <div>
              <Rule align="left" color="var(--sage)" />
              <p className="body" style={{ marginTop: 18 }}>
                We're building a movement that spreads like a neighborhood — one city at a time, one dinner at a time, until there's a Common Table in every city in the world.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   THE DINNER — what actually happens
══════════════════════════════════════ */
function TheDinner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  const MOMENTS = [
    { n:"01", t:"The food is real.", b:"Smoked, slow-cooked, made with care. Not catered. Not boxed. Someone spent the day preparing it. You can smell it before you walk in the door." },
    { n:"02", t:"The table is long.", b:"Long enough that you can't talk to everyone. Long enough that you'll find the two or three people you were meant to meet that night." },
    { n:"03", t:"The phones stay away.", b:"Not a rule. A request. Two hours where nothing you're looking at is a screen. Just faces, stories, and the kind of eye contact that used to be normal." },
    { n:"04", t:"Anyone can come.", b:"No application. No membership. No ticket price. If you're in the city and you want to come, there is a seat for you. That's the whole policy." },
  ];

  return (
    <section id="dinners" style={{ background: "var(--linen)" }}>
      {/* Full-bleed scene */}
      <div ref={ref} style={{ position: "relative", height: "54vh", overflow: "hidden" }}>
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

      {/* What happens */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 100px" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>What Happens</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                A real dinner.<br /><em style={{ color: "var(--terra)" }}>Nothing more.</em>
              </h2>
            </div>
            <p className="body">
              No icebreakers. No name tags. No program. Just a long table, good food, and the slow magic that happens when people eat together without somewhere else to be.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", borderTop: "none" }}>
          {MOMENTS.map((m, i) => (
            <Reveal key={m.n} delay={i * .1}>
              <div style={{
                padding: "44px var(--pad) 44px",
                borderRight: i < MOMENTS.length - 1 ? "1px solid var(--linen3)" : "none",
                borderTop: "1px solid var(--linen3)",
              }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--terra)", opacity: .6, marginBottom: 16 }}>{m.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(20px,2.2vw,27px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 16 }}>{m.t}</h3>
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
   CITIES — the scale
══════════════════════════════════════ */
const CITIES = [
  { city:"Los Angeles",  region:"California, US",   next:"Every Saturday",  s:"Active"   },
  { city:"New York",     region:"New York, US",      next:"Every Friday",    s:"Active"   },
  { city:"London",       region:"England, UK",       next:"Every Sunday",    s:"Active"   },
  { city:"Nairobi",      region:"Kenya",             next:"Every Saturday",  s:"Active"   },
  { city:"Berlin",       region:"Germany",           next:"Launching soon",  s:"Soon"     },
  { city:"Tokyo",        region:"Japan",             next:"Launching soon",  s:"Soon"     },
  { city:"São Paulo",    region:"Brazil",            next:"Launching soon",  s:"Soon"     },
  { city:"Cape Town",    region:"South Africa",      next:"Launching soon",  s:"Soon"     },
  { city:"Toronto",      region:"Canada",            next:"Your city next?", s:"Open"     },
  { city:"Sydney",       region:"Australia",         next:"Your city next?", s:"Open"     },
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
      style={{
        display: "grid", gridTemplateColumns: "1fr 200px 110px",
        alignItems: "center", gap: "clamp(12px,3vw,36px)",
        padding: "16px var(--pad)",
        borderBottom: "1px solid var(--linen3)",
        background: hov ? "var(--white)" : "transparent",
        transition: "background .28s",
      }}
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
    <section id="cities" style={{ background: "var(--linen2)", borderTop: "1px solid var(--linen3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Where We Are</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                A table in<br /><em style={{ color: "var(--terra)" }}>every city.</em>
              </h2>
            </div>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 20 }}>
                We started with one city. We're building toward every city. The model is simple — a local host, a long table, a weekly rhythm. If it can happen in Nairobi, it can happen anywhere.
              </p>
            </div>
          </div>
        </Reveal>

        {CITIES.map((c,i) => <CityRow key={c.city} c={c} i={i} />)}

        <Reveal delay={.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--linen3)" }}>
            {[["4","Active cities"],["Weekly","Dinner frequency"],["Free","Always"],["Open","To everyone"]].map(([val,lbl],i) => (
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
   HOST — spread like a church
══════════════════════════════════════ */
function Host() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], ["-7%","7%"]);
  const v = useInView(ref, { once: true });

  return (
    <section id="host" style={{ background: "var(--linen)" }}>
      <div ref={ref} style={{ position: "relative", height: "50vh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: "-14%", y }} className="scene-city">
          <div style={{ position: "absolute", inset: 0, animation: "flicker 15s ease-in-out infinite" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(10,8,12,.62) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(180deg, var(--linen) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(0deg, var(--linen2) 0%, transparent 100%)" }} />
        <motion.div
          initial={{ opacity: 0 }} animate={v ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: .2 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 var(--pad)", textAlign: "center" }}
        >
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(19px,3vw,40px)", lineHeight: 1.48, color: "rgba(242,237,228,.88)", maxWidth: 540 }}>
            "Every great movement started with someone who just decided to cook for their neighbors."
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 100px" }}>
        <Reveal>
          <div style={{ padding: "72px var(--pad) 52px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,64px)", alignItems: "end", borderBottom: "1px solid var(--linen3)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Bring It to Your City</div>
              <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(32px,4.8vw,60px)", lineHeight: .95, color: "var(--ink)" }}>
                Become a<br /><em style={{ color: "var(--terra)" }}>Common Table host.</em>
              </h2>
            </div>
            <div>
              <Rule align="left" />
              <p className="body" style={{ marginTop: 20 }}>
                You don't need a restaurant. You don't need funding. You need a space, a fire, and the belief that the people in your city are worth feeding. We'll handle the rest — the framework, the support, and a grant to cover your first three dinners.
              </p>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { n:"01", t:"Apply to host.", b:"Tell us your city and a little about yourself. We're looking for people who cook for love, not resume." },
            { n:"02", t:"We set you up.", b:"You get the Common Table framework, a host handbook, a small launch grant, and a community of hosts around the world." },
            { n:"03", t:"Cook. Gather. Repeat.", b:"Weekly. Same night, same place. The rhythm is the whole thing. People come back because they know where to find you." },
          ].map((s,i) => (
            <Reveal key={s.n} delay={i*.1}>
              <div style={{ padding: "44px var(--pad)", borderRight: i < 2 ? "1px solid var(--linen3)" : "none", borderTop: "1px solid var(--linen3)" }}>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12, color: "var(--terra)", opacity: .6, marginBottom: 16 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(20px,2.2vw,27px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 16 }}>{s.t}</h3>
                <Rule align="left" />
                <p className="body" style={{ marginTop: 16, fontSize: "clamp(14px,1.35vw,16px)" }}>{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   DONATE — the honest ask
══════════════════════════════════════ */
function DonateModal({ onClose }) {
  const [amt, setAmt] = useState(null);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);
  const AMOUNTS = [25, 50, 100, 250];

  const inp = {
    width:"100%", background:"transparent", border:"none",
    borderBottom:"1px solid var(--linen3)",
    color:"var(--ink)", fontFamily:"var(--sans)", fontWeight:300,
    fontSize:16, letterSpacing:".018em", padding:"11px 0", outline:"none",
    transition:"border-color .32s",
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}
      style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(30,26,20,.32)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}
        transition={{duration:.55,ease:[0.22,1,0.28,1]}}
        style={{width:"100%",maxWidth:480,background:"var(--linen)",border:"1px solid var(--linen3)",padding:"46px 42px",position:"relative"}}
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
                You just fed<br /><em style={{color:"var(--terra)"}}>a room full of people.</em>
              </h3>
              <Rule align="left" />
              <p className="body" style={{marginTop:18,fontSize:14.5}}>
                Your donation goes directly to Basalith.org and funds Common Table dinners around the world. Every dollar feeds someone who showed up alone and leaves less so.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}}>
              <div className="eyebrow" style={{marginBottom:18}}>Support Common Table</div>
              <h3 style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(20px,2.6vw,28px)",color:"var(--ink)",marginBottom:10,lineHeight:1.2}}>
                Every dinner is free.<br />That takes funding.
              </h3>
              <p className="body" style={{marginBottom:32,fontSize:14.5}}>
                Your gift to Basalith.org keeps the table set. Tax-deductible. No overhead theater — the money feeds people.
              </p>

              <div className="eyebrow" style={{fontSize:8,marginBottom:12,opacity:.5}}>Choose an amount</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
                {AMOUNTS.map(a=>(
                  <button key={a} onClick={()=>{setAmt(a);setCustom("");}}
                    style={{
                      fontFamily:"var(--sans)",fontWeight:300,fontSize:14,
                      padding:"11px 8px",border:"1px solid",
                      borderColor:amt===a?"var(--terra)":"var(--linen3)",
                      background:amt===a?"rgba(184,92,56,.08)":"transparent",
                      color:amt===a?"var(--terra)":"var(--ink3)",
                      cursor:"pointer",transition:"all .28s",
                    }}
                  >${a}</button>
                ))}
              </div>
              <div className="eyebrow" style={{fontSize:8,marginBottom:8,opacity:.5}}>Or enter your own</div>
              <input value={custom} onChange={e=>{setCustom(e.target.value);setAmt(null);}} placeholder="$ Other amount" style={inp}
                onFocus={e=>e.target.style.borderBottomColor="var(--terra)"}
                onBlur={e=>e.target.style.borderBottomColor="var(--linen3)"} />

              <button className="btn btn-terra" onClick={()=>setDone(true)}
                style={{marginTop:32,width:"100%",textAlign:"center"}}>
                Donate {amt ? `$${amt}` : custom ? `$${custom}` : ""} to Basalith.org
              </button>
              <p style={{fontFamily:"var(--sans)",fontWeight:300,fontSize:11,color:"rgba(30,26,20,.35)",textAlign:"center",marginTop:14,letterSpacing:".04em"}}>
                Secure donation · Tax-deductible · Basalith.org 501(c)(3)
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
function Footer({ onDonate }) {
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
                Find a dinner near you. Bring nothing. Leave full — in every sense of the word.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="#cities" className="btn btn-solid">Find a Dinner</a>
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
            Basalith.org is a registered 501(c)(3) nonprofit
          </span>
          <div style={{ display:"flex", gap:24 }}>
            {["About","Donate","Host","Contact"].map(l=>(
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
  const [donateOpen, setDonateOpen] = useState(false);
  return (
    <>
      <style>{CSS}</style>
      <AnimatePresence>
        {!entered && <Opening onEnter={() => setEntered(true)} />}
      </AnimatePresence>
      {entered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0 }}>
          <Nav onDonate={() => setDonateOpen(true)} />
          <main>
            <Hero onDonate={() => setDonateOpen(true)} />
            <Mission />
            <TheDinner />
            <Cities />
            <Host />
          </main>
          <Footer onDonate={() => setDonateOpen(true)} />
        </motion.div>
      )}
      <AnimatePresence>
        {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      </AnimatePresence>
    </>
  );
}