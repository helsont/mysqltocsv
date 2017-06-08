const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('test.sql')
});

let isFirstLine = true;

function splitAndTrim(string) {
  let finalValues = [];
  string.split('|').map((elem) => {
    let trimmed = elem.trim();
    finalValues.push(trimmed);
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

  console.log(headers.join(','));
  values.map((value, idx) => {
    console.log(idx + value.join(','));
  });
});
