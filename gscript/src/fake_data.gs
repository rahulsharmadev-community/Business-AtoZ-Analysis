const status = [
  "P"
  , "PL"
  , "SL"
  , "HPL"
  , "HSL"
  , "WFH"
  , "FFL"
  , "HFFL"
  , "BL "
  , "LWP"
  , "HLWP"
  , "BRL "
  , "HBRL "
  , "HWFH"
  , "WO"
  , "HO"
  , "ML"
  , "HML"];

function fakeData() {
  const sh = spreadsheet.getActiveSheet();

    const length = sh.getMaxColumns() - 4;
    const range = sh.getRange(3, 5, 5000, length);

    const data = [];
    for (let i = 0; i < 5000; i++) {
      data[i] = [];
      for (let j = 0; j < length / 5; j++) {
        data[i] = data[i].concat([TIME_IN(), TIME_OUT(), BREAK(), ATT_STATUS(), IS_APPROVED()]);
      }
    }

    range.setValues(data);
}





function TIME_IN() {
  return getRandomTimeInRange("06:00", "10:60");
}

function TIME_OUT() {
  return getRandomTimeInRange("18:00", "23:60");
}
function BREAK() {
  return getRandom(0, 5).toString();
}

function ATT_STATUS() {
  return getRandom(0, 10) < 6 ? 'P' :
    status[getRandom(0, status.length-1)];
}
function IS_APPROVED() {
  return getRandom(0, 4) ? 'TRUE' : 'FALSE';
}




function repeat(arr, times) {
  let result = [];
  for (var i = 0; i < times; i++) {
    result = result.concat(arr);
  }
  return result;
}


function getRandomTimeInRange(startTime, endTime) {
  let s = startTime.split(':').map((e) => { return parseInt(e) });
  let e = endTime.split(':').map((e) => { return parseInt(e) });

  return getRandom(s[0], e[0]).toString().padStart(2, "0") + ':' + getRandom(s[1], e[1]).toString().padStart(2, "0")
}



function getRandom(min, max) {
  const m = Math.max(min, max);
  const n = Math.min(min, max);
  return Math.floor(Math.random() * (m - n) + n);
}

