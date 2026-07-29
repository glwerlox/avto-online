/* ==========================================================================
   AVTO ONLINE - PDD SIMULATOR & EXAM BANK (v8.0 CENTER MODAL OVERLAY)
   ========================================================================== */

// --- I18N DICTIONARY ---
const I18N = {
  uz: {
    subtitle: "Chorrahada harakatlanish simulyatori",
    tab_sim: "Interaktiv Simulyator",
    tab_quiz: "PDD Imtihon",
    tab_rules: "Qoidalar Ensiklopediyasi",
    level: "Bosqich",
    reset: "Qayta boshlash",
    tap_order_hint: "Avtomobillarga ketma-ket bosing: 1-mashina, 2-mashina, 3-mashina...",
    selected_order: "Tanlangan ketma-ketlik:",
    seq_placeholder: "Mashinalarni tartib bilan bosing...",
    start_driving: "🚀 Harakatni boshlash",
    scenario_info: "Chorraha Sharoiti",
    intersection_type: "Chorraha turi:",
    your_car: "Sizning mashinangiz:",
    active_rule: "Asosiy qoida:",
    next_level: "Keyingi bosqich ➔",
    retry: "🔄 Qayta urinish",
    quick_tip_title: "💡 Esda tuting:",
    tip1: "Mashinalar Siz tanlagan ketma-ketlikda (1, 2, 3...) birma-bir harakatlanadi.",
    tip2: "Agar navbatsiz chiqqan mashina bo'lsa, chorrahada to'qnashuv sodir bo'ladi.",
    tip3: "Teng yo'llarda o'ng tomondan to'siq bo'lmagan mashina birinchi o'tishi shart.",
    question: "Savol",
    next_question: "Keyingi savol ➔",
    correct_title: "To'g'ri bajardingiz! 🎉",
    error_title: "NAVBATSIZ CHIQISH: AVARIYA! 💥",
    car_red: "Qizil Sedan",
    car_blue: "Ko'k Sedan (Siz)",
    car_yellow: "Sariq Hatchback",
    car_green: "Yashil SUV",
    car_tram: "Tramvay",
    car_ambulance: "Tez Yordam"
  },
  ru: {
    subtitle: "Симулятор проезда перекрестков по ПДД",
    tab_sim: "Интерактивный симулятор",
    tab_quiz: "Экзамен ПДД",
    tab_rules: "Энциклопедия правил",
    level: "Уровень",
    reset: "Сбросить",
    tap_order_hint: "Нажимайте по очереди: 1-я машина, 2-я машина...",
    selected_order: "Выбранный порядок:",
    seq_placeholder: "Нажимайте на машины по очереди...",
    start_driving: "🚀 Начать движение",
    scenario_info: "Условия перекрестка",
    intersection_type: "Тип перекрестка:",
    your_car: "Ваша машина:",
    active_rule: "Главное правило:",
    next_level: "Следующий уровень ➔",
    retry: "🔄 Попробовать снова",
    quick_tip_title: "💡 Запомните:",
    tip1: "Машины поедут строго по очереди (1, 2, 3...), как Вы выбрали.",
    tip2: "Если машина поедет вне очереди, произойдет столкновение.",
    tip3: "На равнозначных дорогах первой едет машина без помехи справа.",
    question: "Вопрос",
    next_question: "Следующий вопрос ➔",
    correct_title: "Правильно! 🎉",
    error_title: "ПРОЕЗД ВНЕ ОЧЕРЕДИ: АВАРИЯ! 💥",
    car_red: "Красный Седан",
    car_blue: "Синий Седан (Вы)",
    car_yellow: "Желтый Хэтчбек",
    car_green: "Зеленый Внедорожник",
    car_tram: "Трамвай",
    car_ambulance: "Скорая Помощь"
  }
};

let currentLang = 'uz';

// --- SOUND SYNTHESIZER (Web Audio API) ---
class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.25);
    });
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.6);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
}

const sounds = new SoundController();

