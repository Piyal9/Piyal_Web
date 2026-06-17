// ===== AVATAR UPLOAD =====
const avatarHole = document.getElementById('avatarHole');
const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatarImg');
const avatarPlaceholder = document.getElementById('avatarPlaceholder');

avatarHole.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarImg.src = event.target.result;
      avatarImg.style.display = 'block';
      avatarPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// ===== SWIPER INIT =====
const swiper = new Swiper('.projects-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 1.2, spaceBetween: 20 },
    900: { slidesPerView: 2, spaceBetween: 24 },
    1200: { slidesPerView: 2.5, spaceBetween: 28 }
  },
  grabCursor: true,
  loop: false,
  watchSlidesProgress: true,
});

// ===== 3D TILT + DYNAMIC LIGHT ON PROJECT CARDS =====
function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    // Destroy any existing tilt instance to prevent duplicates
    if (card.vanillaTilt) card.vanillaTilt.destroy();

    VanillaTilt.init(card, {
      max: 8,
      speed: 300,
      scale: 1.02,
      glare: false, // we use custom shine layers
      gyroscope: true,
      gyroscopeMinAngleX: -45,
      gyroscopeMaxAngleX: 45,
      gyroscopeMinAngleY: -45,
      gyroscopeMaxAngleY: 45,
      transition: true,
      perspective: 1200,
      reset: true,
      easing: "cubic-bezier(.34,1.56,.64,1)"
    });

    // Add 'tilt-active' class when tilt angle is significant
    card.addEventListener('tiltChange', (e) => {
      const tiltAngleX = e.detail.tiltX;
      const tiltAngleY = e.detail.tiltY;
      if (Math.abs(tiltAngleX) > 2 || Math.abs(tiltAngleY) > 2) {
        card.classList.add('tilt-active');
      } else {
        card.classList.remove('tilt-active');
      }
    });

    // Remove class on mouse leave
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
    });
  });
}

// Initialize tilt after a short delay to ensure DOM is ready
setTimeout(initTilt, 100);

// Re-init tilt after swiper slide change
swiper.on('slideChange', () => setTimeout(initTilt, 200));

// Re-init tilt on window resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initTilt, 300);
});

// ===== AVATAR 3D TILT =====
if (avatarHole) {
  VanillaTilt.init(avatarHole, {
    max: 6,
    speed: 200,
    scale: 1.01,
    glare: false,
    perspective: 500,
    reset: true,
    easing: "cubic-bezier(.34,1.56,.64,1)"
  });
}