document.addEventListener('DOMContentLoaded', () => {
    const goldWeightInput = document.getElementById('goldWeight');
    const caratRadios = document.querySelectorAll('input[name="carat"]');
    const gstRateInput = document.getElementById('gstRate');
    const calculateBtn = document.getElementById('calculateBtn');
    const todayGoldRateSpan = document.getElementById('todayGoldRate');
    const lastUpdatedSpan = document.getElementById('lastUpdated');
    const goldValueOnlySpan = document.getElementById('goldValueOnly');
    const makingChargesDisplaySpan = document.getElementById('makingChargesDisplay');
    const subtotalPriceSpan = document.getElementById('subtotalPrice');
    const gstPercentDisplaySpan = document.getElementById('gstPercentDisplay');
    const gstAmountSpan = document.getElementById('gstAmount');
    const totalPriceSpan = document.getElementById('totalPrice');
    const resultsSection = document.querySelector('.results');

    let current24KRatePerGram = 10000; // fallback rate

    async function fetchLiveGoldRate() {
        try {
            const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
                method: "GET",
                headers: {
                    "x-access-token": "goldapi-1afz519mdn7v2i4-io",
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if (data && data.price_gram_24k) {
                current24KRatePerGram = data.price_gram_24k;
                todayGoldRateSpan.textContent = `${current24KRatePerGram.toFixed(2)} INR`;
                lastUpdatedSpan.textContent = new Date().toLocaleString();
            } else {
                throw new Error("Invalid API response");
            }
        } catch (e) {
            todayGoldRateSpan.textContent = `Fallback: ${current24KRatePerGram.toFixed(2)} INR`;
            lastUpdatedSpan.textContent = new Date().toLocaleString();
        }
    }

    function calculateGoldPrice() {
        const weight = parseFloat(goldWeightInput.value);
        const selectedCarat = document.querySelector('input[name="carat"]:checked').value;
        const gstRatePercent = parseFloat(gstRateInput.value);

        if (isNaN(weight) || weight <= 0) {
            alert("Please enter a valid gold weight.");
            return;
        }

        let caratMultiplier = selectedCarat === '24' ? 1 :
                              selectedCarat === '22' ? 0.9677 :
                              selectedCarat === '18' ? 0.8500 : 1;

        const goldRatePerGram = current24KRatePerGram * caratMultiplier;
        const goldValue = goldRatePerGram * weight;
        const makingCharges = goldValue * 0.15;
        const subtotal = goldValue + makingCharges;
        const gstAmount = subtotal * (gstRatePercent / 100);
        const totalPrice = subtotal + gstAmount;

        goldValueOnlySpan.textContent = goldValue.toFixed(2);
        makingChargesDisplaySpan.textContent = `${makingCharges.toFixed(2)} (15% of gold value)`;
        subtotalPriceSpan.textContent = subtotal.toFixed(2);
        gstPercentDisplaySpan.textContent = gstRatePercent.toFixed(1);
        gstAmountSpan.textContent = gstAmount.toFixed(2);
        totalPriceSpan.textContent = totalPrice.toFixed(2);

        resultsSection.style.display = 'block';
    }

    calculateBtn.addEventListener('click', calculateGoldPrice);
    fetchLiveGoldRate();
});
