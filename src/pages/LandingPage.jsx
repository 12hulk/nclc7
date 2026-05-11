import { useState, useEffect, useRef } from "react";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", dir = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  const base = dir === "left" ? "rl" : dir === "right" ? "rr" : "rv";
  return (
    <div ref={ref} className={`${base} ${visible ? "show" : ""} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function ProgressRing({ pct }) {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="#d4a855" strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <strong style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#d4a855", lineHeight: 1 }}>{pct}%</strong>
        <small style={{ fontSize: 9, color: "rgba(250,246,239,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>to B2</small>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --ink:#0c1420;--ink2:#1e2d42;
  --gold:#b8893a;--gold2:#d4a855;--gold3:#f0cc88;
  --p0:#faf6ef;--p1:#f3ece0;--p2:#e8dfd0;
  --white:#fff;--muted:#7a8499;--green:#1a6b45;
}
html{scroll-behavior:smooth;}
body{font-family:'Outfit',sans-serif;background:var(--p0);color:var(--ink);overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
  background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");}

.rv{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease;}
.rl{opacity:0;transform:translateX(-28px);transition:opacity .6s ease,transform .6s ease;}
.rr{opacity:0;transform:translateX(28px);transition:opacity .6s ease,transform .6s ease;}
.rv.show,.rl.show,.rr.show{opacity:1;transform:none;}

nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:18px 64px;background:rgba(250,246,239,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(184,137,58,.14);transition:box-shadow .3s;}
nav.scrolled{box-shadow:0 4px 28px rgba(12,20,32,.08);}
.logo{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--ink);}
.logo span{color:var(--gold);}
.nav-links{display:flex;gap:36px;}
.nav-links a{text-decoration:none;font-size:14px;font-weight:500;color:var(--ink);opacity:.55;transition:opacity .2s;}
.nav-links a:hover{opacity:1;}
.nav-cta{background:var(--ink);color:var(--gold2);border:none;padding:11px 26px;border-radius:3px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;}
.nav-cta:hover{background:var(--ink2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(12,20,32,.18);}

.hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:56px;padding:130px 64px 80px;position:relative;overflow:hidden;}
.hero-grid{position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(184,137,58,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,58,.05) 1px,transparent 1px);
  background-size:72px 72px;mask-image:radial-gradient(ellipse 65% 70% at 25% 50%,black,transparent);}
.hero-glow{position:absolute;top:15%;left:5%;width:560px;height:560px;background:radial-gradient(ellipse,rgba(184,137,58,.09) 0%,transparent 68%);pointer-events:none;}
.hero-left{position:relative;z-index:1;}
.flag{font-size:36px;display:inline-block;margin-bottom:20px;animation:float 4s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;background:rgba(184,137,58,.1);border:1px solid rgba(184,137,58,.28);color:#7a5c1e;padding:6px 14px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;}
.pdot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pd 2s infinite;}
@keyframes pd{0%,100%{opacity:1;}50%{opacity:.3;}}
h1.ht{font-family:'Cormorant Garamond',serif;font-size:clamp(46px,5.2vw,74px);line-height:1.06;color:var(--ink);margin-bottom:24px;letter-spacing:-1px;}
h1.ht em{color:var(--gold);font-style:italic;}
.hsub{font-size:17px;line-height:1.78;color:var(--muted);max-width:460px;margin-bottom:40px;font-weight:300;}
.hsub strong{color:var(--ink);font-weight:500;}
.hctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:36px;}
.btn-p{background:var(--ink);color:var(--gold2);border:none;padding:17px 38px;border-radius:4px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
.btn-p::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.07),transparent);}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(12,20,32,.28);}
.btn-g{background:transparent;border:1.5px solid rgba(12,20,32,.18);color:var(--ink);padding:16px 28px;border-radius:4px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s;}
.btn-g:hover{border-color:var(--ink);background:rgba(12,20,32,.04);}
.trust{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--muted);}
.avs{display:flex;}
.avs span{width:30px;height:30px;border-radius:50%;border:2px solid var(--p0);background:var(--ink2);color:var(--gold3);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:-9px;}
.avs span:first-child{margin-left:0;}

.hero-right{position:relative;z-index:1;}
.ucard{background:var(--ink);border-radius:18px;padding:28px;box-shadow:0 48px 96px rgba(12,20,32,.3),0 0 0 1px rgba(184,137,58,.1);position:relative;overflow:hidden;}
.ucard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(184,137,58,.07),transparent 60%);pointer-events:none;}
.ucard-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
.ucard-title{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--p0);font-weight:600;}
.ubadge{background:rgba(184,137,58,.15);border:1px solid rgba(184,137,58,.3);color:var(--gold3);padding:4px 10px;border-radius:100px;font-size:11px;}
.pring-row{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:18px;margin-bottom:18px;}
.pring-info h4{font-size:14px;color:var(--p0);margin-bottom:4px;}
.pring-info p{font-size:12px;color:rgba(250,246,239,.42);line-height:1.6;}
.sbar-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.sbar-name{font-size:12px;color:rgba(250,246,239,.48);width:64px;flex-shrink:0;}
.sbar-track{flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden;}
.sbar-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--gold),var(--gold3));}
.sbar-pct{font-size:11px;color:var(--gold2);width:28px;text-align:right;}
.tasks-lbl{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:rgba(250,246,239,.28);margin-bottom:10px;}
.task{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);margin-bottom:7px;}
.tdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.tdot.done{background:#4ade80;}.tdot.active{background:var(--gold);}.tdot.pend{background:rgba(255,255,255,.18);}
.ttxt{flex:1;font-size:13px;color:rgba(250,246,239,.68);}
.ttime{font-size:11px;color:rgba(250,246,239,.26);}
.ufloat{position:absolute;bottom:-16px;left:-40px;background:var(--white);border-radius:12px;padding:14px 18px;box-shadow:0 16px 48px rgba(0,0,0,.14);border:1px solid var(--p2);min-width:158px;}
.ufloat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:3px;}
.ufloat-val{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--ink);font-weight:700;line-height:1;}
.ufloat-up{font-size:12px;color:var(--green);font-weight:600;}

.estrip{background:var(--p1);padding:26px 64px;border-top:1px solid var(--p2);border-bottom:1px solid var(--p2);}
.estrip-in{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;}
.estrip-lbl{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.ebadges{display:flex;gap:16px;flex-wrap:wrap;}
.ebadge{display:flex;align-items:center;gap:7px;background:var(--white);border:1px solid var(--p2);padding:8px 16px;border-radius:6px;font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 2px 8px rgba(0,0,0,.05);}

.stats{background:var(--ink);padding:44px 64px;display:grid;grid-template-columns:repeat(4,1fr);z-index:1;position:relative;}
.stat{text-align:center;padding:0 16px;}
.stat+.stat{border-left:1px solid rgba(255,255,255,.07);}
.snum{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:700;color:var(--gold2);line-height:1;margin-bottom:6px;}
.slbl{font-size:12px;color:rgba(255,255,255,.38);letter-spacing:.5px;}

section{position:relative;z-index:1;}
.stag{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:block;}
.stitle{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.8vw,50px);color:var(--ink);line-height:1.15;letter-spacing:-.5px;}
.ssub{font-size:16px;color:var(--muted);line-height:1.75;font-weight:300;max-width:520px;margin-top:14px;}

.how{padding:120px 64px;background:var(--white);}
.how-in{max-width:1100px;margin:0 auto;}
.how-hd{margin-bottom:72px;}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;position:relative;}
.step-line{position:absolute;top:44px;left:calc(12.5% + 36px);right:calc(12.5% + 36px);height:1px;background:linear-gradient(90deg,transparent,var(--gold2),transparent);opacity:.22;}
.step{padding:0 20px;text-align:center;}
.snwrap{position:relative;width:88px;height:88px;margin:0 auto 20px;}
.snbg{position:absolute;inset:0;border-radius:50%;background:var(--p1);border:1.5px solid rgba(184,137,58,.2);transition:all .3s;}
.step:hover .snbg{background:var(--ink);border-color:var(--ink);}
.sn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--gold);transition:color .3s;}
.step:hover .sn{color:var(--gold2);}
.sne{font-size:18px;position:absolute;bottom:-2px;right:-2px;}
.step h3{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink);margin-bottom:10px;}
.step p{font-size:13px;color:var(--muted);line-height:1.75;font-weight:300;}

.features{padding:120px 64px;background:var(--p0);}
.feat-in{max-width:1100px;margin:0 auto;}
.fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px;}
.fcard{background:var(--white);border:1px solid var(--p2);border-radius:14px;padding:34px 28px;transition:all .3s;position:relative;overflow:hidden;cursor:default;}
.fcard::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold3));transform:scaleX(0);transform-origin:left;transition:transform .35s;}
.fcard:hover{transform:translateY(-5px);box-shadow:0 20px 56px rgba(12,20,32,.09);border-color:rgba(184,137,58,.18);}
.fcard:hover::after{transform:scaleX(1);}
.ficon{width:50px;height:50px;border-radius:10px;background:var(--p1);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;}
.fcard h3{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:var(--ink);margin-bottom:10px;}
.fcard p{font-size:14px;color:var(--muted);line-height:1.75;font-weight:300;}

.testi{padding:120px 64px;background:var(--ink);}
.testi-in{max-width:1100px;margin:0 auto;}
.tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px;}
.tcard{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:30px 26px;transition:all .3s;}
.tcard:hover{background:rgba(255,255,255,.07);border-color:rgba(184,137,58,.2);}
.tstars{color:var(--gold2);font-size:13px;letter-spacing:2px;margin-bottom:14px;}
.ttextq{font-size:14px;color:rgba(250,246,239,.72);line-height:1.82;font-weight:300;font-style:italic;margin-bottom:22px;}
.tauthor{display:flex;align-items:center;gap:12px;}
.tavatar{width:38px;height:38px;border-radius:50%;background:var(--ink2);border:2px solid rgba(184,137,58,.25);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--gold2);flex-shrink:0;}
.tname{font-size:13px;font-weight:600;color:var(--p0);}
.tmeta{font-size:11px;color:rgba(250,246,239,.3);margin-top:2px;}

.pricing{padding:120px 64px;background:var(--p1);}
.price-in{max-width:980px;margin:0 auto;}
.price-hd{text-align:center;margin-bottom:10px;}
.price-sub{text-align:center;font-size:16px;color:var(--muted);margin-bottom:24px;font-weight:300;}
.urgency{text-align:center;background:rgba(184,137,58,.1);border:1px solid rgba(184,137,58,.25);border-radius:8px;padding:12px 24px;max-width:500px;margin:0 auto 40px;font-size:13px;color:#7a5c1e;font-weight:500;}
.urgency strong{font-weight:700;}
.btoggle{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:44px;}
.tw{font-size:14px;color:var(--muted);font-weight:500;transition:color .2s;}
.tw.on{color:var(--ink);font-weight:600;}
.ttrack{width:48px;height:26px;border-radius:100px;background:var(--ink);border:none;cursor:pointer;position:relative;flex-shrink:0;}
.tdotb{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--gold2);transition:transform .25s;}
.ttrack.on .tdotb{transform:translateX(22px);}
.schip{background:rgba(26,107,69,.12);border:1px solid rgba(26,107,69,.22);color:var(--green);padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;}
.plan{background:var(--white);border:1.5px solid var(--p2);border-radius:16px;padding:38px 30px;position:relative;transition:all .25s;}
.plan.feat{background:var(--ink);border-color:var(--gold);transform:scale(1.04);box-shadow:0 24px 72px rgba(12,20,32,.22);}
.pop{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--ink);padding:4px 18px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap;}
.pname{font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
.plan.feat .pname{color:var(--gold);}
.pprice{font-family:'Cormorant Garamond',serif;font-size:54px;font-weight:700;color:var(--ink);line-height:1;margin-bottom:2px;transition:all .3s;}
.plan.feat .pprice{color:var(--p0);}
.pprice sup{font-size:22px;vertical-align:super;font-family:'Outfit',sans-serif;}
.pperiod{font-size:12px;color:var(--muted);margin-bottom:28px;}
.plan.feat .pperiod{color:rgba(250,246,239,.38);}
.pline{height:1px;background:var(--p2);margin-bottom:24px;}
.plan.feat .pline{background:rgba(255,255,255,.07);}
.pfeats{list-style:none;margin-bottom:32px;}
.pfeats li{display:flex;align-items:flex-start;gap:9px;padding:7px 0;font-size:13px;color:var(--muted);}
.plan.feat .pfeats li{color:rgba(250,246,239,.65);}
.ck{color:var(--gold);flex-shrink:0;margin-top:1px;}
.xk{color:rgba(122,132,153,.32);flex-shrink:0;margin-top:1px;}
.btnplan{width:100%;padding:14px;border-radius:6px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:1.5px solid var(--ink);background:transparent;color:var(--ink);}
.btnplan:hover{background:var(--ink);color:var(--p0);}
.plan.feat .btnplan{background:var(--gold);border-color:var(--gold);color:var(--ink);}
.plan.feat .btnplan:hover{background:var(--gold2);border-color:var(--gold2);}
.pnote{font-size:11px;text-align:center;color:var(--muted);margin-top:10px;}
.plan.feat .pnote{color:rgba(250,246,239,.3);}

.faq{padding:100px 64px;background:var(--white);}
.faq-in{max-width:680px;margin:0 auto;}
.faq-hd{text-align:center;margin-bottom:56px;}
.fitem{border-bottom:1px solid var(--p2);padding:22px 0;cursor:pointer;}
.fq{display:flex;align-items:center;justify-content:space-between;gap:16px;}
.fqt{font-size:15px;font-weight:500;color:var(--ink);transition:color .2s;line-height:1.5;}
.fitem:hover .fqt{color:var(--gold);}
.fico{font-size:22px;color:var(--gold);flex-shrink:0;transition:transform .3s;line-height:1;}
.fitem.open .fico{transform:rotate(45deg);}
.fans{font-size:14px;color:var(--muted);line-height:1.82;font-weight:300;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s;}
.fitem.open .fans{max-height:200px;padding-top:14px;}

.fcta{padding:120px 64px;background:var(--ink);text-align:center;position:relative;overflow:hidden;}
.fcta::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(184,137,58,.09) 0%,transparent 65%);pointer-events:none;}
.cflag{font-size:52px;display:block;margin-bottom:22px;animation:float 4s ease-in-out infinite;}
.ctitle{font-family:'Cormorant Garamond',serif;font-size:clamp(38px,5vw,62px);color:var(--p0);line-height:1.1;margin-bottom:18px;letter-spacing:-.5px;}
.ctitle em{color:var(--gold);font-style:italic;}
.csub{font-size:16px;color:rgba(250,246,239,.42);margin-bottom:40px;font-weight:300;}
.btn-cta{background:var(--gold);color:var(--ink);border:none;padding:20px 52px;border-radius:4px;font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:all .25s;}
.btn-cta:hover{background:var(--gold2);transform:translateY(-2px);box-shadow:0 16px 48px rgba(184,137,58,.28);}
.cperks{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:24px;flex-wrap:wrap;}
.cperk{font-size:12px;color:rgba(250,246,239,.3);display:flex;align-items:center;gap:6px;}
.cperk::before{content:'✓';color:var(--gold);font-weight:700;}

footer{background:#070d18;padding:44px 64px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
.flogo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--p0);}
.flogo span{color:var(--gold);}
.flinks{display:flex;gap:24px;}
.flinks a{font-size:13px;color:rgba(255,255,255,.28);text-decoration:none;transition:color .2s;}
.flinks a:hover{color:var(--gold);}
footer p{font-size:12px;color:rgba(255,255,255,.2);}

@media(max-width:960px){
  nav{padding:16px 24px;} .nav-links{display:none;}
  .hero{grid-template-columns:1fr;padding:100px 24px 60px;text-align:center;}
  .hero-right{display:none;} .trust{justify-content:center;} .hctas{justify-content:center;}
  .estrip{padding:24px;}
  .stats{grid-template-columns:repeat(2,1fr);padding:40px 24px;gap:24px;} .stat+.stat{border:none;}
  .how,.features,.pricing,.faq,.fcta,.testi{padding:80px 24px;}
  .steps{grid-template-columns:1fr 1fr;gap:40px;} .step-line{display:none;}
  .fgrid,.tgrid{grid-template-columns:1fr;}
  .plans{grid-template-columns:1fr;} .plan.feat{transform:none;}
  footer{flex-direction:column;align-items:flex-start;padding:40px 24px;}
}
`;

const FAQS = [
  { q: "Which exam does NCLC7 prepare me for?", a: "We focus exclusively on TCF Canada — the primary French exam accepted for Canadian permanent residency. All content, mock tests, and scoring rubrics mirror the official TCF Canada format exactly." },
  { q: "I am a complete beginner. Can I still use NCLC7?", a: "Absolutely. Our assessment places you wherever you are — A1 through C1. Your study plan is built around your starting point, so beginners get a clear, achievable path to NCLC 7 — the level required for most PR streams." },
  { q: "How is this different from Duolingo?", a: "Duolingo is a casual app that won't prepare you for a formal immigration exam. NCLC7 is built around TCF Canada format, official NCLC scoring, and timed simulations. Every session mirrors what you will face on exam day." },
  { q: "Can I cancel anytime?", a: "Yes — no contracts, no fees. Cancel from your dashboard at any time and keep access until the end of your billing period." },
  { q: "How does the AI writing feedback work?", a: "You submit a written response to a prompt. Our AI scores it against the official TCF rubric — grammar, vocabulary, coherence, task completion — and returns an NCLC band score plus specific corrections." },
  { q: "Is the score improvement guarantee real?", a: "On the Intensive plan, if your mock exam score doesn't improve after 8 weeks of consistent use, we refund your last month — no questions asked." },
];

export default function LandingPage({ onStartAssessment }) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const prices = annual ? { prep: 15, intensive: 32 } : { prep: 19, intensive: 39 };

  const plans = [
    {
      name: "Free", price: 0, period: "No credit card needed", feat: false,
      features: [
        { t: "Level assessment quiz", y: true },
        { t: "5 practice questions / day", y: true },
        { t: "Basic progress tracking", y: true },
        { t: "AI writing feedback", y: false },
        { t: "Personalized study plan", y: false },
        { t: "Mock exams", y: false },
      ],
      cta: "Get Started Free", note: "Free forever"
    },
    {
      name: "Prep", price: prices.prep, period: annual ? "/ mo · billed annually" : "/ month", feat: true,
      features: [
        { t: "Everything in Free", y: true },
        { t: "Unlimited practice modules", y: true },
        { t: "AI writing feedback", y: true },
        { t: "Personalized daily study plan", y: true },
        { t: "2 full mock exams / month", y: true },
        { t: "Progress dashboard + streak", y: true },
      ],
      cta: "Start 7-Day Free Trial", note: "Cancel anytime"
    },
    {
      name: "Intensive", price: prices.intensive, period: annual ? "/ mo · billed annually" : "/ month", feat: false,
      features: [
        { t: "Everything in Prep", y: true },
        { t: "Unlimited mock exams", y: true },
        { t: "Speaking recording + AI score", y: true },
        { t: "Score improvement guarantee", y: true },
        { t: "Priority support", y: true },
        { t: "1-on-1 exam strategy session", y: true },
      ],
      cta: "Go Intensive", note: "Guarantee included"
    },
  ];

  return (
    <>
      <style>{CSS}</style>

      <nav className={scrolled ? "scrolled" : ""}>
        <div className="logo">NCLC<span>7</span></div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <button className="nav-cta" onClick={onStartAssessment}>Take Free Assessment →</button>
      </nav>

      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <Reveal dir="left" className="hero-left">
          <div className="flag">🍁</div>
          <div className="eyebrow"><div className="pdot" /> TCF Canada · NCLC 7 · Canadian PR</div>
          <h1 className="ht">Your French.<br /><em>Your PR.</em><br />On schedule.</h1>
          <p className="hsub">The only prep platform built <strong>specifically for immigrants</strong> targeting Canadian permanent residency. Know your level, close the gap, pass TCF Canada.</p>
          <div className="hctas">
            <button className="btn-p" onClick={onStartAssessment}>Take Free Assessment →</button>
            <button className="btn-g" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>See how it works</button>
          </div>
          <div className="trust">
            <div className="avs">{["A","M","K","R","S"].map(l => <span key={l}>{l}</span>)}</div>
            <span>Joined by 4,200+ PR applicants from 38 countries</span>
          </div>
        </Reveal>

        <Reveal dir="right" className="hero-right">
          <div className="ucard">
            <div className="ucard-hd">
              <span className="ucard-title">Your Progress</span>
              <span className="ubadge">TCF Canada</span>
            </div>
            <div className="pring-row">
              <ProgressRing pct={62} />
              <div className="pring-info">
                <h4>Currently at NCLC 5</h4>
                <p>38% more to reach your NCLC 7 PR target. Exam in 74 days.</p>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              {[["Reading", 74], ["Listening", 58], ["Writing", 61], ["Speaking", 49]].map(([n, p]) => (
                <div className="sbar-row" key={n}>
                  <span className="sbar-name">{n}</span>
                  <div className="sbar-track"><div className="sbar-fill" style={{ width: `${p}%` }} /></div>
                  <span className="sbar-pct">{p}%</span>
                </div>
              ))}
            </div>
            <div className="tasks-lbl">Today's Plan</div>
            {[
              { l: "Listening: Dialogue à l'aéroport", t: "10 min", s: "done" },
              { l: "Writing: Lettre formelle", t: "20 min", s: "active" },
              { l: "Mock: Expression orale", t: "30 min", s: "pend" },
            ].map((t, i) => (
              <div className="task" key={i}>
                <div className={`tdot ${t.s}`} />
                <span className="ttxt">{t.l}</span>
                <span className="ttime">{t.t}</span>
              </div>
            ))}
          </div>
          <div className="ufloat">
            <div className="ufloat-lbl">Score Projection</div>
            <div className="ufloat-val">387 <span className="ufloat-up">↑ +23</span></div>
          </div>
        </Reveal>
      </section>

      <div className="estrip">
        <div className="estrip-in">
          <p className="estrip-lbl">Recognized by</p>
          <div className="ebadges">
            {[["🍁","TCF Canada"],["🍁","IRCC Accepted"],["🇫🇷","NCLC Scale"],["🎓","CEFR Aligned"]].map(([ic, lb]) => (
              <div className="ebadge" key={lb}><span>{ic}</span>{lb}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats">
        {[["4,200+","Active Students"],["91%","First-Attempt Pass Rate"],["4 mo.","Average Prep Time"],["38","Countries Represented"]].map(([n, l]) => (
          <div className="stat" key={l}>
            <div className="snum">{n}</div>
            <div className="slbl">{l}</div>
          </div>
        ))}
      </div>

      <section className="how" id="how">
        <div className="how-in">
          <Reveal className="how-hd">
            <span className="stag">How it works</span>
            <h2 className="stitle">From assessment to NCLC 7 in four steps.</h2>
            <p className="ssub">No guesswork. No scattered resources. A clear, personalized path from where you are to where you need to be for Canadian PR.</p>
          </Reveal>
          <div className="steps">
            <div className="step-line" />
            {[
              { n: "01", e: "🎯", t: "Take Free Assessment", d: "A 15-minute adaptive quiz places you precisely on the NCLC scale. No login required. Results are instant." },
              { n: "02", e: "📊", t: "See Your Gap", d: "Your results reveal exactly how far you are from NCLC 7 and how long it will take at your pace." },
              { n: "03", e: "📅", t: "Follow Your Plan", d: "A personalized daily schedule built around your exam date and study time. Know what to do every single day." },
              { n: "04", e: "✅", t: "Pass With Confidence", d: "Mock exams, AI feedback, and progress tracking ensure you walk into TCF Canada fully prepared." },
            ].map((s, i) => (
              <Reveal key={s.n} className="step" delay={i * 0.1}>
                <div className="snwrap">
                  <div className="snbg" /><div className="sn">{s.n}</div><div className="sne">{s.e}</div>
                </div>
                <h3>{s.t}</h3><p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="feat-in">
          <Reveal>
            <span className="stag">Features</span>
            <h2 className="stitle">Everything you need.<br />Nothing you don't.</h2>
            <p className="ssub">Built around what actually moves your NCLC score — not engagement metrics or streaks.</p>
          </Reveal>
          <div className="fgrid">
            {[
              { ic: "🎯", t: "Level Assessment", d: "A smart adaptive quiz places you exactly on the NCLC scale in 15 minutes. Your starting point is the foundation of everything." },
              { ic: "🤖", t: "AI Writing Coach", d: "Submit any response and get instant feedback scored against the official TCF rubric — grammar, coherence, vocabulary, task completion." },
              { ic: "📋", t: "Full Mock Exams", d: "Timed simulations that mirror the exact structure and scoring of TCF Canada. Know your real NCLC score before exam day." },
              { ic: "🎙️", t: "Speaking Practice", d: "Record oral responses and receive AI feedback on fluency, pronunciation, and structure — scored as a real TCF examiner would." },
              { ic: "📅", t: "Personalized Plan", d: "Your daily study schedule built around your exam date, current NCLC level, and available time. Updated weekly based on progress." },
              { ic: "📈", t: "Progress Dashboard", d: "See your NCLC score trajectory, study streak, and a clear projection of whether you will be ready on exam day." },
            ].map((f, i) => (
              <Reveal key={f.t} className="fcard" delay={i * 0.08}>
                <div className="ficon">{f.ic}</div>
                <h3>{f.t}</h3><p>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="testi">
        <div className="testi-in">
          <Reveal>
            <span className="stag" style={{ color: "rgba(212,168,85,.8)" }}>Student Stories</span>
            <h2 className="stitle" style={{ color: "var(--p0)" }}>Real people. Real results.</h2>
          </Reveal>
          <div className="tgrid">
            {[
              { s: "★★★★★", t: "I tried Duolingo for months and felt no closer to the exam. NCLC7 showed me exactly what TCF Canada looks like and my score jumped from NCLC 4 to NCLC 7 in 14 weeks.", n: "Amara K.", m: "Nigeria 🇳🇬 → Montreal · TCF Canada NCLC 7" },
              { s: "★★★★★", t: "The AI writing feedback is something else. I submitted an essay and got back a full breakdown — exactly what an examiner would have said. It transformed how I write in French.", n: "Rajan M.", m: "India 🇮🇳 → Ottawa · TCF Canada NCLC 8" },
              { s: "★★★★★", t: "I had my exam in 8 weeks and was panicking. The study plan NCLC7 built me was exactly what I needed. I passed on my first attempt with 3 weeks to spare.", n: "Sofia T.", m: "Brazil 🇧🇷 → Calgary · TCF Canada NCLC 7" },
            ].map((t, i) => (
              <Reveal key={t.n} className="tcard" delay={i * 0.1}>
                <div className="tstars">{t.s}</div>
                <p className="ttextq">"{t.t}"</p>
                <div className="tauthor">
                  <div className="tavatar">{t.n[0]}</div>
                  <div><div className="tname">{t.n}</div><div className="tmeta">{t.m}</div></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="price-in">
          <Reveal className="price-hd">
            <span className="stag">Pricing</span>
            <h2 className="stitle">Simple, honest pricing.</h2>
          </Reveal>
          <p className="price-sub">Start free. Upgrade when you're ready. Cancel anytime.</p>
          <div className="urgency">🎉 <strong>Founding Member offer:</strong> Lock in Prep at $9/mo forever — only 47 spots remaining</div>
          <div className="btoggle">
            <span className={`tw ${!annual ? "on" : ""}`}>Monthly</span>
            <button className={`ttrack ${annual ? "on" : ""}`} onClick={() => setAnnual(!annual)}>
              <div className="tdotb" />
            </button>
            <span className={`tw ${annual ? "on" : ""}`}>Annual</span>
            {annual && <span className="schip">Save 20%</span>}
          </div>
          <div className="plans">
            {plans.map((p, i) => (
              <Reveal key={p.name} className={`plan ${p.feat ? "feat" : ""}`} delay={i * 0.1}>
                {p.feat && <div className="pop">Most Popular</div>}
                <div className="pname">{p.name}</div>
                <div className="pprice">{p.price === 0 ? "Free" : <><sup>$</sup>{p.price}</>}</div>
                <div className="pperiod">{p.price === 0 ? "No credit card needed" : p.period}</div>
                <div className="pline" />
                <ul className="pfeats">
                  {p.features.map(f => (
                    <li key={f.t}><span className={f.y ? "ck" : "xk"}>{f.y ? "✓" : "–"}</span>{f.t}</li>
                  ))}
                </ul>
                <button className="btnplan" onClick={onStartAssessment}>{p.cta}</button>
                <p className="pnote">{p.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="faq-in">
          <Reveal className="faq-hd">
            <span className="stag">FAQ</span>
            <h2 className="stitle">Common questions.</h2>
          </Reveal>
          {FAQS.map((f, i) => (
            <div className={`fitem ${openFaq === i ? "open" : ""}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="fq"><span className="fqt">{f.q}</span><span className="fico">+</span></div>
              <div className="fans">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="fcta">
        <Reveal>
          <span className="cflag">🍁</span>
          <h2 className="ctitle">Your PR is waiting.<br /><em>Your French</em> is the last step.</h2>
          <p className="csub">Take the free assessment. Know your NCLC level in 15 minutes. No credit card required.</p>
          <button className="btn-cta" onClick={onStartAssessment}>Take Free Assessment →</button>
          <div className="cperks">
            <span className="cperk">Takes 15 minutes</span>
            <span className="cperk">Results are instant</span>
            <span className="cperk">No login required</span>
            <span className="cperk">100% free to start</span>
          </div>
        </Reveal>
      </section>

      <footer>
        <div className="flogo">NCLC<span>7</span></div>
        <div className="flinks">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a><a href="#">Blog</a>
        </div>
        <p>© 2026 NCLC7 · Built for immigrants, by immigrants.</p>
      </footer>
    </>
  );
}
