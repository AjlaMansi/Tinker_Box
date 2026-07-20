(() => {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');

  const GRID = 20;                 // 20x20 cells
  const CELL = canvas.width / GRID; // px per cell (canvas is 400x400)

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMsg = document.getElementById('overlay-msg');
  const overlayBtn = document.getElementById('overlay-btn');

  const YARN_COLORS = ['#C1443C', '#D5645C', '#A83830']; // shades of red yarn for body
  const HEAD_COLOR = '#E3A857';   // mustard head = the "ball" leading the strand
  const BUTTON_COLORS = ['#F1E7D6', '#7C9473', '#E3A857'];

  let snake, dir, nextDir, food, score, best, speedMs, loopId, running, gameOver;

  best = Number(localStorage.getItem('yarnSnakeBest') || 0);
  bestEl.textContent = best;

  function resetState() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speedMs = 140;
    running = false;
    gameOver = false;
    scoreEl.textContent = score;
    placeFood();
    draw(); // show initial frame behind overlay
  }

  function placeFood() {
    let attempts = 0;
    while (attempts < 500) {
      const candidate = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
      if (!snake.some(s => s.x === candidate.x && s.y === candidate.y)) {
        food = candidate;
        food.color = BUTTON_COLORS[Math.floor(Math.random() * BUTTON_COLORS.length)];
        return;
      }
      attempts++;
    }
  }

  function tick() {
    dir = nextDir;
    const head = snake[0];
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // wall collision
    if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
      return endGame();
    }
    // self collision (tangled yarn)
    if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      return endGame();
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
      if (speedMs > 60 && score % 3 === 0) speedMs -= 6; // gentle ramp up
      restartLoop();
    } else {
      snake.pop();
    }

    draw();
  }

  function endGame() {
    running = false;
    gameOver = true;
    clearInterval(loopId);
    if (score > best) {
      best = score;
      localStorage.setItem('yarnSnakeBest', String(best));
      bestEl.textContent = best;
    }
    overlayTitle.textContent = 'tangled up!';
    overlayMsg.textContent = `you collected ${score} button${score === 1 ? '' : 's'}. give it another go?`;
    overlayBtn.textContent = 'play again';
    overlay.classList.remove('hidden');
  }

  function restartLoop() {
    clearInterval(loopId);
    loopId = setInterval(tick, speedMs);
  }

  function draw() {
    // background
    ctx.fillStyle = '#221b18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle grid weave texture
    ctx.strokeStyle = 'rgba(241,231,214,0.04)';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(canvas.width, i * CELL);
      ctx.stroke();
    }

    // food = button (circle with two holes)
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.36, 0, Math.PI * 2);
    ctx.fillStyle = food.color;
    ctx.fill();
    ctx.fillStyle = '#221b18';
    ctx.beginPath();
    ctx.arc(fx - 3, fy - 3, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx + 3, fy + 3, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // snake = yarn strand
    snake.forEach((seg, i) => {
      const cx = seg.x * CELL + CELL / 2;
      const cy = seg.y * CELL + CELL / 2;
      const isHead = i === 0;
      ctx.beginPath();
      ctx.arc(cx, cy, isHead ? CELL * 0.44 : CELL * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = isHead ? HEAD_COLOR : YARN_COLORS[i % YARN_COLORS.length];
      ctx.fill();

      if (isHead) {
        // little eyes so the yarn ball has a face
        const ex = dir.x !== 0 ? dir.x * 4 : 0;
        const ey = dir.y !== 0 ? dir.y * 4 : 0;
        ctx.fillStyle = '#221b18';
        ctx.beginPath();
        ctx.arc(cx - ey + ex * 0.3 - 3, cy + ex + ey * 0.3 - 3, 1.8, 0, Math.PI * 2);
        ctx.arc(cx + ey + ex * 0.3 + 3, cy - ex + ey * 0.3 - 3, 1.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // yarn cross-thread detail
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - CELL * 0.25, cy - CELL * 0.25);
        ctx.lineTo(cx + CELL * 0.25, cy + CELL * 0.25);
        ctx.stroke();
      }
    });
  }

  function setDir(x, y) {
    // prevent reversing directly into itself
    if (dir.x === -x && dir.y === -y) return;
    nextDir = { x, y };
  }

  // keyboard
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': setDir(0, -1); e.preventDefault(); break;
      case 'ArrowDown': case 's': case 'S': setDir(0, 1); e.preventDefault(); break;
      case 'ArrowLeft': case 'a': case 'A': setDir(-1, 0); e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D': setDir(1, 0); e.preventDefault(); break;
    }
    if (!running && !gameOver && e.key.startsWith('Arrow')) startGame();
  });

  // on-screen dpad
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.dir;
      if (d === 'up') setDir(0, -1);
      if (d === 'down') setDir(0, 1);
      if (d === 'left') setDir(-1, 0);
      if (d === 'right') setDir(1, 0);
      if (!running && !gameOver) startGame();
    });
  });

  // swipe support
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  canvas.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDir(dx > 0 ? 1 : -1, 0);
    } else {
      setDir(0, dy > 0 ? 1 : -1);
    }
    touchStart = null;
    if (!running && !gameOver) startGame();
  }, { passive: true });

  function startGame() {
    if (gameOver) resetState();
    running = true;
    overlay.classList.add('hidden');
    restartLoop();
  }

  overlayBtn.addEventListener('click', startGame);

  resetState();
})();
