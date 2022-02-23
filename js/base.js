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
