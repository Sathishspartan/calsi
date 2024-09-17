// Select elements
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const typeEl = document.getElementById("type");
const entriesListEl = document.getElementById("entries-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");

// Entries array to store data
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Load initial entries
displayEntries(entries);

// Event: Add a new entry
document.getElementById("add-btn").addEventListener("click", () => {
    const description = descriptionEl.value;
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;

    if (description && !isNaN(amount)) {
        const entry = {
            id: Date.now(),
            description,
            amount,
            type
        };
        entries.push(entry);
        updateLocalStorage();
        displayEntries(entries);
    }

    descriptionEl.value = "";
    amountEl.value = "";
});

// Event: Filter entries
document.querySelectorAll('input[name="filter"]').forEach(filterRadio => {
    filterRadio.addEventListener('change', function() {
        const filterValue = this.value;
        filterEntries(filterValue);
    });
});

// CRUD functions
function displayEntries(entries) {
    entriesListEl.innerHTML = '';

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach(entry => {
        if (entry.type === "income") {
            totalIncome += entry.amount;
        } else {
            totalExpense += entry.amount;
        }

        const listItem = document.createElement("li");
        listItem.classList.add(entry.type);
        listItem.innerHTML = `
            <span>${entry.description} - ${entry.amount}</span>
            <div>
                <button class="edit-btn" onclick="editEntry(${entry.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `;

        entriesListEl.appendChild(listItem);
    });

    totalIncomeEl.textContent = totalIncome;
    totalExpenseEl.textContent = totalExpense;
    netBalanceEl.textContent = totalIncome - totalExpense;
}

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Edit an entry
function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionEl.value = entry.description;
    amountEl.value = entry.amount;
    typeEl.value = entry.type;

    deleteEntry(id); // Remove the old entry for updating
}

// Delete an entry
function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    displayEntries(entries);
}

// Filter entries based on selected filter
function filterEntries(filter) {
    if (filter === "all") {
        displayEntries(entries);
    } else {
        const filteredEntries = entries.filter(entry => entry.type === filter);
        displayEntries(filteredEntries);
    }
}