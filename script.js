/* ============================================================
   Alpha TRADING BOT — Premium Script
   ============================================================ */

/* ---- State ---- */
const state = {
  selectedPlatform: 'QUOTEX',
  selectedPlatformImg: 'qu.png',
  selectedTime: 5,             // seconds
  signalCount: 0,
  winCount: 0,
  history: [],
  timerInterval: null,
  timerTotal: 0,
  analyzing: false,
};

/* ============================================================
   PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COLORS = ['rgba(245,197,24,0.55)', 'rgba(255,216,77,0.35)', 'rgba(255,255,255,0.15)'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 1.6 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
    this.life  = 0;
    this.maxLife = Math.random() * 240 + 120;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const COUNT = Math.min(110, Math.floor((canvas.width * canvas.height) / 9000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================================
   BACKGROUND VIDEO
   ============================================================ */
const bgVideo = document.getElementById('bgVideo');
if (bgVideo) bgVideo.playbackRate = 0.6;

/* ============================================================
   LIVE CLOCK
   ============================================================ */
function updateClock() {
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  const el = document.getElementById('liveClock');
  if (el) el.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ============================================================
   TICKER TAPE
   ============================================================ */
(function initTicker() {
  const pairs = [
    'EUR/USD ▲ 0.42%', 'GBP/USD ▼ 0.18%', 'USD/JPY ▲ 0.31%',
    'AUD/USD ▼ 0.22%', 'USD/CAD ▲ 0.15%', 'NZD/USD ▲ 0.09%',
    'USD/CHF ▼ 0.33%', 'GOLD ▲ 1.14%', 'BTC/USD ▲ 2.87%',
    'ETH/USD ▲ 1.55%', 'OIL ▼ 0.77%', 'S&P500 ▲ 0.44%',
    'NASDAQ ▲ 0.61%', 'USD/PKR ▼ 0.12%', 'USD/INR ▲ 0.05%',
  ];
  const el = document.getElementById('tickerContent');
  if (!el) return;
  const content = pairs.map((p, i) => {
    const dir   = p.includes('▲') ? 'color:#00e676' : 'color:#ff4444';
    const parts = p.split(' ');
    const pct   = parts.pop();
    const name  = parts.join(' ');
    return `<span style="margin:0 28px;opacity:0.85">${name} <strong style="${dir}">${pct}</strong></span>`;
  }).join('');
  el.innerHTML = content + content; // duplicate for seamless loop
})();

/* ============================================================
   LOGIN SYSTEM
   ============================================================ */
const CREDENTIALS = { username: 'Alpha', password: '1234' };

function togglePassword() {
  const input = document.getElementById('passwordInput');
  const toggle = document.getElementById('togglePw');
  if (input.type === 'password') {
    input.type = 'text';
    toggle.textContent = '🙈';
  } else {
    input.type = 'password';
    toggle.textContent = '👁';
  }
}

function doLogin() {
  const uInput  = document.getElementById('usernameInput').value.trim();
  const pInput  = document.getElementById('passwordInput').value.trim();
  const errEl   = document.getElementById('loginError');
  const btn     = document.getElementById('loginBtn');
  const btnText = document.getElementById('loginBtnText');
  const spinner = document.getElementById('loginSpinner');

  errEl.textContent = '';

  if (!uInput || !pInput) {
    errEl.textContent = '⚠ Please enter both username and password.';
    shakeElement(document.getElementById('loginInputGroup'));
    return;
  }

  /* Show loading state */
  btn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'block';

  /* Simulate auth delay for UX trust */
  setTimeout(() => {
    if (
      uInput.toLowerCase() === CREDENTIALS.username.toLowerCase().trim() &&
      pInput === CREDENTIALS.password.toString().trim()
    ) {
      showToast('✅ Access granted! Welcome to Alpha Bot.');
      setTimeout(() => {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'flex';
      }, 700);
    } else {
      btn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
      errEl.textContent = '❌ Invalid credentials. Try again.';
      shakeElement(document.getElementById('loginInputGroup'));
      document.getElementById('passwordInput').value = '';
    }
  }, 1400);
}

/* Allow pressing Enter to login */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.getElementById('loginScreen').style.display !== 'none' ||
        !document.getElementById('loginScreen').style.display) {
      doLogin();
    }
  }
});

