document.addEventListener("DOMContentLoaded", () => {

  // ===== PARTICLE CANVAS =====
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.35 + 0.05;
      this.color = ["180,220,255","255,190,215","160,230,205","210,190,255"][Math.floor(Math.random()*4)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== COUNTING ANIMATION =====
  const statNums = document.querySelectorAll(".stat-num[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 30);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => countObserver.observe(el));

  // ===== SWIPER =====
  let swiper;
  if (document.querySelector(".projects-swiper")) {
    swiper = new Swiper(".projects-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      allowTouchMove: true,
      simulateTouch: true,
      grabCursor: true,
      breakpoints: {
        640:  { slidesPerView: 1.15, spaceBetween: 20 },
        900:  { slidesPerView: 2,    spaceBetween: 24 },
        1200: { slidesPerView: 2.6,  spaceBetween: 28 },
      },
      watchSlidesProgress: true,
      observer: true, observeParents: true, updateOnWindowResize: true, loop: false,
    });
  }

  // ===== VANILLA TILT =====
  function initTilt() {
    document.querySelectorAll(".project-card").forEach(card => {
      if (card.vanillaTilt) card.vanillaTilt.destroy();
      VanillaTilt.init(card, {
        max: 10, speed: 300, scale: 1.03, glare: false,
        gyroscope: true,
        gyroscopeMinAngleX: -45, gyroscopeMaxAngleX: 45,
        gyroscopeMinAngleY: -45, gyroscopeMaxAngleY: 45,
        transition: true, perspective: 1000, reset: true,
        easing: "cubic-bezier(.34,1.56,.64,1)"
      });
    });
  }
  setTimeout(initTilt, 120);
  if (swiper) swiper.on("slideChange", () => setTimeout(initTilt, 200));

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll(
    ".section-skills, .section-projects, .section-services, .cta-banner, .stats-bar"
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.56,.64,1)";
    revealObserver.observe(el);
  });

  document.querySelectorAll(".revealed, .section-name").forEach(() => {});

  const style = document.createElement("style");
  style.textContent = ".revealed { opacity: 1 !important; transform: translateY(0) !important; }";
  document.head.appendChild(style);

  // ===== RESIZE =====
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initTilt();
      if (swiper) swiper.update();
    }, 300);
  });

});