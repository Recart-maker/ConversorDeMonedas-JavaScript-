const API_KEY = '8fdba2b395400c5f9922e151'; // Consigue tu API key de exchangeratesapi.io
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');



let currencies = [];

// Fetch currencies
fetch(BASE_URL)
    .then(response => response.json())
    .then(data => {
        currencies = Object.keys(data.conversion_rates);
        populateCurrencies();
    })
    .catch(error => showError('Error fetching currency data'));

function populateCurrencies() {
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        option2.value = currency;
        option2.textContent = currency;
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });
}

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount)) {
        showError('Please enter a valid amount');
        return;
    }

    if (from === to) {
        showError('Please select different currencies');
        return;
    }

    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                resultDiv.innerHTML = `
                    ${amount} ${from} = 
                    <span class="highlight">${data.conversion_result.toFixed(2)} ${to}</span>
                `;
                errorDiv.textContent = '';
            } else {
                showError('Conversion failed');
            }
        })
        .catch(error => showError('Error converting currency'));
}

function showError(message) {
    errorDiv.textContent = message;
    resultDiv.textContent = '';
}

convertBtn.addEventListener('click', convertCurrency);