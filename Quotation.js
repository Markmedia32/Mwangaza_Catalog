// quotation_invoices.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quotation-invoice-form');
    const itemList = document.getElementById('item-list');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const clientName = document.getElementById('client-name').value;
        const clientEmail = document.getElementById('client-email').value;
        const itemName = document.getElementById('item-name').value;
        const itemDescription = document.getElementById('item-description').value;
        const itemPrice = document.getElementById('item-price').value;

        // Validate form inputs
        if (clientName.trim() === '' || clientEmail.trim() === '' || itemName.trim() === '' || itemDescription.trim() === '' || itemPrice.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Create new item
        const newItem = document.createElement('li');
        newItem.innerHTML = `
            <strong>Client Name:</strong> ${clientName}<br>
            <strong>Client Email:</strong> ${clientEmail}<br>
            <strong>Item Name:</strong> ${itemName}<br>
            <strong>Item Description:</strong> ${itemDescription}<br>
            <strong>Item Price:</strong> ${itemPrice}<br>
        `;

        // Add item to the list
        itemList.appendChild(newItem);

        // Clear form inputs
        form.reset();
    });
});
