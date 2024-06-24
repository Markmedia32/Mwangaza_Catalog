document.addEventListener('DOMContentLoaded', function() {
    const addItemBtn = document.getElementById('addItemBtn');
    const itemInput = document.getElementById('item');
    const stockStatusSelect = document.getElementById('stockStatus');
    const inStockList = document.getElementById('in-stock-items');
    const outOfStockList = document.getElementById('out-of-stock-items');
    const almostOutOfStockList = document.getElementById('almost-out-of-stock-items');

    // Load items from localStorage if available
    let items = JSON.parse(localStorage.getItem('shoppingList')) || [];

    // Function to render items in respective categories
    function renderItems() {
        inStockList.innerHTML = '';
        outOfStockList.innerHTML = '';
        almostOutOfStockList.innerHTML = '';

        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name}</span>
                <span class="stock-status">${item.stockStatus === 'in-stock' ? 'In Stock' : item.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Almost Out of Stock'}</span>
                <button class="delete-btn" data-index="${index}">Remove</button>
            `;

            if (item.stockStatus === 'in-stock') {
                li.classList.add('in-stock');
                inStockList.appendChild(li);
            } else if (item.stockStatus === 'out-of-stock') {
                li.classList.add('out-of-stock');
                outOfStockList.appendChild(li);
            } else {
                li.classList.add('almost-out-of-stock');
                almostOutOfStockList.appendChild(li);
            }
        });

        // Save items to localStorage after rendering
        saveItems();
    }

    // Function to add new item to the list
    function addItem() {
        const newItemName = itemInput.value.trim();
        const newItemStockStatus = stockStatusSelect.value;

        if (newItemName !== '') {
            const newItem = {
                name: newItemName,
                stockStatus: newItemStockStatus
            };
            items.push(newItem);
            renderItems();
            itemInput.value = ''; // Clear input after adding
        }
    }

    // Function to remove item from the list
    function removeItem(index) {
        items.splice(index, 1);
        renderItems();
    }

    // Function to save items to localStorage
    function saveItems() {
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }

    // Event listener for add item button
    addItemBtn.addEventListener('click', addItem);

    // Event delegation for remove item button
    inStockList.addEventListener('click', handleRemoveItem);
    outOfStockList.addEventListener('click', handleRemoveItem);
    almostOutOfStockList.addEventListener('click', handleRemoveItem);

    function handleRemoveItem(event) {
        if (event.target.classList.contains('delete-btn')) {
            const index = parseInt(event.target.dataset.index);
            removeItem(index);
        }
    }

    // Initial render of items
    renderItems();
});
