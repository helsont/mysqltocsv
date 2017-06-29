const lineReader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
  // input: require('fs').createReadStream(FILE_NAME)
});

let isFirstLine = true;

function splitAndTrim(string) {
  let finalValues = [];
  string.replace(/ /g, '').split('|').map((elem) => {
    if (elem) {
      finalValues.push(elem);
    }
  });
  return finalValues;
}

function readHeader(line) {
  return splitAndTrim(line);
}

let values = [];
let headers = [];
lineReader.on('line', function (line) {
  if (line.indexOf('+') === 0) {
    return;
  }
  if (isFirstLine) {
    debugger;
    headers = readHeader(line);
    isFirstLine = false;
    return;
  }
  // read the rest of the file
  values.push(splitAndTrim(line));
});

let SELECT = [
  'id', 'phone', 'email',
  'firstName', 'lastName', 'stripe_active',
  'stripe_subscription', 'stripe_plan', 'created_at', 'company_id'
];

let buildMap = () => {
  let m = {};
  let idxArray = {};
  let keyToValue = {};
  headers.map((header, idx) => {
    if (SELECT.indexOf(header) > -1) {
      m[header] = [];
      idxArray[idx] = true;
      keyToValue[idx] = header;
    }
  });
  values.map((value, idx) => {
    if (idxArray[idx]) {
      m[keyToValue[idx]].push(value);
    }
  });
  return m;
};

lineReader.on('close', function (line) {
  // let m = buildMap();
  // let keys = [];
  // let columns = Object.keys(m);
  // console.log(columns.join(','));
  // for (let idx = 0, len = columns.length; idx < len; idx++) {
  //   console.log(m[columns[idx]]);
  // }
  if (false) {
    console.log(headers);
  }
  console.log(headers.join(','));
  values.map((value, idx) => {
    console.log(value.join(','));
  });
});
