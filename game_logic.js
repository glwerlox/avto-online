/* AVTO ONLINE - FULL LOGIC WITH INTERSECTION SIMULATOR & PERSISTENT STATS */

let currentLang = 'uz';
let activeQuestions = [];
let currentQIdx = 0;
let stats = { solved: 0, correct: 0, wrong: 0 };
let examTimer = null;
let secondsLeft = 900;

// SIMULATOR STATE
let simCurrentLevel = 0;
let simSelectedOrder = [];
let simCanvas, simCtx;

const SCENARIOS = [
  {
    id: 1,
    title: { uz: "Teng Ahamiyatli Chorraha (O'ng tomondagi to'siq)", ru: "Равнозначный перекресток (Помеха справа)" },
    desc: { uz: "O'ng tomondan to'siq bo'lmagan avtomobil birinchi o'tishi kerak.", ru: "Первым едет авто без помехи справа." },
    cars: [
      { id: 'red', name: { uz: 'Qizil Sedan', ru: 'Красный Седан' }, color: '#ef4444', start: { x: 200, y: 50 }, dir: 'south' },
      { id: 'blue', name: { uz: "Ko'k Sedan (Siz)", ru: 'Синий Седан (Вы)' }, color: '#3b82f6', start: { x: 50, y: 200 }, dir: 'east' },
      { id: 'yellow', name: { uz: 'Sariq Hatchback', ru: 'Желтый Хэтчбек' }, color: '#eab308', start: { x: 200, y: 320 }, dir: 'north' }
    ],
    correctOrder: ['red', 'blue', 'yellow']
  },
  {
    id: 2,
    title: { uz: "Asosiy va Ikkinchi Darajali Yo'l", ru: "Главная и второстепенная дорога" },
    desc: { uz: "Asosiy yo'ldagi mashinalar ikkinchi darajali yo'ldagilardan oldin o'tadi.", ru: "Главная дорога имеет приоритет." },
    cars: [
      { id: 'blue', name: { uz: "Ko'k Sedan (Asosiy yo'lda)", ru: 'Синий (На главной)' }, color: '#3b82f6', start: { x: 50, y: 200 }, dir: 'east' },
      { id: 'red', name: { uz: "Qizil Sedan (Asosiy yo'lda)", ru: 'Красный (На главной)' }, color: '#ef4444', start: { x: 320, y: 200 }, dir: 'west' },
      { id: 'yellow', name: { uz: "Sariq Hatchback (Ikkinchi yo'lda)", ru: 'Желтый (На второстепенной)' }, color: '#eab308', start: { x: 200, y: 320 }, dir: 'north' }
    ],
    correctOrder: ['blue', 'red', 'yellow']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  loadStatsFromStorage();
  renderTickets();
  initSimCanvas();
  loadSimLevel(0);
});

