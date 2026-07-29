/* AVTO ONLINE - FRESH LOGIC ENGINE */

let currentLang = 'uz';
let activeQuestions = [];
let currentQIdx = 0;
let stats = { solved: 0, correct: 0, wrong: 0 };
let examTimer = null;
let secondsLeft = 900;

document.addEventListener('DOMContentLoaded', () => {
  renderTickets();
  updateStatsUI();
});

function showTab(tabName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

  document.getElementById('tab-' + tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('theme-indicator').innerText = isLight ? '☀️' : '🌙';
}

function toggleLanguage() {
  currentLang = currentLang === 'uz' ? 'ru' : 'uz';
  document.getElementById('lang-indicator').innerText = currentLang.toUpperCase();
  renderTickets();
}

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
      alert("Vaqt tugadi!");
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

  updateStatsUI();

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

function updateStatsUI() {
  document.getElementById('st-solved').innerText = stats.solved;
  document.getElementById('st-correct').innerText = stats.correct;
  document.getElementById('st-wrong').innerText = stats.wrong;

  const pct = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;
  document.getElementById('st-pct').innerText = pct + '%';
}
