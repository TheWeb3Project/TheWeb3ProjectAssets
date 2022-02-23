BNBDIV = 10**18;

function round(value, n=0) {
  return value.toFixed(n);
}
function BNB(value, n=4) {
  value = parseInt(value);
  return round(value / BNBDIV, n);
}

function WRAP(v) {
	return '[' + v + ']';
}


function select(el, all = true) {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

function copyValue(value) {
  navigator.clipboard.writeText(value);
}



function shortAdrDisplay(adr) {
  let shortAdrStr = adr.slice(0, 6) + '..' + adr.slice(-4);
  return shortAdrStr;
}

function ADR(address) {
  let checksumAdr;
  try {
    checksumAdr = ethers.utils.getAddress(address);
  } catch (error) {
    alert('Wrong Format Address: [' + address + ']');

    return '';
  }
  return checksumAdr;
}

function displayAccountInformation() {
  let shortAdrStr = shortAdrDisplay(currentAccount);
  
  let els = select('.connect-wallet');
  for (var idx = 0; idx < els.length; idx++) {
    els[idx].innerHTML = shortAdrStr;
  }
  
  return;
}

let currentAccount;
async function ahandleAccountsChanged(accounts) {
  if (accounts.length == 0) {
    displayText("connectResult", 'Please Connect Metamask');
    return;
  }

  currentAccount = ADR(accounts[0]);
  displayAccountInformation();
  
  return currentAccount;
}

async function afconnect() {
  let accounts = await ethereum
    .request({ method: 'eth_requestAccounts' }); // eth_requestAccounts

  currentAccount = await ahandleAccountsChanged(accounts);

  return currentAccount;
}
