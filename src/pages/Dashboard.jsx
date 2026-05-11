import { useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Outfit',sans-serif;background:#faf6ef;color:#0c1420;}

.db-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;background:rgba(250,246,239,.95);backdrop-filter:blur(20px);border-bottom:1px solid #e8dfd0;}
.db-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#0c1420;cursor:pointer;}
.db-logo span{color:#b8893a;}
.db-nav-right{display:flex;align-items:center;gap:12px;}
.db-streak{font-size:12px;color:#7a5c1e;background:rgba(184,137,58,.08);border:1px solid rgba(184,137,58,.2);padding:5px 14px;border-radius:100px;font-weight:500;}
.db-btn-ghost{font-size:13px;color:#7a8499;background:transparent;border:1px solid #e8dfd0;padding:7px 14px;border-radius:6px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;}
.db-btn-ghost:hover{border-color:#0c1420;color:#0c1420;}
.db-btn-link{font-size:13px;color:#7a8499;background:transparent;border:none;cursor:pointer;font-family:'Outfit',sans-serif;}

.db-root{max-width:1100px;margin:0 auto;padding:40px 32px 80px;}

.db-header{margin-bottom:40px;}
.db-greeting{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:#0c1420;letter-spacing:-.5px;line-height:1.2;margin-bottom:6px;}
.db-greeting em{color:#b8893a;font-style:italic;}
.db-tagline{font-size:14px;color:#7a8499;font-weight:300;}

.db-level-bar{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #e8dfd0;border-radius:14px;padding:20px 24px;margin-bottom:32px;}
.db-level-current{text-align:center;padding:0 20px;}
.db-level-label{font-size:10px;color:#7a8499;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
.db-level-val{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#0c1420;line-height:1;}
.db-level-sub{font-size:11px;color:#7a8499;margin-top:2px;}
.db-level-track{flex:1;position:relative;}
.db-level-line{height:6px;background:#f3ece0;border-radius:3px;overflow:hidden;margin-bottom:8px;}
.db-level-fill{height:6px;border-radius:3px;background:linear-gradient(90deg,#b8893a,#d4a855);}
.db-level-steps{display:flex;justify-content:space-between;}
.db-level-step{font-size:10px;color:#b0a898;font-weight:500;}
.db-level-step.done{color:#b8893a;}
.db-level-step.current{color:#0c1420;font-weight:600;}
.db-level-step.target{color:#1a6b45;font-weight:600;}
.db-level-target{text-align:center;padding:0 20px;}
.db-level-target .db-level-val{color:#b8893a;}
.db-exam-badge{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 20px;background:#faf6ef;border:1px solid #e8dfd0;border-radius:10px;min-width:120px;}
.db-exam-days{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:#0c1420;line-height:1;}
.db-exam-lbl{font-size:10px;color:#7a8499;text-transform:uppercase;letter-spacing:.8px;margin-top:3px;}

.db-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;}
@media(max-width:768px){.db-grid{grid-template-columns:1fr;}}

.db-section-title{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#7a8499;margin-bottom:14px;}

.db-modules{display:grid;gap:10px;margin-bottom:32px;}
.db-module{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #e8dfd0;border-radius:12px;padding:16px 20px;cursor:pointer;transition:all .2s;text-decoration:none;position:relative;overflow:hidden;}
.db-module::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#b8893a,#d4a855);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
.db-module:hover{border-color:rgba(184,137,58,.3);box-shadow:0 4px 20px rgba(12,20,32,.06);transform:translateY(-1px);}
.db-module:hover::after{transform:scaleX(1);}
.db-module.priority{border-color:rgba(184,137,58,.35);background:#fffdf9;}
.db-module-icon{width:44px;height:44px;border-radius:10px;background:#faf6ef;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.db-module.priority .db-module-icon{background:rgba(184,137,58,.1);}
.db-module-info{flex:1;}
.db-module-name{font-size:14px;font-weight:600;color:#0c1420;margin-bottom:3px;}
.db-module-desc{font-size:12px;color:#7a8499;font-weight:300;}
.db-module-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
.db-module-score{font-size:12px;font-weight:600;color:#0c1420;}
.db-module-count{font-size:11px;color:#7a8499;}
.db-module-bar{width:80px;height:3px;background:#f3ece0;border-radius:2px;overflow:hidden;}
.db-module-fill{height:3px;border-radius:2px;background:linear-gradient(90deg,#b8893a,#d4a855);}
.db-priority-tag{position:absolute;top:12px;right:12px;font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#7a5c1e;background:rgba(184,137,58,.12);border:1px solid rgba(184,137,58,.25);padding:2px 8px;border-radius:100px;}
.db-module-arrow{font-size:16px;color:#b0a898;margin-left:4px;}

.db-card{background:#fff;border:1px solid #e8dfd0;border-radius:14px;padding:22px;}

.db-skill-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f3ece0;}
.db-skill-row:last-child{border-bottom:none;}
.db-skill-name{font-size:13px;color:#0c1420;font-weight:500;width:80px;flex-shrink:0;}
.db-skill-track{flex:1;height:5px;background:#f3ece0;border-radius:3px;overflow:hidden;}
.db-skill-fill{height:5px;border-radius:3px;background:linear-gradient(90deg,#b8893a,#d4a855);}
.db-skill-score{font-size:12px;font-weight:600;color:#0c1420;width:52px;text-align:right;}
.db-skill-nclc{font-size:10px;color:#7a8499;width:44px;text-align:right;}

.db-activity-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f3ece0;}
.db-activity-row:last-child{border-bottom:none;}
.db-activity-icon{font-size:16px;width:32px;height:32px;background:#faf6ef;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.db-activity-info{flex:1;}
.db-activity-name{font-size:13px;color:#0c1420;font-weight:500;margin-bottom:2px;}
.db-activity-meta{font-size:11px;color:#7a8499;}
.db-activity-score{font-size:13px;font-weight:600;}
.db-activity-score.good{color:#1a6b45;}
.db-activity-score.avg{color:#b8893a;}
.db-activity-score.low{color:#c0392b;}

.db-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;}
.db-cal-day{height:28px;border-radius:4px;background:#f3ece0;position:relative;}
.db-cal-day.active{background:linear-gradient(135deg,#b8893a,#d4a855);}
.db-cal-day.today{outline:2px solid #b8893a;outline-offset:1px;}
.db-cal-lbl{display:flex;justify-content:space-between;margin-bottom:8px;}
.db-cal-month{font-size:11px;color:#7a8499;}
.db-cal-days-row{display:flex;gap:4px;margin-bottom:4px;}
.db-cal-d{font-size:9px;color:#b0a898;flex:1;text-align:center;}

.db-vocab-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3ece0;}
.db-vocab-row:last-child{border-bottom:none;}
.db-vocab-word{font-size:13px;font-weight:500;color:#0c1420;}
.db-vocab-status{font-size:11px;padding:2px 8px;border-radius:100px;}
.db-vocab-status.mastered{color:#1a6b45;background:#f0faf4;border:1px solid rgba(26,107,69,.2);}
.db-vocab-status.review{color:#b8893a;background:rgba(184,137,58,.08);border:1px solid rgba(184,137,58,.2);}
.db-vocab-status.new{color:#7a8499;background:#faf6ef;border:1px solid #e8dfd0;}

.db-empty{text-align:center;padding:32px 16px;}
.db-empty-icon{font-size:28px;margin-bottom:10px;}
.db-empty-text{font-size:13px;color:#7a8499;font-weight:300;line-height:1.6;}

.db-cta-btn{display:inline-flex;align-items:center;gap:6px;background:#0c1420;color:#d4a855;border:none;padding:10px 20px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;margin-top:14px;}
.db-cta-btn:hover{background:#1e2d42;transform:translateY(-1px);}
`;

const NCLC_STEPS = ["NCLC 1","NCLC 2","NCLC 3","NCLC 4","NCLC 5","NCLC 6","NCLC 7","NCLC 8","NCLC 9","NCLC 10"];

const MODULES = [
  { id: "writing",    icon: "✍️", name: "Writing Practice",    desc: "TCF-style prompts · submit and review model answers" },
  { id: "listening",  icon: "🎧", name: "Listening Practice",  desc: "Québec accent audio passages · comprehension questions" },
  { id: "reading",    icon: "📖", name: "Reading Practice",    desc: "Formal texts · official correspondence · MCQs" },
  { id: "speaking",   icon: "🗣️", name: "Speaking Practice",   desc: "Oral prompts · sample responses · structure guides" },
  { id: "vocabulary", icon: "📚", name: "Vocabulary Builder",  desc: "Level-matched word banks · spaced repetition" },
];

function getSkillPct(nclc, target) {
  const n = parseInt(nclc) || 1;
  const t = parseInt(target) || 7;
  return Math.min(Math.round((n / t) * 100), 100);
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getLevelPct(currentNclc, targetNclc) {
  const steps = [1,2,3,4,5,6,7,8,9,10];
  const cur = parseInt(currentNclc) || 1;
  const tgt = parseInt(targetNclc) || 7;
  const curIdx = steps.indexOf(cur);
  const tgtIdx = steps.indexOf(tgt);
  if (tgtIdx <= 0) return 100;
  return Math.round((curIdx / tgtIdx) * 100);
}

export default function Dashboard({ userData, onRetake, onLogout, onStartModule }) {
  const [activeTab, setActiveTab] = useState("overview");

  const currentNclc = userData?.placed?.nclc || userData?.placedNclc || "5";
  const currentLevel = userData?.placed?.level || userData?.placedLevel || "B1";
  const targetNclc = userData?.target || userData?.targetNclc || "7";
  const examDate = userData?.examDate || null;
  const streak = userData?.streak || 0;
  const activity = userData?.completedExercises || [];
  const skills = userData?.answers
    ? (() => {
        const s = {};
        userData.answers.forEach((a) => {
          if (!s[a.skill]) s[a.skill] = { c: 0, t: 0 };
          s[a.skill].t++;
          if (a.correct) s[a.skill].c++;
        });
        return s;
      })()
    : {};

  const weakestSkill = Object.entries(skills).sort((a,b) => {
    const pctA = a[1].t > 0 ? a[1].c / a[1].t : 1;
    const pctB = b[1].t > 0 ? b[1].c / b[1].t : 1;
    return pctA - pctB;
  })[0]?.[0] || null;

  const levelPct = getLevelPct(currentNclc, targetNclc);
  const days = daysUntil(examDate);

  // Generate last 28 days activity grid
  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const isToday = i === 27;
    const isActive = Math.random() > 0.6; // placeholder — replace with real data
    return { d, isToday, isActive };
  });

  const skillList = [
    { name: "Reading",   score: skills["Comprehension"] ? Math.round((skills["Comprehension"].c / skills["Comprehension"].t) * 100) : null },
    { name: "Listening", score: null },
    { name: "Writing",   score: skills["Writing"] ? Math.round((skills["Writing"].c / skills["Writing"].t) * 100) : null },
    { name: "Speaking",  score: null },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <div className="db-nav">
        <div className="db-logo" onClick={onLogout}>NCLC<span>7</span></div>
        <div className="db-nav-right">
          <div className="db-streak">🔥 {streak} day streak</div>
          <button className="db-btn-ghost" onClick={onRetake}>Retake Assessment</button>
          <button className="db-btn-link" onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div className="db-root">

        {/* HEADER */}
        <div className="db-header">
          <div className="db-greeting">
            {new Date(userData?.joinedAt || Date.now()).toDateString() === new Date().toDateString()
              ? <>Welcome to <em>NCLC7</em></>
              : <>Welcome back</>
            }
          </div>
          <div className="db-tagline">
            Your resources are ready · {currentLevel} level · targeting NCLC {targetNclc}
          </div>
        </div>

        {/* LEVEL PROGRESS BAR */}
        <div className="db-level-bar">
          <div className="db-level-current">
            <div className="db-level-label">Your level</div>
            <div className="db-level-val">{currentLevel}</div>
            <div className="db-level-sub">NCLC {currentNclc}</div>
          </div>

          <div className="db-level-track">
            <div className="db-level-line">
              <div className="db-level-fill" style={{ width: `${levelPct}%` }} />
            </div>
            <div className="db-level-steps">
              {["1","2","3","4","5","6","7","8","9","10"].map((n) => {
                const isCurrent = n === currentNclc;
                const isTarget = n === targetNclc;
                const isDone = parseInt(n) < parseInt(currentNclc);
                return (
                  <div key={n} className={`db-level-step${isCurrent ? " current" : isTarget ? " target" : isDone ? " done" : ""}`}>
                    {n}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="db-level-target">
            <div className="db-level-label">Target</div>
            <div className="db-level-val">NCLC {targetNclc}</div>
            <div className="db-level-sub">Your goal</div>
          </div>

          {days !== null && (
            <div className="db-exam-badge">
              <div className="db-exam-days">{days > 0 ? days : "—"}</div>
              <div className="db-exam-lbl">{days > 0 ? "days left" : "exam passed"}</div>
            </div>
          )}
        </div>

        {/* MODULES */}
        <div className="db-section-title">Resources · {currentLevel} level</div>
        <div className="db-modules" style={{ marginBottom: 32 }}>
          {MODULES.map((m) => {
            const isPriority = weakestSkill && m.name.toLowerCase().includes(weakestSkill.toLowerCase());
            const completed = activity.filter(a => a.module === m.id).length;
            const avgScore = completed > 0
              ? Math.round(activity.filter(a => a.module === m.id && a.score).reduce((s, a) => s + a.score, 0) / completed)
              : null;
            return (
              <div
                key={m.id}
                className={`db-module${isPriority ? " priority" : ""}`}
                onClick={() => onStartModule && onStartModule(m.id)}
              >
                {isPriority && <div className="db-priority-tag">Focus area</div>}
                <div className="db-module-icon">{m.icon}</div>
                <div className="db-module-info">
                  <div className="db-module-name">{m.name}</div>
                  <div className="db-module-desc">{m.desc}</div>
                </div>
                <div className="db-module-meta">
                  {avgScore !== null ? (
                    <>
                      <div className="db-module-score">{avgScore}%</div>
                      <div className="db-module-bar">
                        <div className="db-module-fill" style={{ width: `${avgScore}%` }} />
                      </div>
                      <div className="db-module-count">{completed} done</div>
                    </>
                  ) : (
                    <div className="db-module-count" style={{ fontSize: 11, color: "#b0a898" }}>Not started</div>
                  )}
                </div>
                <div className="db-module-arrow">→</div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM GRID */}
        <div className="db-grid">

          {/* SKILL BREAKDOWN */}
          <div>
            <div className="db-section-title">Skill breakdown · from assessment</div>
            <div className="db-card">
              {skillList.map((s) => {
                const pct = s.score !== null ? s.score : null;
                return (
                  <div key={s.name} className="db-skill-row">
                    <div className="db-skill-name">{s.name}</div>
                    <div className="db-skill-track">
                      <div className="db-skill-fill" style={{ width: pct !== null ? `${pct}%` : "0%" }} />
                    </div>
                    <div className="db-skill-score">{pct !== null ? `${pct}%` : "—"}</div>
                    <div className="db-skill-nclc">NCLC {currentNclc}</div>
                  </div>
                );
              })}
              {Object.keys(skills).length === 0 && (
                <div className="db-empty">
                  <div className="db-empty-icon">📊</div>
                  <div className="db-empty-text">Skill data will appear here after you complete exercises in each module.</div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVITY CALENDAR */}
          <div>
            <div className="db-section-title">Activity · last 28 days</div>
            <div className="db-card">
              <div className="db-cal-lbl">
                <span className="db-cal-month">Each square = one session</span>
                <span className="db-cal-month" style={{ color: "#b8893a" }}>🟧 active day</span>
              </div>
              <div className="db-cal-days-row">
                {["M","T","W","T","F","S","S"].map((d,i) => (
                  <div key={i} className="db-cal-d">{d}</div>
                ))}
              </div>
              <div className="db-cal">
                {last28.map((day, i) => (
                  <div
                    key={i}
                    className={`db-cal-day${day.isActive ? " active" : ""}${day.isToday ? " today" : ""}`}
                    title={day.d.toDateString()}
                  />
                ))}
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7a8499" }}>
                <span>{streak} day streak</span>
                <span>{activity.length} total sessions</span>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div>
            <div className="db-section-title">Recent activity</div>
            <div className="db-card">
              {activity.length > 0 ? (
                activity.slice(-5).reverse().map((a, i) => (
                  <div key={i} className="db-activity-row">
                    <div className="db-activity-icon">
                      {MODULES.find(m => m.id === a.module)?.icon || "📝"}
                    </div>
                    <div className="db-activity-info">
                      <div className="db-activity-name">{a.title || a.module}</div>
                      <div className="db-activity-meta">{a.date || "Recently"}</div>
                    </div>
                    {a.score && (
                      <div className={`db-activity-score ${a.score >= 75 ? "good" : a.score >= 50 ? "avg" : "low"}`}>
                        {a.score}%
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="db-empty">
                  <div className="db-empty-icon">📝</div>
                  <div className="db-empty-text">No activity yet. Pick a module above to get started.</div>
                </div>
              )}
            </div>
          </div>

          {/* VOCABULARY STATUS */}
          <div>
            <div className="db-section-title">Vocabulary · due for review</div>
            <div className="db-card">
              {userData?.vocabulary && userData.vocabulary.length > 0 ? (
                userData.vocabulary.slice(0, 5).map((v, i) => (
                  <div key={i} className="db-vocab-row">
                    <div className="db-vocab-word">{v.word}</div>
                    <div className={`db-vocab-status ${v.status}`}>{v.status}</div>
                  </div>
                ))
              ) : (
                <div className="db-empty">
                  <div className="db-empty-icon">📚</div>
                  <div className="db-empty-text">Start the Vocabulary Builder to see your word progress here.</div>
                  <button className="db-cta-btn" onClick={() => onStartModule && onStartModule("vocabulary")}>
                    Open Vocabulary →
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
