document.addEventListener('DOMContentLoaded', function() {
    let ordersData = JSON.parse(localStorage.getItem('orders')) || [];

    const orderList = document.getElementById('order-list');

    function groupOrdersByMonthAndYear(orders) {
        return orders.reduce((acc, order) => {
            const orderDate = new Date(order.orderDate);
            const monthYear = `${orderDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(order);
            return acc;
        }, {});
    }

    function renderOrders() {
        orderList.innerHTML = '';
        const groupedOrders = groupOrdersByMonthAndYear(ordersData);
        const sortedMonths = Object.keys(groupedOrders).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        sortedMonths.forEach(monthYear => {
            const monthSection = document.createElement('section');
            monthSection.setAttribute('data-month', monthYear);
            monthSection.innerHTML = `<h2>${monthYear}</h2>`;
            groupedOrders[monthYear].forEach(orderData => {
                const orderItem = createOrderItem(orderData);
                monthSection.appendChild(orderItem);
            });
            orderList.appendChild(monthSection);
        });
        
        // Update local storage after rendering
        saveOrdersToLocalStorage();
    }

    function createOrderItem(orderData) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order');

        let statusClass, statusText;
        switch(orderData.status.toLowerCase()) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'fully paid':
                statusClass = 'status-fully-paid';
                statusText = 'Fully Paid';
                break;
            case 'partially paid':
                statusClass = 'status-partially-paid';
                statusText = 'Partially Paid';
                break;
            default:
                statusClass = '';
                statusText = orderData.status;
        }

        orderItem.innerHTML = `
            <strong>Order Number:</strong> ${orderData.orderNumber}<br>
            <strong>Customer Name:</strong> ${orderData.customerName}<br>
            <strong>Order Date:</strong> ${orderData.orderDate}<br>
            <strong>Cake Description:</strong> ${orderData.cakeDescription}<br>
            <strong>Kgs:</strong> ${orderData.kgs}<br>
            <strong>Amount Paid:</strong> <span class="amountPaid">${orderData.amountPaid}</span><br>
            <strong>Cake Price:</strong> ${orderData.cakePrice}<br> 
            <strong>Delivery Address:</strong> ${orderData.deliveryAddress}<br>
            <strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span><br>
            <div class="order-buttons">
                <button class="change-status-btn">Change Status</button>
                <button class="change-amount-paid-btn">Change Amount Paid</button>
            </div>
        `;

        orderItem.querySelector('.change-status-btn').addEventListener('click', function() {
            switch (orderData.status.toLowerCase()) {
                case 'pending':
                    orderData.status = 'Fully Paid';
                    break;
                case 'fully paid':
                    orderData.status = 'Partially Paid';
                    break;
                case 'partially paid':
                    orderData.status = 'Pending';
                    break;
                default:
                    break;
            }
            updateOrderInLocalStorage(orderData);
            renderOrders();
        });

        orderItem.querySelector('.change-amount-paid-btn').addEventListener('click', function() {
            const newAmount = prompt("Enter new amount paid:");
            if (newAmount !== null && !isNaN(newAmount)) {
                orderData.amountPaid = parseFloat(newAmount);
                updateOrderInLocalStorage(orderData);
                renderOrders();
            }
        });

        return orderItem;
    }

    function updateOrderInLocalStorage(updatedOrder) {
        ordersData = ordersData.map(order => {
            if (order.orderNumber === updatedOrder.orderNumber) {
                return updatedOrder;
            }
            return order;
        });
        localStorage.setItem('orders', JSON.stringify(ordersData));
    }

    function saveOrdersToLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(ordersData));
    }

    renderOrders();
});
