// ===== DeboFlix Letter JS =====

(function () {
  if (!sessionStorage.getItem('df_auth')) {
    window.location.href = 'login.html';
    return;
  }

  /* ---- Letter text ---- */
  const LETTER_PARAGRAPHS = [
    "I have been thinking about what to write to you for a long time now. And I keep arriving at the same realization — there are no words that are quite big enough for what I feel.",
    "One year ago, something shifted. I found you. Or maybe — we found each other. And everything that came after has felt like the most extraordinary adventure I never expected.",
    "I have watched you face hard days with a quiet grace that leaves me in awe. I have seen the way you care for the people around you — completely, selflessly, with everything you have. I have noticed the small things: the way your face changes when you talk about something you love, the warmth in your voice, the way you make ordinary moments feel like they actually matter.",
    "You have given me so much this past year. Not just the good days — the ones full of laughter and plans and everything-is-perfect — but the complicated ones too. The days when things weren't easy. The days when we figured it out anyway. Those ones, I think, mean the most to me.",
    "I want you to know: I do not take any of this for granted. Not a single day. Not a single text. Not a single moment where I get to be the person who loves you.",
    "Thank you for choosing this with me. Thank you for every conversation, every kind word, every time you showed up. Thank you for being exactly who you are — because you, exactly as you are, are my favorite thing.",
    "I don't know what the next year holds. But I know I want to face it beside you. I know I want to keep choosing this — choosing you — every single day.",
    "Happy first anniversary, my love. Here's to all the ones that follow. ❤️"
  ];

  const SIGNATURE = "— Always yours ❤️";

  /* ---- DOM ---- */
  const envelope    = document.getElementById('envelope');
  const envWrap     = document.getElementById('envelope-wrap');
  const openBtn     = document.getElementById('open-btn');
  const letterWrap  = document.getElementById('letter-wrap');
  const letterBody  = document.getElementById('letter-body');
  const letterSig   = document.getElementById('letter-signature');
  const closeLetter = document.getElementById('close-letter-btn');

  /* ---- Particles ---- */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * (W || window.innerWidth);
      this.y  = init ? Math.random() * (H || window.innerHeight) : -(Math.random() * 30 + 10);
      this.vy = Math.random() * 0.5 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 3 + 1;
      this.a  = Math.random() * 0.3 + 0.1;
      this.rot = Math.random() * 360;
      this.rotV = (Math.random() - 0.5) * 1.5;
      this.isHeart = Math.random() < 0.4;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.y * 0.02) * 0.4;
      this.rot += this.rotV;
      if (this.y > H + 20) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot * Math.PI / 180);
      if (this.isHeart) {
        ctx.fillStyle = `rgba(192,57,43,1)`;
        const s = this.r;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s*1.5, -s*2.5, s*3.5, -s, 0, s*1.8);
        ctx.bezierCurveTo(-s*3.5, -s, -s*1.5, -s*2.5, 0, -s);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,180,180,1)`;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 50; i++) particles.push(new Petal());
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(tick);
  })();

  /* ---- Open Envelope ---- */
  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.classList.add('open');
    openBtn.disabled = true;
    openBtn.style.opacity = '0.5';

    setTimeout(() => {
      envWrap.classList.add('hiding');
      setTimeout(() => {
        envWrap.style.display = 'none';
        letterWrap.classList.add('show');
        typewriterLetter();
      }, 500);
    }, 800);
  }

  envelope.addEventListener('click', openEnvelope);
  openBtn.addEventListener('click', openEnvelope);

  /* ---- Typewriter ---- */
  function typewriterLetter() {
    letterBody.innerHTML = '';
    let paraIdx = 0;
    let charIdx = 0;
    let cursorEl = null;

    // Create cursor
    cursorEl = document.createElement('span');
    cursorEl.className = 'cursor';
    letterBody.appendChild(cursorEl);

    const BASE_SPEED = 28; // ms per char
    const PARA_PAUSE = 600;

    function typeChar() {
      if (paraIdx >= LETTER_PARAGRAPHS.length) {
        // Done with body — remove cursor and type signature
        if (cursorEl && cursorEl.parentNode) cursorEl.parentNode.removeChild(cursorEl);
        setTimeout(() => typeSignature(), 800);
        return;
      }

      const para = LETTER_PARAGRAPHS[paraIdx];

      if (charIdx === 0) {
        // Start new paragraph
        const p = document.createElement('p');
        p.style.marginBottom = '1.5em';
        p.style.position = 'relative';
        letterBody.insertBefore(p, cursorEl);
      }

      const currentParas = letterBody.querySelectorAll('p');
      const currentP = currentParas[currentParas.length - 1];

      if (charIdx < para.length) {
        currentP.textContent += para[charIdx];
        charIdx++;
        // Move cursor after the paragraph
        currentP.appendChild(cursorEl);
        const delay = para[charIdx - 1] === '.' || para[charIdx - 1] === ',' ? BASE_SPEED * 6 : BASE_SPEED;
        setTimeout(typeChar, delay);
      } else {
        // Next paragraph
        if (cursorEl.parentNode) cursorEl.parentNode.removeChild(cursorEl);
        letterBody.appendChild(cursorEl);
        paraIdx++;
        charIdx = 0;
        setTimeout(typeChar, PARA_PAUSE);
      }
    }
    typeChar();
  }

  function typeSignature() {
    let idx = 0;
    letterSignature = document.getElementById('letter-signature');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    letterSignature.appendChild(cursor);

    function typeS() {
      if (idx < SIGNATURE.length) {
        letterSignature.textContent = SIGNATURE.substring(0, idx + 1);
        letterSignature.appendChild(cursor);
        idx++;
        setTimeout(typeS, 60);
      } else {
        cursor.remove();
      }
    }
    typeS();
  }

  /* ---- Close letter ---- */
  closeLetter.addEventListener('click', () => {
    letterWrap.style.opacity = '0';
    letterWrap.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      letterWrap.style.display = 'none';
      envWrap.style.display = '';
      envWrap.classList.remove('hiding');
      envWrap.style.opacity = '';
      envWrap.style.animation = 'envReveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards';
      envelope.classList.remove('open');
      opened = false;
      openBtn.disabled = false;
      openBtn.style.opacity = '';
      letterBody.innerHTML = '';
      document.getElementById('letter-signature').textContent = '';
      letterWrap.style.opacity = '';
      letterWrap.style.transition = '';
      letterWrap.classList.remove('show');
    }, 500);
  });

})();
