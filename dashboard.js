document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const logoutBtn = document.getElementById('logout-btn');
    const orderForm = document.getElementById('order-form');
    const orderList = document.getElementById('order-list');
    const errorMessage = document.getElementById('error-message');

    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'access.html'; // Redirect to login page if not logged in
    }

    // Toggle navigation menu
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = 'access.html'; // Redirect to login page after logout
    });

    // Add new order form submission
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const orderNumber = document.getElementById('order-number').value.trim();
        const customerName = document.getElementById('customer-name').value.trim();
        const orderDate = document.getElementById('order-date').value;
        const cakeDescription = document.getElementById('cake-description').value.trim();
        const kgs = document.getElementById('kgs').value.trim();
        const amountPaid = parseFloat(document.getElementById('Amount-paid').value) || 0;
        const deliveryAddress = document.getElementById('Delivery-Address').value.trim();
        const status = document.getElementById('status').value.trim();
        const cakePrice = parseFloat(document.getElementById('cake-price').value) || 0;

        // Validate order number uniqueness (optional)
        if (isOrderNumberUnique(orderNumber)) {
            // Add order to UI
            addOrder(orderNumber, customerName, orderDate, cakeDescription, kgs, amountPaid, deliveryAddress, status, cakePrice);
            
            // Save orders to local storage
            saveOrdersToLocalStorage();

            // Reset form
            this.reset();
        } else {
            errorMessage.textContent = 'Order Number already exists!';
        }
    });

    // Function to check if order number is unique
    function isOrderNumberUnique(orderNumber) {
        const existingOrderNumbers = Array.from(orderList.querySelectorAll('.order-number')).map(el => el.innerText);
        return !existingOrderNumbers.includes(orderNumber);
    }

    // Function to add order to UI
    function addOrder(orderNumber, customerName, orderDate, cakeDescription, kgs, amountPaid, deliveryAddress, status, cakePrice) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order');
        orderItem.innerHTML = `
            <strong>Order Number:</strong> <span class="order-number">${orderNumber}</span><br>
            <strong>Customer Name:</strong> <span class="customer-name">${customerName}</span><br>
            <strong>Order Date:</strong> <span class="order-date">${orderDate}</span><br>
            <strong>Cake Description:</strong> <span class="cake-description">${cakeDescription}</span><br>
            <strong>Kgs:</strong> <span class="kgs">${kgs}</span><br>
            <strong>Amount Paid:</strong> <span class="amount-paid">${amountPaid}</span><br>
            <strong>Delivery Address:</strong> <span class="delivery-address">${deliveryAddress}</span><br>
            <strong>Cake Price:</strong> <span class="cake-price">${cakePrice}</span><br>
            <strong>Status:</strong> <span class="status">${status}</span><br>
            <button class="delete-btn">Delete</button>
        `;

        orderList.appendChild(orderItem);

        orderItem.querySelector('.delete-btn').addEventListener('click', function() {
            orderList.removeChild(orderItem);
            saveOrdersToLocalStorage();
        });
    }

    // Function to save orders to local storage
    function saveOrdersToLocalStorage() {
        const orderElements = Array.from(orderList.querySelectorAll('.order'));
        const ordersData = [];

        orderElements.forEach(function(orderElement) {
            const orderData = {
                orderNumber: orderElement.querySelector('.order-number').innerText.trim(),
                customerName: orderElement.querySelector('.customer-name').innerText.trim(),
                orderDate: orderElement.querySelector('.order-date').innerText.trim(),
                cakeDescription: orderElement.querySelector('.cake-description').innerText.trim(),
                kgs: orderElement.querySelector('.kgs').innerText.trim(),
                amountPaid: parseFloat(orderElement.querySelector('.amount-paid').innerText.trim()),
                deliveryAddress: orderElement.querySelector('.delivery-address').innerText.trim(),
                status: orderElement.querySelector('.status').innerText.trim(),
                cakePrice: parseFloat(orderElement.querySelector('.cake-price').innerText.trim())
            };

            ordersData.push(orderData);
        });

        localStorage.setItem('orders', JSON.stringify(ordersData));
    }

    // Function to load orders from local storage on page load
    function loadOrdersFromLocalStorage() {
        const ordersData = JSON.parse(localStorage.getItem('orders'));

        if (ordersData) {
            ordersData.forEach(function(orderData) {
                addOrder(orderData.orderNumber, orderData.customerName, orderData.orderDate, orderData.cakeDescription, orderData.kgs, orderData.amountPaid, orderData.deliveryAddress, orderData.status, orderData.cakePrice);
            });
        }
    }

    // Load orders from local storage when DOM content is loaded
    loadOrdersFromLocalStorage();
});
