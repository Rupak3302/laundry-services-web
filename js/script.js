document.addEventListener("DOMContentLoaded", function () {

  console.log("JS file loaded successfully");

  /* ================= ELEMENTS ================= */
  const addBtns = document.querySelectorAll(".add-btn");
  const removeBtns = document.querySelectorAll(".remove-btn");

  const cartBody = document.querySelector(".cart-table tbody");
  const emptyCart = document.querySelector(".empty-cart");
  const totalAmountEl = document.getElementById("totalAmount");

  const bookingForm = document.querySelector(".booking-form");
  const bookBtn = document.getElementById("bookBtn");
  const successMsg = document.getElementById("successMsg");
    const bookWarning = document.getElementById("bookWarning");

  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  /* ================= STATE ================= */
  let cartItems = [];
  let totalAmount = 0;

  /* ================= FUNCTIONS ================= */
  function updateTotal() {
    totalAmountEl.textContent = `₹${totalAmount}`;
  }

  function updateCartState() {
    if (cartItems.length === 0) {
      emptyCart.style.display = "block";
      bookingForm.classList.add("disabled-state");
      bookingForm.classList.remove("enabled-state");
    } else {
      emptyCart.style.display = "none";
      bookingForm.classList.remove("disabled-state");
      bookingForm.classList.add("enabled-state");
      bookWarning.style.display = "none";
    }
  }

    // ================= WARNING ON INPUT CLICK =================
  [nameInput, emailInput, phoneInput].forEach(input => {
    input.addEventListener("focus", () => {
      if (cartItems.length === 0) {
        bookWarning.style.display = "flex";
      }
    });
  });


  // ================= ADD ITEM =================
  addBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceItem = btn.closest(".service-item");
      const name = serviceItem.querySelector(".service-name").textContent;
      const priceText = serviceItem.querySelector(".service-price").textContent;
      const price = parseInt(priceText.replace("₹", ""));

      if (cartItems.find(item => item.name === name)) return;

      cartItems.push({ name, price });
      totalAmount += price;
      updateTotal();

      const row = document.createElement("tr");
      row.setAttribute("data-name", name);
      row.innerHTML = `
        <td>${cartItems.length}</td>
        <td>${name}</td>
        <td>₹${price}</td>
      `;
      cartBody.appendChild(row);

      btn.style.display = "none";
      serviceItem.querySelector(".remove-btn").style.display = "inline-block";

      updateCartState();
    });
  });

  // ================= REMOVE ITEM =================
  removeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceItem = btn.closest(".service-item");
      const name = serviceItem.querySelector(".service-name").textContent;
      const priceText = serviceItem.querySelector(".service-price").textContent;
      const price = parseInt(priceText.replace("₹", ""));

      cartItems = cartItems.filter(item => item.name !== name);
      totalAmount -= price;
      updateTotal();

      const row = cartBody.querySelector(`tr[data-name="${name}"]`);
      if (row) row.remove();

      [...cartBody.children].forEach((row, i) => {
        row.children[0].textContent = i + 1;
      });

      btn.style.display = "none";
      serviceItem.querySelector(".add-btn").style.display = "inline-block";

      updateCartState();
    });
  });

  // ================= BOOK NOW =================
  bookBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (cartItems.length === 0) return;

    if (
      nameInput.value.trim() === "" ||
      emailInput.value.trim() === "" ||
      phoneInput.value.trim() === ""
    ) {
      alert("Please fill all the details before booking.");
      return;
    }

    // Show success message
    successMsg.style.display = "flex";

    // Hide success message after 3 seconds
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 5000);

    // Reset cart
    cartItems = [];
    totalAmount = 0;
    updateTotal();
    cartBody.innerHTML = "";

    // Reset buttons
    addBtns.forEach(btn => (btn.style.display = "inline-block"));
    removeBtns.forEach(btn => (btn.style.display = "none"));

    // Clear inputs
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";

    updateCartState();
  });

  // ================= INITIAL =================
  updateTotal();
  updateCartState();

});


