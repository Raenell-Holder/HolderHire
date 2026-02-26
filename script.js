document.addEventListener("DOMContentLoaded", function () {

  /* Navbar shrink */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
  });

  /* Scroll reveal */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".animate").forEach(el => {
    observer.observe(el);
  });

  /* Subtle hero scroll effect */
  const hero = document.querySelector(".hero");

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    if (hero) {
      hero.style.transform = `scale(${1 - scroll * 0.0002})`;
      hero.style.opacity = `${1 - scroll * 0.0007}`;
    }
  });

});