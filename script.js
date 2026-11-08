
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate Dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Update Exchange Rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "") {
    msg.innerText = "Enter amount";
    return;
}

if (amtVal < 1) {
    msg.innerText = "Amount must be greater than 0";
    return;
}

  try {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Currency API request failed");
    }

    let data = await response.json();

    let rate =
      data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    if (!rate) {
      throw new Error("Exchange rate not available");
    }

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    console.log(error);
    msg.innerText = "Unable to fetch exchange rate!";
  }
};

// Update Flags
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Button Click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Amount Change
document.querySelector(".amount input").addEventListener("input", () => {
  updateExchangeRate();
});

// Initial Load
window.addEventListener("load", () => {
    fromCurr.value = "USD";
    toCurr.value = "PKR";

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();
});