// --- SCENARIO DATA BANK FOR SIMULATOR ---
const SCENARIOS = [
  {
    id: 1,
    title: { uz: "Teng ahamiyatli chorraha (O'ng tomondagi to'siq)", ru: "Равнозначный перекресток (Помеха справа)" },
    type: { uz: "Tartibga solinmagan teng chorraha", ru: "Нерегулируемый равнозначный" },
    yourCar: { uz: "Ko'k Sedan (To'g'riga harakat)", ru: "Синий Седан (Прямо)" },
    rule: { uz: "O'ng tomondagi to'siq qoidasi", ru: "Правило помехи справа" },
    description: {
      uz: "Chorrahada 3 ta avtomobil o'z yo'l bo'laklarida turibdi. Qaysi ketma-ketlikda o'tish kerak?",
      ru: "На перекрестке 3 машины в своих полосах. В каком порядке проехать?"
    },
    cars: [
      { id: 'red', color: '#ef4444', nameKey: 'car_red', startPos: { x: 310, y: 120 }, angle: 90, target: 'straight', dir: 'south' },
      { id: 'blue', color: '#3b82f6', nameKey: 'car_blue', startPos: { x: 120, y: 390 }, angle: 0, target: 'straight', dir: 'east', isPlayer: true },
      { id: 'yellow', color: '#eab308', nameKey: 'car_yellow', startPos: { x: 390, y: 580 }, angle: -90, target: 'straight', dir: 'north' }
    ],
    validGroupOrders: [
      ['red'],
      ['blue'],
      ['yellow']
    ],
    explanation: {
      uz: "1. Qizil mashinaning o'ng tomonida to'siq yo'q, u 1-bo'lib o'tadi.\n2. Qizil o'tgach, Ko'k mashinaning (Sizning) o'ng tomoningiz bo'shaydi va 2-bo'lib o'tasiz.\n3. Sariq mashina 3-bo'lib oxirida o'tadi.",
      ru: "1. У красной машины нет помехи справа, она едет первой.\n2. Затем проезжает Синяя машина (Вы).\n3. Желтая машина проезжает последней."
    }
  },
  {
    id: 2,
    title: { uz: "Asosiy va ikkinchi darajali yo'l", ru: "Главная и второстепенная дорога" },
    type: { uz: "Belgilar bilan tartiblangan chorraha", ru: "Со знаком Главная дорога" },
    yourCar: { uz: "Ko'k Sedan (Asosiy yo'lda, to'g'riga)", ru: "Синий Седан (На главной, прямо)" },
    rule: { uz: "Asosiy yo'l ustunligi (2.1)", ru: "Приоритет главной дороги" },
    description: {
      uz: "Ko'k mashina (Siz) va Qizil mashina Asosiy yo'lda. Sariq mashina Ikkinchi darajali yo'lda (2.4 Yo'l berish belgisi).",
      ru: "Вы и красная машина на Главной дороге. Желтая машина на второстепенной."
    },
    mainRoadDir: 'horizontal',
    cars: [
      { id: 'blue', color: '#3b82f6', nameKey: 'car_blue', startPos: { x: 120, y: 390 }, angle: 0, target: 'straight', dir: 'east', isPlayer: true },
      { id: 'red', color: '#ef4444', nameKey: 'car_red', startPos: { x: 580, y: 310 }, angle: 180, target: 'straight', dir: 'west' },
      { id: 'yellow', color: '#eab308', nameKey: 'car_yellow', startPos: { x: 390, y: 580 }, angle: -90, target: 'left', dir: 'north' }
    ],
    validGroupOrders: [
      ['blue', 'red'],
      ['yellow']
    ],
    explanation: {
      uz: "1. Asosiy yo'ldagi Ko'k (Siz) va Qizil avtomobillar birinchi o'tadi.\n2. Ikkinchi darajali yo'ldagi Sariq avtomobil har ikkalasiga yo'l berib oxirida o'tadi.",
      ru: "1. Машины на главной дороге (Синяя и Красная) проезжают первыми.\n2. Желтая машина уступает дорогу и едет последней."
    }
  },
  {
    id: 3,
    title: { uz: "Chapga burilishda qarama-qarshi transport", ru: "Поворот налево и встречный транспорт" },
    type: { uz: "Teng chorraha, Chapga burilish", ru: "Равнозначный, поворот налево" },
    yourCar: { uz: "Ko'k Sedan (Chapga burilmoqda)", ru: "Синий Седан (Поворачивает налево)" },
    rule: { uz: "Qarama-qarshi o'tuvchiga yo'l berish", ru: "Уступить встречному при повороте" },
    description: {
      uz: "Siz chapga burilmoqchisiz. Ro'paradan Qizil mashina to'g'riga kelyapti.",
      ru: "Вы поворачиваете налево. Навстречу прямо едет красная машина."
    },
    cars: [
      { id: 'blue', color: '#3b82f6', nameKey: 'car_blue', startPos: { x: 120, y: 390 }, angle: 0, target: 'left', dir: 'east', isPlayer: true },
      { id: 'red', color: '#ef4444', nameKey: 'car_red', startPos: { x: 580, y: 310 }, angle: 180, target: 'straight', dir: 'west' }
    ],
    validGroupOrders: [
      ['red'],
      ['blue']
    ],
    explanation: {
      uz: "Chapga burilayotganda ro'paradan to'g'ri kelayotgan transport vositasiga yo'l berish shart!",
      ru: "При повороте налево необходимо уступить дорогу встречным авто, движущимся прямо!"
    }
  },
  {
    id: 4,
    title: { uz: "Tramvay va Avtomobillar chorrahasi", ru: "Перекресток с Трамваем" },
    type: { uz: "Tramvay yo'li mavjud chorraha", ru: "Перекресток с трамвайными путями" },
    yourCar: { uz: "Ko'k Sedan (To'g'riga harakat)", ru: "Синий Седан (Прямо)" },
    rule: { uz: "Tramvay teng sharoitda har doim afzal", ru: "Преимущество трамвая" },
    description: {
      uz: "Teng sharoitda tramvay harakat yo'nalishidan qat'i nazar avtomobillarga nisbatan ustunlikka ega.",
      ru: "В равных условиях трамвай имеет преимущество независимо от направления движения."
    },
    cars: [
      { id: 'tram', color: '#8b5cf6', nameKey: 'car_tram', startPos: { x: 310, y: 120 }, angle: 90, target: 'straight', dir: 'south', isTram: true },
      { id: 'blue', color: '#3b82f6', nameKey: 'car_blue', startPos: { x: 120, y: 390 }, angle: 0, target: 'straight', dir: 'east', isPlayer: true }
    ],
    validGroupOrders: [
      ['tram'],
      ['blue']
    ],
    explanation: {
      uz: "Teng sharoitda tramvay har doim birinchi o'tadi!",
      ru: "В равных условиях трамвай всегда проезжает первым!"
    }
  }
];

