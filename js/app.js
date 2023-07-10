const selectCriptos = document.querySelector('#criptomonedas');
const selectCurrency = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const resultsContainer = document.querySelector('#resultado');
const searchObj = {
  currency: '',
  criptoCurrency: ''
}

// create a Promise
const getCriptocurrency = criptocurrency => new Promise(resolve => {
  resolve(criptocurrency);
});

document.addEventListener('DOMContentLoaded', (e) => {
  queryCriptocurrency();

  if (form) {
    form.addEventListener('submit', submitForm);
  }

  if (selectCriptos) {
    selectCriptos.addEventListener('change', readValue);
  }

  if (selectCurrency) {
    selectCurrency.addEventListener('change', readValue);
  }
});


async function queryCriptocurrency() {
  const URL = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  try {
    const response = await fetch(URL);
    const result = await response.json();
    const criptocurrency = await getCriptocurrency(result.Data);
    selectCriptocurrency(criptocurrency);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptocurrency(criptos) {
  criptos.forEach(cripto => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement('OPTION');
    option.value = Name;
    option.textContent = FullName;

    if (selectCriptos) {
      selectCriptos.appendChild(option);
    }
  });
}

function readValue(e) {
  searchObj[e.target.name] = e.target.value;
}

function submitForm(e) {
  e.preventDefault();

  const { currency, criptoCurrency } = searchObj;

  if (currency === '' || criptoCurrency === '') {
    showAlert('Both fields are required');
    return;
  }

  queryAPI();
}

function showAlert(msg) {
  const existAlert = document.querySelector('.error');

  if (!existAlert) {
    const alert = document.createElement('DIV');
    alert.classList.add('error');
    alert.textContent = msg;

    form.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
  }
}

async function queryAPI() {
  const { currency, criptoCurrency } = searchObj;
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoCurrency}&tsyms=${currency}`;

  spinner();

  try {
    const response = await fetch(URL);
    const price = await response.json();
    showPrice(price.DISPLAY[criptoCurrency][currency]);
  } catch (error) {
    console.log(error)
  }
}

function showPrice(price) {

  clearHtml(resultsContainer);

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = price;

  const priceElement = document.createElement('P');
  priceElement.classList.add('precio');

  priceElement.innerHTML = `
    Price is: <span>${PRICE}</span>
  `;

  const highPrice = document.createElement('P');
  highPrice.innerHTML = `
    High price of day is: <span>${HIGHDAY}</span>
  `;

  const lowPrice = document.createElement('P');
  lowPrice.innerHTML = `
    Low price of day is: <span>${LOWDAY}</span>
  `;

  const lastHours = document.createElement('P');
  lastHours.innerHTML = `
    Changes last 24 hours: <span>${CHANGEPCT24HOUR}%</span>
  `;

  const lastUpdate = document.createElement('P');
  lastUpdate.innerHTML = `
    last Update: <span>${LASTUPDATE}</span>
  `;

  resultsContainer.appendChild(priceElement);
  resultsContainer.appendChild(highPrice);
  resultsContainer.appendChild(lowPrice);
  resultsContainer.appendChild(lastHours);
  resultsContainer.appendChild(lastUpdate);

}

function clearHtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}

function spinner() {
  clearHtml(resultsContainer);

  const spinner = document.createElement('DIV');
  spinner.classList.add('spinner');

  spinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  `;

  resultsContainer.appendChild(spinner);
}