// --- PERSISTENT STORAGE FOR STATS ---
function loadStatsFromStorage() {
  const saved = localStorage.getItem('avto_online_stats_v2');
  if (saved) {
    try {
      stats = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  updateStatsUI();
}

function saveStatsToStorage() {
  localStorage.setItem('avto_online_stats_v2', JSON.stringify(stats));
  updateStatsUI();
}

function updateStatsUI() {
  document.getElementById('st-solved').innerText = stats.solved;
  document.getElementById('st-correct').innerText = stats.correct;
  document.getElementById('st-wrong').innerText = stats.wrong;

  const pct = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;
  document.getElementById('st-pct').innerText = pct + '%';
}

// --- TABS & NAVIGATION ---
function showTab(tabName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

  document.getElementById('tab-' + tabName).classList.add('active');
  event.currentTarget.classList.add('active');

  if (tabName === 'sim') {
    setTimeout(drawSimRoads, 100);
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('theme-indicator').innerText = isLight ? '☀️' : '🌙';
  drawSimRoads();
}

function toggleLanguage() {
  currentLang = currentLang === 'uz' ? 'ru' : 'uz';
  document.getElementById('lang-indicator').innerText = currentLang.toUpperCase();
  renderTickets();
  loadSimLevel(simCurrentLevel);
}

// --- BILETLAR ---
function renderTickets() {
  const container = document.getElementById('tickets-list');
  container.innerHTML = '';

  for (let i = 1; i <= 44; i++) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.onclick = () => loadTicket(i);
    card.innerHTML = `
      <div class="num">${currentLang === 'uz' ? i + '-Bilet' : 'Билет ' + i}</div>
      <div class="sub">28 ${currentLang === 'uz' ? 'Savol' : 'Вопросов'}</div>
    `;
    container.appendChild(card);
  }
}

function loadTicket(ticketNum) {
  const start = (ticketNum - 1) * 28;
  const end = Math.min(start + 28, ALL_QUESTIONS.length);
  
  activeQuestions = ALL_QUESTIONS.slice(start, end);
  if (activeQuestions.length === 0) {
    activeQuestions = ALL_QUESTIONS.slice(0, 20);
  }

  currentQIdx = 0;
  openQuizView();
}

// --- IMTIHON ---
function startExamSession() {
  const copy = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
  activeQuestions = copy.slice(0, 20);

  currentQIdx = 0;
  secondsLeft = 900;

  openQuizView();
  startTimer();
}

function openQuizView() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-exam').classList.add('active');

  document.getElementById('exam-welcome').classList.add('hidden');
  document.getElementById('quiz-active').classList.remove('hidden');

  renderQuestion();
}

function startTimer() {
  clearInterval(examTimer);
  examTimer = setInterval(() => {
    secondsLeft--;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    document.getElementById('quiz-timer').innerText = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;

    if (secondsLeft <= 0) {
      clearInterval(examTimer);
      alert(currentLang === 'uz' ? "Vaqt tugadi!" : "Время вышло!");
      closeQuizView();
    }
  }, 1000);
}

function renderQuestion() {
  const q = activeQuestions[currentQIdx];
  if (!q) return;

  document.getElementById('q-num').innerText = currentQIdx + 1;
  document.getElementById('q-total').innerText = activeQuestions.length;
  document.getElementById('progress-fill').style.width = `${((currentQIdx + 1) / activeQuestions.length) * 100}%`;

  const imgWrap = document.getElementById('q-img-wrap');
  const img = document.getElementById('q-img');
  if (q.photo) {
    img.src = q.photo;
    imgWrap.classList.remove('hidden');
  } else {
    imgWrap.classList.add('hidden');
  }

  document.getElementById('q-text').innerText = q.question[currentLang] || q.question['uz'];

  const optsContainer = document.getElementById('q-options');
  optsContainer.innerHTML = '';
  document.getElementById('q-exp').classList.add('hidden');

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt[currentLang] || opt['uz'];
    btn.onclick = () => selectOption(btn, opt.correct, q.explanation[currentLang] || q.explanation['uz']);
    optsContainer.appendChild(btn);
  });
}

function selectOption(btn, isCorrect, expText) {
  document.querySelectorAll('.option-btn').forEach(b => b.onclick = null);

  stats.solved++;
  if (isCorrect) {
    btn.classList.add('correct');
    stats.correct++;
  } else {
    btn.classList.add('wrong');
    stats.wrong++;
  }

  saveStatsToStorage();

  if (expText && expText.trim() !== '') {
    document.getElementById('exp-text').innerText = expText;
    document.getElementById('q-exp').classList.remove('hidden');
  } else {
    setTimeout(nextQuestion, 1000);
  }
}

function nextQuestion() {
  currentQIdx++;
  if (currentQIdx >= activeQuestions.length) {
    clearInterval(examTimer);
    alert(currentLang === 'uz' ? "Test yakunlandi!" : "Тест завершен!");
    closeQuizView();
  } else {
    renderQuestion();
  }
}

function closeQuizView() {
  document.getElementById('exam-welcome').classList.remove('hidden');
  document.getElementById('quiz-active').classList.add('hidden');
}