// --- UZBEKISTAN 24PDD.UZ EXAM QUESTION BANK ---
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: {
      uz: "1-Savol: Tartibga solinmagan teng chorrahada o'ng tomondan kelayotgan avtomobilga yo'l berish kerakmi?",
      ru: "Вопрос 1: Нужно ли уступить дорогу автомобилю, приближающемуся справа на равнозначном перекрестке?"
    },
    options: [
      { uz: "A) Ha, har doim yo'l berish shart", ru: "A) Да, всегда обязаны уступить", correct: true },
      { uz: "B) Yo'q, to'g'riga ketayotgan mashina birinchi o'tadi", ru: "B) Нет, едущий прямо проезжает первым", correct: false },
      { uz: "C) Faqat yuk avtomobillariga yo'l beriladi", ru: "C) Уступают только грузовым авто", correct: false }
    ],
    explanation: {
      uz: "O'zR YHQ 16-bandiga ko'ra, tartibga solinmagan teng chorrahada haydovchi o'ng tomondan yaqinlashayotgan barcha transport vositalariga yo'l berishi shart ('O'ng tomondagi to'siq' qoidasi).",
      ru: "Согласно ПДД РУз, на нерегулируемом равнозначном перекрестке водитель обязан уступить дорогу авто, приближающимся справа."
    }
  },
  {
    id: 2,
    question: {
      uz: "2-Savol: Svetoforning yashil chirog'ida chapga burilayotganda ro'paradan to'g'ri kelayotgan mashinaga yo'l beriladimi?",
      ru: "Вопрос 2: Уступаете ли вы дорогу встречному авто при повороте налево на зеленый сигнал светофора?"
    },
    options: [
      { uz: "A) Ha, yo'l berish shart", ru: "A) Да, обязаны уступить", correct: true },
      { uz: "B) Yo'q, yashil chiroq birinchi o'tish huquqini beradi", ru: "B) Нет, зеленый дает право проехать первым", correct: false },
      { uz: "C) Signal berib birinchi o'tib ketiladi", ru: "C) Подать сигнал и проехать первым", correct: false }
    ],
    explanation: {
      uz: "O'zR YHQ 15-bandiga ko'ra, svetoforning yashil chirog'ida chapga burilayotgan haydovchi ro'paradan to'g'ri yoki o'ngga harakatlanayotgan avtomobilga yo'l berishi shart.",
      ru: "При повороте налево на зеленый сигнал светофора вы обязаны уступить дорогу встречным транспортным средствам."
    }
  },
  {
    id: 3,
    question: {
      uz: "3-Savol: 2.1 'Asosiy yo'l' belgisi bor chorrahada ikkinchi darajali yo'ldan chiqayotgan mashinaga yo'l beriladimi?",
      ru: "Вопрос 3: Уступают ли дорогу авто на второстепенной дороге, если установлен знак 2.1 'Главная дорога'?"
    },
    options: [
      { uz: "A) Yo'q, asosiy yo'ldagi avtomobil ustunlikka ega", ru: "A) Нет, главная дорога имеет преимущество", correct: true },
      { uz: "B) Ha, har doim yo'l beriladi", ru: "B) Да, всегда уступают", correct: false },
      { uz: "C) Qaysi mashina tezroq bo'lsa u o'tadi", ru: "C) Проезжает тот, кто быстрее", correct: false }
    ],
    explanation: {
      uz: "2.1 Asosiy yo'l belgisi o'rnatilgan yo'ldagi transport vositasi ikkinchi darajali yo'ldan chiqayotganlarga nisbatan imtiyozga ega.",
      ru: "Знак 2.1 'Главная дорога' предоставляет право первоочередного проезда нерегулируемого перекрестка."
    }
  },
  {
    id: 4,
    question: {
      uz: "4-Savol: Maxsus ko'k/qizil chiroq va sirena yoqilgan Tez Yordam va IIB avtomobillariga yo'l beriladimi?",
      ru: "Вопрос 4: Обязаны ли уступить дорогу Скорой помощи с включенным маячком и сиреной?"
    },
    options: [
      { uz: "A) Ha, har qanday holatda yo'l berilishi shart", ru: "A) Да, обязаны уступить в любом случае", correct: true },
      { uz: "B) Faqat u asosiy yo'lda bo'lsa yo'l beriladi", ru: "B) Только если она на главной дороге", correct: false },
      { uz: "C) Yo'l berish shart emas", ru: "C) Уступать не обязательно", correct: false }
    ],
    explanation: {
      uz: "O'zR YHQ 6-bandiga ko'ra, maxsus chiroq va sirena yoqqan operativ xizmatlarga yo'lning qayerida va qaysi yo'nalishda bo'lishidan qat'i nazar yo'l berish shart.",
      ru: "При приближении транспортного средства с включенным синим маячком и звуковым сигналом водители обязаны уступить дорогу."
    }
  },
  {
    id: 5,
    question: {
      uz: "5-Savol: Teng sharoitda tramvay va engil avtomobil to'qnash kelganda qaysi birinchi o'tadi?",
      ru: "Вопрос 5: Кто имеет преимущество в равных условиях: трамвай или легковой автомобиль?"
    },
    options: [
      { uz: "A) Tramvay har doim ustunlikka ega", ru: "A) Трамвай всегда имеет преимущество", correct: true },
      { uz: "B) Engil avtomobil ustunlikka ega", ru: "B) Легковой автомобиль", correct: false },
      { uz: "C) O'ng tomondan kelgani o'tadi", ru: "C) Тот, кто приближается справа", correct: false }
    ],
    explanation: {
      uz: "O'zR YHQ 16-bandiga ko'ra, teng sharoitda tramvay harakat yo'nalishidan qat'i nazar engil va yuk avtomobillariga nisbatan ustunlikka ega.",
      ru: "В равных условиях трамвай имеет преимущество перед безрельсовыми транспортными средствами."
    }
  }
];

