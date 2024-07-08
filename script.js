// scripts.js

const transactionForm = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const balanceDisplay = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

let transactions = [];

// Fetch transactions from server
async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        transactions = data;
        displayTransactions();
        calculateBalance();
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
    }
}

// Display transactions in the UI
function displayTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const transactionClass = transaction.amount < 0 ? 'negative' : 'positive';
        const transactionItem = document.createElement('li');
        transactionItem.classList.add('transaction-item', transactionClass);
        transactionItem.innerHTML = `
            ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">x</button>
        `;
        transactionList.appendChild(transactionItem);
    });
}

// Calculate and display balance
function calculateBalance() {
    const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
}

// Add new transaction
async function addTransaction(event) {
    event.preventDefault();
    const text = textInput.value.trim();
    const amount = +amountInput.value.trim();
    if (text === '' || isNaN(amount)) {
        alert('Please enter valid text and amount!');
        return;
    }

    const transaction = {
        text,
        amount
    };

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction)
        });
        const data = await response.json();
        transactions.push(data);
        displayTransactions();
        calculateBalance();
        textInput.value = '';
        amountInput.value = '';
    } catch (error) {
        console.error('Error adding transaction:', error.message);
    }
}

// Delete transaction
async function deleteTransaction(id) {
    try {
        await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
        });
        transactions = transactions.filter(transaction => transaction._id !== id);
        displayTransactions();
        calculateBalance();
    } catch (error) {
        console.error('Error deleting transaction:', error.message);
    }
}

// Toggle dark mode
function toggleDarkMode() {
    body.classList.toggle('dark-theme');
}

// Event listeners
transactionForm.addEventListener('submit', addTransaction);
darkModeToggle.addEventListener('click', toggleDarkMode);

// Initialize
fetchTransactions();
