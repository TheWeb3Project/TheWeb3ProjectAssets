BNBDIV = 10**18;

function round(value, n=0) {
  return value.toFixed(n);
}
function BNB(value, n=4) {
  value = parseInt(value);
  return round(value / BNBDIV, n);
}

function select(el, all = true) {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

async function afconnect() {
  accounts = await ethereum
    .request({ method: 'eth_requestAccounts' }); // eth_requestAccounts

  currentAccount = await ahandleAccountsChanged(accounts);

  return currentAccount;
}