// --- APP STATE ---
let currentScenarioIdx = 0;
let currentQuizIdx = 0;
let quizCorrectCount = 0;
let quizIncorrectCount = 0;
let selectedSequence = [];
let isAnimating = false;
let userScore = 0;
let userStreak = 0;

// --- RENDERER ENGINE FOR SIMULATOR ---
class IntersectionRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cars = [];
    this.scenario = null;
    this.animating = false;
    this.blinkTimer = 0;
    this.crashParticles = [];
    this.isCrashed = false;
    this.crashPoint = { x: 350, y: 350 };

    this.renderLoop();
  }

  loadScenario(scenario) {
    this.scenario = scenario;
    this.isCrashed = false;
    this.crashParticles = [];
    this.cars = scenario.cars.map(c => ({
      ...c,
      currentPos: { ...c.startPos },
      currentAngle: c.angle,
      passed: false,
      collided: false
    }));
    this.draw();
  }

  renderLoop() {
    this.blinkTimer += 0.05;
    if (this.isCrashed) {
      this.updateParticles();
    }
    this.draw();
    requestAnimationFrame(() => this.renderLoop());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.drawRoads();
    this.drawRoadSigns();
    this.drawCars();

    if (this.isCrashed) {
      this.drawCrashExplosion();
    }
  }

  drawBackground() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawRoads() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const rw = 160;

    this.ctx.fillStyle = '#475569';
    this.ctx.fillRect(0, cy - rw/2 - 6, this.width, rw + 12);
    this.ctx.fillRect(cx - rw/2 - 6, 0, rw + 12, this.height);

    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(0, cy - rw/2, this.width, rw);
    this.ctx.fillRect(cx - rw/2, 0, rw, this.height);

    this.ctx.strokeStyle = '#facc15';
    this.ctx.lineWidth = 3;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, cy);
    this.ctx.lineTo(cx - rw/2, cy);
    this.ctx.moveTo(cx + rw/2, cy);
    this.ctx.lineTo(this.width, cy);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx, 0);
    this.ctx.lineTo(cx, cy - rw/2);
    this.ctx.moveTo(cx, cy + rw/2);
    this.ctx.lineTo(cx, this.height);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 6;

    this.ctx.beginPath();
    this.ctx.moveTo(cx - rw/2 - 10, cy);
    this.ctx.lineTo(cx - rw/2 - 10, cy + rw/2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx + rw/2 + 10, cy - rw/2);
    this.ctx.lineTo(cx + rw/2 + 10, cy);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy + rw/2 + 10);
    this.ctx.lineTo(cx + rw/2, cy + rw/2 + 10);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(cx - rw/2, cy - rw/2 - 10);
    this.ctx.lineTo(cx, cy - rw/2 - 10);
    this.ctx.stroke();

    this.drawZebra(cx - rw/2 - 40, cy - rw/2, 24, rw, true);
    this.drawZebra(cx + rw/2 + 16, cy - rw/2, 24, rw, true);
    this.drawZebra(cx - rw/2, cy - rw/2 - 40, rw, 24, false);
    this.drawZebra(cx - rw/2, cy + rw/2 + 16, rw, 24, false);
  }

  drawZebra(x, y, w, h, isVertical) {
    this.ctx.fillStyle = '#ffffff';
    const stripeCount = 6;
    if (isVertical) {
      const step = h / stripeCount;
      for (let i = 0; i < stripeCount; i += 2) {
        this.ctx.fillRect(x, y + i * step, w, step);
      }
    } else {
      const step = w / stripeCount;
      for (let i = 0; i < stripeCount; i += 2) {
        this.ctx.fillRect(x + i * step, y, step, h);
      }
    }
  }

  drawRoadSigns() {
    if (!this.scenario) return;
    if (this.scenario.mainRoadDir === 'horizontal') {
      this.drawMainRoadSign(210, 450);
      this.drawMainRoadSign(490, 250);
      this.drawYieldSign(450, 490);
    }
  }

  drawMainRoadSign(x, y) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 18, 0, Math.PI*2);
    this.ctx.fill();

    this.ctx.rotate(45 * Math.PI / 180);
    this.ctx.fillStyle = '#facc15';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    this.ctx.fillRect(-14, -14, 28, 28);
    this.ctx.strokeRect(-14, -14, 28, 28);

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-10, -10, 20, 20);

    this.ctx.restore();
  }

  drawYieldSign(x, y) {
    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.beginPath();
    this.ctx.moveTo(-16, -14);
    this.ctx.lineTo(16, -14);
    this.ctx.lineTo(0, 16);
    this.ctx.closePath();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawCars() {
    this.cars.forEach(car => {
      if (!car.passed) {
        this.drawSingleCar(car);
      }
    });
  }

  drawSingleCar(car) {
    this.ctx.save();
    this.ctx.translate(car.currentPos.x, car.currentPos.y);
    this.ctx.rotate((car.currentAngle * Math.PI) / 180);

    const isSelected = selectedSequence.includes(car.id);
    const orderNum = selectedSequence.indexOf(car.id) + 1;
    const isBlinking = Math.floor(this.blinkTimer * 10) % 2 === 0;

    this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
    this.ctx.fillRect(-22, -14, 50, 28);

    this.ctx.fillStyle = car.collided ? '#475569' : car.color;
    this.ctx.beginPath();
    this.ctx.roundRect(-20, -14, 46, 28, 6);
    this.ctx.fill();

    if (isSelected && !car.collided) {
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }

    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.roundRect(-8, -10, 24, 20, 4);
    this.ctx.fill();

    this.ctx.fillStyle = '#fef08a';
    this.ctx.fillRect(24, -12, 4, 6);
    this.ctx.fillRect(24, 6, 4, 6);

    this.ctx.fillStyle = '#dc2626';
    this.ctx.fillRect(-22, -12, 3, 6);
    this.ctx.fillRect(-22, 6, 3, 6);

    if (car.target === 'left' && isBlinking && !car.collided) {
      this.ctx.fillStyle = '#f97316';
      this.ctx.beginPath();
      this.ctx.arc(24, -12, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (isSelected && !car.collided) {
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#000000';
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(orderNum.toString(), 0, 1);
    }

    this.ctx.restore();

    if (!car.collided) {
      this.drawCarDirectionBadge(car);
    }
  }

  drawCarDirectionBadge(car) {
    this.ctx.save();
    const bx = car.currentPos.x;
    const by = car.currentPos.y - 35;

    let icon = '⬆️';
    if (car.target === 'left') icon = '↖️';
    if (car.target === 'right') icon = '↗️';

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.beginPath();
    this.ctx.roundRect(bx - 16, by - 12, 32, 24, 12);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    this.ctx.stroke();

    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(icon, bx, by);

    this.ctx.restore();
  }

  spawnCrashParticles(cx, cy) {
    this.isCrashed = true;
    this.crashPoint = { x: cx, y: cy };
    this.crashParticles = [];
    for (let i = 0; i < 40; i++) {
      this.crashParticles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 8 + 4,
        color: ['#ef4444', '#f97316', '#facc15', '#64748b'][Math.floor(Math.random() * 4)],
        life: 1.0
      });
    }
  }

  updateParticles() {
    this.crashParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
    });
  }

  drawCrashExplosion() {
    this.crashParticles.forEach(p => {
      if (p.life > 0) {
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.life;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    this.ctx.globalAlpha = 1.0;

    this.ctx.font = '48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('💥', this.crashPoint.x, this.crashPoint.y);
  }

  handleClick(e) {
    if (isAnimating || this.isCrashed) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    this.cars.forEach(car => {
      const dist = Math.hypot(car.currentPos.x - clickX, car.currentPos.y - clickY);
      if (dist < 45) {
        toggleCarSelection(car.id);
        sounds.playClick();
      }
    });
  }

  // STRICT SEQUENTIAL STEP-BY-STEP DRIVE ANIMATION ENGINE
  animateCarsInOrder(selectedOrder, isCorrect, onComplete) {
    this.animating = true;
    isAnimating = true;

    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= selectedOrder.length) {
        this.animating = false;
        isAnimating = false;
        if (onComplete) onComplete();
        return;
      }

      const currentCarId = selectedOrder[stepIndex];
      const car = this.cars.find(c => c.id === currentCarId);

      if (!car) {
        stepIndex++;
        runStep();
        return;
      }

      const isStepValid = checkStepValidity(selectedOrder, stepIndex);

      if (isStepValid) {
        let progress = 0;
        const startPos = { ...car.currentPos };

        const driveAnim = () => {
          progress += 0.04;
          if (progress >= 1) {
            car.passed = true;
            stepIndex++;
            runStep();
          } else {
            const dist = 380 * progress;
            if (car.dir === 'east') car.currentPos.x = startPos.x + dist;
            if (car.dir === 'west') car.currentPos.x = startPos.x - dist;
            if (car.dir === 'north') car.currentPos.y = startPos.y - dist;
            if (car.dir === 'south') car.currentPos.y = startPos.y + dist;

            this.draw();
            requestAnimationFrame(driveAnim);
          }
        };
        requestAnimationFrame(driveAnim);
      } else {
        let progress = 0;
        const startPos = { ...car.currentPos };

        const crashX = (car.dir === 'east' || car.dir === 'west') ? 350 : car.startPos.x;
        const crashY = (car.dir === 'north' || car.dir === 'south') ? 350 : car.startPos.y;

        const crashAnim = () => {
          progress += 0.035;
          car.currentPos.x = startPos.x + (crashX - startPos.x) * progress;
          car.currentPos.y = startPos.y + (crashY - startPos.y) * progress;

          if (progress >= 1) {
            car.collided = true;
            this.animating = false;
            isAnimating = false;

            sounds.playCrash();
            this.spawnCrashParticles(crashX, crashY);

            const container = document.getElementById('canvas-container');
            container.classList.add('shake');
            setTimeout(() => container.classList.remove('shake'), 500);

            document.getElementById('crash-banner').classList.remove('hidden');

            if (onComplete) onComplete();
          } else {
            this.draw();
            requestAnimationFrame(crashAnim);
          }
        };
        requestAnimationFrame(crashAnim);
      }
    };

    runStep();
  }
}

