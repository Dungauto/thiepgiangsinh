/**
 * Snowfall & Confetti Canvas Physics Engine
 * Author: Dung Automation
 */

let snowCanvas, snowCtx;
let snowflakes = [];
let snowCount = 90;
let wind = 0;
let isSnowstorm = false;

// Confetti Particle System
let confettiCanvas, confettiCtx;
let confettiParticles = [];

/**
 * Initialize Snowfall Canvas
 */
function initSnowCanvas() {
  snowCanvas = document.getElementById("snow-canvas");
  if (!snowCanvas) return;
  snowCtx = snowCanvas.getContext("2d");
  resizeSnowCanvas();
  window.addEventListener("resize", resizeSnowCanvas);

  for (let i = 0; i < snowCount; i++) {
    snowflakes.push(createSnowflake());
  }
  requestAnimationFrame(renderSnow);
}

function resizeSnowCanvas() {
  if (!snowCanvas) return;
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}

function createSnowflake() {
  return {
    x: Math.random() * snowCanvas.width,
    y: Math.random() * snowCanvas.height,
    radius: Math.random() * 3 + 1,
    density: Math.random() * snowCount,
    speedY: Math.random() * 1.5 + 0.8,
    swaySpeed: Math.random() * 0.02 + 0.01,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.7 + 0.3
  };
}

function renderSnow() {
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowCtx.fillStyle = "#ffffff";

  for (let i = 0; i < snowflakes.length; i++) {
    let p = snowflakes[i];
    p.angle += p.swaySpeed;
    p.y += p.speedY * (isSnowstorm ? 2.5 : 1);
    p.x += (Math.sin(p.angle) * 1.2 + wind) * (isSnowstorm ? 2 : 1);

    if (p.y > snowCanvas.height + 10) {
      p.y = -10;
      p.x = Math.random() * snowCanvas.width;
    }
    if (p.x > snowCanvas.width + 10) p.x = -10;
    if (p.x < -10) p.x = snowCanvas.width + 10;

    snowCtx.beginPath();
    snowCtx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    snowCtx.arc(p.x, p.y, p.radius * (isSnowstorm ? 1.4 : 1), 0, Math.PI * 2);
    snowCtx.fill();
  }
  requestAnimationFrame(renderSnow);
}

function toggleSnowstorm() {
  isSnowstorm = !isSnowstorm;
  const btn = document.getElementById("btn-snowstorm");
  if (btn) btn.style.color = isSnowstorm ? "var(--gold)" : "white";
  if (typeof showToast === "function") {
    showToast(isSnowstorm ? "Bão tuyết Bắc Cực đã bật! ❄️💨" : "Tuyết rơi dịu êm trở lại ❄️");
  }
}

/**
 * Initialize Confetti Canvas
 */
function initConfettiCanvas() {
  confettiCanvas = document.getElementById("confetti-canvas");
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext("2d");
  resizeConfettiCanvas();
  window.addEventListener("resize", resizeConfettiCanvas);
  requestAnimationFrame(renderConfetti);
}

function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function fireConfettiBurst() {
  const colors = ["#c41e3a", "#f8b229", "#165b33", "#ffffff", "#3399ff", "#ff80df"];
  for (let i = 0; i < 90; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.55,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.4,
      life: 1,
      decay: Math.random() * 0.015 + 0.008
    });
  }
}

function renderConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.life -= p.decay;

    if (p.life <= 0) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = p.life;
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  }
  requestAnimationFrame(renderConfetti);
}

function spawnClickHeart(x, y) {
  const el = document.createElement("div");
  el.innerHTML = "💙";
  el.style.position = "fixed";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.pointerEvents = "none";
  el.style.zIndex = "999";
  el.style.fontSize = "1.5rem";
  el.style.transform = "translate(-50%, -50%) scale(0.5)";
  el.style.transition = "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(-50%, -100px) scale(1.4) rotate(${Math.random() * 40 - 20}deg)`;
    el.style.opacity = "0";
  });

  setTimeout(() => el.remove(), 900);
}

function createParticleHeart() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const y = window.innerHeight / 2 + (Math.random() - 0.5) * 150;
      spawnClickHeart(x, y);
    }, i * 80);
  }
}