function doLogout() {
  document.getElementById('mainDashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display   = 'flex';
  document.getElementById('usernameInput').value = '';
  document.getElementById('passwordInput').value = '';
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginBtn').disabled = false;
  document.getElementById('loginBtnText').style.display = 'block';
  document.getElementById('loginSpinner').style.display = 'none';
  showToast('👋 Logged out successfully.');
}

/* ============================================================
   PLATFORM DROPDOWN
   ============================================================ */
function toggleDropdown() {
  const list  = document.getElementById('platformList');
  const arrow = document.getElementById('dropArrow');
  const isOpen = list.classList.toggle('show');
  arrow.classList.toggle('open', isOpen);
}

function selectPlatform(el) {
  const val  = el.getAttribute('data-value');
  const img  = el.getAttribute('data-img');
  const text = el.querySelector('span').textContent;

  document.getElementById('platformIcon').src = img;
  document.getElementById('platformText').textContent = text;
  document.getElementById('platformList').classList.remove('show');
  document.getElementById('dropArrow').classList.remove('open');

  state.selectedPlatform    = text;
  state.selectedPlatformImg = img;
}

/* Close dropdown when clicking outside */
document.addEventListener('click', e => {
  const dd = document.getElementById('platformDropdown');
  if (dd && !dd.contains(e.target)) {
    document.getElementById('platformList').classList.remove('show');
    const arrow = document.getElementById('dropArrow');
    if (arrow) arrow.classList.remove('open');
  }
});

/* ============================================================
   TIME PILL SELECTOR
   ============================================================ */
function selectTime(el) {
  document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  state.selectedTime = parseInt(el.getAttribute('data-val'));
}

/* ============================================================
   SIGNAL GENERATION
   ============================================================ */
const analyzeMessages = [
  'Scanning market data...',
  'Analyzing RSI patterns...',
  'Processing volume signals...',
  'Checking support & resistance...',
  'Running AI prediction model...',
  'Calculating entry point...',
  'Finalizing signal...',
];

function getSignal() {
  if (state.analyzing) return;
  state.analyzing = true;

  const btn      = document.getElementById('getSignal');
  const btnText  = document.getElementById('signalBtnText');
  btn.disabled   = true;
  btnText.textContent = 'ANALYZING...';

  /* Show analyzing state */
  showSection('signalAnalyzing');

  const totalDuration = Math.floor(Math.random() * 3000) + 2500; // 2.5–5.5s
  const pctEl    = document.getElementById('analyzePercent');
  const textEl   = document.getElementById('analyzeText');
  const barEl    = document.getElementById('progressBar');
  const ringEl   = document.querySelector('.analyzing-ring');

  let pct = 0;
  let msgIdx = 0;
  const pctInterval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 4 + 1, 99);
    pctEl.textContent = Math.floor(pct) + '%';
    barEl.style.width = pct + '%';

    // Cycle messages
    const newMsgIdx = Math.floor((pct / 100) * analyzeMessages.length);
    if (newMsgIdx !== msgIdx && newMsgIdx < analyzeMessages.length) {
      msgIdx = newMsgIdx;
      textEl.textContent = analyzeMessages[msgIdx];
    }

    // Spin ring via conic gradient
    if (ringEl) {
      ringEl.style.background =
        `conic-gradient(#f5c518 ${pct * 3.6}deg, rgba(245,197,24,0.08) ${pct * 3.6}deg)`;
    }
  }, 100);

  setTimeout(() => {
    clearInterval(pctInterval);
    pctEl.textContent = '100%';
    barEl.style.width = '100%';
    if (ringEl) ringEl.style.background = `conic-gradient(#f5c518 360deg, transparent 360deg)`;

    setTimeout(() => {
      generateResult(btn, btnText);
    }, 350);
  }, totalDuration);
}

function generateResult(btn, btnText) {
  /* Generate signal */
  const signal     = Math.random() < 0.52 ? 'BUY' : 'SELL';
  const confidence = Math.floor(Math.random() * 18) + 78; // 78–95%
  const pair       = document.getElementById('currencySelect').value;
  const platform   = state.selectedPlatform;
  const timeLabel  = formatTime(state.selectedTime);
  const timestamp  = new Date().toLocaleTimeString();

  /* Update Stats */
  state.signalCount++;
  if (signal === 'BUY' && Math.random() > 0.25) state.winCount++;
  else if (signal === 'SELL' && Math.random() > 0.25) state.winCount++;
  updateStats();

  /* Show result */
  showSection('signalResult');

  const dirEl  = document.getElementById('resultDirection');
  dirEl.textContent  = (signal === 'BUY' ? '▲ BUY' : '▼ SELL');
  dirEl.className    = 'result-direction ' + signal.toLowerCase();

  document.getElementById('resultPair').textContent     = pair;
  document.getElementById('resultPlatform').textContent = platform;
  document.getElementById('resultTime').textContent     = timeLabel;

  /* Animate confidence bar */
  setTimeout(() => {
    document.getElementById('confidenceBar').style.width = confidence + '%';
    document.getElementById('confidencePct').textContent = confidence + '%';
  }, 100);

  /* Add to history */
  addHistoryItem(signal, pair, platform, timeLabel, confidence, timestamp);

  /* Toast */
  const emoji = signal === 'BUY' ? '📈' : '📉';
  showToast(`${emoji} Signal: ${signal} — ${confidence}% confidence`);

  /* Start countdown timer */
  startTimer(state.selectedTime, btn, btnText);
}

