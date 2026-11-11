const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let heartWords = [];
let floatingWords = [];
let pixelRatio = 1;

const phrases = ["I LOVE YOU", "I love you", "LOVE YOU", "ALILA ❤️"];

function heartEquation(x, y) {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  createHeart();
  createFloatingWords();
}

function createHeart() {
  heartWords = [];

  const scale = Math.min(width / 38, height / 31) * 0.88;
  const centerX = width / 2;
  const centerY = height / 2 - Math.min(12, height * 0.02);
  const step = width < 600 ? 0.105 : 0.085;

  for (let y = -1.28; y <= 1.28; y += step) {
    for (let x = -1.35; x <= 1.35; x += step) {
      if (heartEquation(x, y) && Math.random() > 0.10) {
        heartWords.push({
          x: centerX + x * scale * 15.5,
          y: centerY - y * scale * 15.5,
          text: phrases[Math.floor(Math.random() * 3)],
          size: width < 600 ? 5.5 + Math.random() * 2 : 7 + Math.random() * 3,
          alpha: 0.52 + Math.random() * 0.48,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.1
        });
      }
    }
  }
}

function createFloatingWords() {
  floatingWords = [];
  const amount = Math.max(90, Math.floor((width * height) / 5200));

  for (let i = 0; i < amount; i++) {
    floatingWords.push({
      x: Math.random() * width,
      y: Math.random() * height,
      text: Math.random() > 0.45 ? "I LOVE YOU" : "♥",
      size: 6 + Math.random() * 5,
      alpha: 0.12 + Math.random() * 0.24,
      speed: 0.12 + Math.random() * 0.38
    });
  }
}

const startTime = performance.now();

function animate(now) {
  const time = (now - startTime) / 1000;
  ctx.clearRect(0, 0, width, height);

  // Soft red glow behind the heart
  const glow = ctx.createRadialGradient(
    width / 2, height / 2, 8,
    width / 2, height / 2, Math.max(width, height) * 0.62
  );
  glow.addColorStop(0, "rgba(105, 0, 18, 0.18)");
  glow.addColorStop(1, "rgba(8, 6, 9, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Small words drifting around the heart
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  floatingWords.forEach(word => {
    word.y -= word.speed;
    if (word.y < -18) {
      word.y = height + 18;
      word.x = Math.random() * width;
    }
    ctx.font = `${word.size}px Georgia`;
    ctx.fillStyle = `rgba(255, 65, 77, ${word.alpha})`;
    ctx.fillText(word.text, word.x, word.y);
  });

  // Heart made from many repeated love messages
  const pulse = 1 + Math.sin(time * 2.1) * 0.012;
  heartWords.forEach(word => {
    const drift = Math.sin(time * word.speed + word.phase) * 1.2;
    const x = width / 2 + (word.x - width / 2) * pulse;
    const y = height / 2 + (word.y - height / 2) * pulse + drift;

    ctx.font = `bold ${word.size}px Georgia`;
    ctx.shadowColor = "rgba(255, 35, 48, 0.55)";
    ctx.shadowBlur = 5;
    ctx.fillStyle = `rgba(255, ${48 + Math.floor(word.alpha * 30)}, ${52 + Math.floor(word.alpha * 20)}, ${word.alpha})`;
    ctx.fillText(word.text, x, y);
  });

  ctx.shadowBlur = 0;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);
