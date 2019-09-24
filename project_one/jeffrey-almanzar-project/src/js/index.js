
const SUBMIT_BUTTON = document.getElementById("hex-submit");

const HEX = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  a: "1010",
  b: "1011",
  c: "1100",
  d: "1101",
  e: "1110",
  f: "1111"
};

function validateInput(input) {
  if (input.length === 8) {
    for (let i = 0; i < input.length; i++) {
      if (!HEX[input[i]]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function hexToBinary(hexValue) {
  let result = "";
  for (let i = 0; i < hexValue.length; i++) {
    result += HEX[hexValue[i]] + " ";
  }
  return result;
}

function hexToDecimal(hexValue) {
  hexValue = hexValue
    .split("")
    .reverse()
    .join("");
  const HEX = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15
  };
  let result = 0;
  for (let i = 0; i < hexValue.length; i++) {
    result += HEX[hexValue[i]] * Math.pow(16, i);
  }

  return result;
}

function hexToDottedDecimal(hexValue) {
  const hexValues = insertDashIntoString(hexValue).split("-");

  let result = "";
  hexValues.forEach((element, index) => {
    if (index != 0 && index != hexValues.length) {
      result += "." + hexToDecimal(element);
      console.log(index);
    } else {
      result += hexToDecimal(element);
    }
  });
  return result;
}

function insertDashIntoString(hexValue) {
  let newHexValue = "";
  const insertDash = { 2: true, 4: true, 6: true };

  hexValue.split("").forEach((element, index) => {
    if (insertDash[index]) {
      newHexValue += "-" + element;
    } else {
      newHexValue += element;
    }
  });
  return newHexValue;
}

function getIpClass(binaryValue) {
  const IP_CLASSES = { a: "01", b: "10", c: "11" };
  binaryValue = binaryValue.substring(0, 2);

  let result;
  switch (binaryValue) {
    case IP_CLASSES["b"]:
      result = "B";
      break;

    case IP_CLASSES["c"]:
      result = "C";
      break;

    default:
      if (binaryValue[0] == "0") {
        result = "A";
      } else {
        result = "Unknown";
      }
  }

  return result;
}

function getNetworkID(hexValue, ipClass) {
  switch (ipClass) {
    case "A":
      return hexValue.substring(0, 2);
    case "B":
      return hexValue.substring(0, 4);
    case "C":
      return hexValue.substring(0, 6);
    default:
      return "unknown";
  }
}

function getHostID(hexValue, ipClass) {
  switch (ipClass) {
    case "A":
      return hexValue.substring(2);
    case "B":
      return hexValue.substring(4);
    case "C":
      return hexValue.substring(6);
    default:
      return "unknown";
  }
}

function createElement(elementTag) {
  return document.createElement(elementTag);
}

function displayInfo(ipClass, networkId, hostId, decimalDottedNotation) {
  const RESULTS = document.getElementById("result-container");
  const INNER_RESULT = document.getElementById("inner-result-container");
  const parentDiv = createElement("DIV");
  const ipClassParagraph = createElement("P");
  const networkIdParagraph = createElement("P");
  const hostIdParagraph = createElement("P");
  const decimalDottedNotationParagraph = createElement("P");

  ipClassParagraph.innerHTML = `<span>IP Class</span> : <span>${ipClass}</span>`;
  networkIdParagraph.innerHTML = `<span>Network ID</span> : <span>${networkId}</span>`;
  hostIdParagraph.innerHTML = `<span>Host ID</span> : <span>${hostId}</span>`;
  decimalDottedNotationParagraph.innerHTML = `<span>Dotted Decimal Notation</span> : <span>${decimalDottedNotation}</span>`;

  parentDiv.appendChild(ipClassParagraph);
  parentDiv.appendChild(networkIdParagraph);
  parentDiv.appendChild(hostIdParagraph);
  parentDiv.appendChild(decimalDottedNotationParagraph);

  INNER_RESULT.appendChild(parentDiv);
  RESULTS.style.display = "block";
}

function clear() {
  const RESULTS = document.getElementById("result-container");
  const INNER_RESULT = document.getElementById("inner-result-container");
  INNER_RESULT.innerHTML = "";
}
SUBMIT_BUTTON.onclick = e => {
  const INPUT_FIELD = document.getElementById("hex-input");
  const userHexValue = INPUT_FIELD.value.toLowerCase();
  clear();
  if (validateInput(userHexValue)) {
    const binaryValue = hexToBinary(userHexValue);
    const ipClass = getIpClass(binaryValue);
    const networkId = getNetworkID(userHexValue, ipClass);
    const hostId = getHostID(userHexValue, ipClass);
    const decimalDottedNotation = hexToDottedDecimal(userHexValue);
    displayInfo(ipClass, networkId, hostId, decimalDottedNotation);
  } else {
    alert("NO VALID INPUT!");
  }
};

// get input in hex value
// validate input
// convert to binary
// determine class
// determine network id
// determine host id
// convert hex value to decimal --> taking in consideration dotted notation.
// or
// goes from binary to decimal  --> taking in consideration dotted notation.