function formatTime(secs) {
  if (secs < 60) return secs + 's';
  return (secs / 60) + 'm';
}

/* ============================================================
   COUNTDOWN TIMER (Circular SVG)
   ============================================================ */
function startTimer(totalSecs, btn, btnText) {
  const timerDisplay = document.getElementById('timerDisplay');
  const timerNum     = document.getElementById('timerNum');
  const timerCircle  = document.getElementById('timerCircle');
  const CIRCUMFERENCE = 213.6;

  timerDisplay.style.display = 'flex';

  let remaining = totalSecs;
  timerNum.textContent = remaining + 's';
  timerCircle.style.strokeDashoffset = '0';

  state.timerTotal = totalSecs;

  if (state.timerInterval) clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {
    remaining--;
    timerNum.textContent = remaining + 's';
    const progress = 1 - (remaining / totalSecs);
    timerCircle.style.strokeDashoffset = (CIRCUMFERENCE * progress).toString();

    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      timerDisplay.style.display = 'none';
      showSection('signalIdle');
      btn.disabled = false;
      btn.textContent = '';
      const icon = document.createElement('span');
      icon.className = 'signal-btn-icon';
      icon.textContent = '⚡';
      btn.appendChild(icon);
      const txt = document.createElement('span');
      txt.id = 'signalBtnText';
      txt.textContent = 'GENERATE SIGNAL';
      btn.appendChild(txt);
      state.analyzing = false;
    }
  }, 1000);
}

/* ============================================================
   SHOW SECTION HELPER
   ============================================================ */
function showSection(sectionId) {
  ['signalIdle', 'signalAnalyzing', 'signalResult'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'flex';
}

/* ============================================================
   SIGNAL HISTORY
   ============================================================ */
function addHistoryItem(signal, pair, platform, time, confidence, timestamp) {
  state.history.unshift({ signal, pair, platform, time, confidence, timestamp });

  const listEl = document.getElementById('historyList');
  const emptyEl = listEl.querySelector('.history-empty');
  if (emptyEl) emptyEl.remove();

  const item = document.createElement('div');
  item.className = 'history-item';
  item.innerHTML = `
    <div class="hist-signal ${signal.toLowerCase()}">${signal === 'BUY' ? '▲' : '▼'} ${signal}</div>
    <div class="hist-info">
      <div class="hist-pair">${pair}</div>
      <div class="hist-meta">${platform} • ${time} • ${timestamp}</div>
    </div>
    <div class="hist-conf">${confidence}%</div>
  `;
  listEl.insertBefore(item, listEl.firstChild);

  /* Keep max 15 history items */
  const items = listEl.querySelectorAll('.history-item');
  if (items.length > 15) {
    listEl.removeChild(listEl.lastChild);
  }
}

function clearHistory() {
  const listEl = document.getElementById('historyList');
  listEl.innerHTML = '<div class="history-empty">No signals yet. Generate your first signal!</div>';
  state.history = [];
  showToast('🗑 Signal history cleared.');
}

/* ============================================================
   STATS UPDATE
   ============================================================ */
function updateStats() {
  document.getElementById('signalCount').textContent = state.signalCount;
  document.getElementById('winCount').textContent    = state.winCount;
  const rate = state.signalCount > 0
    ? Math.round((state.winCount / state.signalCount) * 100) + '%'
    : '—';
  document.getElementById('winRate').textContent = rate;
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ============================================================
   SHAKE ANIMATION (input error feedback)
   ============================================================ */
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
  setTimeout(() => { el.style.animation = ''; }, 500);
}

/* Inject shake keyframes dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    10%, 90% { transform: translateX(-3px); }
    20%, 80% { transform: translateX(4px); }
    30%, 50%, 70% { transform: translateX(-6px); }
    40%, 60% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);