let renderer = null;

// --- QUIZ ENGINE & RESULTS STATS ---
function resetQuizExam() {
  currentQuizIdx = 0;
  quizCorrectCount = 0;
  quizIncorrectCount = 0;

  document.getElementById('quiz-question-view').classList.remove('hidden');
  document.getElementById('quiz-result-view').classList.add('hidden');

  renderQuizQuestion(0);
}

function renderQuizQuestion(idx) {
  currentQuizIdx = idx;
  const q = QUIZ_QUESTIONS[idx];

  document.getElementById('quiz-q-num').innerText = idx + 1;
  document.getElementById('quiz-q-total').innerText = QUIZ_QUESTIONS.length;
  document.getElementById('quiz-progress-fill').style.width = `${((idx + 1) / QUIZ_QUESTIONS.length) * 100}%`;
  document.getElementById('quiz-question-text').innerText = q.question[currentLang];

  document.getElementById('quiz-explanation-box').classList.add('hidden');

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt[currentLang];
    btn.addEventListener('click', () => handleQuizAnswer(btn, opt.correct, q.explanation[currentLang]));
    optionsContainer.appendChild(btn);
  });

  drawQuizIllustration(idx);
}

function drawQuizIllustration(qIdx) {
  const canvas = document.getElementById('quizCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 135, canvas.width, 80);
  ctx.fillRect(210, 0, 80, canvas.height);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 175); ctx.lineTo(canvas.width, 175);
  ctx.moveTo(250, 0); ctx.lineTo(250, canvas.height);
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(260, 40, 30, 20);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(100, 185, 30, 20);
}

