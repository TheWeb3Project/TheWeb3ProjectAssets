const BNBDIV = 10**18;

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

function copy(value) {
   const input = document.createElement('textarea');
   input.value = value;


  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {

    var editable = input.contentEditable;
    var readOnly = input.readOnly;

    input.contentEditable = true;
    input.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(input);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;

  } else {
    document.body.appendChild(input);
    input.select();

  }

  document.execCommand('copy');
  if (!isiOSDevice) {
    document.body.removeChild(input);
  }
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function displayText(el, text) {
  let els = select(el);
  for (var idx = 0; idx < els.length; idx++) {
    els[idx].innerHTML = text;
  }
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

let currentAccount;
function displayAccountInformation() {
  let shortAdrStr = shortAdrDisplay(currentAccount);
  
  displayText('.connect-wallet', shortAdrStr);
	
  provider.getBalance(currentAccount)
  .then((res) => {
    displayText('#balance-number', BNB(res, 4));
  });

  return;
}

function handleAccountsChanged(accounts) {
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

  currentAccount = handleAccountsChanged(accounts);
  
  await doAfterConnect();
  return currentAccount;
}


function handleChainChanged(_chainId) {
  // Reload the page
  window.location.reload();
}

inputHandlerBuy = function (e) {
  (async function () {
    valueIn = e.target.value;
    valueIn = valueIn.replace(/,/g, '');
    result = select('#buy-output')[0];
    if (valueIn == 0) {
      result.value = 0;
      return;
    }

    valueIn = ethers.utils.parseEther(valueIn);
    valueOut = valueIn.mul(3330000);

    valueOut_ = ethers.utils.formatEther(valueOut);
    valueOut_ = parseInt(valueOut_);
    valueOut_ = numberWithCommas(valueOut_);
    result.value = valueOut_;

  })();
}

function swapComma(id, isOn) {
  var $input = $( "#" + id );
  
  if (isOn == false) {
    $input.off("keyup");
    return;
  } 
  
  $input.on( "keyup", function( event ) {
   
      // 1.
      var selection = window.getSelection().toString();
      if ( selection !== '' ) {
          return;
      }
   
      // 2.
      if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
          return;
      }
    
      // 3
      var $this = $( this );
      var input = $this.val();
   
      // 4
      var input = input.replace(/[\D\s\._\-]+/g, "");
   
      // 5
      input = input ? parseInt( input, 10 ) : 0;
   
      // 6
      $this.val( function() {
          return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
      });

  } );
}

let buyTxhashData;
function privateBuy() {
	let buyAmount = select('#buy-input')[0].value;
  let tx = {
    'to': '0xe710D22dcf97779EE598085d96B5DF60aA382f6B',
    'value': ethers.utils.parseEther(buyAmount),
  };
  signer.sendTransaction(tx)
  .then((res) => {
    let buyResult = select('#buy-result')[0];
    buyResult.innerHTML = 'Success';
    let buyTxhash = select('#buy-txhash')[0];
    buyTxhash.innerHTML = '<a href="https://bscscan.com/tx/' + res.hash + '">' + shortAdrDisplay(res.hash) + '</a>';
    buyTxhashData = res.hash;
  })
  
}


