document.addEventListener('DOMContentLoaded', function() {
    let expensesData = JSON.parse(localStorage.getItem('expenses')) || [];

    // Get the expenses list element
    const expensesList = document.getElementById('expenses');

    // Populate the expenses list
    displayExpenses(expensesData);

    // Expense form
    const expenseForm = document.getElementById('expense-form');

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Get the expense name, amount, and date
        const expenseNameInput = document.getElementById('expense-name');
        const expenseAmountInput = document.getElementById('expense-amount');
        const expenseDateInput = document.getElementById('expense-date');

        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value);
        const expenseDate = new Date(expenseDateInput.value);

        // Check if the name, amount, and date are valid
        if (expenseName.trim() !== '' && !isNaN(expenseAmount) && !isNaN(expenseDate.getTime())) {
            // Create a new expense object
            const newExpense = {
                name: expenseName,
                amount: expenseAmount,
                date: expenseDate.toISOString() // Store date as ISO string
            };

            // Add the new expense to the expenses data array
            expensesData.push(newExpense);

            // Save the updated expenses data to local storage
            saveExpensesToLocalStorage();

            // Clear the form inputs
            expenseNameInput.value = '';
            expenseAmountInput.value = '';
            expenseDateInput.value = '';

            // Display the updated expenses list
            displayExpenses(expensesData);
        } else {
            alert('Please enter a valid expense name, amount, and date.');
        }
    });

    // Function to create an expense list item
    function createExpenseItem(expenseData, index) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="expense-name">${expenseData.name}</span>
                        <span class="expense-amount">Ksh ${expenseData.amount.toFixed(2)}</span>
                        <button class="delete-expense-btn" data-index="${index}">Delete</button>`;
        li.querySelector('.delete-expense-btn').addEventListener('click', function() {
            // Remove the expense from the expenses data array
            expensesData.splice(index, 1);

            // Save the updated expenses data to local storage
            saveExpensesToLocalStorage();

            // Display the updated expenses list
            displayExpenses(expensesData);
        });
        return li;
    }

    // Function to save expenses data to local storage
    function saveExpensesToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expensesData));
    }

    // Function to display expenses grouped by year and month
    function displayExpenses(expenses) {
        // Clear the current expenses list
        expensesList.innerHTML = '';

        // Group expenses by year and month
        const groupedExpenses = expenses.reduce((acc, expense) => {
            const expenseDate = new Date(expense.date); // Parse ISO date string
            const year = expenseDate.getFullYear();
            const month = expenseDate.toLocaleString('default', { month: 'long' });

            if (!acc[year]) {
                acc[year] = {};
            }

            if (!acc[year][month]) {
                acc[year][month] = [];
            }

            acc[year][month].push(expense);
            return acc;
        }, {});

        // Display the grouped expenses
        Object.keys(groupedExpenses).forEach(year => {
            const yearContainer = document.createElement('div');
            yearContainer.classList.add('expense-group');
            yearContainer.innerHTML = `<h3>${year}</h3>`;

            Object.keys(groupedExpenses[year]).forEach(month => {
                const monthContainer = document.createElement('div');
                monthContainer.classList.add('expense-group');
                monthContainer.innerHTML = `<h4>${month}</h4>`;

                const ul = document.createElement('ul');
                groupedExpenses[year][month].forEach((expense, index) => {
                    const li = createExpenseItem(expense, index);
                    ul.appendChild(li);
                });

                monthContainer.appendChild(ul);
                yearContainer.appendChild(monthContainer);
            });

            expensesList.appendChild(yearContainer);
        });
    }
});
