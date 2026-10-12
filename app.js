(() => {
  const STORE = "orbitHub.v1";
  const subjects = [
    {id:"physics", name:"Physics", hi:"भौतिक विज्ञान", icon:"⚛", desc:"Concepts, formulas and numerical practice", chapters:["Physical World & Measurement","Motion in a Straight Line","Motion in a Plane","Laws of Motion","Work, Energy & Power","System of Particles & Rotational Motion","Gravitation","Properties of Bulk Matter","Thermodynamics","Kinetic Theory","Oscillations","Waves"]},
    {id:"chemistry", name:"Chemistry", hi:"रसायन विज्ञान", icon:"◈", desc:"Theory, reactions and solved problems", chapters:["Some Basic Concepts of Chemistry","Structure of Atom","Classification of Elements","Chemical Bonding","States of Matter","Thermodynamics","Equilibrium","Redox Reactions","Organic Chemistry: Basic Principles","Hydrocarbons"]},
    {id:"maths", name:"Mathematics", hi:"गणित", icon:"∑", desc:"Formulas, worked examples and practice", chapters:["Sets","Relations & Functions","Trigonometric Functions","Complex Numbers","Linear Inequalities","Permutations & Combinations","Binomial Theorem","Sequences & Series","Straight Lines","Conic Sections","Introduction to 3D Geometry","Limits & Derivatives","Statistics","Probability"]},
    {id:"english", name:"English", hi:"अंग्रेज़ी", icon:"Aa", desc:"Literature, writing skills and grammar", chapters:["The Portrait of a Lady","A Photograph","We’re Not Afraid to Die…","Discovering Tut","The Voice of the Rain","The Ailing Planet","The Summer of the Beautiful White Horse","The Address","Mother’s Day","The Tale of Melon City","Writing Skills & Grammar"]},
    {id:"cs", name:"Computer Science", hi:"कंप्यूटर विज्ञान", icon:"⌘", desc:"Python concepts, programs and debugging", chapters:["Computer Systems","Encoding Schemes & Number Systems","Emerging Trends","Introduction to Python","Getting Started with Python","Flow of Control","Strings","Lists","Tuples & Dictionaries","Python Modules"]},
    {id:"pat", name:"PAT", hi:"शारीरिक शिक्षा", icon:"✦", desc:"Health, communication, yoga and safety", chapters:["Communication Skills","Self-management Skills","ICT Skills","Physical & Emotional Health","Health Domains","Physical Activity & Society","Yoga & Well-being","Hygiene and Safety"]}
  ];
  const defaultState = {lang:"en",view:"home",activeSubject:"physics",activeChapter:0,tasks:[],workouts:[],habits:[],notes:[],studyMinutes:0,completedChapters:[],timerTarget:25,theme:"dark"};
  let state = loadState();
  let timerInterval = null, timerSeconds = 25*60, timerRunning = false;
  const $ = s => document.querySelector(s);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch(e){return {...defaultState}}}
  function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){toast("Could not save. Device storage may be full.")}}
  const tr = (en,hi) => state.lang==="hi" ? hi : en;
  function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),2400)}
  function dateLabel(){const locale=state.lang==="hi"?"hi-IN":"en-IN";$("#todayLabel").textContent=new Intl.DateTimeFormat(locale,{weekday:"short",day:"numeric",month:"short"}).format(new Date())}
  function heading(kicker,title,desc,action=""){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
  function stat(label,value,note,icon){return `<div class="stat"><div class="stat-label">${icon||"✦"} &nbsp;${label}</div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`}
  function homeView(){
    const done=state.tasks.filter(t=>t.done).length, total=state.tasks.length;
    const mins=state.studyMinutes||0;
    return `${heading(tr("YOUR PERSONAL SPACE","आपकी निजी जगह"),tr("Welcome to Orbit Hub","Orbit Hub में आपका स्वागत है"),tr("One calm place to study, build healthy routines and keep moving forward.","पढ़ाई, अच्छी आदतों और प्रगति के लिए एक जगह।"),`<button class="button primary" data-action="go-study">${tr("Continue studying","पढ़ाई जारी रखें")} ↗</button>`)}
      <div class="grid stats-grid">
        ${stat(tr("Study time","पढ़ाई का समय"),`${Math.floor(mins/60)}h ${mins%60}m`,tr("Minutes logged in this app","इस ऐप में दर्ज समय"),"◷")}
        ${stat(tr("Tasks completed","पूरे किए कार्य"),`${done}/${total}`,tr("Keep your day manageable","दिन को व्यवस्थित रखें"),"✓")}
        ${stat(tr("Subjects","विषय"),"6",tr("Class 11 learning spaces","कक्षा 11 के विषय"),"▤")}
        ${stat(tr("Saved items","सहेजी गई चीज़ें"),`${state.notes.length}`,tr("Personal notes saved","व्यक्तिगत नोट्स"),"☆")}
      </div>
      <div class="section-title"><div><h2>${tr("Your hubs","आपके हब")}</h2><p>${tr("Pick what you want to work on today.","आज किस पर काम करना चाहते हैं?")}</p></div></div>
      <div class="grid feature-grid">
        <button class="feature-card" data-action="go-study"><span class="feature-icon">▤</span><h3>${tr("Study Centre","अध्ययन केंद्र")}</h3><p>${tr("Six subjects, chapter guides, practice and revision.","छह विषय, अध्याय, अभ्यास और दोहराव।")}</p><span class="pill">${tr("6 subjects","6 विषय")}</span></button>
        <button class="feature-card" data-action="go-fitness"><span class="feature-icon">✦</span><h3>${tr("Fitness Centre","फिटनेस केंद्र")}</h3><p>${tr("Log workouts, track consistency and plan stretching.","वर्कआउट, नियमितता और स्ट्रेचिंग दर्ज करें।")}</p><span class="pill">${tr("Healthy habits","स्वस्थ आदतें")}</span></button>
        <button class="feature-card" data-action="go-planner"><span class="feature-icon">☷</span><h3>${tr("Productivity Hub","उत्पादकता केंद्र")}</h3><p>${tr("Tasks, a focus timer and a simple study plan.","कार्य, फोकस टाइमर और अध्ययन योजना।")}</p><span class="pill">${tr("Plan your day","दिन की योजना")}</span></button>
        <button class="feature-card" data-action="go-growth"><span class="feature-icon">↗</span><h3>${tr("Personal Growth","व्यक्तिगत विकास")}</h3><p>${tr("Build habits, journal and review your goals.","आदतें, डायरी और लक्ष्य।")}</p><span class="pill">${tr("Small steps","छोटे कदम")}</span></button>
        <button class="feature-card" data-action="go-settings"><span class="feature-icon">⚙</span><h3>${tr("Settings & Backup","सेटिंग्स और बैकअप")}</h3><p>${tr("Language, export your data and restore a backup.","भाषा बदलें और डेटा का बैकअप लें।")}</p><span class="pill">${tr("Your device","आपका डिवाइस")}</span></button>
        <div class="feature-card"><span class="feature-icon">◎</span><h3>${tr("Your rule","आपका नियम")}</h3><p>${tr("Progress over perfection. A little done today is still progress.","पूर्णता से ज़्यादा प्रगति ज़रूरी है।")}</p><span class="pill">${tr("Keep going","जारी रखें")}</span></div>
      </div>
      <div class="section-title"><div><h2>${tr("Today's tasks","आज के कार्य")}</h2><p>${tr("Your next small steps","आपके अगले छोटे कदम")}</p></div><button class="button secondary" data-action="go-planner">${tr("Manage tasks","कार्य प्रबंधित करें")}</button></div>
      ${taskList(state.tasks.slice(0,4),true)}
    `;
  }
  function taskList(tasks,compact=false){
    if(!tasks.length)return `<div class="card empty">${tr("No tasks yet. Add one in Productivity Hub.","अभी कोई कार्य नहीं। उत्पादकता केंद्र में जोड़ें।")}</div>`;
    return `<div class="task-list">${tasks.map(t=>`<label class="task-item ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}><span class="task-text">${escapeHTML(t.text)}</span>${t.due?`<span class="pill">${escapeHTML(t.due)}</span>`:""}</label>`).join("")}</div>`;
  }
  function studyView(){
    return `${heading(tr("LEARN WITH CLARITY","स्पष्टता से सीखें"),tr("Study Centre","अध्ययन केंद्र"),tr("Choose a subject to open its chapter list, study guide and practice notes.","विषय चुनें और अध्याय, अध्ययन मार्गदर्शिका तथा अभ्यास नोट्स खोलें।"))}
      <div class="grid subject-grid">${subjects.map(s=>`<article class="subject-card" role="button" tabindex="0" data-subject="${s.id}"><div class="subject-top"><span class="subject-icon">${s.icon}</span><span class="pill">${s.chapters.length} ${tr("chapters","अध्याय")}</span></div><h3>${tr(s.name,s.hi)}</h3><p>${tr(s.desc,subjectHindiDesc(s.id))}</p><div class="progress-track"><span style="width:${subjectProgress(s.id)}%"></span></div><div class="subject-foot"><span>${tr("Progress","प्रगति")}</span><span>${subjectProgress(s.id)}%</span></div></article>`).join("")}</div>`;
  }
  function subjectHindiDesc(id){return ({physics:"अवधारणाएँ, सूत्र और संख्यात्मक अभ्यास",chemistry:"सिद्धांत, अभिक्रियाएँ और हल किए प्रश्न",maths:"सूत्र, उदाहरण और अभ्यास",english:"साहित्य, लेखन कौशल और व्याकरण",cs:"Python, प्रोग्राम और त्रुटि सुधार",pat:"स्वास्थ्य, संचार, योग और सुरक्षा"})[id]}
  function subjectProgress(id){const s=subjects.find(x=>x.id===id);return Math.round(s.chapters.filter((c,i)=>state.completedChapters.includes(id+":"+i)).length/s.chapters.length*100)}
  function genericNote(s,ch,index){
    const data={
      physics:{intro:"Physics describes patterns in nature using observation, models, mathematics and experiments.",concept:"Start by identifying the system, choosing a reference frame, writing known values with units, and deciding which principle connects them.",formula:"Write each formula with its conditions and SI units. Check dimensions before substituting values.",practice:"A useful numerical workflow is: Given → Required → Principle → Substitution → Answer with unit.",questions:["State the key idea of this chapter in your own words.","List the quantities involved and their SI units.","Solve one basic numerical and check whether the answer is reasonable."]},
      chemistry:{intro:"Chemistry explains the composition, structure, properties and transformations of matter.",concept:"Keep symbols, units and balanced equations clear. Distinguish observations from models and conclusions.",formula:"For numerical questions, write the relevant relation first, convert all quantities to consistent units, then substitute.",practice:"Show intermediate steps and preserve significant figures where required.",questions:["Define the central terms in this chapter.","Write one example and explain why it fits the concept.","Try a numerical or equation-based question from your textbook."]},
      maths:{intro:"Mathematics becomes easier when definitions, conditions and notation are made explicit.",concept:"Read the question carefully, identify the type, select a suitable identity or method, and show the steps in order.",formula:"Keep a formula notebook with the identity, its conditions and one worked example.",practice:"After solving, substitute the result back into the original condition whenever possible.",questions:["State the definition or identity needed.","Solve a basic example without looking at the solution.","Create a similar question by changing the values."]},
      english:{intro:"Read for meaning first: identify the speaker, setting, central idea, tone and evidence from the text.",concept:"A strong answer makes a clear point, supports it with a relevant detail, and explains how that detail supports the point.",formula:"For long answers, use a short introduction, two or three organised points, and a concise conclusion.",practice:"For writing tasks, follow the required format, audience, word limit and tone.",questions:["Summarise the main idea in three sentences.","Identify a key theme and support it with a textual detail.","Write one answer using clear topic sentences."]},
      cs:{intro:"A program is a sequence of instructions written in a language and executed according to defined rules.",concept:"Trace variables line by line. For each statement, note the current value, the operation and the output.",formula:"For Python, check data types, indentation, operator precedence, and whether an expression returns a value.",practice:"Run small examples mentally, then test edge cases such as empty strings, zero and boundary indices.",questions:["Predict the output of a short program.","Explain a variable's value after each statement.","Find and correct one syntax or logic error."]},
      pat:{intro:"Physical activity and well-being include safe movement, health knowledge, communication and self-management.",concept:"Use reliable information, appropriate safety practices, gradual progress and respect for individual needs.",formula:"For theory answers, define the term, list key points, and add a practical example.",practice:"Connect each concept to a realistic school, sport or daily-life situation.",questions:["Define the main terms in this chapter.","Give two benefits and one safety consideration.","Explain how the concept can be applied in daily life."]}
    }[s.id];
    return `<div class="note-content"><div class="notice">Starter guide for <b>${escapeHTML(ch)}</b>. This is a framework, not a substitute for the complete prescribed textbook chapter. Check your current school syllabus and textbook for exact coverage.</div>
      <h2>${escapeHTML(ch)}</h2><p>${data.intro}</p>
      <h3>${tr("Core approach","मुख्य तरीका")}</h3><p>${data.concept}</p>
      <h3>${tr("Key notes","मुख्य नोट्स")}</h3><ul><li>${data.formula}</li><li>${data.practice}</li><li>${tr("Write down questions you get wrong and revisit them during revision.","गलत हुए प्रश्न लिखें और दोहराव में फिर से हल करें।")}</li></ul>
      <h3>${tr("Practice checklist","अभ्यास सूची")}</h3><ol>${data.questions.map(q=>`<li>${q}</li>`).join("")}</ol>
      <div class="form-row"><button class="button primary" data-action="mark-chapter" data-subject="${s.id}" data-chapter="${index}">${state.completedChapters.includes(s.id+":"+index)?tr("✓ Completed","✓ पूरा हुआ"):tr("Mark chapter complete","अध्याय पूरा चिह्नित करें")}</button><button class="button secondary" data-action="save-note" data-subject="${s.id}" data-chapter="${index}">${tr("Save to my notes","मेरे नोट्स में सहेजें")}</button></div></div>`;
  }
  function subjectDetail(){
    const s=subjects.find(x=>x.id===state.activeSubject)||subjects[0], index=Math.min(state.activeChapter,s.chapters.length-1);
    return `${heading(tr("STUDY SPACE","अध्ययन स्थान"),tr(s.name,s.hi),tr("Choose a chapter on the left. Study guides are starter frameworks; full textbook-aligned notes can be added chapter by chapter.","बाईं ओर अध्याय चुनें। ये प्रारंभिक मार्गदर्शिकाएँ हैं; विस्तृत पाठ्यपुस्तक-अनुरूप नोट्स अध्यायवार जोड़े जा सकते हैं।"),`<button class="button secondary" data-action="back-study">← ${tr("All subjects","सभी विषय")}</button>`)}
      <div class="subject-detail"><div class="card"><h3>${tr("Chapters","अध्याय")}</h3><div class="chapter-list">${s.chapters.map((c,i)=>`<button class="chapter-button ${i===index?"active":""}" data-chapter-pick="${i}">${i+1}. ${escapeHTML(c)} ${state.completedChapters.includes(s.id+":"+i)?"✓":""}</button>`).join("")}</div></div><div class="card">${genericNote(s,s.chapters[index],index)}</div></div>`;
  }
  function fitnessView(){
    return `${heading(tr("MOVE & RECOVER","चलें और आराम करें"),tr("Fitness Centre","फिटनेस केंद्र"),tr("Log what you do, build consistency gradually and prioritise good technique, sleep and recovery.","अपनी गतिविधि दर्ज करें और सही तकनीक, नींद व आराम को प्राथमिकता दें।"))}
      <div class="grid two-col"><div class="stack">
        <div class="card"><h2>${tr("Log a workout","वर्कआउट दर्ज करें")}</h2><form id="workoutForm"><label class="field-label">${tr("Activity","गतिविधि")}</label><input class="field" name="activity" required maxlength="80" placeholder="${tr("e.g. Full-body strength","जैसे फुल-बॉडी स्ट्रेंथ")}"><div class="form-row"><div style="flex:1;min-width:110px"><label class="field-label">${tr("Minutes","मिनट")}</label><input class="field" name="minutes" type="number" min="1" max="300" value="25" required></div><div style="flex:1;min-width:110px"><label class="field-label">${tr("Sets (optional)","सेट (वैकल्पिक)")}</label><input class="field" name="sets" type="number" min="0" max="50" placeholder="3"></div></div><label class="field-label">${tr("Notes (optional)","नोट्स (वैकल्पिक)")}</label><input class="field" name="notes" maxlength="160" placeholder="${tr("How did it feel?","कैसा लगा?")}"><div style="margin-top:14px"><button class="button primary" type="submit">${tr("Save workout","वर्कआउट सहेजें")}</button></div></form></div>
        <div class="card"><h2>${tr("Simple weekly routine","सरल साप्ताहिक दिनचर्या")}</h2><ul class="note-content"><li>${tr("2–3 non-consecutive days: comfortable full-body strength practice.","2–3 अलग-अलग दिन: आरामदायक फुल-बॉडी अभ्यास।")}</li><li>${tr("Other days: walking, sport, mobility or easy stretching.","अन्य दिन: चलना, खेल या हल्की स्ट्रेचिंग।")}</li><li>${tr("Stop if you feel pain, dizziness or unusual discomfort; ask a trusted adult or qualified professional when unsure.","दर्द या चक्कर होने पर रुकें और ज़रूरत हो तो विश्वसनीय वयस्क से सलाह लें।")}</li><li>${tr("Eat regular balanced meals and get enough sleep; avoid extreme diets.","संतुलित भोजन और पर्याप्त नींद लें; अत्यधिक डाइट से बचें।")}</li></ul></div>
      </div><div class="stack"><div class="card"><h2>${tr("Recent activity","हाल की गतिविधि")}</h2>${state.workouts.length?`<div class="simple-list">${state.workouts.slice(0,8).map(w=>`<div class="task-item"><span class="task-text"><b>${escapeHTML(w.activity)}</b><br><small class="muted">${escapeHTML(w.date)} · ${w.minutes} min ${w.sets?`· ${w.sets} sets`:""}</small>${w.notes?`<br><small class="muted">${escapeHTML(w.notes)}</small>`:""}</span><button class="button secondary" data-delete-workout="${w.id}" aria-label="Delete workout">×</button></div>`).join("")}</div>`:`<div class="empty">${tr("No workouts logged yet.","अभी कोई वर्कआउट दर्ज नहीं है।")}</div>`}</div><div class="card"><h2>${tr("Flexibility reminder","लचीलापन रिमाइंडर")}</h2><p>${tr("Try 5–10 minutes of comfortable mobility after warming up. Stretch gently, breathe normally and never force a range of motion.","वार्म-अप के बाद 5–10 मिनट आरामदायक मोबिलिटी करें। धीरे स्ट्रेच करें और ज़ोर न लगाएँ।")}</p></div></div></div>`;
  }
  function plannerView(){
    return `${heading(tr("MAKE SPACE FOR WHAT MATTERS","ज़रूरी काम के लिए समय"),tr("Productivity Hub","उत्पादकता केंद्र"),tr("Add a small task, focus for a set time, and keep your plan realistic.","छोटा कार्य जोड़ें, तय समय तक ध्यान दें और योजना व्यावहारिक रखें।"))}
      <div class="grid two-col"><div class="stack"><div class="card"><h2>${tr("Add a task","कार्य जोड़ें")}</h2><form id="taskForm"><label class="field-label">${tr("Task","कार्य")}</label><input class="field" name="text" maxlength="120" required placeholder="${tr("e.g. Revise Laws of Motion","जैसे गति के नियम दोहराएँ")}"><label class="field-label">${tr("Due date (optional)","अंतिम तिथि (वैकल्पिक)")}</label><input class="field" type="date" name="due"><div style="margin-top:14px"><button class="button primary" type="submit">+ ${tr("Add task","कार्य जोड़ें")}</button></div></form></div><div class="card"><div class="section-title" style="margin-top:0"><h2>${tr("Task list","कार्य सूची")}</h2><button class="button secondary" data-action="clear-completed">${tr("Clear completed","पूरे कार्य हटाएँ")}</button></div>${taskList(state.tasks)}</div></div>
      <div class="stack"><div class="card"><h2>${tr("Focus timer","फोकस टाइमर")}</h2><p>${tr("A simple Pomodoro timer. Keep the app open while the timer runs.","सरल पोमोडोरो टाइमर। टाइमर चलते समय ऐप खुला रखें।")}</p><div class="timer-display" id="timerDisplay">25:00</div><div class="form-row"><label class="field-label" style="margin:0;align-self:center">${tr("Minutes","मिनट")}</label><select id="timerMinutes" class="field" style="width:100px"><option>15</option><option selected>25</option><option>30</option><option>45</option><option>50</option></select></div><div class="timer-controls" style="margin-top:14px"><button class="button primary" id="timerStart">${tr("Start","शुरू करें")}</button><button class="button secondary" id="timerReset">${tr("Reset","रीसेट")}</button></div><p class="muted" id="timerStatus">${tr("Completed focus minutes are added to your dashboard when the timer finishes.","टाइमर पूरा होने पर फोकस समय डैशबोर्ड में जुड़ेगा।")}</p></div><div class="card"><h2>${tr("Study tip","अध्ययन सुझाव")}</h2><p>${tr("Choose one clear outcome for each session, keep distractions away, then take a short break.","हर सत्र का एक स्पष्ट लक्ष्य रखें, ध्यान भटकाने वाली चीज़ें दूर रखें और छोटा ब्रेक लें।")}</p></div></div></div>`;
  }
  function growthView(){
    return `${heading(tr("SMALL STEPS COUNT","छोटे कदम मायने रखते हैं"),tr("Personal Growth","व्यक्तिगत विकास"),tr("Track routines and write a short reflection. You do not need to do everything every day.","आदतें दर्ज करें और छोटा आत्म-चिंतन लिखें। हर दिन सब कुछ करना ज़रूरी नहीं।"))}
      <div class="grid two-col"><div class="stack"><div class="card"><h2>${tr("Daily habits","दैनिक आदतें")}</h2><p>${tr("Tick a habit when you've done it today. This list resets by date.","आज आदत पूरी होने पर चेक करें। सूची तारीख के अनुसार बदलती है।")}</p><div id="habitList">${habitList()}</div><form id="habitForm" class="form-row" style="margin-top:12px"><input class="field" name="habit" required maxlength="60" placeholder="${tr("Add a habit","नई आदत जोड़ें")}" style="flex:1"><button class="button primary" type="submit">+</button></form></div><div class="card"><h2>${tr("Weekly reflection","साप्ताहिक चिंतन")}</h2><label class="field-label">${tr("What went well?","क्या अच्छा हुआ?")}</label><textarea class="field" id="reflection" rows="4" maxlength="1000" placeholder="${tr("One thing I learned or improved…","एक चीज़ जो मैंने सीखी या सुधारी…")}">${escapeHTML(state.reflection||"")}</textarea><div style="margin-top:12px"><button class="button primary" data-action="save-reflection">${tr("Save reflection","चिंतन सहेजें")}</button></div></div></div><div class="stack"><div class="card"><h2>${tr("Your progress","आपकी प्रगति")}</h2>${stat(tr("Workouts logged","दर्ज वर्कआउट"),state.workouts.length,tr("Every session counts","हर सत्र मायने रखता है"),"✦")}${stat(tr("Tasks completed","पूरे कार्य"),state.tasks.filter(t=>t.done).length,tr("Keep building momentum","निरंतरता बनाए रखें"),"✓")}${stat(tr("Chapters completed","पूरे अध्याय"),state.completedChapters.length,tr("Across all subjects","सभी विषयों में"),"▤")}</div><div class="card"><h2>${tr("A gentle reminder","एक सरल याद")}</h2><p>${tr("Progress is not a competition. Rest, learning and consistency all matter.","प्रगति कोई प्रतियोगिता नहीं है। आराम, सीखना और नियमितता सभी मायने रखते हैं।")}</p></div></div></div>`;
  }
  function habitList(){
    if(!state.habits.length)return `<div class="empty">${tr("Add a habit above, such as reading for 10 minutes or preparing your school bag.","ऊपर कोई आदत जोड़ें, जैसे 10 मिनट पढ़ना या स्कूल बैग तैयार करना।")}</div>`;
    const today=new Date().toISOString().slice(0,10);
    return state.habits.map(h=>`<div class="habit-row"><label class="checkline"><input type="checkbox" data-habit="${h.id}" ${h.lastDone===today?"checked":""}><span>${escapeHTML(h.name)}</span></label><button class="button secondary" data-delete-habit="${h.id}">×</button></div>`).join("");
  }
  function settingsView(){
    return `${heading(tr("YOUR DATA, YOUR CHOICE","आपका डेटा, आपका नियंत्रण"),tr("Settings & Backup","सेटिंग्स और बैकअप"),tr("Orbit Hub saves progress in this browser on this device. Export a backup before clearing browser data or changing devices.","Orbit Hub इस डिवाइस के ब्राउज़र में प्रगति सहेजता है। ब्राउज़र डेटा साफ़ करने या डिवाइस बदलने से पहले बैकअप लें।"))}
      <div class="grid settings-grid"><div class="card"><h2>${tr("Language","भाषा")}</h2><p>${tr("Switch the interface between English and Hindi. Study content may still contain English terminology.","इंटरफ़ेस अंग्रेज़ी और हिंदी में बदलें। अध्ययन सामग्री में अंग्रेज़ी शब्द रह सकते हैं।")}</p><button class="button primary" id="settingsLang">${state.lang==="en"?"हिंदी में बदलें":"Switch to English"}</button></div><div class="card"><h2>${tr("Export backup","बैकअप निर्यात करें")}</h2><p>${tr("Download your tasks, workouts, notes, habits and settings as a JSON file.","अपने कार्य, वर्कआउट, नोट्स, आदतें और सेटिंग्स JSON फ़ाइल में डाउनलोड करें।")}</p><button class="button primary" data-action="export">${tr("Download backup","बैकअप डाउनलोड करें")}</button></div><div class="card"><h2>${tr("Restore backup","बैकअप बहाल करें")}</h2><p>${tr("Choose an Orbit Hub JSON backup. It replaces the current saved data.","Orbit Hub JSON बैकअप चुनें। यह वर्तमान सहेजे गए डेटा को बदल देगा।")}</p><label class="button secondary file-label"> ${tr("Choose backup file","बैकअप फ़ाइल चुनें")} <input type="file" id="importFile" accept=".json,application/json" class="hidden"></label></div><div class="card"><h2>${tr("Install & offline","इंस्टॉल और ऑफलाइन")}</h2><p>${tr("For best offline support, serve this folder over HTTPS or localhost, then use your browser's Add to Home screen / Install option. Opening index.html directly may limit offline caching.","ऑफलाइन सुविधा के लिए HTTPS या localhost पर चलाएँ और ब्राउज़र में होम स्क्रीन पर जोड़ें/इंस्टॉल चुनें। सीधे index.html खोलने पर कैशिंग सीमित हो सकती है।")}</p><span class="pill">${tr("No account required","खाते की ज़रूरत नहीं")}</span></div><div class="card"><h2>${tr("Reset app data","ऐप डेटा रीसेट करें")}</h2><p>${tr("This permanently clears saved progress in this browser. Export a backup first if you want to keep it.","यह ब्राउज़र में सहेजी गई प्रगति मिटा देगा। पहले बैकअप लें।")}</p><button class="button danger" data-action="reset">${tr("Reset all local data","सारा स्थानीय डेटा रीसेट करें")}</button></div><div class="card"><h2>${tr("About this version","इस संस्करण के बारे में")}</h2><p>${tr("Orbit Hub starter build. Sample study guides are frameworks, not complete verified textbook notes. Check the current school syllabus for official coverage.","Orbit Hub प्रारंभिक संस्करण। नमूना अध्ययन मार्गदर्शिकाएँ पूरी सत्यापित पाठ्यपुस्तक नोट्स नहीं हैं।")}</p><span class="pill">Version 0.1.0</span></div></div>`;
  }
  function render(){
    dateLabel();
    const root=$("#viewRoot");
    if(state.view==="home")root.innerHTML=homeView();
    else if(state.view==="study")root.innerHTML=studyView();
    else if(state.view==="subject")root.innerHTML=subjectDetail();
    else if(state.view==="fitness")root.innerHTML=fitnessView();
    else if(state.view==="planner")root.innerHTML=plannerView();
    else if(state.view==="growth")root.innerHTML=growthView();
    else root.innerHTML=settingsView();
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view || (state.view==="subject"&&b.dataset.view==="study")));
    $("#langToggle").textContent=state.lang==="en"?"हिंदी":"English";
    document.documentElement.lang=state.lang==="hi"?"hi":"en";
    $("#viewRoot").querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>handleAction(b.dataset.action,b)));
    $("#viewRoot").querySelectorAll("[data-subject]").forEach(b=>{const fn=()=>{state.activeSubject=b.dataset.subject;state.activeChapter=0;state.view="subject";save();render()};b.addEventListener("click",fn);b.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn()}})});
    $("#viewRoot").querySelectorAll("[data-chapter-pick]").forEach(b=>b.addEventListener("click",()=>{state.activeChapter=Number(b.dataset.chapterPick);save();render()}));
    $("#viewRoot").querySelectorAll("[data-task]").forEach(c=>c.addEventListener("change",()=>{const t=state.tasks.find(t=>t.id===c.dataset.task);if(t)t.done=c.checked;save();render()}));
    $("#viewRoot").querySelectorAll("[data-habit]").forEach(c=>c.addEventListener("change",()=>{const h=state.habits.find(h=>h.id===c.dataset.habit);if(h)h.lastDone=c.checked?new Date().toISOString().slice(0,10):"";save();render()}));
    $("#viewRoot").querySelectorAll("[data-delete-habit]").forEach(b=>b.addEventListener("click",()=>{state.habits=state.habits.filter(h=>h.id!==b.dataset.deleteHabit);save();render()}));
    $("#viewRoot").querySelectorAll("[data-delete-workout]").forEach(b=>b.addEventListener("click",()=>{state.workouts=state.workouts.filter(w=>w.id!==b.dataset.deleteWorkout);save();render()}));
    const tf=$("#taskForm");if(tf)tf.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(tf);state.tasks.unshift({id:uid(),text:d.get("text").trim(),due:d.get("due"),done:false});save();render();toast(tr("Task added","कार्य जोड़ा गया"))});
    const wf=$("#workoutForm");if(wf)wf.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(wf);state.workouts.unshift({id:uid(),activity:d.get("activity").trim(),minutes:Number(d.get("minutes")),sets:d.get("sets"),notes:d.get("notes").trim(),date:new Date().toLocaleDateString()});save();render();toast(tr("Workout saved","वर्कआउट सहेजा गया"))});
    const hf=$("#habitForm");if(hf)hf.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(hf);state.habits.push({id:uid(),name:d.get("habit").trim(),lastDone:""});save();render()});
    const rf=$("#reflection");if(rf)rf.addEventListener("input",()=>{state.reflection=rf.value;save()});
    const tl=$("#timerMinutes");if(tl)tl.addEventListener("change",()=>{if(!timerRunning){timerSeconds=Number(tl.value)*60;updateTimerDisplay()}});
    const ts=$("#timerStart");if(ts)ts.addEventListener("click",toggleTimer);
    const trb=$("#timerReset");if(trb)trb.addEventListener("click",resetTimer);
    const sl=$("#settingsLang");if(sl)sl.addEventListener("click",toggleLanguage);
    const imp=$("#importFile");if(imp)imp.addEventListener("change",importBackup);
    updateTimerDisplay();
  }
  function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}
  function go(view){state.view=view;save();render()}
  function toggleLanguage(){state.lang=state.lang==="en"?"hi":"en";save();render()}
  function handleAction(action,el){
    if(action.startsWith("go-"))return go(({ "go-study":"study","go-fitness":"fitness","go-planner":"planner","go-growth":"growth","go-settings":"settings"})[action]||"home");
    if(action==="back-study")return go("study");
    if(action==="mark-chapter"){const key=el.dataset.subject+":"+el.dataset.chapter;if(state.completedChapters.includes(key))state.completedChapters=state.completedChapters.filter(x=>x!==key);else state.completedChapters.push(key);save();render();toast(tr("Progress updated","प्रगति अपडेट हुई"))}
    if(action==="save-note"){const s=subjects.find(s=>s.id===el.dataset.subject);const title=s.chapters[Number(el.dataset.chapter)];state.notes.unshift({id:uid(),title,subject:s.name,date:new Date().toLocaleDateString(),text:tr("Review this chapter and add your own key points.","इस अध्याय को दोहराएँ और अपने मुख्य बिंदु जोड़ें।")});save();toast(tr("Added to your saved notes","आपके नोट्स में जोड़ा गया"))}
    if(action==="clear-completed"){state.tasks=state.tasks.filter(t=>!t.done);save();render();toast(tr("Completed tasks cleared","पूरे कार्य हटाए गए"))}
    if(action==="save-reflection"){state.reflection=$("#reflection")?.value||"";save();toast(tr("Reflection saved","चिंतन सहेजा गया"))}
    if(action==="export")exportBackup();
    if(action==="reset"){if(confirm(tr("Delete all Orbit Hub data saved in this browser? Export a backup first if needed.","इस ब्राउज़र में सहेजा सारा डेटा मिटाएँ? ज़रूरत हो तो पहले बैकअप लें।"))){localStorage.removeItem(STORE);state={...defaultState};stopTimer();render();toast(tr("Local data reset","स्थानीय डेटा रीसेट हुआ"))}}
  }
  function updateTimerDisplay(){const el=$("#timerDisplay");if(el)el.textContent=`${String(Math.floor(timerSeconds/60)).padStart(2,"0")}:${String(timerSeconds%60).padStart(2,"0")}`;const b=$("#timerStart");if(b)b.textContent=timerRunning?tr("Pause","रोकें"):tr("Start","शुरू करें")}
  function toggleTimer(){if(timerRunning){stopTimer();updateTimerDisplay();return}timerRunning=true;updateTimerDisplay();timerInterval=setInterval(()=>{timerSeconds--;updateTimerDisplay();if(timerSeconds<=0){stopTimer();const mins=Number($("#timerMinutes")?.value||25);state.studyMinutes+=mins;save();updateTimerDisplay();toast(tr("Focus session complete!","फोकस सत्र पूरा हुआ!"));const status=$("#timerStatus");if(status)status.textContent=tr("Great work. Take a short break before your next session.","बहुत अच्छा। अगले सत्र से पहले छोटा ब्रेक लें।")}},1000)}
  function stopTimer(){timerRunning=false;if(timerInterval)clearInterval(timerInterval);timerInterval=null}
  function resetTimer(){stopTimer();timerSeconds=Number($("#timerMinutes")?.value||25)*60;updateTimerDisplay()}
  function exportBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="orbit-hub-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url);toast(tr("Backup download started","बैकअप डाउनलोड शुरू हुआ"))}
  function importBackup(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!data||typeof data!=="object"||!Array.isArray(data.tasks))throw new Error("Invalid");if(!confirm(tr("Replace current data with this backup?","वर्तमान डेटा को इस बैकअप से बदलें?")))return;state={...defaultState,...data};save();render();toast(tr("Backup restored","बैकअप बहाल हुआ"))}catch(err){toast(tr("That backup file could not be read.","बैकअप फ़ाइल पढ़ी नहीं जा सकी।"))}};reader.readAsText(file)}
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
  $("#langToggle").addEventListener("click",toggleLanguage);
  if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
  render();
  
