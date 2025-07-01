// FILE: reservation-cta.js

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. SELECT ALL NECESSARY ELEMENTS ---
  const reservationBar = document.getElementById("reservation-bar");
  const reserveTriggers = document.querySelectorAll(".reserve-btn-trigger");
  const checkinInput = document.getElementById("checkin-date");
  const checkoutInput = document.getElementById("checkout-date");
  const footer = document.querySelector(".site-footer");

  // --- 2. GUARD CLAUSE ---
  // If the main reservation bar isn't on the page, stop running the script.
  if (!reservationBar) {
    return;
  }

  // --- 3. CORE COMPONENT LOGIC ---

  // A) DATE PICKER LOGIC
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fpOptions = {
    locale: "ja",
    dateFormat: "Y/m/d",
    minDate: "today",
  };
  const checkinPicker = flatpickr(checkinInput, {
    ...fpOptions,
    defaultDate: "today",
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        const nextDay = new Date(selectedDates[0]);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutPicker.set("minDate", nextDay);
      }
    },
  });
  const checkoutPicker = flatpickr(checkoutInput, {
    ...fpOptions,
    defaultDate: tomorrow,
  });
  document
    .getElementById("checkin-icon")
    .addEventListener("click", () => checkinPicker.open());
  document
    .getElementById("checkout-icon")
    .addEventListener("click", () => checkoutPicker.open());

  // B) COUNTER LOGIC
  reservationBar.addEventListener("click", function (event) {
    const button = event.target.closest(".counter-btn");
    if (!button) return;

    const targetId = button.dataset.target;
    const action = button.dataset.action;
    const countElement = document.getElementById(`${targetId}-count`);
    let currentValue = parseInt(countElement.textContent);
    const minValue = parseInt(countElement.dataset.min);

    if (action === "increment") {
      currentValue++;
    } else if (action === "decrement" && currentValue > minValue) {
      currentValue--;
    }
    countElement.textContent = currentValue;
  });

  // C) RESERVE BUTTON (CTA) LOGIC
  reserveTriggers.forEach((button) => {
    button.addEventListener("click", function () {
      if (window.innerWidth < 992) {
        const isExpanded = reservationBar.classList.contains("is-expanded");
        if (!isExpanded) {
          reservationBar.classList.add("is-expanded");
        } else {
          performSearch();
        }
      } else {
        performSearch();
      }
    });
  });

  // D) CLOSE EXPANDED FORM ON OUTSIDE CLICK (MOBILE)
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth < 992 &&
      reservationBar.classList.contains("is-expanded")
    ) {
      if (!reservationBar.contains(event.target)) {
        reservationBar.classList.remove("is-expanded");
      }
    }
  });

  // --- 4. DISAPPEAR ON FOOTER LOGIC (INTERSECTION OBSERVER) ---
  if (footer) {
    // Only run this logic if a footer element exists on the page

    const observerCallback = (entries) => {
      const [entry] = entries; // We are only observing one element (the footer)

      // This logic should only apply to mobile screens
      if (window.innerWidth < 992) {
        if (entry.isIntersecting) {
          // The footer is now in our trigger zone, so HIDE the button.
          reservationBar.classList.add("reservation-bar--hidden");
        } else {
          // The footer is out of view, so SHOW the button.
          reservationBar.classList.remove("reservation-bar--hidden");
        }
      } else {
        // On desktop, always ensure the button is not hidden. This handles browser resizing.
        reservationBar.classList.remove("reservation-bar--hidden");
      }
    };

    const footerObserver = new IntersectionObserver(observerCallback, {
      root: null, // Observe relative to the viewport
      // Creates a trigger zone 100px from the bottom of the viewport.
      // The observer fires when the footer crosses this line.
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.0, // Fire as soon as any part of the footer enters the zone
    });

    // Start observing the footer element
    footerObserver.observe(footer);
  }
}); // --- END OF DOMCONTENTLOADED ---

// --- HELPER FUNCTION ---
// This function is called by the reserve button logic.
function performSearch() {
  const reservationData = {
    checkin: document.getElementById("checkin-date").value,
    checkout: document.getElementById("checkout-date").value,
    adults: parseInt(document.getElementById("adults-count").textContent),
    children: parseInt(document.getElementById("children-count").textContent),
    rooms: parseInt(document.getElementById("rooms-count").textContent),
  };
  console.log("--- Reservation Data Collected ---", reservationData);
  alert(
    `検索データ:\nチェックイン: ${reservationData.checkin}\nチェックアウト: ${reservationData.checkout}\n大人: ${reservationData.adults}名\nお子様: ${reservationData.children}名\n客室: ${reservationData.rooms}室`
  );
}
