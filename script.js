/* =========================================
   HolderHire Global JavaScript
   ========================================= */

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     Navbar Shrink on Scroll
     =============================== */
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  });

  /* ===============================
     Scroll Reveal Animation
     =============================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  document.querySelectorAll(".animate").forEach(el => {
    observer.observe(el);
  });

  /* ===============================
     Animated Counter
     =============================== */
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let current = 0;

    const updateCounter = () => {
      const increment = target / 200;

      if (current < target) {
        current += increment;
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  });

});