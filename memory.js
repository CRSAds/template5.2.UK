console.log("memory.js loaded!");

const iconSets = {
  summer: [
    'beach-umbrella.png', 'beach-umbrella.png',
    'flamingo.png', 'flamingo.png',
    'flip-flops.png', 'flip-flops.png',
    'ice-cream.png', 'ice-cream.png',
    'shirt.png', 'shirt.png',
    'sun.png', 'sun.png'
  ],
  fruits: [
    'grapes.png', 'grapes.png',
    'berries.png', 'berries.png',
    'watermelon.png', 'watermelon.png',
    'coconut.png', 'coconut.png',
    'bananas.png', 'bananas.png',
    'orange.png', 'orange.png'
  ],
  beauty: [
    'face-mask.png', 'face-mask.png',
    'cream.png', 'cream.png',
    'perfume.png', 'perfume.png',
    'brush.png', 'brush.png',
    'makeup.png', 'makeup.png',
    'mouth.png', 'mouth.png'
  ],
  pretpark: [
    'rollercoaster.png', 'rollercoaster.png',
    'amusement-park.png', 'amusement-park.png',
    'tent.png', 'tent.png',
    'bumper-car.png', 'bumper-car.png',
    'pirate-ship.png', 'pirate-ship.png',
    'spinning-swing.png', 'spinning-swing.png'
  ],
  flowers: [
    'rose.png', 'rose.png',
    'tulip.png', 'tulip.png',
    'daisy.png', 'daisy.png',
    'sunflower.png', 'sunflower.png',
    'orchid.png', 'orchid.png',
    'lily.png', 'lily.png'
  ]
};

const selectedSetName = localStorage.getItem('memory_iconset') || 'summer';
const icons = iconSets[selectedSetName] || iconSets.summer;

const shuffle = arr => arr.sort(() => Math.random() - 0.5);
const board = document.getElementById('game-board');
const overlay = document.getElementById('win-overlay');
let flipped = [];
let matched = 0;
let timerInterval;
let timeLimit = 90;
let timeLeft = timeLimit;

function createCard(src) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="front">
      <img src="https://template5-2-uk.vercel.app/assets/card-icon.png" alt="">
    </div>
    <div class="back">
      <img src="https://template5-2-uk.vercel.app/assets/${selectedSetName}/${src}" alt="">
    </div>
  `;
  card.addEventListener('click', () => flipCard(card, src));
  return card;
}

function flipCard(card, src) {
  if (card.classList.contains('flip') || flipped.length === 2) return;
  card.classList.add('flip');
  flipped.push({ card, src });

  if (flipped.length === 2) {
    const [a, b] = flipped;
    if (a.src === b.src) {
      matched++;
      flipped = [];
      if (matched === 6) handleWin();
    } else {
      setTimeout(() => {
        a.card.classList.remove('flip');
        b.card.classList.remove('flip');
        flipped = [];
      }, 900);
    }
  }
}

function handleWin() {
  clearInterval(timerInterval);
  overlay.classList.add('show');
  triggerConfetti();

  const overlayContent = document.querySelector('.overlay-content');
  if (overlayContent && !document.getElementById('win-title')) {
    const h2 = document.createElement('h2');
    h2.id = 'win-title';
    h2.textContent = 'Great job, you found them all!';
    overlayContent.insertBefore(h2, overlayContent.firstChild);
  }

  const nextButton = document.getElementById('to-form-button');
  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
      const currentIndex = steps.findIndex(step => step.contains(document.getElementById('game-board')));
      const next = steps[currentIndex + 1];
      if (next) {
        steps[currentIndex].style.display = 'none';
        next.style.display = 'block';

        window.dispatchEvent(new Event('scroll'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

function startGame() {
  board.innerHTML = '';
  matched = 0;
  flipped = [];
  timeLeft = timeLimit;
  updateProgress();
  overlay.classList.remove('show');

  const cards = shuffle([...icons]);
  cards.forEach(icon => board.appendChild(createCard(icon)));

  timerInterval = setInterval(() => {
    timeLeft--;
    updateProgress();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
    }
  }, 1000);
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const timerText = document.getElementById('time-remaining');
  
  const percentage = (timeLeft / timeLimit) * 100;
  fill.style.width = `${percentage}%`;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  if (timerText) {
    timerText.textContent = `${minutes}:${seconds}`;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

if (board && overlay) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && board.offsetParent !== null) {
        startGame();
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(board);
}

function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  const origin = document.querySelector('.overlay-content');
  const centerX = origin.offsetLeft + origin.offsetWidth / 2;
  const centerY = origin.offsetTop + origin.offsetHeight / 2;

  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti');
    el.style.setProperty('--hue', Math.floor(Math.random() * 360));

    const angle = Math.random() * 2 * Math.PI;
    const radius = 150 + Math.random() * 200;
    const x = Math.cos(angle) * radius + 'px';
    const y = Math.sin(angle) * radius + 'px';

    el.style.setProperty('--x', x);
    el.style.setProperty('--y', y);
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;

    container.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}
