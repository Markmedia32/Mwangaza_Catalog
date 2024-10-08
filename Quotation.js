document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the stored invoice count from localStorage, or start with 1 if not set
    let invoiceCount = localStorage.getItem('invoiceCount') ? parseInt(localStorage.getItem('invoiceCount')) : 1;

    function updateInvoiceNumber() {
        document.getElementById('invoice-number').textContent = String(invoiceCount).padStart(3, '0');
    }

    updateInvoiceNumber();

    // Add a new row for an item
    document.getElementById('add-item').addEventListener('click', function () {
        const tbody = document.getElementById('invoice-items');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" placeholder="Enter item"></td>
            <td><input type="text" placeholder="Enter description"></td>
            <td><input type="number" placeholder="Enter quantity"></td>
            <td><input type="number" placeholder="Enter price"></td>
            <td><span class="total-price">0</span></td>
            <td><button class="delete-item">Delete</button></td>
        `;
        tbody.appendChild(row);

        // Add event listener to the new delete button
        row.querySelector('.delete-item').addEventListener('click', function () {
            row.remove();
            calculateTotals(); // Recalculate totals after deleting a row
        });
    });

    // Calculate total price per row and the grand total
    function calculateTotals() {
        let grandTotal = 0;
        document.querySelectorAll('#invoice-items tr').forEach(row => {
            const quantity = row.querySelector('td:nth-child(3) input').value;
            const price = row.querySelector('td:nth-child(4) input').value;
            const totalPrice = quantity * price;
            row.querySelector('.total-price').textContent = totalPrice;
            grandTotal += totalPrice;
        });
        document.getElementById('invoice-total').textContent = grandTotal + ' Ksh';
    }

    document.getElementById('invoice-items').addEventListener('input', calculateTotals);

    // Generate PDF
    document.getElementById('generate-pdf').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Set Title
        doc.setFontSize(20);
        doc.text('Mwangaza Bakes Invoice', 20, 20);

        // Invoice Details
        doc.setFontSize(12);
        doc.text(`Baker: ${document.getElementById('baker-name').textContent}`, 20, 30);
        doc.text(`Date: ${document.getElementById('invoice-date').value}`, 20, 40);
        doc.text(`Invoice No: ${document.getElementById('invoice-number').textContent}`, 20, 50);

        // Client Details
        doc.text(`Client: ${document.getElementById('client-name').value}`, 20, 60);
        doc.text(`Address: ${document.getElementById('client-address').value}`, 20, 70);
        doc.text(`Contact: ${document.getElementById('client-contact').value}`, 20, 80);

        // Table Header
        doc.setFontSize(10);
        doc.text('Item', 20, 100);
        doc.text('Description', 60, 100);
        doc.text('Quantity', 100, 100);
        doc.text('Price (Ksh)', 140, 100);
        doc.text('Total (Ksh)', 180, 100);

        // Invoice Items
        let startY = 110;
        document.querySelectorAll('#invoice-items tr').forEach(row => {
            const columns = row.querySelectorAll('input');
            doc.text(columns[0].value, 20, startY);
            doc.text(columns[1].value, 60, startY);
            doc.text(columns[2].value, 100, startY);
            doc.text(columns[3].value, 140, startY);
            doc.text(row.querySelector('.total-price').textContent, 180, startY);
            startY += 10;
        });

        // Total
        doc.setFontSize(12);
        doc.text(`Total: ${document.getElementById('invoice-total').textContent}`, 160, startY + 10);

        // Save PDF
        doc.save('invoice.pdf');

        // Increment invoice count for the next invoice
        invoiceCount++;
        localStorage.setItem('invoiceCount', invoiceCount); // Store the updated count in localStorage
        updateInvoiceNumber();
    });
});
