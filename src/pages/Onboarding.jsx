import { useState } from "react";

const TOPICS = [
  { id: "immigration", label: "Immigration & residency", icon: "🏛️" },
  { id: "workplace", label: "Workplace French", icon: "💼" },
  { id: "daily", label: "Daily life", icon: "🏘️" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "education", label: "Education & schools", icon: "📚" },
  { id: "housing", label: "Housing & tenancy", icon: "🏠" },
];

const LEVELS = [
  { code: "A1", label: "Beginner", desc: "Little to no French", nclc: "NCLC 1–2" },
  { code: "A2", label: "Elementary", desc: "Basic phrases, greetings", nclc: "NCLC 3–4" },
  { code: "B1", label: "Intermediate", desc: "Can hold simple conversations", nclc: "NCLC 5–6" },
  { code: "B2", label: "Upper-intermediate", desc: "Comfortable in most situations", nclc: "NCLC 7–8" },
];

const QUESTIONS = {
  A1: [
    { skill: "Signs", q: "You see this sign on a Canadian government office door.", ctx: "ENTRÉE", opts: ["Enter / Come in", "Exit / Way out", "Danger / Warning", "Toilets"], c: 0, ex: "Entrée means entrance. You will see this on doors across Canada — essential day-one vocabulary." },
    { skill: "Signs", q: "You see this on a door in a mall.", ctx: "POUSSEZ", opts: ["Push", "Pull", "Closed", "Open"], c: 0, ex: "Poussez = push. Tirez = pull. These two words are on almost every door in Quebec." },
    { skill: "Forms", q: "You are filling a government form. The field says 'Nom'. What do you write?", ctx: "Formulaire de demande\n\nNom : ___________\nPrénom : ___________", opts: ["Your last name (family name)", "Your first name", "Your date of birth", "Your address"], c: 0, ex: "Nom = last name. Prénom = first name. This distinction is critical on every Canadian government form." },
    { skill: "Vocabulary", q: "Which word means 'doctor' in French?", ctx: null, opts: ["Médecin", "Maison", "Travail", "École"], c: 0, ex: "Médecin = doctor. Maison = house, Travail = work, École = school. Know these for healthcare visits." },
    { skill: "Social", q: "Your neighbor says 'Bonjour!' What do you say back?", ctx: null, opts: ["Bonjour !", "Merci beaucoup.", "Au revoir.", "Je ne sais pas."], c: 0, ex: "Bonjour = Hello. You respond with Bonjour. Merci = thank you, Au revoir = goodbye." },
    { skill: "Numbers", q: "The cashier says: 'Cinq dollars, s'il vous plaît.' How much do you owe?", ctx: null, opts: ["$5", "$15", "$50", "$500"], c: 0, ex: "Cinq = five. S'il vous plaît = please. Numbers are essential for shopping and banking." },
    { skill: "Vocabulary", q: "You need to find a hospital. Which word do you look for?", ctx: null, opts: ["Hôpital", "Hôtel", "École", "Bureau de poste"], c: 0, ex: "Hôpital = hospital. Hôtel = hotel (similar but very different!). École = school. Bureau de poste = post office." },
    { skill: "Social", q: "Someone asks: 'Comment vous appelez-vous?' What are they asking?", ctx: null, opts: ["What is your name?", "Where do you live?", "How old are you?", "Where are you from?"], c: 0, ex: "Comment vous appelez-vous? = What is your name? The literal translation is 'How do you call yourself?'" },
  ],
  A2: [
    { skill: "Comprehension", q: "Read this text and answer.", ctx: "Je m'appelle Fatima. Je viens du Maroc. J'habite à Montréal depuis six mois. Je travaille dans un café le matin.", opts: ["She works in a café", "She is a student", "She works in an office", "She does not work"], c: 0, ex: "'Je travaille dans un café' = I work in a café. Travailler = to work. Since = depuis." },
    { skill: "Grammar", q: "Choose the correct word to complete the sentence.", ctx: "Je _______ au bureau tous les jours.", opts: ["vais", "va", "aller", "allé"], c: 0, ex: "'Je vais' = I go. With 'je', the verb aller takes the form 'vais'. Va is for il/elle." },
    { skill: "Practical", q: "Your landlord sends you this message. What does he want?", ctx: "Bonjour, le loyer du mois de novembre est dû le 1er. Merci.", opts: ["The rent is due on the 1st", "You need to call him", "Your lease is ending", "There is a problem"], c: 0, ex: "Loyer = rent. Dû = due/owed. Real messages like this arrive every month as a tenant in Canada." },
    { skill: "Grammar", q: "Complete the sentence correctly.", ctx: "Elle _______ une infirmière très compétente.", opts: ["est", "a", "être", "ont"], c: 0, ex: "'Elle est' = She is. With être (to be), elle takes 'est'. 'A' means has, from avoir (to have)." },
    { skill: "Practical", q: "You call a clinic and hear this. What should you do?", ctx: "'Nos bureaux sont fermés. Veuillez rappeler pendant les heures d'ouverture : lundi au vendredi, 8h à 17h.'", opts: ["Call back weekday between 8am–5pm", "Leave a message now", "Go to the clinic immediately", "Call a different number"], c: 0, ex: "Fermés = closed. Rappeler = call back. Heures d'ouverture = opening hours. Critical for navigating services." },
    { skill: "Vocabulary", q: "Your doctor says 'Vous avez de la fièvre.' What does this mean?", ctx: null, opts: ["You have a fever", "You need rest", "You are healthy", "You need medication"], c: 0, ex: "Fièvre = fever. Vous avez = you have. Recognizing health vocabulary is essential for immigrants." },
    { skill: "Grammar", q: "Choose the correct form.", ctx: "Nous _______ au Canada depuis deux ans.", opts: ["sommes", "avons", "êtes", "sont"], c: 0, ex: "'Nous sommes' = We are. Être conjugated for 'nous' = sommes. The most common way to express duration." },
    { skill: "Practical", q: "You receive this letter from the city. What is it about?", ctx: "Objet : Renouvellement de votre permis de stationnement\nVotre permis expire le 31 décembre. Veuillez renouveler avant cette date.", opts: ["Parking permit expires Dec 31", "You have a parking fine", "Your parking is cancelled", "You need a new address"], c: 0, ex: "Renouvellement = renewal. Permis = permit. Expire = expires. Reading official mail is a key immigration skill." },
  ],
  B1: [
    { skill: "Grammar", q: "Choose the sentence that uses the correct tense for a completed action yesterday.", ctx: "Context: describing what happened at work yesterday.", opts: ["Hier, j'ai présenté mon rapport à l'équipe.", "Hier, je présente mon rapport à l'équipe.", "Hier, je présentais mon rapport à l'équipe.", "Hier, je vais présenter mon rapport."], c: 0, ex: "For a completed action in the past, use passé composé: j'ai présenté. Présente (present) and présentais (imperfect, ongoing) do not fit." },
    { skill: "Formal", q: "You are writing a formal email to a government official you have never met. Which opening is correct?", ctx: null, opts: ["Madame, Monsieur,", "Salut,", "Cher ami,", "Bonjour tout le monde,"], c: 0, ex: "Madame, Monsieur is the standard formal salutation in French official correspondence — equivalent to 'Dear Sir or Madam'." },
    { skill: "Comprehension", q: "Read this and identify the main idea.", ctx: "Le gouvernement du Canada invite les résidents permanents à s'intégrer dans leur communauté en participant aux activités locales, en apprenant les langues officielles et en comprenant les droits et responsabilités canadiens.", opts: ["Government encourages PR holders to integrate via community, language, and civic participation", "Government requires residents to learn two languages", "Permanent residents must attend local events", "Government offers free language classes"], c: 0, ex: "S'intégrer = integrate. Apprenant = learning. Droits et responsabilités = rights and responsibilities. The key word is 'invite' (encourage), not 'oblige' (require)." },
    { skill: "Grammar", q: "Complete the sentence with the correct relative pronoun.", ctx: "C'est le formulaire _______ je dois remplir pour ma demande de citoyenneté.", opts: ["que", "qui", "dont", "où"], c: 0, ex: "'Que' is used when the relative pronoun is the object of the verb. Je dois remplir le formulaire → C'est le formulaire que je dois remplir." },
    { skill: "Writing", q: "Which sentence is correct and formally appropriate for a job application cover letter?", ctx: null, opts: ["Je me permets de vous soumettre ma candidature pour le poste d'infirmier.", "Je veux avoir ce travail d'infirmier avec vous.", "Moi, je suis infirmier et je cherche un job.", "Je vous écris parce que j'ai besoin d'un emploi."], c: 0, ex: "'Je me permets de vous soumettre ma candidature' is the standard formal phrase for job applications. Register awareness is critical for TCF writing tasks." },
    { skill: "Grammar", q: "Choose the correct verb form for this conditional sentence.", ctx: "Si j'_______ le temps, j'apprendrais le français plus vite.", opts: ["avais", "ai", "aurai", "aurais"], c: 0, ex: "Conditional: si + imparfait (avais) + conditionnel (apprendrais). Si j'avais = If I had. Tested in TCF writing tasks." },
    { skill: "Comprehension", q: "What does this workplace email ask you to do?", ctx: "Objet : Réunion obligatoire\nVeuillez noter que la réunion de vendredi est obligatoire pour tous les membres de l'équipe. Merci de confirmer votre présence avant jeudi midi.", opts: ["Confirm attendance before Thursday noon", "Reschedule the Friday meeting", "Submit a report by Thursday", "Inform a colleague"], c: 0, ex: "Confirmez votre présence = confirm your attendance. Avant jeudi midi = before Thursday noon. Obligatoire = mandatory." },
    { skill: "Vocabulary", q: "Your employer asks about your 'atouts'. What is she asking about?", ctx: null, opts: ["Your strengths and assets", "Your weaknesses", "Your previous salary", "Your references"], c: 0, ex: "Atouts = assets, strengths. Commonly used in job interviews: 'Quels sont vos principaux atouts?' = What are your main strengths?" },
  ],
  B2: [
    { skill: "Grammar", q: "Which sentence is grammatically correct?", ctx: null, opts: ["Bien qu'il soit fatigué, il a terminé son rapport.", "Bien qu'il est fatigué, il a terminé son rapport.", "Bien qu'il était fatigué, il a terminé son rapport.", "Bien qu'il serait fatigué, il a terminé son rapport."], c: 0, ex: "'Bien que' (although) always requires the subjunctive: soit. Not est (indicative), était (imperfect), or serait (conditional). A key B2 grammar point." },
    { skill: "Writing", q: "You are writing a formal complaint to your landlord about heating. Which sentence is most appropriate?", ctx: null, opts: ["Je me vois dans l'obligation de vous signaler que le chauffage est hors service depuis trois semaines.", "Le chauffage est cassé depuis 3 semaines, c'est inacceptable.", "Ça fait 3 semaines que le chauffage marche pas.", "Le chauffage ne fonctionne plus et je suis vraiment fâché."], c: 0, ex: "'Je me vois dans l'obligation de' (I feel compelled to) is the formal register for complaints. The other options are too informal or aggressive." },
    { skill: "Comprehension", q: "What is the main argument of this paragraph?", ctx: "La maîtrise du français ne se limite pas à la communication quotidienne. Elle constitue un véritable vecteur d'intégration sociale et professionnelle pour les nouveaux arrivants, leur permettant d'accéder à un marché du travail plus large et de participer pleinement à la vie civique.", opts: ["French mastery enables social, professional and civic integration beyond daily communication", "French is difficult for newcomers", "The job market requires perfect French", "French classes are available for newcomers"], c: 0, ex: "Vecteur = vehicle/means. Intégration = integration. The paragraph argues French opens doors — social, professional, and civic. The key word is 'ne se limite pas' (is not limited to)." },
    { skill: "Grammar", q: "Choose the correct form to express a past hypothesis.", ctx: "Si elle _______ arrivée plus tôt, elle aurait eu le poste.", opts: ["était", "a été", "serait", "aura été"], c: 0, ex: "Past conditional: si + plus-que-parfait (était arrivée) + conditionnel passé (aurait eu). 'If she had arrived earlier, she would have gotten the job.'" },
    { skill: "Vocabulary", q: "Which word best completes this formal sentence?", ctx: "Le comité a décidé de _______ le projet en raison de contraintes budgétaires.", opts: ["suspendre", "arrêter", "finir", "bloquer"], c: 0, ex: "Suspendre (to suspend/put on hold) is the most formal and precise word here. Arrêter is more abrupt, finir means to finish, bloquer is informal." },
    { skill: "Writing", q: "Which sentence best introduces a counterargument in a formal essay?", ctx: null, opts: ["Certes, certains avancent que l'immigration enrichit la culture locale, mais il convient néanmoins d'examiner les défis qu'elle pose.", "Oui mais l'immigration c'est compliqué aussi.", "L'immigration a des avantages et des inconvénients.", "Cependant, l'immigration est un sujet difficile."], c: 0, ex: "'Certes... mais il convient néanmoins de' is the classic academic French formula for counterarguments — essential for TCF written expression at B2." },
    { skill: "Comprehension", q: "What can be inferred from this legal notice?", ctx: "Avis aux locataires : En vertu de l'article 1913 du Code civil, tout locataire souhaitant résilier son bail doit en aviser le propriétaire par écrit avec un préavis d'au moins trois mois.", opts: ["Tenants must give 3 months written notice to end their lease", "Tenants can leave anytime without notice", "The landlord must give 3 months notice", "The lease renews after 3 months"], c: 0, ex: "Résilier = terminate. Bail = lease. Préavis = notice period. Aviser par écrit = notify in writing. This type of legal text appears in TCF comprehension sections." },
    { skill: "Grammar", q: "Identify the sentence with the correct passive voice.", ctx: null, opts: ["La décision a été prise par le comité directeur.", "Le comité directeur a pris la décision.", "La décision était pris par le comité.", "Le comité a été pris la décision."], c: 0, ex: "Passive voice: sujet + être (conjugated) + participe passé + par + agent. 'A été prise' — prise agrees with 'la décision' (feminine). Option 3 has gender agreement error." },
  ],
};

