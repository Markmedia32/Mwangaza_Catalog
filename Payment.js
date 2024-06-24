document.addEventListener('DOMContentLoaded', function() {
    // Retrieve orders data from local storage
    let ordersData = JSON.parse(localStorage.getItem('orders')) || [];

    // Retrieve expenses data from local storage
    let expensesData = JSON.parse(localStorage.getItem('expenses')) || [];

    // Calculate total amount made and total amount paid
    let totalAmountMade = 0;
    let totalAmountPaid = 0;

    ordersData.forEach(orderData => {
        totalAmountMade += parseFloat(orderData.cakePrice);
        totalAmountPaid += parseFloat(orderData.amountPaid); // Corrected property name to amountPaid
    });

    // Calculate total expenses
    let totalExpenses = 0;
    expensesData.forEach(expense => {
        totalExpenses += parseFloat(expense.amount);
    });

    // Calculate total money at hand
    const moneyAtHand = totalAmountPaid - totalExpenses;

    // Display fully paid orders
    const fullyPaidOrdersList = document.getElementById('fully-paid-orders-list');
    fullyPaidOrdersList.innerHTML = ''; // Clear previous content
    const fullyPaidOrders = ordersData.filter(orderData => orderData.amountPaid >= orderData.cakePrice);
    fullyPaidOrders.forEach(orderData => {
        const li = document.createElement('li');
        li.textContent = `${orderData.orderNumber} - ${orderData.customerName}`;
        fullyPaidOrdersList.appendChild(li);
    });

    // Display partially paid orders
    const partiallyPaidOrdersList = document.getElementById('partially-paid-orders-list');
    partiallyPaidOrdersList.innerHTML = ''; // Clear previous content
    const partiallyPaidOrders = ordersData.filter(orderData => orderData.amountPaid < orderData.cakePrice);
    partiallyPaidOrders.forEach(orderData => {
        const li = document.createElement('li');
        const balance = parseFloat(orderData.cakePrice) - parseFloat(orderData.amountPaid);
        li.textContent = `${orderData.orderNumber} - ${orderData.customerName} (Balance: Ksh ${balance.toFixed(2)})`;
        partiallyPaidOrdersList.appendChild(li);
    });

    // Display total money at hand, total amount made, and total expenses
    const moneyAtHandElement = document.getElementById('money-at-hand');
    moneyAtHandElement.textContent = `Money at Hand: Ksh ${moneyAtHand.toFixed(2)}`;

    const totalAmountMadeElement = document.getElementById('total-amount');
    totalAmountMadeElement.textContent = `Total Amount Made: Ksh ${totalAmountMade.toFixed(2)}`;

    const totalExpensesElement = document.getElementById('total-expenses');
    totalExpensesElement.textContent = `Total Expenses: Ksh ${totalExpenses.toFixed(2)}`;
});
