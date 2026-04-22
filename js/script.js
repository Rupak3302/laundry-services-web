(function() {
    emailjs.init("HDjHYp2TEHm8yjPp2"); // This is my emailjs public key for send email
})();

// I made an array to store the services details for using this show services in UI
const services = [
  {id: 1, icon: '👕', name: 'Dry Cleaning', price: 200.00, },
  {id: 2, icon: '🧺', name: 'Wash & Fold', price: 100.00},
  {id: 3, icon: '👔', name: 'Ironing', price: 30.00},
  {id: 4, icon: '✨', name: 'Stain Removal', price: 500.00},
  {id: 5, icon: '💼', name: 'Leather & Suede Cleaning', price: 999.00},
  {id: 6, icon: '👗', name: 'Wedding Dress Cleaning', price: 2800.00}
];

// this store add to cart items
let cart = [];

// I am selecting all the required elements from HTML so I can update UI 
const servicesList = document.getElementById('js-services-list');
const cartContent = document.getElementById('js-empty-cart');
const totalPriceEl = document.getElementById('js-total-price');
const bookingForm = document.getElementById('js-booking-form');
const inputFields = bookingForm.querySelectorAll('input');
const bookNowBtn = document.getElementById('js-book-btn');
const bookWarning = document.getElementById('js-Warning-msg');
const successMsg = document.getElementById('js-success-msg');

// this fuction shows all the services on the left side 
// and also check if item alrady added or not 
function createServicesList() {
    servicesList.innerHTML = '';
    services.forEach(service => {
        const inCart = cart.find(item => item.id === service.id);
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <div class="service-info">
                <span class="service-icon">${service.icon}</span>
                <span>${service.name} - </span>
                <span class="service-price">₹${service.price.toFixed(2)}</span>
            </div>

            ${inCart 
                ? `<button class="remove-btn" onclick="removeFromCart(${service.id})">
                        Remove Item
                    <i class="fa-solid fa-circle-minus"></i>
                    </button>`
                : `<button class="add-btn" onclick="addToCart(${service.id})">
                        Add Item
                    <i class="fa-solid fa-circle-plus"></i>
                    </button>`
            }`;

        servicesList.appendChild(div);
    });
}

// this fuction update the cart section on the right side
// show added items and total price 
function createCartContent() {
    cartContent.innerHTML = '';

    // if cart is empty then show the empty cart msg 
    if (cart.length === 0) {
        cartContent.innerHTML = `
        <i class="fa-solid fa-circle-info"></i>
        <h4>No Items Added</h4>
        <p>Add items to the cart from the services bar</p>
        `;

        // also show total nas 0
        totalPriceEl.innerHTML = '₹0';

        // disable all input fields
        inputFields.forEach(field => {
            field.readOnly = true;
        });

        // also disable book now btn
        bookNowBtn.disabled = true;
        return;
    } 

    inputFields.forEach(field => field.readOnly = false);

    bookNowBtn.disabled = false;

    bookWarning.style.display = 'none';

    // calculate the total price
    let total = 0;

    // loop through cart items and show them on the cart
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
                <span class="sNo">${index + 1}</span>
                <span class="sName">${item.name}</span>
                <span class="sPrice">₹${item.price.toFixed(2)}</span>            
        `;

        cartContent.appendChild(div);
    });

    totalPriceEl.innerHTML = `₹${total.toFixed(2)}`;

}

// this function runs when user clicks add item btn and it adds selected service to cart
document.addToCart = (id) => {
    const service = services.find(s => s.id === id);
    if (service && !cart.find(item => item.id === service.id)) {
        cart.push(service);
        createServicesList();
        createCartContent();
    }
};

// this function removes item from the cart 
document.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    createServicesList();
    createCartContent();
};

// when click any ionput field if cart is empty then show the warning msg
inputFields.forEach(field => {
    field.addEventListener('focus', () => {
        if (cart.length === 0) {
            bookWarning.style.display = 'flex';
        }
    });
});

// this runs when click the book now button and also checks data and send email
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        bookWarning.style.display = 'flex';
        return;
    }

    // creating email data
    let serviceText = '';
    
    cart.forEach(item => {
        serviceText += `${item.name} - ₹${item.price.toFixed(2)}\n`;
    });
    
    // creating a data object to send in email
    const templateParams = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        services: serviceText,
        total: totalPriceEl.innerHTML

    };

    // sending email using email.js with using Service ID and Template 
    emailjs.send('service_ho10t1a', 'template_lo5o89u', templateParams)
    .then(() => {

        successMsg.style.display = 'flex';
        bookWarning.style.display = 'none';

        bookingForm.reset();
        cart = [];

        createServicesList();
        createCartContent();

        // success msg displayed upto 5 sec
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);

    });

});

createServicesList();
createCartContent();