function placedLevel(selfLevel, score) {
  const map = {
    A1: score >= 88 ? { level: "A2", nclc: "3" } : score >= 63 ? { level: "A1+", nclc: "2" } : { level: "A1", nclc: "1" },
    A2: score >= 88 ? { level: "B1", nclc: "5" } : score >= 63 ? { level: "A2+", nclc: "4" } : { level: "A2", nclc: "3" },
    B1: score >= 88 ? { level: "B2", nclc: "7" } : score >= 63 ? { level: "B1+", nclc: "6" } : { level: "B1", nclc: "5" },
    B2: score >= 88 ? { level: "C1", nclc: "9" } : score >= 63 ? { level: "B2+", nclc: "8" } : { level: "B2", nclc: "7" },
  };
  return map[selfLevel] || { level: "B1", nclc: "5" };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Outfit',sans-serif;}
.ob-root{min-height:100vh;background:#faf6ef;display:flex;align-items:center;justify-content:center;padding:32px 16px;position:relative;}
.ob-root::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");}
.ob-card{width:100%;max-width:560px;background:#fff;border:1px solid #e8dfd0;border-radius:20px;overflow:hidden;box-shadow:0 24px 80px rgba(12,20,32,.1);position:relative;z-index:1;}
.ob-top{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #f3ece0;background:rgba(250,246,239,.9);}
.ob-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#0c1420;}
.ob-logo span{color:#b8893a;}
.ob-sc{font-size:11px;color:#7a8499;font-weight:500;}
.ob-track{height:2px;background:#f3ece0;}
.ob-fill{height:2px;background:linear-gradient(90deg,#b8893a,#d4a855);transition:width .5s cubic-bezier(.4,0,.2,1);}
.ob-wrap{padding:28px 24px 32px;}
.ob-eye{display:inline-flex;align-items:center;gap:7px;background:rgba(184,137,58,.08);border:1px solid rgba(184,137,58,.22);color:#7a5c1e;padding:5px 12px;border-radius:100px;font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:16px;}
.ob-edot{width:5px;height:5px;border-radius:50%;background:#b8893a;animation:obpd 2s infinite;}
@keyframes obpd{0%,100%{opacity:1}50%{opacity:.3}}
.ob-h{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#0c1420;letter-spacing:-.5px;line-height:1.2;margin-bottom:6px;}
.ob-h em{color:#b8893a;font-style:italic;}
.ob-sub{font-size:13px;color:#7a8499;line-height:1.6;margin-bottom:20px;font-weight:300;}
.ob-lrow{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #e8dfd0;border-radius:10px;cursor:pointer;background:#faf6ef;margin-bottom:7px;transition:all .2s;}
.ob-lrow:hover{border-color:#d4a855;background:#fff;}
.ob-lrow.on{border:1.5px solid #b8893a;background:#fff;box-shadow:0 4px 20px rgba(184,137,58,.08);}
.ob-lcode{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#b8893a;min-width:30px;}
.ob-lname{font-size:13px;font-weight:500;color:#0c1420;margin-bottom:1px;}
.ob-ldesc{font-size:11px;color:#7a8499;}
.ob-npill{font-size:10px;padding:3px 9px;border-radius:100px;border:1px solid #e8dfd0;color:#7a8499;background:#fff;transition:all .2s;}
.ob-lrow.on .ob-npill{border-color:#b8893a;color:#7a5c1e;background:rgba(184,137,58,.08);}
.ob-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px;}
.ob-chip{font-size:12px;padding:6px 13px;border-radius:100px;border:1px solid #e8dfd0;color:#7a8499;background:#faf6ef;cursor:pointer;transition:all .15s;user-select:none;}
.ob-chip:hover{border-color:#d4a855;color:#0c1420;}
.ob-chip.on{border-color:#b8893a;color:#7a5c1e;background:rgba(184,137,58,.08);font-weight:500;}
.ob-tl{font-size:12px;color:#7a8499;font-weight:500;display:block;margin:14px 0 9px;}
.ob-nbtns{display:flex;gap:6px;margin-bottom:22px;}
.ob-nb{width:37px;height:37px;border-radius:8px;border:1px solid #e8dfd0;background:#faf6ef;color:#7a8499;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;}
.ob-nb:hover{border-color:#d4a855;color:#0c1420;}
.ob-nb.on{background:#0c1420;color:#d4a855;border-color:#0c1420;}
.ob-ctx{background:#faf6ef;border:1px solid #e8dfd0;border-radius:10px;padding:14px 16px;margin-bottom:14px;font-size:13px;color:#0c1420;line-height:1.6;}
.ob-ctx-lbl{font-size:10px;font-weight:600;color:#b8893a;letter-spacing:.8px;text-transform:uppercase;margin-bottom:6px;}
.ob-opts{display:grid;gap:8px;margin-bottom:16px;}
.ob-opt{display:flex;align-items:center;gap:11px;padding:12px 14px;border:1px solid #e8dfd0;border-radius:8px;font-size:13px;color:#7a8499;cursor:pointer;background:#faf6ef;transition:all .15s;}
.ob-opt:hover{border-color:#d4a855;color:#0c1420;background:#fff;}
.ob-opt.correct{border-color:#1a6b45;background:#f0faf4;color:#1a6b45;}
.ob-opt.wrong{border-color:#c0392b;background:#fdf3f2;color:#c0392b;}
.ob-opt.reveal{border-color:#1a6b45;background:#f0faf4;color:#1a6b45;opacity:.55;}
.ob-ol{font-size:10px;font-weight:700;color:#b8893a;min-width:18px;flex-shrink:0;}
.ob-opt.correct .ob-ol,.ob-opt.wrong .ob-ol{color:inherit;}
.ob-explain{background:#faf6ef;border-left:3px solid #b8893a;padding:10px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#7a8499;line-height:1.6;margin-bottom:14px;}
.ob-dots{display:flex;gap:6px;justify-content:center;margin-top:4px;}
.ob-dot{height:6px;border-radius:3px;background:#e8dfd0;transition:all .3s;}
.ob-dot.a{width:20px;background:#b8893a;}
.ob-dot.d{width:6px;background:#1a6b45;}
.ob-dot.w{width:6px;background:#c0392b;}
.ob-dot.i{width:6px;}
.ob-btn{flex:1;padding:13px;background:#0c1420;color:#d4a855;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;}
.ob-btn:hover:not(:disabled){background:#1e2d42;transform:translateY(-1px);}
.ob-btn:disabled{background:#e8dfd0;color:#b0a898;cursor:not-allowed;}
.ob-btnb{padding:13px 18px;background:transparent;color:#7a8499;border:1px solid #e8dfd0;border-radius:8px;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;}
.ob-btnb:hover{border-color:#0c1420;color:#0c1420;}
.ob-btnrow{display:flex;gap:9px;}
.ob-info-row{display:flex;justify-content:space-between;padding:11px 14px;background:#faf6ef;border:1px solid #e8dfd0;border-radius:8px;font-size:13px;margin-bottom:8px;}
.ob-badge{font-size:10px;padding:3px 10px;border-radius:100px;border:1px solid rgba(184,137,58,.3);color:#7a5c1e;background:rgba(184,137,58,.06);font-weight:500;margin-bottom:12px;display:inline-block;}
.ob-rbadge{display:inline-block;font-size:10px;font-weight:600;color:#1a6b45;background:#f0faf4;border:1px solid rgba(26,107,69,.2);border-radius:100px;padding:5px 12px;letter-spacing:.8px;text-transform:uppercase;margin:24px 24px 0;}
.ob-rtitle{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#0c1420;margin:10px 24px 5px;line-height:1.2;}
.ob-rsub{font-size:13px;color:#7a8499;margin:0 24px 18px;line-height:1.6;font-weight:300;}
.ob-rgrid{display:flex;align-items:center;gap:10px;margin:0 24px 16px;}
.ob-rbox{flex:1;border-radius:12px;padding:14px;text-align:center;border:1px solid #e8dfd0;background:#faf6ef;}
.ob-rbox.hi{background:#0c1420;border-color:#0c1420;box-shadow:0 12px 40px rgba(12,20,32,.2);}
.ob-rlbl{font-size:10px;letter-spacing:.8px;text-transform:uppercase;margin-bottom:5px;color:#7a8499;font-weight:500;}
.ob-rbox.hi .ob-rlbl{color:rgba(212,168,85,.6);}
.ob-rbig{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#0c1420;line-height:1;}
.ob-rbox.hi .ob-rbig{color:#d4a855;}
.ob-rsm{font-size:11px;color:#7a8499;margin-top:3px;}
.ob-rbox.hi .ob-rsm{color:rgba(212,168,85,.5);}
.ob-rarr{font-size:18px;color:#e8dfd0;}
.ob-skillgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 24px 16px;}
.ob-skillbox{background:#faf6ef;border:1px solid #e8dfd0;border-radius:10px;padding:12px 14px;}
.ob-skillname{font-size:11px;color:#7a8499;margin-bottom:6px;font-weight:500;}
.ob-skillbar{height:4px;background:#e8dfd0;border-radius:2px;overflow:hidden;margin-bottom:4px;}
.ob-skillfill{height:4px;border-radius:2px;background:linear-gradient(90deg,#b8893a,#d4a855);}
.ob-skillpct{font-size:11px;color:#b8893a;font-weight:600;}
.ob-pbox{margin:0 24px 18px;background:#faf6ef;border:1px solid #e8dfd0;border-radius:12px;padding:16px;}
.ob-ptitle{font-size:13px;font-weight:600;color:#0c1420;margin-bottom:12px;}
.ob-pitem{display:flex;gap:9px;align-items:flex-start;margin-bottom:9px;}
.ob-picon{font-size:13px;margin-top:1px;}
.ob-ptext{font-size:12px;color:#7a8499;line-height:1.55;font-weight:300;}
.ob-cta{display:block;width:calc(100% - 48px);margin:0 24px 24px;padding:14px;background:#0c1420;color:#d4a855;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;}
.ob-cta:hover{background:#1e2d42;transform:translateY(-1px);}
`;

export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [selfLevel, setSelfLevel] = useState(null);
  const [topics, setTopics] = useState([]);
  const [target, setTarget] = useState("7");
  const [qBank, setQBank] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplain, setShowExplain] = useState(false);

  const toggleTopic = (id) =>
    setTopics((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const buildBank = (lvl) => {
    const pool = QUESTIONS[lvl] || [];
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
  };

  const handleAnswer = (chosen) => {
    const q = qBank[qIdx];
    const correct = chosen === q.c;
    setAnswers((prev) => [...prev, { chosen, correct, skill: q.skill }]);
  };

  const goNext = () => {
    setShowExplain(false);
    if (qIdx < qBank.length - 1) setQIdx(qIdx + 1);
    else setPhase("result");
  };

  const score = answers.length > 0 ? Math.round((answers.filter((a) => a.correct).length / answers.length) * 100) : 0;
  const placed = placedLevel(selfLevel, score);

  const skillScores = () => {
    const s = {};
    answers.forEach((a) => {
      if (!s[a.skill]) s[a.skill] = { c: 0, t: 0 };
      s[a.skill].t++;
      if (a.correct) s[a.skill].c++;
    });
    return s;
  };

  const fill =
    phase === "intro" ? 2
    : phase === "level" ? 10
    : phase === "topics" ? 20
    : phase === "target" ? 30
    : phase === "briefing" ? 40
    : phase === "quiz" ? 40 + Math.round((qIdx / (qBank.length || 1)) * 52)
    : 100;

  const scLabel =
    phase === "intro" ? "Free Assessment"
    : phase === "level" ? "Step 1 of 3"
    : phase === "topics" ? "Step 2 of 3"
    : phase === "target" ? "Step 3 of 3"
    : phase === "briefing" ? "Ready"
    : phase === "quiz" ? `Question ${qIdx + 1} of ${qBank.length}`
    : "Complete";

  return (
    <>
      <style>{CSS}</style>
      <div className="ob-root">
        <div className="ob-card">
          <div className="ob-top">
            <div className="ob-logo">NCLC<span>7</span></div>
            <div className="ob-sc">{scLabel}</div>
          </div>
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${Math.max(fill, 2)}%` }} />
          </div>

          {phase === "intro" && (
            <div className="ob-wrap">
              <div className="ob-eye"><div className="ob-edot" />Free Assessment</div>
              <div className="ob-h">Find your <em>true level</em></div>
              <div className="ob-sub">A practical, adaptive assessment built for immigrants — not a grammar quiz for students. Every question reflects real life in Canada.</div>
              {[
                ["Real scenarios", "Signs, forms, emails, workplace situations"],
                ["Adaptive questions", "Matched to your self-reported level"],
                ["Skill breakdown", "See exactly where you are strong and weak"],
                ["NCLC placement", "Official Canadian scale score"],
              ].map(([t, d]) => (
                <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 13px", background: "#faf6ef", border: "1px solid #e8dfd0", borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#b8893a", marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0c1420", marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: 12, color: "#7a8499" }}>{d}</div>
                  </div>
                </div>
              ))}
              <button className="ob-btn" style={{ marginTop: 16, width: "100%" }} onClick={() => setPhase("level")}>Begin assessment →</button>
            </div>
          )}

          {phase === "level" && (
            <div className="ob-wrap">
              <div className="ob-eye"><div className="ob-edot" />Step 1 · Self-report</div>
              <div className="ob-h">How's your <em>French</em> right now?</div>
              <div className="ob-sub">Be honest — the assessment will confirm your placement. Your questions will match your level.</div>
              {LEVELS.map((l) => (
                <div key={l.code} className={`ob-lrow${selfLevel === l.code ? " on" : ""}`} onClick={() => setSelfLevel(l.code)}>
                  <div className="ob-lcode">{l.code}</div>
                  <div style={{ flex: 1 }}>
                    <div className="ob-lname">{l.label}</div>
                    <div className="ob-ldesc">{l.desc}</div>
                  </div>
                  <div className="ob-npill">{l.nclc}</div>
                </div>
              ))}
              <button className="ob-btn" style={{ marginTop: 8, width: "100%" }} disabled={!selfLevel} onClick={() => setPhase("topics")}>Continue →</button>
            </div>
          )}

          {phase === "topics" && (
            <div className="ob-wrap">
              <div className="ob-eye"><div className="ob-edot" />Step 2 · Focus areas</div>
              <div className="ob-h">Which topics <em>matter most?</em></div>
              <div className="ob-sub">We tailor your practice to the French you actually need in Canada.</div>
              <div className="ob-chips">
                {TOPICS.map((t) => (
                  <div key={t.id} className={`ob-chip${topics.includes(t.id) ? " on" : ""}`} onClick={() => toggleTopic(t.id)}>
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
              <div className="ob-btnrow">
                <button className="ob-btnb" onClick={() => setPhase("level")}>← Back</button>
                <button className="ob-btn" disabled={!topics.length} onClick={() => setPhase("target")}>Continue →</button>
              </div>
            </div>
          )}

          {phase === "target" && (
            <div className="ob-wrap">
              <div className="ob-eye"><div className="ob-edot" />Step 3 · Your goal</div>
              <div className="ob-h">What NCLC level do <em>you need?</em></div>
              <div className="ob-sub">Most Canadian PR streams require NCLC 7. Check your specific immigration program.</div>
              <div style={{ background: "#faf6ef", border: "1px solid #e8dfd0", borderRadius: 10, padding: "13px 16px", marginBottom: 18, fontSize: 12, color: "#7a8499", lineHeight: 1.7 }}>
                <strong style={{ color: "#0c1420", display: "block", marginBottom: 4 }}>Common requirements:</strong>
                NCLC 5–6 → Family sponsorship · NCLC 7 → Express Entry (CLB 7) · NCLC 9 → Federal Skilled Worker (high CRS)
              </div>
              <label className="ob-tl">Select your target NCLC level</label>
              <div className="ob-nbtns">
                {["4","5","6","7","8","9","10"].map((n) => (
                  <button key={n} className={`ob-nb${target === n ? " on" : ""}`} onClick={() => setTarget(n)}>{n}</button>
                ))}
              </div>
              <div className="ob-btnrow">
                <button className="ob-btnb" onClick={() => setPhase("topics")}>← Back</button>
                <button className="ob-btn" onClick={() => { setQBank(buildBank(selfLevel)); setQIdx(0); setAnswers([]); setPhase("briefing"); }}>Start assessment →</button>
              </div>
            </div>
          )}

          {phase === "briefing" && (
            <div className="ob-wrap">
              <div className="ob-eye"><div className="ob-edot" />Assessment · {selfLevel} Level</div>
              <div className="ob-h">Your questions are <em>ready</em></div>
              <div className="ob-sub">
                {{ A1: "Survival French — real signs, forms and everyday situations.", A2: "Practical French — messages, short texts and daily tasks.", B1: "Working French — grammar, workplace and formal communication.", B2: "Advanced French — complex grammar, formal writing and legal comprehension." }[selfLevel]}
              </div>
              {[
                ["Questions", "8 adaptive questions"],
                ["Time limit", "None — read each question carefully"],
                ["After each answer", "Explanation shown so you learn as you go"],
                ["Result", "NCLC score + skill-by-skill breakdown"],
              ].map(([l, v]) => (
                <div key={l} className="ob-info-row">
                  <span style={{ color: "#7a8499" }}>{l}</span>
                  <strong style={{ color: "#0c1420" }}>{v}</strong>
                </div>
              ))}
              <button className="ob-btn" style={{ marginTop: 16, width: "100%" }} onClick={() => setPhase("quiz")}>Start now →</button>
            </div>
          )}

          {phase === "quiz" && (() => {
            const q = qBank[qIdx];
            const answered = answers[qIdx] !== undefined;
            const chosen = answered ? answers[qIdx].chosen : null;
            return (
              <div className="ob-wrap">
                <div className="ob-badge">{q.skill} · {selfLevel} level</div>
                <div style={{ fontSize: 11, color: "#7a8499", marginBottom: 10 }}>Question {qIdx + 1} of {qBank.length}</div>
                <div className="ob-h" style={{ fontSize: 18, marginBottom: 10 }}>{q.q}</div>
                {q.ctx && (
                  <div className="ob-ctx">
                    <div className="ob-ctx-lbl">Context</div>
                    {q.ctx.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                )}
                <div className="ob-opts">
                  {q.opts.map((opt, i) => {
                    let cls = "ob-opt";
                    if (answered) {
                      if (i === q.c) cls += " correct";
                      else if (i === chosen && chosen !== q.c) cls += " wrong";
                    }
                    return (
                      <div key={i} className={cls} onClick={() => !answered && handleAnswer(i)}>
                        <span className="ob-ol">{["A","B","C","D"][i]}</span>{opt}
                      </div>
                    );
                  })}
                </div>
                {answered && showExplain && (
                  <div className="ob-explain"><strong style={{ color: "#b8893a" }}>Why: </strong>{q.ex}</div>
                )}
                <div className="ob-dots">
                  {qBank.map((_, i) => {
                    let cls = "ob-dot i";
                    if (i === qIdx) cls = "ob-dot a";
                    else if (answers[i] !== undefined) cls = answers[i].correct ? "ob-dot d" : "ob-dot w";
                    return <div key={i} className={cls} />;
                  })}
                </div>
                {answered && (
                  <div className="ob-btnrow" style={{ marginTop: 16 }}>
                    <button className="ob-btnb" onClick={() => setShowExplain(!showExplain)}>
                      {showExplain ? "Hide" : "Explain"} answer
                    </button>
                    <button className="ob-btn" onClick={goNext}>
                      {qIdx < qBank.length - 1 ? "Next question →" : "See my results →"}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {phase === "result" && (() => {
            const skills = skillScores();
            const skillKeys = Object.keys(skills);
            const weakSkills = skillKeys.filter((k) => Math.round((skills[k].c / skills[k].t) * 100) < 60);
            return (
              <>
                <div className="ob-rbadge">✓ Assessment complete</div>
                <div className="ob-rtitle">Your French level</div>
                <div className="ob-rsub">
                  {score >= 75 ? "Strong performance — your actual level may be higher than you thought." : score >= 50 ? "Solid foundation. Targeted practice will close the gap quickly." : "Good starting point — focused daily practice makes the difference."}
                </div>
                <div className="ob-rgrid">
                  <div className="ob-rbox">
                    <div className="ob-rlbl">Assessed level</div>
                    <div className="ob-rbig">{placed.level}</div>
                    <div className="ob-rsm">NCLC {placed.nclc}</div>
                  </div>
                  <div className="ob-rarr">→</div>
                  <div className="ob-rbox hi">
                    <div className="ob-rlbl">Your target</div>
                    <div className="ob-rbig">NCLC {target}</div>
                    <div className="ob-rsm">Your goal</div>
                  </div>
                </div>
                <div className="ob-skillgrid">
                  {skillKeys.map((sk) => {
                    const pct = Math.round((skills[sk].c / skills[sk].t) * 100);
                    return (
                      <div key={sk} className="ob-skillbox">
                        <div className="ob-skillname">{sk}</div>
                        <div className="ob-skillbar"><div className="ob-skillfill" style={{ width: `${pct}%` }} /></div>
                        <div className="ob-skillpct">{pct}% ({skills[sk].c}/{skills[sk].t})</div>
                      </div>
                    );
                  })}
                </div>
                <div className="ob-pbox">
                  <div className="ob-ptitle">Your personalized study plan</div>
                  {[
                    { icon: "✍️", text: `Writing · 3×/week · focus on ${weakSkills.length > 0 ? weakSkills.join(", ") : "all skills"}` },
                    { icon: "🎧", text: "Listening · 2×/week · Québec accent audio at your level" },
                    { icon: "📖", text: selfLevel === "A1" || selfLevel === "A2" ? "Reading · daily · signs, forms, short texts" : "Reading · daily · formal texts, official correspondence" },
                    { icon: "📚", text: `Vocabulary · 10 words/day · ${topics.slice(0, 2).join(" & ") || "immigration context"}` },
                  ].map((item, i) => (
                    <div key={i} className="ob-pitem">
                      <span className="ob-picon">{item.icon}</span>
                      <span className="ob-ptext">{item.text}</span>
                    </div>
                  ))}
                </div>
                <button className="ob-cta" onClick={() => onComplete && onComplete({ selfLevel, placed, target, topics, score, answers })}>
                  Go to my dashboard →
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
}