function handleQuizAnswer(selectedBtn, isCorrect, expText) {
  sounds.playClick();
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect) {
    sounds.playVictory();
    selectedBtn.classList.add('correct');
    quizCorrectCount++;
    userScore += 50;
    updateUserStats();
  } else {
    sounds.playCrash();
    selectedBtn.classList.add('incorrect');
    quizIncorrectCount++;
  }

  document.getElementById('quiz-explanation-text').innerText = expText;
  document.getElementById('quiz-explanation-box').classList.remove('hidden');

  const nextBtn = document.getElementById('quiz-next-btn');
  if (currentQuizIdx === QUIZ_QUESTIONS.length - 1) {
    nextBtn.innerText = "🏆 Natijalarni ko'rish ➔";
  } else {
    nextBtn.innerText = I18N[currentLang].next_question;
  }
}

function showQuizSummaryResults() {
  document.getElementById('quiz-question-view').classList.add('hidden');
  document.getElementById('quiz-result-view').classList.remove('hidden');

  const total = QUIZ_QUESTIONS.length;
  const accuracyPct = Math.round((quizCorrectCount / total) * 100);

  document.getElementById('quiz-correct-count').innerText = quizCorrectCount;
  document.getElementById('quiz-incorrect-count').innerText = quizIncorrectCount;
  document.getElementById('quiz-accuracy-pct').innerText = `${accuracyPct}%`;

  const iconEl = document.getElementById('quiz-result-icon');
  const titleEl = document.getElementById('quiz-result-title');
  const statusEl = document.getElementById('quiz-result-status');

  if (accuracyPct >= 80) {
    sounds.playVictory();
    iconEl.innerText = "🏆";
    titleEl.innerText = "IMTIHONDAN O'TDINGIZ!";
    titleEl.style.color = "#34d399";
    statusEl.innerText = `Tabriklaymiz! Siz ${total} ta savoldan ${quizCorrectCount} ta to'g'ri topib imtihondan o'tdingiz.`;
  } else {
    sounds.playCrash();
    iconEl.innerText = "⚠️";
    titleEl.innerText = "IMTIHONDAN O'TMADINGIZ!";
    titleEl.style.color = "#fca5a5";
    statusEl.innerText = `Siz ${total} ta savoldan ${quizIncorrectCount} ta xato qildingiz. O'tish bali: 80% (${quizCorrectCount}/${total}).`;
  }
}

