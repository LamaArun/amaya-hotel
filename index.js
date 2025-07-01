document.addEventListener("DOMContentLoaded", () => {
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible"); // Add the 'visible' class when in view
            observer.unobserve(entry.target); // Stop observing once the animation is applied
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    fadeInElements.forEach((el) => observer.observe(el)); 
  });




