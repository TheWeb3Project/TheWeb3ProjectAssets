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


const PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
const SIGNER = PROVIDER.getSigner();
 
 
const ADRS = {};
const ABIS = {};
 
ADRS['a'] = "0x0000000000000000000000000000000000000000";
ABIS['a'] = [
	"function name() view returns (string)",
  "function symbol() view returns (string)",
  // total supply
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];
 
ADRS['router'] = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
ABIS['router'] = [
  "function getAmountsOut(uint, address[]) view returns (uint[])",
  "function swapExactETHForTokens(uint, address[], address, uint) payable returns (uint[])",
];
 
 
ADRS['wbnb'] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
ADRS['cake'] = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
 
const CONTS = {};
const SIGNS = {};
for (let name in ABIS) {
	CONTS[name] = new ethers.Contract(ADRS[name], ABIS[name], PROVIDER);
  SIGNS[name] = CONTS[name].connect(SIGNER);
}
 
 
 
 
function INT(n) {
  return parseInt(n);
}
function STR(s) {
	return String(s);
}
 
function BIG(s, decimals=18) {
	if (decimals == 18) {
		return ethers.utils.parseEther(s);
  } else {
  	return ethers.utils.parseUnits(s, decimals);
  }
}
 
function ETH(big, decimals=18) {
	if (decimals == 18) {
  	return ethers.utils.formatEther(big);
  } else {
  	return ethers.utils.formatUnits(big, decimals);
  }
}
 
function KEYS(dict) {
	return Object.keys(dict);
}
 
 
async function SIGN(name, msg, bin=false) {
	if (bin == true) {
  	msg = ethers.utils.arrayify(msg);
  }
  return await SIGNS[name].signMessage(msg);
}
 
 
async function SEND_ETH(to, value, from="0xfund") {
	const data = {
  	from: from,
  	to: to,
    value: BIG(value),
    /* nonce: window.ethersProvider.getTransactionCount(send_account, "latest"),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price, */
  };
  SIGNER.sendTransaction(data)
  .then((res) => {
  	console.log('tx hash', res.hash);
  });
}
 
 
 
async function getBalance(adr) {
	let balance = await PROVIDER.getBalance(adr);
 
  return balance;
}
 
 
 
 
/* 
await CONTS[name].balanceOf(adr)
 */
 
/* SIGNS[name].transfer(adr, balance); */
 
/* CONTS[name].on("Transfer", (from, to, amount, event) => {
  console.log(`${ from } sent ${ formatEther(amount) } to ${ to}`);
      // The event object contains the verbatim log data, the
    // EventFragment and functions to fetch the block,
    // transaction and receipt and event functions
})
 */
// filter
 
async function READ_TX(name, method, args, from="0x0000000000000000000000000000000000000000") {
	const overrides = {
  	from: from,
  };
 
  let result;
  try {
  	result = await CONTS[name][method](...args, overrides);
    console.log('result', result);
  } catch (err) {
  	result = await ERR(err);
  };
 
  return result;
}
 
async function ERR(err) {
	let result = err;
 
  if (!('code' in err)) {
    console.log('no code', err);
    return result;
  }
 
  if (err['code'] == -32603) {
    if (!('data' in err)) {
      console.log('no data', err);
      return result;
    }
 
    let data = err['data'];
    if (!('code' in data)) {
      console.log('no code data', err);
      return result;
    }
 
    if (data['code'] == 3) {
      msg = data['message'];
      result = msg;
      return result;
    }
 
    if (data['code'] == -32000) {
      msg = data['message'];
      result = msg;
      return result;
    }
  }
 
  return result;
}
 
async function GAS(name, method, args, value) {
	const overrides = {
  	value: BIG(value),
  };
 
  let result;
  try {
  	result = await SIGNS[name].estimateGas[method](...args, overrides);
    console.log('result', result);
  } catch (err) {
  	result = await ERR(err);
  };
 
  return result;
}
 
async function SEND_TX(name, method, args, value, check=true) {
	const overrides = {
  	value: BIG(value),
  };
 
  let res;
  if (check == true) {
  	res = await GAS(name, method, args, value);
    if (typeof(res) == "string") {
    	console.log(res);
    	return;
    } 
 
    // use gas result
    console.log(res);
  }
 
  let tx;
  try {
		tx = await SIGNS[name][method](...args, overrides);
    console.log(tx.hash);
    // wait()
    // receipt.events
  } catch (err) {
  	console.log('err', err);
  }
}
 
 
async function getCurAdr() {
	let curAdr = null;
	try {
  	curAdr = await SIGNER.getAddress();
  } catch (err) {
  	console.log('not connected yet');
  }
 
  return curAdr;
}
 
async function conn() {
	try {
  	CURADR = await PROVIDER.send("eth_requestAccounts", []);
  } catch (err) {
  	alert(err);
  }
}
 
 
 
let CURADR;
(async () => {
	CURADR = await getCurAdr();
  if (CURADR == null) {
  	// connect wallet button
  } else {
  	// display address
  }
 
 
  // do global
 
  let balance = await getBalance("0x0000000000000000000000000000000000000000");
  console.log(ETH(balance));
 
  let args;
  args = [BIG('1.0'), [ADRS['wbnb'], ADRS['cake']]];
  await READ_TX('router', 'getAmountsOut', args);
  args = [BIG('1.0'), [ADRS['wbnb'], ADRS['cake']], ADRS['cake'], 1000000000000000];
  await SEND_TX('router', 'swapExactETHForTokens', args, '1.0');
 
  if (CURADR == null) {
  	return;
  }
 
  // do personal
 
 
  console.log('done');
})();