// --- GAME CONTROLLER ---
function initApp() {
  renderer = new IntersectionRenderer('roadCanvas');
  renderer.canvas.addEventListener('click', (e) => renderer.handleClick(e));

  setupEventListeners();
  loadScenario(0);
  resetQuizExam();
  updateI18n();
}

function loadScenario(idx) {
  currentScenarioIdx = idx;
  selectedSequence = [];
  const sc = SCENARIOS[idx];

  renderer.loadScenario(sc);

  document.getElementById('sim-level-num').innerText = sc.id;
  document.getElementById('sim-scenario-title').innerText = sc.title[currentLang];
  document.getElementById('scenario-description').innerText = sc.description[currentLang];
  document.getElementById('detail-type').innerText = sc.type[currentLang];
  document.getElementById('detail-your-car').innerText = sc.yourCar[currentLang];
  document.getElementById('detail-rule').innerText = sc.rule[currentLang];

  // Hide modal overlays
  document.getElementById('sim-modal-overlay').classList.add('hidden');
  document.getElementById('crash-banner').classList.add('hidden');

  updateSequenceUI();
}

function toggleCarSelection(carId) {
  const idx = selectedSequence.indexOf(carId);
  if (idx > -1) {
    selectedSequence.splice(idx, 1);
  } else {
    selectedSequence.push(carId);
  }

  updateSequenceUI();
  renderer.draw();
}

