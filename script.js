const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GROUND_HEIGHT = 96;
const GRAVITY = 1800;
const FLAP = -320;
const MAX_FALL_SPEED = 620;
const PIPE_WIDTH = 74;
const PIPE_GAP = 186;
const PIPE_SPEED = 210;
const SPAWN_INTERVAL = 1.35;
const MAX_SHAKE = 9;

let bird;
let pipes;
let particles;
let clouds;
let score;
let gameOver;
let started;
let animationFrameId;
let lastTime;
let spawnTimer;
let shake;
let time;
let isRunning;
let highScore = Number(localStorage.getItem('floppyBirdHighScore') || 0);

function stopLoop() {
  isRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function startLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  isRunning = true;
  lastTime = null;
  animationFrameId = requestAnimationFrame(loop);
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('floppyBirdHighScore', String(highScore));
  }
  highScoreEl.textContent = String(highScore);
}

function resetGame() {
  bird = {
    x: 120,
    y: HEIGHT / 2 - 20,
    radius: 16,
    velocity: 0,
    angle: 0,
    wingPhase: 0,
  };
  pipes = [];
  particles = [];
  clouds = [
    { x: 90, y: 110, scale: 1 },
    { x: 300, y: 70, scale: 0.85 },
    { x: 430, y: 140, scale: 0.7 },
  ];
  score = 0;
  gameOver = false;
  started = false;
  scoreEl.textContent = '0';
  updateHighScore();
  spawnTimer = 0;
  shake = 0;
  time = 0;
  stopLoop();
  startLoop();
}

function spawnPipe() {
  const minY = 85;
  const maxY = HEIGHT - GROUND_HEIGHT - PIPE_GAP - 85;
  const topHeight = minY + Math.random() * (maxY - minY);
  pipes.push({
    x: WIDTH + 40,
    topHeight,
    bottomY: topHeight + PIPE_GAP,
    scored: false,
  });
}

function spawnBurst(x, y, count = 10) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 180,
      vy: (Math.random() - 0.5) * 180,
      life: 0.6 + Math.random() * 0.4,
      maxLife: 1,
      size: 3 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#f59e0b' : '#ffffff',
    });
  }
}

function flap() {
  if (gameOver) {
    resetGame();
    return;
  }

  if (!started) {
    started = true;
  }

  bird.velocity = FLAP;
  bird.y = Math.max(bird.y - 8, bird.radius + 6);
  bird.wingPhase = 0.4;
  spawnBurst(bird.x - 8, bird.y, 4);
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  stopLoop();
  draw();
}