function workEnergyPowerNote(index) {
  const done = state.completedChapters.includes("physics:" + index);

  return `
    <div class="note-content">
      <div class="notice">
        ${tr(
          "Complete chapter module • Class 11 Physics • NCERT-aligned study support. Use your current prescribed textbook and school syllabus to confirm coverage.",
          "पूर्ण अध्याय मॉड्यूल • कक्षा 11 भौतिक विज्ञान • NCERT-अनुरूप अध्ययन सहायता। पाठ्यक्रम की पुष्टि अपनी वर्तमान पाठ्यपुस्तक और स्कूल के सिलेबस से करें।"
        )}
      </div>

      <h2>${tr("Work, Energy and Power", "कार्य, ऊर्जा और शक्ति")}</h2>
      <p>${tr(
        "This chapter explains how forces transfer energy, how energy is stored, and how quickly work is done.",
        "यह अध्याय समझाता है कि बल ऊर्जा का स्थानांतरण कैसे करते हैं, ऊर्जा कैसे संचित होती है और कार्य कितनी तेजी से होता है।"
      )}</p>

      <h3>${tr("1. Learning objectives", "1. सीखने के उद्देश्य")}</h3>
      <ul>
        <li>${tr("Calculate work done by a constant force.", "स्थिर बल द्वारा किए गए कार्य की गणना करना।")}</li>
        <li>${tr("Understand kinetic energy and the work–energy theorem.", "गतिज ऊर्जा और कार्य–ऊर्जा प्रमेय को समझना।")}</li>
        <li>${tr("Use gravitational and spring potential energy.", "गुरुत्वीय और स्प्रिंग स्थितिज ऊर्जा का उपयोग करना।")}</li>
        <li>${tr("Apply conservation of mechanical energy.", "यांत्रिक ऊर्जा संरक्षण लागू करना।")}</li>
        <li>${tr("Calculate average and instantaneous power.", "औसत और तात्क्षणिक शक्ति की गणना करना।")}</li>
      </ul>

      <h3>${tr("2. Work done by a constant force", "2. स्थिर बल द्वारा किया गया कार्य")}</h3>
      <p>${tr(
        "Work is done when a force has a component along the displacement. Work is a scalar quantity.",
        "जब बल का कोई घटक विस्थापन की दिशा में होता है, तब कार्य होता है। कार्य एक अदिश राशि है।"
      )}</p>
      <p><b>${tr("Formula", "सूत्र")}:</b> W = F s cos θ</p>
      <ul>
        <li>${tr("W = work done, measured in joules (J).", "W = कार्य, जूल (J) में।")}</li>
        <li>${tr("F = force in newtons (N); s = displacement in metres (m).", "F = बल, न्यूटन (N) में; s = विस्थापन, मीटर (m) में।")}</li>
        <li>${tr("θ is the angle between force and displacement.", "θ बल और विस्थापन के बीच का कोण है।")}</li>
      </ul>
      <p>${tr(
        "Positive work: force helps displacement. Negative work: force opposes displacement. Zero work: force is perpendicular to displacement, or displacement is zero.",
        "धनात्मक कार्य: बल विस्थापन में सहायता करता है। ऋणात्मक कार्य: बल विस्थापन का विरोध करता है। शून्य कार्य: बल विस्थापन के लंबवत है या विस्थापन शून्य है।"
      )}</p>
      <p>${tr(
        "Examples: friction usually does negative work on a sliding object; centripetal force does zero work in ideal uniform circular motion because it is perpendicular to instantaneous displacement.",
        "उदाहरण: फिसलती वस्तु पर घर्षण सामान्यतः ऋणात्मक कार्य करता है। आदर्श एकसमान वृत्तीय गति में अभिकेन्द्रीय बल शून्य कार्य करता है, क्योंकि वह तात्क्षणिक विस्थापन के लंबवत होता है।"
      )}</p>

      <h3>${tr("3. Variable force and force–displacement graph", "3. परिवर्ती बल और बल–विस्थापन ग्राफ")}</h3>
      <p>${tr(
        "If force changes with position, work is the signed area under the F–x graph. In calculus notation, W = ∫ Fₓ dx.",
        "यदि बल स्थिति के साथ बदलता है, तो कार्य F–x ग्राफ के नीचे का चिह्नित क्षेत्रफल होता है। कलन के संकेत में W = ∫ Fₓ dx."
      )}</p>
      <p>${tr(
        "For a straight-line graph, calculate the relevant area using a rectangle, triangle or trapezium. Areas below the displacement axis contribute negative work.",
        "सीधी रेखा वाले ग्राफ के लिए आयत, त्रिभुज या समलंब का क्षेत्रफल निकालें। विस्थापन-अक्ष के नीचे का क्षेत्र ऋणात्मक कार्य दर्शाता है।"
      )}</p>

      <h3>${tr("4. Kinetic energy", "4. गतिज ऊर्जा")}</h3>
      <p>${tr(
        "Kinetic energy is the energy an object has because of its motion.",
        "गतिज ऊर्जा वह ऊर्जा है जो किसी वस्तु में उसकी गति के कारण होती है।"
      )}</p>
      <p><b>K = ½mv²</b></p>
      <p>${tr(
        "Here m is mass in kilograms and v is speed in metres per second. Kinetic energy is non-negative in classical mechanics and is measured in joules.",
        "यहाँ m द्रव्यमान (किलोग्राम) और v चाल (मीटर प्रति सेकंड) है। शास्त्रीय यांत्रिकी में गतिज ऊर्जा ऋणात्मक नहीं होती और इसे जूल में मापा जाता है।"
      )}</p>

      <h3>${tr("5. Work–energy theorem", "5. कार्य–ऊर्जा प्रमेय")}</h3>
      <p><b>W<sub>net</sub> = ΔK = K<sub>f</sub> − K<sub>i</sub></b></p>
      <p>${tr(
        "The net work done by all forces on an object equals its change in kinetic energy.",
        "किसी वस्तु पर सभी बलों द्वारा किया गया कुल कार्य उसकी गतिज ऊर्जा में परिवर्तन के बराबर होता है।"
      )}</p>
      <p>${tr(
        "If the net work is positive, kinetic energy increases; if negative, kinetic energy decreases; if zero, the initial and final kinetic energies are equal.",
        "कुल कार्य धनात्मक होने पर गतिज ऊर्जा बढ़ती है; ऋणात्मक होने पर घटती है; शून्य होने पर प्रारंभिक और अंतिम गतिज ऊर्जाएँ समान होती हैं।"
      )}</p>

      <h3>${tr("6. Potential energy", "6. स्थितिज ऊर्जा")}</h3>
      <p>${tr(
        "Potential energy is associated with the configuration or position of interacting objects. Its numerical value depends on the chosen zero level.",
        "स्थितिज ऊर्जा वस्तुओं की स्थिति या उनकी व्यवस्था से संबंधित होती है। इसका संख्यात्मक मान चुने गए शून्य स्तर पर निर्भर करता है।"
      )}</p>
      <p><b>${tr("Near Earth's surface", "पृथ्वी की सतह के निकट")}:</b> U = mgh</p>
      <p>${tr(
        "This relation applies when g is approximately constant and h is measured relative to the chosen reference level.",
        "यह संबंध तब लागू होता है जब g लगभग स्थिर हो और h चुने गए संदर्भ स्तर से मापा गया हो।"
      )}</p>
      <p><b>${tr("Ideal spring", "आदर्श स्प्रिंग")}:</b> U = ½kx²</p>
      <p>${tr(
        "Here k is the spring constant in N/m and x is the extension or compression from natural length, in metres. The ideal spring force is F = −kx.",
        "यहाँ k स्प्रिंग नियतांक (N/m) और x प्राकृतिक लंबाई से बढ़ाव या संपीड़न (मीटर) है। आदर्श स्प्रिंग का बल F = −kx होता है।"
      )}</p>

      <h3>${tr("7. Conservative and non-conservative forces", "7. संरक्षी और असंरक्षी बल")}</h3>
      <ul>
        <li>${tr("For a conservative force, work between two points is path-independent; work over a closed path is zero.", "संरक्षी बल के लिए दो बिंदुओं के बीच कार्य पथ पर निर्भर नहीं करता; बंद पथ में कुल कार्य शून्य होता है।")}</li>
        <li>${tr("Gravity and an ideal spring force are conservative forces.", "गुरुत्वाकर्षण और आदर्श स्प्रिंग बल संरक्षी बल हैं।")}</li>
        <li>${tr("Friction is generally non-conservative; it can transfer mechanical energy into thermal energy.", "घर्षण सामान्यतः असंरक्षी होता है; यह यांत्रिक ऊर्जा को ऊष्मीय ऊर्जा में बदल सकता है।")}</li>
      </ul>

      <h3>${tr("8. Conservation of mechanical energy", "8. यांत्रिक ऊर्जा का संरक्षण")}</h3>
      <p><b>K + U = constant</b></p>
      <p>${tr(
        "When only conservative forces do work, total mechanical energy (kinetic plus potential energy) remains constant. Energy may change form, such as potential energy becoming kinetic energy.",
        "जब केवल संरक्षी बल कार्य करते हैं, तब कुल यांत्रिक ऊर्जा (गतिज + स्थितिज ऊर्जा) स्थिर रहती है। ऊर्जा अपना रूप बदल सकती है, जैसे स्थितिज ऊर्जा का गतिज ऊर्जा में बदलना।"
      )}</p>
      <p>${tr(
        "When friction or another non-conservative force does work, mechanical energy may change. Total energy is still conserved when all relevant forms, including thermal energy, are counted.",
        "जब घर्षण या कोई अन्य असंरक्षी बल कार्य करता है, तो यांत्रिक ऊर्जा बदल सकती है। ऊष्मीय ऊर्जा सहित सभी रूपों को गिनने पर कुल ऊर्जा फिर भी संरक्षित रहती है।"
      )}</p>

      <h3>${tr("9. Power", "9. शक्ति")}</h3>
      <p><b>${tr("Average power", "औसत शक्ति")}:</b> P<sub>avg</sub> = W/Δt</p>
      <p><b>${tr("Instantaneous power", "तात्क्षणिक शक्ति")}:</b> P = F · v = Fv cos θ</p>
      <p>${tr(
        "Power measures how quickly work is done or energy is transferred. Its SI unit is the watt (W), where 1 W = 1 J/s.",
        "शक्ति बताती है कि कार्य कितनी तेजी से होता है या ऊर्जा का स्थानांतरण कितनी तेजी से होता है। इसका SI मात्रक वाट (W) है, जहाँ 1 W = 1 J/s."
      )}</p>

      <h3>${tr("10. Efficiency", "10. दक्षता")}</h3>
      <p><b>Efficiency = (useful output energy ÷ input energy) × 100%</b></p>
      <p>${tr(
        "Efficiency is usually less than 100% in real devices because some input energy is transferred to less useful forms, such as heat or sound.",
        "वास्तविक उपकरणों में दक्षता सामान्यतः 100% से कम होती है, क्योंकि कुछ ऊर्जा ऊष्मा या ध्वनि जैसे कम उपयोगी रूपों में चली जाती है।"
      )}</p>

      <h3>${tr("11. Worked examples", "11. हल किए गए उदाहरण")}</h3>

      <details>
        <summary>${tr("Example 1 — Work at an angle", "उदाहरण 1 — कोण पर किया गया कार्य")}</summary>
        <p>${tr(
          "A 10 N force moves an object 5 m. The angle between force and displacement is 60°. Find work done.",
          "10 N का बल किसी वस्तु को 5 m विस्थापित करता है। बल और विस्थापन के बीच कोण 60° है। कार्य ज्ञात करें।"
        )}</p>
        <p>W = Fs cos θ = 10 × 5 × cos 60°</p>
        <p>W = 50 × ½ = <b>25 J</b></p>
      </details>

      <details>
        <summary>${tr("Example 2 — Work–energy theorem", "उदाहरण 2 — कार्य–ऊर्जा प्रमेय")}</summary>
        <p>${tr(
          "A 2 kg object speeds up from 3 m/s to 7 m/s. Find the net work.",
          "2 kg की वस्तु की चाल 3 m/s से बढ़कर 7 m/s हो जाती है। कुल कार्य ज्ञात करें।"
        )}</p>
        <p>W<sub>net</sub> = ½m(v² − u²)</p>
        <p>= ½ × 2 × (49 − 9) = <b>40 J</b></p>
      </details>

      <details>
        <summary>${tr("Example 3 — Lifting and power", "उदाहरण 3 — उठाना और शक्ति")}</summary>
        <p>${tr(
          "A 20 kg load is lifted vertically by 2 m at constant speed in 4 s. Take g = 9.8 m/s². Find the work done against gravity and the average power.",
          "20 kg का भार 4 s में स्थिर चाल से 2 m ऊपर उठाया जाता है। g = 9.8 m/s² लें। गुरुत्व के विरुद्ध कार्य और औसत शक्ति ज्ञात करें।"
        )}</p>
        <p>W = mgh = 20 × 9.8 × 2 = <b>392 J</b></p>
        <p>P<sub>avg</sub> = W/t = 392/4 = <b>98 W</b></p>
      </details>

      <details>
        <summary>${tr("Example 4 — Spring potential energy", "उदाहरण 4 — स्प्रिंग की स्थितिज ऊर्जा")}</summary>
        <p>${tr(
          "A spring has k = 200 N/m and is stretched by 0.10 m. Find stored energy.",
          "एक स्प्रिंग का k = 200 N/m है और उसे 0.10 m खींचा जाता है। संचित ऊर्जा ज्ञात करें।"
        )}</p>
        <p>U = ½kx² = ½ × 200 × (0.10)²</p>
        <p>U = 100 × 0.01 = <b>1 J</b></p>
      </details>

      <details>
        <summary>${tr("Example 5 — Area under an F–x graph", "उदाहरण 5 — F–x ग्राफ के नीचे का क्षेत्रफल")}</summary>
        <p>${tr(
          "A force increases uniformly from 0 N to 8 N over a displacement of 3 m. Find the work from the graph.",
          "3 m विस्थापन में बल 0 N से बढ़कर समान रूप से 8 N हो जाता है। ग्राफ से कार्य ज्ञात करें।"
        )}</p>
        <p>W = area of triangle = ½ × base × height</p>
        <p>W = ½ × 3 × 8 = <b>12 J</b></p>
      </details>

      <h3>${tr("12. Quick formula sheet", "12. त्वरित सूत्र-संग्रह")}</h3>
      <ul>
        <li>W = Fs cos θ</li>
        <li>W = ∫ F<sub>x</sub> dx</li>
        <li>K = ½mv²</li>
        <li>W<sub>net</sub> = ΔK = K<sub>f</sub> − K<sub>i</sub></li>
        <li>U<sub>gravity</sub> = mgh</li>
        <li>U<sub>spring</sub> = ½kx²</li>
        <li>K + U = constant (conservative forces only)</li>
        <li>P<sub>avg</sub> = W/Δt</li>
        <li>P = F · v = Fv cos θ</li>
        <li>Efficiency = useful output ÷ input × 100%</li>
      </ul>
      <p><b>${tr("Units:", "मात्रक:")}</b> ${tr(
        "Work and energy: joule (J); power: watt (W); force: newton (N); spring constant: N/m.",
        "कार्य और ऊर्जा: जूल (J); शक्ति: वाट (W); बल: न्यूटन (N); स्प्रिंग नियतांक: N/m."
      )}</p>

      <h3>${tr("13. Common mistakes", "13. सामान्य गलतियाँ")}</h3>
      <ul>
        <li>${tr("Forgetting cos θ in W = Fs cos θ.", "W = Fs cos θ में cos θ भूल जाना।")}</li>
        <li>${tr("Using speed instead of speed squared in kinetic energy.", "गतिज ऊर्जा में चाल के वर्ग की जगह केवल चाल का उपयोग करना।")}</li>
        <li>${tr("Confusing net work with work done by one force.", "कुल कार्य और किसी एक बल द्वारा किए गए कार्य को एक समझ लेना।")}</li>
        <li>${tr("Applying conservation of mechanical energy when non-conservative work has not been accounted for.", "असंरक्षी बल के कार्य को ध्यान में रखे बिना यांत्रिक ऊर्जा संरक्षण लागू करना।")}</li>
        <li>${tr("Forgetting units or mixing grams with kilograms.", "मात्रक भूल जाना या ग्राम और किलोग्राम को मिलाना।")}</li>
      </ul>

      <h3>${tr("14. Practice questions", "14. अभ्यास प्रश्न")}</h3>
      <p>${tr(
        "Try each question before opening its answer. Show the formula, substitution and unit in numerical answers.",
        "उत्तर खोलने से पहले प्रत्येक प्रश्न हल करें। संख्यात्मक उत्तर में सूत्र, मान रखने के चरण और मात्रक लिखें।"
      )}</p>

      <details>
        <summary>${tr("Q1. A 15 N force acts along a 4 m displacement. Find work.", "प्रश्न 1. 15 N का बल 4 m विस्थापन की दिशा में लगता है। कार्य ज्ञात करें।")}</summary>
        <p>W = Fs = 15 × 4 = <b>60 J</b></p>
      </details>

      <details>
        <summary>${tr("Q2. A 5 kg object moves at 4 m/s. Find its kinetic energy.", "प्रश्न 2. 5 kg की वस्तु 4 m/s से चलती है। गतिज ऊर्जा ज्ञात करें।")}</summary>
        <p>K = ½ × 5 × 4² = <b>40 J</b></p>
      </details>

      <details>
        <summary>${tr("Q3. A 3 kg object falls through 5 m. Find the loss in gravitational potential energy. Take g = 10 m/s².", "प्रश्न 3. 3 kg की वस्तु 5 m नीचे गिरती है। स्थितिज ऊर्जा में कमी ज्ञात करें। g = 10 m/s² लें।")}</summary>
        <p>Loss = mgh = 3 × 10 × 5 = <b>150 J</b></p>
      </details>

      <details>
        <summary>${tr("Q4. A machine does 600 J of work in 12 s. Find average power.", "प्रश्न 4. एक मशीन 12 s में 600 J कार्य करती है। औसत शक्ति ज्ञात करें।")}</summary>
        <p>P = W/t = 600/12 = <b>50 W</b></p>
      </details>

      <details>
        <summary>${tr("Q5. A 20 N force acts perpendicular to a 6 m displacement. Find work.", "प्रश्न 5. 20 N का बल 6 m विस्थापन के लंबवत लगता है। कार्य ज्ञात करें।")}</summary>
        <p>W = Fs cos 90° = <b>0 J</b></p>
      </details>

      <details>
        <summary>${tr("Q6. A 1000 J input produces 750 J useful output. Find efficiency.", "प्रश्न 6. 1000 J इनपुट से 750 J उपयोगी आउटपुट मिलता है। दक्षता ज्ञात करें।")}</summary>
        <p>Efficiency = (750/1000) × 100% = <b>75%</b></p>
      </details>

      <details>
        <summary>${tr("Q7. A 4 kg object changes speed from 2 m/s to 6 m/s. Find net work.", "प्रश्न 7. 4 kg की वस्तु की चाल 2 m/s से 6 m/s हो जाती है। कुल कार्य ज्ञात करें।")}</summary>
        <p>W = ½ × 4 × (6² − 2²) = 2 × 32 = <b>64 J</b></p>
      </details>

      <details>
        <summary>${tr("Q8. A spring with k = 100 N/m is compressed by 0.20 m. Find its stored energy.", "प्रश्न 8. k = 100 N/m वाली स्प्रिंग को 0.20 m दबाया जाता है। संचित ऊर्जा ज्ञात करें।")}</summary>
        <p>U = ½ × 100 × (0.20)² = <b>2 J</b></p>
      </details>

      <details>
        <summary>${tr("Q9. State the work–energy theorem.", "प्रश्न 9. कार्य–ऊर्जा प्रमेय लिखें।")}</summary>
        <p>${tr(
          "The net work done on an object equals the change in its kinetic energy: Wnet = Kf − Ki.",
          "किसी वस्तु पर किया गया कुल कार्य उसकी गतिज ऊर्जा में परिवर्तन के बराबर होता है: Wnet = Kf − Ki."
        )}</p>
      </details>

      <details>
        <summary>${tr("Q10. When is mechanical energy conserved?", "प्रश्न 10. यांत्रिक ऊर्जा कब संरक्षित रहती है?")}</summary>
        <p>${tr(
          "When only conservative forces do work, total mechanical energy K + U remains constant.",
          "जब केवल संरक्षी बल कार्य करते हैं, तब कुल यांत्रिक ऊर्जा K + U स्थिर रहती है।"
        )}</p>
      </details>

      <h3>${tr("15. Revision checklist", "15. दोहराव सूची")}</h3>
      <ul>
        <li>${tr("I can calculate work for different angles.", "मैं विभिन्न कोणों पर कार्य निकाल सकता हूँ।")}</li>
        <li>${tr("I can read work from a force–displacement graph.", "मैं बल–विस्थापन ग्राफ से कार्य निकाल सकता हूँ।")}</li>
        <li>${tr("I can use the work–energy theorem in numericals.", "मैं संख्यात्मक प्रश्नों में कार्य–ऊर्जा प्रमेय लगा सकता हूँ।")}</li>
        <li>${tr("I can apply gravitational and spring potential energy.", "मैं गुरुत्वीय और स्प्रिंग स्थितिज ऊर्जा का उपयोग कर सकता हूँ।")}</li>
        <li>${tr("I can distinguish energy from power and state their units.", "मैं ऊर्जा और शक्ति में अंतर तथा उनके मात्रक बता सकता हूँ।")}</li>
      </ul>

      <div class="form-row">
        <button class="button primary" data-action="mark-chapter"
          data-subject="physics" data-chapter="${index}">
          ${done ? tr("✓ Completed", "✓ पूरा हुआ") : tr("Mark chapter complete", "अध्याय पूरा चिह्नित करें")}
        </button>
        <button class="button secondary" data-action="save-note"
          data-subject="physics" data-chapter="${index}">
          ${tr("Save formula sheet to my notes", "सूत्र-संग्रह नोट्स में सहेजें")}
        </button>
      </div>
    </div>`;
}
  
  function genericNote(s,ch,index){
  if (s.id === "physics" && index === 4) {
    return workEnergyPowerNote(index);
    
if (action === "save-note") {
  const s = subjects.find(s => s.id === el.dataset.subject);
  if (!s) return;

  const chapterIndex = Number(el.dataset.chapter);
  const title = s.chapters[chapterIndex];

  const savedText =
    s.id === "physics" && chapterIndex === 4
      ? tr(
          "Work, Energy and Power formula sheet:\n" +
          "W = Fs cos(theta); Wnet = change in K; " +
          "K = 1/2 mv^2; Ugravity = mgh; " +
          "Uspring = 1/2 kx^2; K + U = constant " +
          "when only conservative forces do work; " +
          "Pavg = W/time; P = F dot v; " +
          "Efficiency = useful output/input x 100%.",
          "कार्य, ऊर्जा और शक्ति सूत्र-संग्रह:\n" +
          "W = Fs cos(theta); कुल कार्य = गतिज ऊर्जा में परिवर्तन; " +
          "K = 1/2 mv^2; गुरुत्वीय स्थितिज ऊर्जा = mgh; " +
          "स्प्रिंग ऊर्जा = 1/2 kx^2; केवल संरक्षी बल कार्य करें तो " +
          "K + U स्थिर रहता है; औसत शक्ति = कार्य/समय; " +
          "तात्क्षणिक शक्ति = F dot v; " +
          "दक्षता = उपयोगी आउटपुट/इनपुट x 100%."
        )
      : tr(
          "Review this chapter and add your own key points.",
          "इस अध्याय को दोहराएँ और अपने मुख्य बिंदु जोड़ें।"
        );

  state.notes.unshift({
    id: uid(),
    title,
    subject: s.name,
    date: new Date().toLocaleDateString(),
    text: savedText
  });

  save();
  toast(tr("Formula sheet saved to your notes", "सूत्र-संग्रह नोट्स में सहेजा गया"));
}
    
  }

  const data = {
})();
