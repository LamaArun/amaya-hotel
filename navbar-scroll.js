//bootstrap-html-scroll-hide-navbar
document.addEventListener("DOMContentLoaded", function () {
  const navWrapper = document.getElementById("navWrapper");
  const navWrapperHeight = navWrapper.offsetHeight;
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // Scroll down → hide
      navWrapper.style.top = `-${navWrapperHeight}px`;
    } else {
      // Scroll up → show
      navWrapper.style.top = "0";
    }

    lastScrollTop = currentScroll;
  });
});


//bootstrap-html-scroll-hide-navbar-end
