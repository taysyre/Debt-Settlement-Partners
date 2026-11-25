document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
    }
  });

  const revealTargets = document.querySelectorAll(
    ".feature-box, .info-card, .step-card, .testimonial-card, .service-card, .service-image, .card"
  );

  revealTargets.forEach(function (target) {
    target.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (target) {
      observer.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add("visible");
    });
  }

  const navbarCollapse = document.getElementById("mainNavbar");
  if (navbarCollapse) {
    navbarCollapse.addEventListener("click", function (event) {
      if (event.target.closest(".nav-link") && window.innerWidth < 992) {
        const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (collapse) collapse.hide();
      }
    });
  }

  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");

  if (form && submitBtn) {
    const formMessage = document.getElementById("formMessage");

    function validateForm() {
      submitBtn.disabled = !form.checkValidity();
    }

    form.addEventListener("input", validateForm);
    form.addEventListener("change", validateForm);
    validateForm();

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Submitting...';

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          form.reset();
          validateForm();
          submitBtn.textContent = "Submit Inquiry";
          if (formMessage) {
            formMessage.innerHTML =
              '<div class="alert alert-success mt-3" role="alert">Thank you. Your inquiry has been submitted successfully.</div>';
          }
        } else {
          throw new Error("Submission failed");
        }
      } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Inquiry";
        if (formMessage) {
          formMessage.innerHTML =
            '<div class="alert alert-danger mt-3" role="alert">We could not submit your inquiry. Please check your connection and try again.</div>';
        }
      }
    });
  }
});