// --- CHORRAHA SIMULYATORI ---
function initSimCanvas() {
  simCanvas = document.getElementById('simCanvas');
  if (!simCanvas) return;
  simCtx = simCanvas.getContext('2d');

  simCanvas.addEventListener('click', (e) => {
    const rect = simCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (simCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (simCanvas.height / rect.height);

    const scenario = SCENARIOS[simCurrentLevel];
    scenario.cars.forEach(car => {
      const dist = Math.hypot(car.start.x - x, car.start.y - y);
      if (dist < 35) {
        toggleCarInOrder(car.id);
      }
    });
  });
}

function loadSimLevel(idx) {
  simCurrentLevel = idx;
  simSelectedOrder = [];
  const scenario = SCENARIOS[idx];

  document.querySelector('.sim-card h2').innerText = scenario.title[currentLang];
  document.querySelector('.sim-card p').innerText = scenario.desc[currentLang];

  updateSimOrderUI();
  drawSimRoads();
}

function toggleCarInOrder(carId) {
  const i = simSelectedOrder.indexOf(carId);
  if (i > -1) {
    simSelectedOrder.splice(i, 1);
  } else {
    simSelectedOrder.push(carId);
  }

  updateSimOrderUI();
  drawSimRoads();
}

function updateSimOrderUI() {
  const container = document.getElementById('sim-seq');
  const btn = document.getElementById('sim-btn');
  const scenario = SCENARIOS[simCurrentLevel];

  if (simSelectedOrder.length === 0) {
    container.innerHTML = `<span class="hint">${currentLang === 'uz' ? 'Mashinalarni tartib bilan bosing...' : 'Нажмите на машины по порядку...'}</span>`;
    btn.disabled = true;
  } else {
    container.innerHTML = simSelectedOrder.map((id, index) => {
      const car = scenario.cars.find(c => c.id === id);
      const name = car ? car.name[currentLang] : id;
      return `<span style="display:inline-block; background:var(--card); border:1px solid var(--blue); padding:4px 8px; border-radius:6px; margin:2px; font-weight:700;">${index + 1}. ${name} ✖</span>`;
    }).join(' ');

    btn.disabled = (simSelectedOrder.length < scenario.cars.length);
  }
}

function drawSimRoads() {
  if (!simCtx) return;
  simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);

  // Background
  simCtx.fillStyle = '#0f172a';
  simCtx.fillRect(0, 0, simCanvas.width, simCanvas.height);

  // Roads
  simCtx.fillStyle = '#334155';
  simCtx.fillRect(0, 150, 400, 100);
  simCtx.fillRect(150, 0, 100, 400);

  // Dashed lines
  simCtx.strokeStyle = '#facc15';
  simCtx.lineWidth = 2;
  simCtx.setLineDash([10, 10]);

  simCtx.beginPath();
  simCtx.moveTo(0, 200); simCtx.lineTo(400, 200);
  simCtx.moveTo(200, 0); simCtx.lineTo(200, 400);
  simCtx.stroke();
  simCtx.setLineDash([]);

  // Draw Cars
  const scenario = SCENARIOS[simCurrentLevel];
  scenario.cars.forEach(car => {
    const isSelected = simSelectedOrder.includes(car.id);
    const orderIdx = simSelectedOrder.indexOf(car.id);

    simCtx.fillStyle = car.color;
    simCtx.fillRect(car.start.x - 20, car.start.y - 20, 40, 40);

    simCtx.strokeStyle = isSelected ? '#ffffff' : '#000000';
    simCtx.lineWidth = isSelected ? 3 : 1;
    simCtx.strokeRect(car.start.x - 20, car.start.y - 20, 40, 40);

    if (isSelected) {
      simCtx.fillStyle = '#ffffff';
      simCtx.font = 'bold 16px sans-serif';
      simCtx.textAlign = 'center';
      simCtx.textBaseline = 'middle';
      simCtx.fillText(orderIdx + 1, car.start.x, car.start.y);
    }
  });
}

function startSimDrive() {
  const scenario = SCENARIOS[simCurrentLevel];
  const isCorrect = JSON.stringify(simSelectedOrder) === JSON.stringify(scenario.correctOrder);

  if (isCorrect) {
    alert(currentLang === 'uz' ? "To'g'ri! Barcha mashinalar bexatar o'tdi. 🎉" : "Правильно! Все машины проехали безопасно. 🎉");
    if (simCurrentLevel + 1 < SCENARIOS.length) {
      loadSimLevel(simCurrentLevel + 1);
    } else {
      loadSimLevel(0);
    }
  } else {
    alert(currentLang === 'uz' ? "XATO! NAVBATSIZ CHIQISH: AVARIYA! 💥" : "ОШИБКА! СТОЛКНОВЕНИЕ! 💥");
    simSelectedOrder = [];
    updateSimOrderUI();
    drawSimRoads();
  }
}
