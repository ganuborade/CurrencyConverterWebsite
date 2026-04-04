// Converter Page Functionality
const dropList = document.querySelectorAll("form select"),
fromCurrency = document.getElementById("fromCurrency"),
toCurrency = document.getElementById("toCurrency"),
convertBtn = document.getElementById("convertBtn"),
exchangeBtn = document.getElementById("exchangeBtn"),
amount = document.getElementById("amount");

// Populate currency options
for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "INR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Load flag images
function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){
            let flagImg = element.parentElement.querySelector("img");
            flagImg.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// Exchange button functionality
if (exchangeBtn) {
    exchangeBtn.addEventListener("click", () => {
        let tempCode = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tempCode;
        loadFlag(fromCurrency);
        loadFlag(toCurrency);
        getExchangeRate();
    });
}

// Convert button
if (convertBtn) {
    convertBtn.addEventListener("click", (e) => {
        e.preventDefault();
        getExchangeRate();
    });
}

// Get exchange rate
function getExchangeRate(){
    const exchangeRateTxt = document.getElementById("exchangeRate");
    const rateInfo = document.getElementById("rateInfo");
    let amountVal = amount.value;

    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";
    rateInfo.innerText = "";

    let url = `https://v6.exchangerate-api.com/v6/daf691a2827995b7529604bc/latest/${fromCurrency.value}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
            rateInfo.innerText = `1 ${fromCurrency.value} = ${exchangeRate.toFixed(4)} ${toCurrency.value}`;
            
            // Load multi-currency converter
            loadMultiCurrencyConverter(amountVal, fromCurrency.value);
            
            // Load rates table
            loadRatesTable(fromCurrency.value);
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Something went wrong";
            rateInfo.innerText = "Please check your connection and try again";
        });
}

// Multi-currency converter
function loadMultiCurrencyConverter(amount, baseCurrency) {
    const multiResults = document.getElementById("multiResults");
    const multiAmount = document.querySelector(".multi-amount");
    
    if (!multiResults) return;
    
    multiResults.innerHTML = "";
    
    const majorCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "INR", "MXN", "SGD"];
    
    let url = `https://v6.exchangerate-api.com/v6/daf691a2827995b7529604bc/latest/${baseCurrency}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            majorCurrencies.forEach(currency => {
                if (currency !== baseCurrency && result.conversion_rates[currency]) {
                    let rate = result.conversion_rates[currency];
                    let converted = (amount * rate).toFixed(2);
                    
                    let resultDiv = document.createElement("div");
                    resultDiv.className = "multi-result-item";
                    resultDiv.style.cssText = `
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    `;
                    resultDiv.innerHTML = `
                        <span style="font-weight: 500;">${currency}</span>
                        <span style="color: #0083b0; font-weight: 600;">${converted}</span>
                    `;
                    multiResults.appendChild(resultDiv);
                }
            });
        })
        .catch(() => {
            console.log("Error loading multi-currency data");
        });
}

// Load rates table
function loadRatesTable(baseCurrency) {
    const tableBody = document.getElementById("ratesTableBody");
    
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    
    const majorCurrencies = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "MXN", "SGD"];
    
    let url = `https://v6.exchangerate-api.com/v6/daf691a2827995b7529604bc/latest/${baseCurrency}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            majorCurrencies.forEach(currency => {
                if (result.conversion_rates[currency]) {
                    let rate = result.conversion_rates[currency];
                    let row = document.createElement("tr");
                    
                    let countryName = getCurrencyName(currency);
                    let change = (Math.random() * 2 - 1).toFixed(2); // Mock change percentage
                    let changeClass = change > 0 ? 'positive' : 'negative';
                    
                    row.innerHTML = `
                        <td>${countryName}</td>
                        <td>${currency}</td>
                        <td>${rate.toFixed(4)}</td>
                        <td style="color: ${change > 0 ? '#27ae60' : '#e74c3c'};">${change > 0 ? '+' : ''}${change}%</td>
                    `;
                    tableBody.appendChild(row);
                }
            });
        })
        .catch(() => {
            let row = document.createElement("tr");
            row.innerHTML = `<td colspan="4" style="text-align: center; color: #e74c3c;">Error loading rates</td>`;
            tableBody.appendChild(row);
        });
}

// Currency name mapper
function getCurrencyName(code) {
    const names = {
        'EUR': 'Euro',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen',
        'AUD': 'Australian Dollar',
        'CAD': 'Canadian Dollar',
        'CHF': 'Swiss Franc',
        'CNY': 'Chinese Yuan',
        'INR': 'Indian Rupee',
        'MXN': 'Mexican Peso',
        'SGD': 'Singapore Dollar'
    };
    return names[code] || code;
}

// Event listeners
if (amount) {
    amount.addEventListener("input", () => {
        const label = document.querySelector(".amount-box label");
        if (amount.value && amount.value !== "0") {
            getExchangeRate();
        }
    });
}

// Initial load
window.addEventListener("load", () => {
    getExchangeRate();
});

// Auto-refresh rates every 60 seconds
setInterval(() => {
    getExchangeRate();
}, 60000);