function update(dt) {
  time += dt;
  shake = Math.max(0, shake - dt * 16);

  if (!started) {
    bird.y = HEIGHT / 2 - 20 + Math.sin(time * 2.2) * 4;
    bird.angle = Math.sin(time * 2.8) * 0.06;
    bird.wingPhase = Math.sin(time * 10) * 0.45;
  }

  if (started && !gameOver) {
    bird.velocity += GRAVITY * dt;
    bird.velocity = Math.min(bird.velocity, MAX_FALL_SPEED);
    bird.y += bird.velocity * dt;
    bird.angle = Math.max(-0.55, Math.min(0.75, bird.velocity / 900));
    bird.wingPhase = Math.sin(time * 16) * 0.75;

    if (bird.y + bird.radius >= HEIGHT - GROUND_HEIGHT) {
      bird.y = HEIGHT - GROUND_HEIGHT - bird.radius;
      bird.velocity = 0;
      shake = MAX_SHAKE;
      spawnBurst(bird.x, bird.y, 16);
      endGame();
      return;
    }

    if (bird.y - bird.radius <= 0) {
      bird.y = bird.radius;
      bird.velocity = 0;
      shake = MAX_SHAKE;
      spawnBurst(bird.x, bird.y, 16);
      endGame();
      return;
    }

    for (let i = pipes.length - 1; i >= 0; i -= 1) {
      const pipe = pipes[i];
      pipe.x -= PIPE_SPEED * dt;

      const passedPipe = bird.x > pipe.x + PIPE_WIDTH && !pipe.scored;
      if (passedPipe) {
        pipe.scored = true;
        score += 1;
        scoreEl.textContent = String(score);
        updateHighScore();
        spawnBurst(pipe.x + PIPE_WIDTH / 2, pipe.topHeight + PIPE_GAP / 2, 8);
      }

      const hit =
        bird.x + bird.radius > pipe.x &&
        bird.x - bird.radius < pipe.x + PIPE_WIDTH &&
        ((bird.y - bird.radius < pipe.topHeight) ||
          (bird.y + bird.radius > pipe.bottomY));

      if (hit) {
        shake = MAX_SHAKE;
        spawnBurst(bird.x, bird.y, 18);
        endGame();
        return;
      }

      if (pipe.x + PIPE_WIDTH < -40) {
        pipes.splice(i, 1);
      }
    }

    spawnTimer += dt;
    if (spawnTimer >= SPAWN_INTERVAL) {
      spawnTimer = 0;
      spawnPipe();
    }
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 220 * dt;
    p.vx *= 0.98;
    if (p.life <= 0) particles.splice(i, 1);
  }

  clouds.forEach((cloud) => {
    cloud.x -= 18 * dt * (cloud.scale + 0.2);
    if (cloud.x < -120) cloud.x = WIDTH + 80;
  });
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#7dd3fc');
  sky.addColorStop(0.5, '#bfdbfe');
  sky.addColorStop(1, '#e9f8ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(380, 90, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(380, 90, 30, 0, Math.PI * 2);
  ctx.fill();

  clouds.forEach((cloud) => {
    const size = 24 * cloud.scale;
    ctx.save();
    ctx.translate(cloud.x, cloud.y);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.arc(size + 10, 0, size * 0.85, 0, Math.PI * 2);
    ctx.arc(size * 2, 6, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.fillStyle = '#8ecf8e';
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.quadraticCurveTo(120, 360, 220, 420);
  ctx.quadraticCurveTo(330, 470, 440, 420);
  ctx.quadraticCurveTo(560, 380, 640, 420);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawGround() {
  const groundY = HEIGHT - GROUND_HEIGHT;
  const patternOffset = (time * 140) % 40;

  ctx.fillStyle = '#7ddc4d';
  ctx.fillRect(0, groundY, WIDTH, GROUND_HEIGHT);
  ctx.fillStyle = '#4d9f2b';
  ctx.fillRect(0, groundY, WIDTH, 10);

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let x = -40; x <= WIDTH + 40; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x + patternOffset, groundY + 8);
    ctx.lineTo(x + 20 + patternOffset, groundY + 34);
    ctx.stroke();
  }
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.angle);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(10, -5, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.fillRect(-6, -4, 8, 3);

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-20, 6);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(4, -2, 2.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(12, 1);
  ctx.lineTo(22, 2);
  ctx.lineTo(12, 8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#8a4b00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, 10);
  ctx.quadraticCurveTo(0, 16 + Math.sin(bird.wingPhase) * 5, 6, 10);
  ctx.stroke();

  ctx.restore();
}

function drawPipes() {
  pipes.forEach((pipe) => {
    const topBottomY = HEIGHT - GROUND_HEIGHT;

    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, topBottomY - pipe.bottomY);

    ctx.fillStyle = '#0f766e';
    ctx.fillRect(pipe.x - 3, 0, 6, pipe.topHeight);
    ctx.fillRect(pipe.x - 3, pipe.bottomY, 6, topBottomY - pipe.bottomY);

    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(pipe.x + 6, pipe.topHeight - 14, PIPE_WIDTH - 12, 10);
    ctx.fillRect(pipe.x + 6, pipe.bottomY + 4, PIPE_WIDTH - 12, 10);
  });
}

function drawParticles() {
  particles.forEach((p) => {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawOverlay() {
  if (!started && !gameOver) {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Tap or press Space', WIDTH / 2, HEIGHT / 2 - 24);
    ctx.font = '20px Segoe UI';
    ctx.fillText('to launch your run', WIDTH / 2, HEIGHT / 2 + 14);
    return;
  }

  if (gameOver) {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.28)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const panelX = 84;
    const panelY = 220;
    const panelW = WIDTH - 168;
    const panelH = 170;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
    ctx.fillRect(panelX, panelY, panelW, panelH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', WIDTH / 2, panelY + 54);
    ctx.font = '20px Segoe UI';
    ctx.fillText(`Score: ${score}`, WIDTH / 2, panelY + 92);
    ctx.fillText('Press Space or click to restart', WIDTH / 2, panelY + 128);
  }
}

function draw() {
  ctx.save();
  if (shake > 0) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }

  drawBackground();
  drawParticles();
  drawPipes();
  drawBird();
  drawGround();
  drawOverlay();
  ctx.restore();
}

function loop(timestamp) {
  if (!isRunning) return;
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.03);
  lastTime = timestamp;

  update(dt);
  draw();
  animationFrameId = requestAnimationFrame(loop);
}

canvas.addEventListener('pointerdown', () => {
  flap();
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    flap();
  }
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

highScoreEl.textContent = String(highScore);
resetGame();
