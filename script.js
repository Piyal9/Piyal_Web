// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {

  // ===== AVATAR ELEMENTS =====
  const avatarHole = document.getElementById("avatarHole");
  const avatarInput = document.getElementById("avatarInput");
  const avatarImg = document.getElementById("avatarImg");
  const avatarPlaceholder = document.getElementById("avatarPlaceholder");

  // ===== AVATAR UPLOAD =====
  if (avatarHole && avatarInput) {

    avatarHole.addEventListener("click", () => {
      avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {

        if (avatarImg) {
          avatarImg.src = event.target.result;
          avatarImg.style.display = "block";
        }

        if (avatarPlaceholder) {
          avatarPlaceholder.style.display = "none";
        }
      };

      reader.readAsDataURL(file);
    });
  }

  // ===== SWIPER INIT =====
  let swiper;

  if (document.querySelector(".projects-swiper")) {

    swiper = new Swiper(".projects-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },

      allowTouchMove: true,
      simulateTouch: true,
      grabCursor: true,

      breakpoints: {
        640: {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },

        900: {
          slidesPerView: 2,
          spaceBetween: 24,
        },

        1200: {
          slidesPerView: 2.5,
          spaceBetween: 28,
        }
      },

      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      loop: false,
    });

    console.log("Swiper initialized successfully");
  }

  // ===== PROJECT CARD TILT =====
  function initTilt() {

    document.querySelectorAll(".project-card").forEach((card) => {

      if (card.vanillaTilt) {
        card.vanillaTilt.destroy();
      }

      VanillaTilt.init(card, {
        max: 8,
        speed: 300,
        scale: 1.02,
        glare: false,
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

      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilt-active");
      });
    });
  }

  // Initialize tilt
  setTimeout(initTilt, 100);

  // Re-init tilt after slide change
  if (swiper) {
    swiper.on("slideChange", () => {
      setTimeout(initTilt, 200);
    });
  }

  // Re-init tilt on resize
  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      initTilt();

      if (swiper) {
        swiper.update();
      }

    }, 300);
  });

  // ===== AVATAR TILT =====
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

});