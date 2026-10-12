
(() => {
  "use strict";

  const STORE = "orbitHub.v1";

  const subjects = [
    {
      id: "physics", name: "Physics", hi: "भौतिक विज्ञान", icon: "⚛",
      desc: "Concepts, formulas and numerical practice",
      chapters: [
        "Physical World & Measurement", "Motion in a Straight Line",
        "Motion in a Plane", "Laws of Motion", "Work, Energy & Power",
        "System of Particles & Rotational Motion", "Gravitation",
        "Properties of Bulk Matter", "Thermodynamics", "Kinetic Theory",
        "Oscillations", "Waves"
      ]
    },
    {
      id: "chemistry", name: "Chemistry", hi: "रसायन विज्ञान", icon: "◈",
      desc: "Theory, reactions and solved problems",
      chapters: [
        "Some Basic Concepts of Chemistry", "Structure of Atom",
        "Classification of Elements", "Chemical Bonding", "States of Matter",
        "Thermodynamics", "Equilibrium", "Redox Reactions",
        "Organic Chemistry: Basic Principles", "Hydrocarbons"
      ]
    },
    {
      id: "maths", name: "Mathematics", hi: "गणित", icon: "∑",
      desc: "Formulas, worked examples and practice",
      chapters: [
        "Sets", "Relations & Functions", "Trigonometric Functions",
        "Complex Numbers", "Linear Inequalities", "Permutations & Combinations",
        "Binomial Theorem", "Sequences & Series", "Straight Lines",
        "Conic Sections", "Introduction to 3D Geometry",
        "Limits & Derivatives", "Statistics", "Probability"
      ]
    },
    {
      id: "english", name: "English", hi: "अंग्रेज़ी", icon: "Aa",
      desc: "Literature, writing skills and grammar",
      chapters: [
        "The Portrait of a Lady", "A Photograph",
        "We’re Not Afraid to Die…", "Discovering Tut",
        "The Voice of the Rain", "The Ailing Planet",
        "The Summer of the Beautiful White Horse", "The Address",
        "Mother’s Day", "The Tale of Melon City", "Writing Skills & Grammar"
      ]
    },
    {
      id: "cs", name: "Computer Science", hi: "कंप्यूटर विज्ञान", icon: "⌘",
      desc: "Python concepts, programs and debugging",
      chapters: [
        "Computer Systems", "Encoding Schemes & Number Systems",
        "Emerging Trends", "Introduction to Python",
        "Getting Started with Python", "Flow of Control", "Strings",
        "Lists", "Tuples & Dictionaries", "Python Modules"
      ]
    },
    {
      id: "pat", name: "PAT", hi: "शारीरिक शिक्षा", icon: "✦",
      desc: "Health, communication, yoga and safety",
      chapters: [
        "Communication Skills", "Self-management Skills", "ICT Skills",
        "Physical & Emotional Health", "Health Domains",
        "Physical Activity & Society", "Yoga & Well-being", "Hygiene and Safety"
      ]
    }
  ];

  const defaultState = {
    lang: "en", view: "home", activeSubject: "physics", activeChapter: 0,
    tasks: [], workouts: [], habits: [], notes: [], studyMinutes: 0,
    completedChapters: [], timerTarget: 25, theme: "dark", reflection: ""
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      return { ...defaultState, ...saved };
    } catch {
      return { ...defaultState };
    }
  }

  let state = loadState();
  let timerInterval = null;
  let timerSeconds = (Number(state.timerTarget) || 25) * 60;
  let timerRunning = false;

  const $ = selector => document.querySelector(selector);
  const tr = (en, hi) => state.lang === "hi" ? hi : en;

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
      toast("Could not save data. Export a backup if possible.");
    }
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function dateLabel() {
    const el = $("#todayLabel");
    if (el) {
      el.textContent = new Intl.DateTimeFormat(
        state.lang === "hi" ? "hi-IN" : "en-IN",
        { weekday: "short", day: "numeric", month: "short" }
      ).format(new Date());
    }
  }

  function heading(kicker, title, description, action = "") {
    return `<div class="page-heading"><div>
      <div class="eyebrow">${kicker}</div><h1>${title}</h1>
      <p>${description}</p></div>${action}</div>`;
  }

  function stat(label, value, note, icon = "✦") {
    return `<div class="stat"><div class="stat-label">${icon} &nbsp;${label}</div>
      <div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`;
  }

  function homeView() {
    const completed = state.tasks.filter(task => task.done).length;
    const minutes = Number(state.studyMinutes) || 0;

    return `${heading(
      tr("YOUR PERSONAL SPACE", "आपकी निजी जगह"),
      tr("Welcome to Orbit Hub", "Orbit Hub में आपका स्वागत है"),
      tr("Study, build healthy routines and keep moving forward.",
         "पढ़ाई करें, अच्छी आदतें बनाएँ और आगे बढ़ें।"),
      `<button class="button primary" data-action="go-study">${tr("Continue studying", "पढ़ाई जारी रखें")} ↗</button>`
    )}
    <div class="grid stats-grid">
      ${stat(tr("Study time","पढ़ाई का समय"),
        `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
        tr("Minutes logged in this app","इस ऐप में दर्ज समय"), "◷")}
      ${stat(tr("Tasks completed","पूरे किए कार्य"),
        `${completed}/${state.tasks.length}`,
        tr("Keep your day manageable","दिन व्यवस्थित रखें"), "✓")}
      ${stat(tr("Subjects","विषय"), "6",
        tr("Class 11 learning spaces","कक्षा 11 के विषय"), "▤")}
      ${stat(tr("Saved items","सहेजी गई चीज़ें"), state.notes.length,
        tr("Personal notes saved","सहेजे गए नोट्स"), "☆")}
    </div>
    <div class="section-title"><div><h2>${tr("Your hubs","आपके हब")}</h2>
      <p>${tr("Choose what to work on today.","आज क्या करना चाहते हैं?")}</p></div></div>
    <div class="grid feature-grid">
      ${[
        ["go-study","▤","Study Centre","अध्ययन केंद्र","Six subjects, chapters and revision.","छह विषय, अध्याय और दोहराव।"],
        ["go-fitness","✦","Fitness Centre","फिटनेस केंद्र","Log workouts and stretching.","वर्कआउट और स्ट्रेचिंग दर्ज करें।"],
        ["go-planner","☷","Productivity Hub","उत्पादकता केंद्र","Tasks and a focus timer.","कार्य और फोकस टाइमर।"],
        ["go-growth","↗","Personal Growth","व्यक्तिगत विकास","Build habits and reflect.","आदतें बनाएँ और चिंतन करें।"],
        ["go-settings","⚙","Settings & Backup","सेटिंग्स और बैकअप","Language, export and restore.","भाषा, निर्यात और बहाली।"]
      ].map(item => `<button class="feature-card" data-action="${item[0]}">
        <span class="feature-icon">${item[1]}</span><h3>${tr(item[2],item[3])}</h3>
        <p>${tr(item[4],item[5])}</p></button>`).join("")}
      <div class="feature-card"><span class="feature-icon">◎</span>
        <h3>${tr("Your rule","आपका नियम")}</h3>
        <p>${tr("Progress over perfection.","पूर्णता से अधिक प्रगति।")}</p></div>
    </div>
    <div class="section-title"><div><h2>${tr("Today's tasks","आज के कार्य")}</h2></div>
      <button class="button secondary" data-action="go-planner">${tr("Manage tasks","कार्य प्रबंधित करें")}</button></div>
    ${taskList(state.tasks.slice(0, 4))}`;
  }

  function taskList(tasks) {
    if (!tasks.length) {
      return `<div class="card empty">${tr("No tasks yet. Add one in Productivity Hub.",
        "अभी कोई कार्य नहीं। उत्पादकता केंद्र में जोड़ें।")}</div>`;
    }
    return `<div class="task-list">${tasks.map(task => `
      <label class="task-item ${task.done ? "done" : ""}">
        <input type="checkbox" data-task="${esc(task.id)}" ${task.done ? "checked" : ""}>
        <span class="task-text">${esc(task.text)}</span>
        ${task.due ? `<span class="pill">${esc(task.due)}</span>` : ""}
      </label>`).join("")}</div>`;
  }

  function subjectProgress(id) {
    const subject = subjects.find(item => item.id === id);
    if (!subject) return 0;
    const count = subject.chapters.filter((chapter, i) =>
      state.completedChapters.includes(`${id}:${i}`)).length;
    return Math.round(count / subject.chapters.length * 100);
  }

  function hindiDescription(id) {
    return ({
      physics: "अवधारणाएँ, सूत्र और संख्यात्मक अभ्यास",
      chemistry: "सिद्धांत, अभिक्रियाएँ और प्रश्न",
      maths: "सूत्र, उदाहरण और अभ्यास",
      english: "साहित्य, लेखन कौशल और व्याकरण",
      cs: "Python, प्रोग्राम और त्रुटि सुधार",
      pat: "स्वास्थ्य, संचार, योग और सुरक्षा"
    })[id] || "";
  }

  function studyView() {
    return `${heading(tr("LEARN WITH CLARITY","स्पष्टता से सीखें"),
      tr("Study Centre","अध्ययन केंद्र"),
      tr("Choose a subject to open its chapters and study guides.",
         "विषय चुनकर अध्याय और अध्ययन मार्गदर्शिकाएँ खोलें।"))}
    <div class="grid subject-grid">${subjects.map(subject => `
      <article class="subject-card" role="button" tabindex="0" data-subject="${subject.id}">
        <div class="subject-top"><span class="subject-icon">${subject.icon}</span>
          <span class="pill">${subject.chapters.length} ${tr("chapters","अध्याय")}</span></div>
        <h3>${tr(subject.name,subject.hi)}</h3>
        <p>${tr(subject.desc,hindiDescription(subject.id))}</p>
        <div class="progress-track"><span style="width:${subjectProgress(subject.id)}%"></span></div>
        <div class="subject-foot"><span>${tr("Progress","प्रगति")}</span>
          <span>${subjectProgress(subject.id)}%</span></div>
      </article>`).join("")}</div>`;
  }

  function workEnergyPowerNote() {
    return `<div class="note-content">
      <div class="notice">${tr(
        "Class 11 Physics study module. Check your prescribed textbook and school syllabus for exact coverage.",
        "कक्षा 11 भौतिक विज्ञान अध्ययन मॉड्यूल। सटीक पाठ्यक्रम के लिए अपनी पाठ्यपुस्तक देखें।"
      )}</div>
      <h2>${tr("Work, Energy and Power","कार्य, ऊर्जा और शक्ति")}</h2>

      <h3>1. Work done by a constant force</h3>
      <p>Work is the scalar product of force and displacement.</p>
      <p><b>W = F s cos θ</b></p>
      <ul>
        <li>θ = 0°: positive work, W = Fs.</li>
        <li>θ = 90°: zero work.</li>
        <li>θ = 180°: negative work, W = −Fs.</li>
        <li>SI unit: joule (J); dimension: [ML²T⁻²].</li>
      </ul>

      <h3>2. Work by a variable force</h3>
      <p>For a force that varies along the displacement:</p>
      <p><b>W = ∫ Fₓ dx</b></p>
      <p>The signed area under a force–displacement graph gives the work.</p>

      <h3>3. Kinetic energy</h3>
      <p>Kinetic energy is the energy associated with motion.</p>
      <p><b>K = ½mv²</b></p>
      <p>It is a scalar quantity and is never negative in classical mechanics.</p>

      <h3>4. Work–energy theorem</h3>
      <p>The net work done on an object equals its change in kinetic energy.</p>
      <p><b>Wₙₑₜ = K₂ − K₁ = ½m(v² − u²)</b></p>

      <h3>5. Potential energy</h3>
      <p>Near Earth's surface, choosing zero potential energy at a reference level:</p>
      <p><b>U = mgh</b></p>
      <p>For an ideal spring with displacement x from equilibrium:</p>
      <p><b>Uₛ = ½kx²</b></p>
      <p>Spring force: <b>F = −kx</b>.</p>

      <h3>6. Conservation of mechanical energy</h3>
      <p>When only conservative forces do work, total mechanical energy remains constant.</p>
      <p><b>K₁ + U₁ = K₂ + U₂</b></p>
      <p>Friction and other non-conservative forces can change mechanical energy into thermal energy or other forms.</p>

      <h3>7. Power</h3>
      <p>Power measures the rate of doing work or transferring energy.</p>
      <ul>
        <li>Average power: <b>P = W/Δt</b>.</li>
        <li>Instantaneous power: <b>P = dW/dt = F · v</b>.</li>
        <li>SI unit: watt (W); dimension: [ML²T⁻³].</li>
      </ul>

      <h3>8. Collisions and energy</h3>
      <p>Momentum is conserved in an isolated system. In an elastic collision, total kinetic energy is also conserved. In an inelastic collision, kinetic energy is not conserved, although total energy is.</p>

      <h3>9. Solved examples</h3>
      <p><b>Example 1:</b> A 2 kg object moves at 3 m/s. Find its kinetic energy.</p>
      <p>K = ½ × 2 × 3² = <b>9 J</b>.</p>

      <p><b>Example 2:</b> A 10 N force moves an object 4 m in the force's direction. Find work.</p>
      <p>W = Fs cos 0° = 10 × 4 = <b>40 J</b>.</p>

      <p><b>Example 3:</b> A machine does 600 J of work in 20 s. Find average power.</p>
      <p>P = W/t = 600/20 = <b>30 W</b>.</p>

      <p><b>Example 4:</b> A 2 kg object falls through 5 m from rest, ignoring air resistance. Find its speed just before reaching the bottom. Use g = 9.8 m/s².</p>
      <p>mgh = ½mv², so v = √(2gh) = √98 ≈ <b>9.90 m/s</b>.</p>

      <h3>10. Common mistakes</h3>
      <ul>
        <li>Forgetting cos θ in W = Fs cos θ.</li>
        <li>Using mass in grams instead of kilograms.</li>
        <li>Confusing energy (joule) with power (watt).</li>
        <li>Assuming kinetic energy is conserved in every collision.</li>
        <li>Ignoring friction when the question includes it.</li>
      </ul>

      <h3>11. Practice questions</h3>
      <ol>
        <li>A 5 N force acts at 60° to a 3 m displacement. Find work.</li>
        <li>Calculate kinetic energy of a 4 kg object moving at 5 m/s.</li>
        <li>A 100 W device operates for 30 s. How much energy does it transfer?</li>
        <li>A spring of force constant 200 N/m is compressed by 0.1 m. Find stored energy.</li>
        <li>Explain the work–energy theorem.</li>
        <li>When is mechanical energy conserved?</li>
      </ol>

      <h3>12. Answer key</h3>
      <ol>
        <li>W = 5 × 3 × cos 60° = <b>7.5 J</b>.</li>
        <li>K = ½ × 4 × 25 = <b>50 J</b>.</li>
        <li>E = Pt = 100 × 30 = <b>3000 J</b>.</li>
        <li>U = ½ × 200 × 0.1² = <b>1 J</b>.</li>
        <li>Net work equals the change in kinetic energy.</li>
        <li>When only conservative forces do work on the system.</li>
      </ol>

      <div class="notice">This is a study module, not a guarantee of complete syllabus coverage. Practise your prescribed textbook and teacher-assigned questions too.</div>
      <div class="form-row">
        <button class="button primary" data-action="mark-chapter" data-subject="physics" data-chapter="4">
          ${state.completedChapters.includes("physics:4") ? "✓ Completed" : "Mark chapter complete"}
        </button>
        <button class="button secondary" data-action="save-note" data-subject="physics" data-chapter="4">Save to my notes</button>
      </div>
    </div>`;
  }

  function genericNote(subject, chapter, index) {
    if (subject.id === "physics" && index === 4) {
      return workEnergyPowerNote();
    }

    const content = {
      physics: "Identify the system, list known values with SI units, choose the relevant physical principle, and check dimensions.",
      chemistry: "Write definitions, symbols, balanced equations and units carefully. Convert quantities before substituting.",
      maths: "Identify the definition or identity, show each step, and verify the answer against the original conditions.",
      english: "Identify the central idea, theme, tone and textual evidence. Structure long answers clearly.",
      cs: "Trace variables line by line. Check data types, indentation, operator precedence and output.",
      pat: "Define the main terms, list key points, give practical examples and include relevant safety considerations."
    };

    return `<div class="note-content">
      <div class="notice">Starter guide — use your prescribed textbook for complete chapter notes.</div>
      <h2>${esc(chapter)}</h2>
      <h3>${tr("Core approach","मुख्य तरीका")}</h3>
      <p>${content[subject.id]}</p>
      <h3>${tr("Study checklist","अध्ययन सूची")}</h3>
      <ol>
        <li>${tr("Read the prescribed textbook section.","पाठ्यपुस्तक का निर्धारित भाग पढ़ें।")}</li>
        <li>${tr("Write important definitions and formulas.","महत्वपूर्ण परिभाषाएँ और सूत्र लिखें।")}</li>
        <li>${tr("Solve examples and textbook questions.","उदाहरण और पाठ्यपुस्तक के प्रश्न हल करें।")}</li>
      </ol>
      <div class="form-row">
        <button class="button primary" data-action="mark-chapter"
          data-subject="${subject.id}" data-chapter="${index}">
          ${state.completedChapters.includes(subject.id + ":" + index) ? "✓ Completed" : "Mark chapter complete"}
        </button>
        <button class="button secondary" data-action="save-note"
          data-subject="${subject.id}" data-chapter="${index}">Save to my notes</button>
      </div>
    </div>`;
  }

  function subjectDetail() {
    const subject = subjects.find(s => s.id === state.activeSubject) || subjects[0];
    const index = Math.max(0, Math.min(Number(state.activeChapter) || 0, subject.chapters.length - 1));

    return `${heading(tr("STUDY SPACE","अध्ययन स्थान"),
      tr(subject.name,subject.hi),
      tr("Choose a chapter and work through its study guide.",
         "अध्याय चुनें और उसकी अध्ययन मार्गदर्शिका पढ़ें।"),
      `<button class="button secondary" data-action="back-study">← ${tr("All subjects","सभी विषय")}</button>`)}
      <div class="subject-detail">
        <div class="card"><h3>${tr("Chapters","अध्याय")}</h3>
          <div class="chapter-list">${subject.chapters.map((chapter, i) => `
            <button class="chapter-button ${i === index ? "active" : ""}" data-chapter-pick="${i}">
              ${i + 1}. ${esc(chapter)} ${state.completedChapters.includes(subject.id + ":" + i) ? "✓" : ""}
            </button>`).join("")}</div>
        </div>
        <div class="card">${genericNote(subject, subject.chapters[index], index)}</div>
      </div>`;
  }

  function fitnessView() {
    return `${heading(tr("MOVE & RECOVER","चलें और आराम करें"),
      tr("Fitness Centre","फिटनेस केंद्र"),
      tr("Track workouts and prioritise technique, recovery and sleep.",
         "वर्कआउट दर्ज करें और तकनीक, आराम व नींद को प्राथमिकता दें।"))}
      <div class="grid two-col">
        <div class="card"><h2>${tr("Log a workout","वर्कआउट दर्ज करें")}</h2>
          <form id="workoutForm">
            <label class="field-label">Activity</label>
            <input class="field" name="activity" required maxlength="80" placeholder="Full-body workout">
            <label class="field-label">Minutes</label>
            <input class="field" name="minutes" type="number" min="1" max="300" value="25" required>
            <label class="field-label">Sets (optional)</label>
            <input class="field" name="sets" type="number" min="0" max="50" placeholder="3">
            <label class="field-label">Notes (optional)</label>
            <input class="field" name="notes" maxlength="160" placeholder="How did it feel?">
            <button class="button primary" type="submit">Save workout</button>
          </form>
        </div>
        <div class="card"><h2>${tr("Recent activity","हाल की गतिविधि")}</h2>
          ${state.workouts.length ? state.workouts.slice(0, 10).map(w => `
            <div class="task-item"><span class="task-text"><b>${esc(w.activity)}</b><br>
              <small class="muted">${esc(w.date)} · ${w.minutes} min</small></span>
              <button class="button secondary" data-delete-workout="${esc(w.id)}">×</button>
            </div>`).join("") : `<div class="empty">${tr("No workouts logged yet.","अभी कोई वर्कआउट दर्ज नहीं है।")}</div>`}
          <p>${tr("Build consistency gradually. Stop if you feel pain or dizziness.",
            "धीरे-धीरे नियमितता बढ़ाएँ। दर्द या चक्कर आने पर रुकें।")}</p>
        </div>
      </div>`;
  }

  function plannerView() {
    return `${heading(tr("MAKE SPACE FOR WHAT MATTERS","ज़रूरी काम के लिए समय"),
      tr("Productivity Hub","उत्पादकता केंद्र"),
      tr("Manage tasks and focus sessions.","कार्य और फोकस सत्र व्यवस्थित करें।"))}
      <div class="grid two-col">
        <div class="stack">
          <div class="card"><h2>${tr("Add a task","कार्य जोड़ें")}</h2>
            <form id="taskForm">
              <label class="field-label">Task</label>
              <input class="field" name="text" maxlength="120" required placeholder="Revise Physics">
              <label class="field-label">Due date (optional)</label>
              <input class="field" type="date" name="due">
              <button class="button primary" type="submit">+ Add task</button>
            </form>
          </div>
          <div class="card"><h2>${tr("Task list","कार्य सूची")}</h2>
            <button class="button secondary" data-action="clear-completed">Clear completed</button>
            ${taskList(state.tasks)}
          </div>
        </div>
        <div class="card"><h2>${tr("Focus timer","फोकस टाइमर")}</h2>
          <p>Keep this page open while the timer runs.</p>
          <div class="timer-display" id="timerDisplay">25:00</div>
          <div class="form-row"><label class="field-label">Minutes</label>
            <select id="timerMinutes" class="field">
              ${[15,25,30,45,50].map(n => `<option value="${n}" ${n === Number(state.timerTarget) ? "selected" : ""}>${n}</option>`).join("")}
            </select>
          </div>
          <div class="timer-controls">
            <button class="button primary" id="timerStart">Start</button>
            <button class="button secondary" id="timerReset">Reset</button>
          </div>
          <p class="muted" id="timerStatus">Completed sessions add to your study time.</p>
        </div>
      </div>`;
  }

  function habitList() {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.habits.length) return `<div class="empty">Add a habit to get started.</div>`;
    return state.habits.map(h => `
      <div class="habit-row">
        <label class="checkline"><input type="checkbox" data-habit="${esc(h.id)}" ${h.lastDone === today ? "checked" : ""}>
          <span>${esc(h.name)}</span></label>
        <button class="button secondary" data-delete-habit="${esc(h.id)}">×</button>
      </div>`).join("");
  }

  function growthView() {
    return `${heading(tr("SMALL STEPS COUNT","छोटे कदम मायने रखते हैं"),
      tr("Personal Growth","व्यक्तिगत विकास"),
      tr("Track habits and reflect on your progress.","आदतें दर्ज करें और अपनी प्रगति पर विचार करें।"))}
      <div class="grid two-col">
        <div class="card"><h2>${tr("Daily habits","दैनिक आदतें")}</h2>
          <div id="habitList">${habitList()}</div>
          <form id="habitForm" class="form-row">
            <input class="field" name="habit" required maxlength="60" placeholder="Add a habit" style="flex:1">
            <button class="button primary" type="submit">+</button>
          </form>
        </div>
        <div class="card"><h2>${tr("Weekly reflection","साप्ताहिक चिंतन")}</h2>
          <label class="field-label">What went well?</label>
          <textarea class="field" id="reflection" rows="4" maxlength="1000">${esc(state.reflection || "")}</textarea>
          <button class="button primary" data-action="save-reflection">Save reflection</button>
        </div>
      </div>`;
  }

  function settingsView() {
    return `${heading(tr("YOUR DATA, YOUR CHOICE","आपका डेटा, आपका नियंत्रण"),
      tr("Settings & Backup","सेटिंग्स और बैकअप"),
      tr("Your progress is stored locally in this browser.",
         "आपकी प्रगति इसी ब्राउज़र में सहेजी जाती है।"))}
      <div class="grid settings-grid">
        <div class="card"><h2>Language / भाषा</h2>
          <button class="button primary" id="settingsLang">${state.lang === "en" ? "हिंदी में बदलें" : "Switch to English"}</button>
        </div>
        <div class="card"><h2>Export backup</h2>
          <p>Download a copy of your saved data.</p>
          <button class="button primary" data-action="export">Download backup</button>
        </div>
        <div class="card"><h2>Restore backup</h2>
          <label class="button secondary file-label">Choose JSON backup
            <input type="file" id="importFile" accept=".json,application/json" class="hidden">
          </label>
        </div>
        <div class="card"><h2>Install & offline</h2>
          <p>Offline support depends on the service worker and files already cached on your device.</p>
        </div>
        <div class="card"><h2>Reset app data</h2>
          <p>This permanently deletes local progress. Export a backup first.</p>
          <button class="button danger" data-action="reset">Reset all local data</button>
        </div>
        <div class="card"><h2>About</h2><span class="pill">Orbit Hub 0.2.0</span></div>
      </div>`;
  }

  function render() {
    dateLabel();
    const root = $("#viewRoot");
    if (!root) return;

    const views = {
      home: homeView,
      study: studyView,
      subject: subjectDetail,
      fitness: fitnessView,
      planner: plannerView,
      growth: growthView,
      settings: settingsView
    };
    root.innerHTML = (views[state.view] || homeView)();

    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("active",
        button.dataset.view === state.view ||
        (state.view === "subject" && button.dataset.view === "study"));
    });

    const langButton = $("#langToggle");
    if (langButton) langButton.textContent = state.lang === "en" ? "हिंदी" : "English";
    document.documentElement.lang = state.lang === "hi" ? "hi" : "en";

    updateTimerDisplay();
  }

  function go(view) {
    state.view = view;
    save();
    render();
  }

  function toggleLanguage() {
    state.lang = state.lang === "en" ? "hi" : "en";
    save();
    render();
  }

  function handleAction(action, element) {
    if (action.startsWith("go-")) {
      const routes = {
        "go-study": "study", "go-fitness": "fitness",
        "go-planner": "planner", "go-growth": "growth",
        "go-settings": "settings"
      };
      return go(routes[action] || "home");
    }

    if (action === "back-study") return go("study");

    if (action === "mark-chapter") {
      const key = element.dataset.subject + ":" + element.dataset.chapter;
      state.completedChapters = state.completedChapters.includes(key)
        ? state.completedChapters.filter(item => item !== key)
        : [...state.completedChapters, key];
      save();
      render();
      toast("Progress updated");
    }

    if (action === "save-note") {
      const subject = subjects.find(s => s.id === element.dataset.subject);
      if (!subject) return;
      const title = subject.chapters[Number(element.dataset.chapter)];
      state.notes.unshift({
        id: uid(), title, subject: subject.name,
        date: new Date().toLocaleDateString(),
        text: "Review this chapter and add your own key points."
      });
      save();
      toast("Added to your saved notes");
    }

    if (action === "clear-completed") {
      state.tasks = state.tasks.filter(task => !task.done);
      save();
      render();
    }

    if (action === "save-reflection") {
      state.reflection = $("#reflection")?.value || "";
      save();
      toast("Reflection saved");
    }

    if (action === "export") exportBackup();

    if (action === "reset" && confirm(
      "Delete all Orbit Hub data saved in this browser? Export a backup first if needed."
    )) {
      localStorage.removeItem(STORE);
      state = { ...defaultState };
      stopTimer();
      timerSeconds = 25 * 60;
      save();
      render();
    }
  }

  function updateTimerDisplay() {
    const display = $("#timerDisplay");
    if (display) {
      display.textContent =
        `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:` +
        `${String(timerSeconds % 60).padStart(2, "0")}`;
    }
    const button = $("#timerStart");
    if (button) button.textContent = timerRunning ? "Pause" : "Start";
  }

  function stopTimer() {
    timerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function toggleTimer() {
    if (timerRunning) {
      stopTimer();
      updateTimerDisplay();
      return;
    }

    timerRunning = true;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();

      if (timerSeconds <= 0) {
        stopTimer();
        state.studyMinutes = (Number(state.studyMinutes) || 0) +
          (Number(state.timerTarget) || 25);
        save();
        toast("Focus session complete!");
        const status = $("#timerStatus");
        if (status) status.textContent = "Great work. Take a short break.";
        updateTimerDisplay();
      }
    }, 1000);
  }

  function resetTimer() {
    stopTimer();
    timerSeconds = (Number(state.timerTarget) || 25) * 60;
    updateTimerDisplay();
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orbit-hub-backup-" +
      new Date().toISOString().slice(0, 10) + ".json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Backup download started");
  }

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== "object" || !Array.isArray(data.tasks)) {
          throw new Error("Invalid backup");
        }
        if (!confirm("Replace current saved data with this backup?")) return;

        state = { ...defaultState, ...data };
        save();
        render();
        toast("Backup restored");
      } catch {
        toast("That backup file could not be read.");
      }
    };
    reader.readAsText(file);
  }

  // Navigation and all page interactions.
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => go(button.dataset.view));
  });

  $("#langToggle")?.addEventListener("click", toggleLanguage);

  const root = $("#viewRoot");

  root?.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      handleAction(actionButton.dataset.action, actionButton);
      return;
    }

    const chapterButton = event.target.closest("[data-chapter-pick]");
    if (chapterButton) {
      state.activeChapter = Number(chapterButton.dataset.chapterPick);
      save();
      render();
      return;
    }

    const subjectCard = event.target.closest("[data-subject]");
    if (subjectCard) {
      state.activeSubject = subjectCard.dataset.subject;
      state.activeChapter = 0;
      state.view = "subject";
      save();
      render();
      return;
    }

    const deleteWorkout = event.target.closest("[data-delete-workout]");
    if (deleteWorkout) {
      state.workouts = state.workouts.filter(w => w.id !== deleteWorkout.dataset.deleteWorkout);
      save();
      render();
      return;
    }

    const deleteHabit = event.target.closest("[data-delete-habit]");
    if (deleteHabit) {
      state.habits = state.habits.filter(h => h.id !== deleteHabit.dataset.deleteHabit);
      save();
      render();
    }
  });

  root?.addEventListener("change", event => {
    const el = event.target;

    if (el.matches("[data-task]")) {
      const task = state.tasks.find(t => t.id === el.dataset.task);
      if (task) task.done = el.checked;
      save();
      render();
    }

    if (el.matches("[data-habit]")) {
      const habit = state.habits.find(h => h.id === el.dataset.habit);
      if (habit) habit.lastDone = el.checked ? new Date().toISOString().slice(0, 10) : "";
      save();
      render();
    }

    if (el.id === "timerMinutes") {
      state.timerTarget = Number(el.value) || 25;
      save();
      if (!timerRunning) {
        timerSeconds = state.timerTarget * 60;
        updateTimerDisplay();
      }
    }

    if (el.id === "importFile") importBackup(event);
  });

  root?.addEventListener("submit", event => {
    const form = event.target;
    event.preventDefault();

    if (form.id === "taskForm") {
      const data = new FormData(form);
      state.tasks.unshift({
        id: uid(), text: String(data.get("text") || "").trim(),
        due: data.get("due"), done: false
      });
      save();
      render();
      toast("Task added");
    }

    if (form.id === "workoutForm") {
      const data = new FormData(form);
      state.workouts.unshift({
        id: uid(),
        activity: String(data.get("activity") || "").trim(),
        minutes: Number(data.get("minutes")) || 0,
        sets: data.get("sets"),
        notes: String(data.get("notes") || "").trim(),
        date: new Date().toLocaleDateString()
      });
      save();
      render();
      toast("Workout saved");
    }

    if (form.id === "habitForm") {
      const data = new FormData(form);
      state.habits.push({
        id: uid(), name: String(data.get("habit") || "").trim(), lastDone: ""
      });
      save();
      render();
    }
  });

  root?.addEventListener("click", event => {
    if (event.target.id === "timerStart") toggleTimer();
    if (event.target.id === "timerReset") resetTimer();
    if (event.target.id === "settingsLang") toggleLanguage();
  });

  root?.addEventListener("input", event => {
    if (event.target.id === "reflection") {
      state.reflection = event.target.value;
      save();
    }
  });

  if ("serviceWorker" in navigator &&
      (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.warn("Service worker registration failed:", error);
    });
  }

  render();
})();
