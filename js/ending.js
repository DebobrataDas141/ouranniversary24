// ===== DeboFlix Ending JS =====

(function () {
  if (!sessionStorage.getItem('df_auth')) {
    window.location.href = 'login.html';
    return;
  }

  /* ---- Cinematic lines ---- */
  const LINES = [
    { id: 'line-1', text: 'One year ago, I found someone special.', speed: 55 },
    { id: 'line-2', text: 'Today, she is still my favorite person.', speed: 55 },
    { id: 'line-3', text: 'Happy 1st Anniversary ❤️', speed: 75 }
  ];

  /* ---- Particles ---- */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Star {
    constructor(init) {
      this.reset(init);
    }
    reset(init) {
      this.x = Math.random() * (W || window.innerWidth);
      this.y = init ? Math.random() * (H || window.innerHeight) : Math.random() * (H || window.innerHeight);
      this.r = Math.random() * 1.2 + 0.2;
      this.a = Math.random() * 0.5 + 0.05;
      this.baseA = this.a;
      this.vx = (Math.random() - 0.5) * 0.12;
      this.vy = (Math.random() - 0.5) * 0.12;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.isRed = Math.random() < 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.twinkle += this.twinkleSpeed;
      if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
    }
    draw() {
      const alpha = this.baseA * (0.6 + 0.4 * Math.sin(this.twinkle));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isRed ? `rgba(192,57,43,${alpha})` : `rgba(220,220,240,${alpha})`;
      ctx.fill();
    }
  }

  class Heart {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * (W || window.innerWidth);
      this.y  = (H || window.innerHeight) + 20;
      this.vy = -(Math.random() * 0.8 + 0.3);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.a  = Math.random() * 0.35 + 0.1;
      this.s  = Math.random() * 0.7 + 0.2;
      this.wobble = Math.random() * Math.PI * 2;
      this.active = false;
    }
    update() {
      if (!this.active) return;
      this.wobble += 0.03;
      this.x += this.vx + Math.sin(this.wobble) * 0.3;
      this.y += this.vy;
      this.a -= 0.0006;
      if (this.a <= 0 || this.y < -(H || window.innerHeight) * 0.3) this.reset();
    }
    draw() {
      if (!this.active || this.a <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.translate(this.x, this.y);
      ctx.scale(this.s, this.s);
      ctx.fillStyle = 'rgba(192,57,43,1)';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(6, -14, 16, -6, 0, 8);
      ctx.bezierCurveTo(-16, -6, -6, -14, 0, -6);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 150; i++) particles.push(new Star(true));
  const hearts = Array.from({ length: 30 }, () => new Heart());

  (function animLoop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animLoop);
  })();

  /* ---- Typewriter helper ---- */
  function typewrite(el, text, speed, onDone) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';

    function next() {
      if (i < text.length) {
        el.textContent = text.slice(0, i + 1);
        el.appendChild(cursor);
        i++;
        const ch = text[i - 1];
        const delay = (ch === '.' || ch === ',') ? speed * 6 : speed;
        setTimeout(next, delay);
      } else {
        cursor.remove();
        if (onDone) onDone();
      }
    }
    next();
  }

  /* ---- DOM refs ---- */
  const fadeOverlay = document.getElementById('fade-overlay');
  const lbTop       = document.querySelector('.letterbox.top');
  const lbBot       = document.querySelector('.letterbox.bottom');
  const wrap1       = document.getElementById('line-1-wrap');
  const wrap2       = document.getElementById('line-2-wrap');
  const wrap3       = document.getElementById('line-3-wrap');
  const el1         = document.getElementById('line-1');
  const el2         = document.getElementById('line-2');
  const el3         = document.getElementById('line-3');
  const heartReveal = document.getElementById('heart-reveal');
  const finalCard   = document.getElementById('final-card');

  /* ---- Sequence ---- */
  function startSequence() {
    // 1. Fade in from black
    setTimeout(() => {
      fadeOverlay.classList.add('gone');
    }, 300);

    // 2. Letterbox bars
    setTimeout(() => {
      lbTop.classList.add('active');
      lbBot.classList.add('active');
    }, 800);

    // 3. Line 1
    setTimeout(() => {
      wrap1.classList.add('visible');
      typewrite(el1, LINES[0].text, LINES[0].speed, () => {

        // 4. Pause, then line 2
        setTimeout(() => {
          wrap2.classList.add('visible');
          typewrite(el2, LINES[1].text, LINES[1].speed, () => {

            // 5. Pause, then line 3
            setTimeout(() => {
              wrap3.classList.add('visible');
              typewrite(el3, LINES[2].text, LINES[2].speed, () => {

                // 6. Heart
                setTimeout(() => {
                  heartReveal.classList.add('show');
                  // Activate floating hearts
                  hearts.forEach(h => { h.active = true; h.y = H + 20 * Math.random(); });
                }, 800);

                // 7. Final card
                setTimeout(() => {
                  finalCard.classList.add('show');
                }, 2000);

              });
            }, 1200);
          });
        }, 1000);
      });
    }, 1600);
  }

  startSequence();

})();
