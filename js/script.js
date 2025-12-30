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

  /* ================= WARNING ON INPUT FOCUS ================= */
  [nameInput, emailInput, phoneInput].forEach(input => {
    input.addEventListener("focus", () => {
      if (cartItems.length === 0) {
        bookWarning.style.display = "flex";
      }
    });
  });

  /* ================= ADD ITEM ================= */
  addBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceItem = btn.closest(".service-item");
      const name = serviceItem.querySelector(".service-name").textContent;
      const price = parseInt(
        serviceItem.querySelector(".service-price").textContent.replace("₹", "")
      );

      if (cartItems.find(item => item.name === name)) return;

      cartItems.push({ name, price });
      totalAmount += price;
      updateTotal();

      const row = document.createElement("tr");
      row.dataset.name = name;
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

  /* ================= REMOVE ITEM ================= */
  removeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceItem = btn.closest(".service-item");
      const name = serviceItem.querySelector(".service-name").textContent;
      const price = parseInt(
        serviceItem.querySelector(".service-price").textContent.replace("₹", "")
      );

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

  /* ================= BOOK NOW ================= */
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

    const servicesList = cartItems
      .map(item => `• ${item.name} - ₹${item.price}`)
      .join("\n");

    emailjs.send(
      "service_ho10t1a",
      "template_lo5o89u",
      {
        user_name: nameInput.value,
        user_email: emailInput.value,
        user_phone: phoneInput.value,
        services_list: servicesList,
        total_amount: `₹${totalAmount}`
      }
    )
    .then(() => {
      successMsg.style.display = "flex";

      setTimeout(() => {
        successMsg.style.display = "none";
      }, 5000);

      cartItems = [];
      totalAmount = 0;
      cartBody.innerHTML = "";
      updateTotal();

      addBtns.forEach(btn => btn.style.display = "inline-block");
      removeBtns.forEach(btn => btn.style.display = "none");

      nameInput.value = "";
      emailInput.value = "";
      phoneInput.value = "";

      updateCartState();
    })
    .catch(error => {
      console.error("EmailJS Error:", error);
      alert("Email failed. Check EmailJS template variables.");
    });
  });

  /* ================= INITIAL ================= */
  updateTotal();
  updateCartState();

});