function updateSequenceUI() {
  const container = document.getElementById('selected-sequence');
  const submitBtn = document.getElementById('submit-order-btn');

  if (selectedSequence.length === 0) {
    container.innerHTML = `<span class="placeholder-tag">${I18N[currentLang].seq_placeholder}</span>`;
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
  } else {
    container.innerHTML = selectedSequence.map((id, index) => {
      const nameKey = renderer.cars.find(c => c.id === id)?.nameKey || id;
      const carName = I18N[currentLang][nameKey] || id;
      return `<span class="car-tag ${id}" onclick="toggleCarSelection('${id}')">${index + 1}. ${carName} ✖</span>`;
    }).join('');

    const sc = SCENARIOS[currentScenarioIdx];
    if (selectedSequence.length === sc.cars.length) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('disabled');
    }
  }
}

function checkStepValidity(selectedOrder, stepIdx) {
  const sc = SCENARIOS[currentScenarioIdx];
  const carId = selectedOrder[stepIdx];
  const validGroups = sc.validGroupOrders;

  let count = 0;
  for (let g = 0; g < validGroups.length; g++) {
    const group = validGroups[g];
    if (stepIdx >= count && stepIdx < count + group.length) {
      return group.includes(carId);
    }
    count += group.length;
  }
  return false;
}

function checkFullOrderCorrectness(selectedOrder) {
  for (let i = 0; i < selectedOrder.length; i++) {
    if (!checkStepValidity(selectedOrder, i)) {
      return false;
    }
  }
  return true;
}

function submitOrder() {
  const sc = SCENARIOS[currentScenarioIdx];
  const isCorrect = checkFullOrderCorrectness(selectedSequence);

  const modalOverlay = document.getElementById('sim-modal-overlay');
  const badge = document.getElementById('modal-result-badge');
  const icon = document.getElementById('modal-result-icon');
  const title = document.getElementById('modal-result-title');
  const text = document.getElementById('modal-result-explanation');

  const showModal = () => {
    modalOverlay.classList.remove('hidden');
    if (isCorrect) {
      sounds.playVictory();
      badge.className = 'result-badge success';
      icon.innerText = '✅';
      title.innerText = I18N[currentLang].correct_title;
      text.innerText = sc.explanation[currentLang];

      document.getElementById('modal-retry-btn').classList.add('hidden');
      document.getElementById('modal-next-btn').classList.remove('hidden');
    } else {
      badge.className = 'result-badge error';
      icon.innerText = '💥';
      title.innerText = I18N[currentLang].error_title;
      text.innerText = sc.explanation[currentLang];

      document.getElementById('modal-retry-btn').classList.remove('hidden');
      document.getElementById('modal-next-btn').classList.remove('hidden');
    }
  };

  if (isCorrect) {
    userScore += 100;
    userStreak += 1;
    updateUserStats();
    renderer.animateCarsInOrder(selectedSequence, true, showModal);
  } else {
    userStreak = 0;
    updateUserStats();
    renderer.animateCarsInOrder(selectedSequence, false, showModal);
  }
}

function updateUserStats() {
  document.getElementById('user-score').innerText = userScore;
  document.getElementById('user-streak').innerText = userStreak;
}

function setupEventListeners() {
  document.getElementById('reset-sim-btn').addEventListener('click', () => {
    loadScenario(currentScenarioIdx);
  });

  // Modal Action Buttons (Center Canvas Overlay)
  document.getElementById('modal-retry-btn').addEventListener('click', () => {
    loadScenario(currentScenarioIdx);
  });

  document.getElementById('modal-next-btn').addEventListener('click', () => {
    const nextIdx = (currentScenarioIdx + 1) % SCENARIOS.length;
    loadScenario(nextIdx);
  });

  document.getElementById('submit-order-btn').addEventListener('click', () => {
    if (!isAnimating && selectedSequence.length > 0) {
      submitOrder();
    }
  });

  document.getElementById('quiz-next-btn').addEventListener('click', () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      renderQuizQuestion(currentQuizIdx + 1);
    } else {
      showQuizSummaryResults();
    }
  });

  document.getElementById('quiz-restart-btn').addEventListener('click', () => {
    resetQuizExam();
  });

  document.getElementById('lang-btn').addEventListener('click', () => {
    currentLang = currentLang === 'uz' ? 'ru' : 'uz';
    document.getElementById('current-lang').innerText = currentLang.toUpperCase();
    updateI18n();
    loadScenario(currentScenarioIdx);
    if (!document.getElementById('quiz-question-view').classList.contains('hidden')) {
      renderQuizQuestion(currentQuizIdx);
    }
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

      const targetTab = btn.getAttribute('data-tab');
      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

function updateI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[currentLang][key]) {
      el.innerText = I18N[currentLang][key];
    }
  });
}

window.addEventListener('DOMContentLoaded', initApp);
