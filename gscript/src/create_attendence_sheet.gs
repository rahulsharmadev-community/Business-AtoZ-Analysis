
function _createSheet(formObject) {
  Logger.log(formObject);
  const year = formObject.year;
  const selectedMonths = formObject.selectedMonths;
  const header = formObject.header;
  const subHeaders = formObject.subHeaders;
  const attributes = formObject.attributes;

  for (var i in selectedMonths) {
    let month = selectedMonths[i];
    const sheetName = `${month} ${year}`;
    // Check if a sheet with this name already exists
    if (spreadsheet.getSheetByName(sheetName)) {
      continue;
    }

    const sheet = spreadsheet.insertSheet(sheetName);
    _createFixHeader(sheet, header, subHeaders);
    _createDateHeader(sheet, attributes, subHeaders.length , year, month);
    sheet.getRange(1, 1, 1, sheet.getMaxColumns()).setBackground('black').setFontColor('white').setFontWeight('bold');
    sheet.getRange(2, 1, 1, sheet.getMaxColumns()).setBackground('#434343').setFontColor('white').setFontWeight('bold');
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).setVerticalAlignment('middle').setHorizontalAlignment('center');
    spreadsheet.setFrozenColumns(subHeaders.length);
  };

  showCompleteTaskDialog("Every this is ready for you. ^_~");
}


function _createFixHeader(sheet, header, subHeaders) {

  // Merge A1:D1 and set the value
  sheet.getRange(1, 1, 1, subHeaders.length).merge().setValue(header);

  // Set the header values in row 2 starting from column 1 (A2)
  sheet.getRange(2, 1, 1, subHeaders.length).setValues([subHeaders]).createFilter();
}





function _createDateHeader(sheet, attributes, skipCell, year, month) {
  const length = attributes.length;

  const daysInMonth = getDate(year, month).getDate();
  const totalCol = sheet.getMaxColumns();
  const requiredCol = skipCell + daysInMonth * attributes.length;

  if (totalCol < requiredCol) {
    sheet.insertColumnsAfter(totalCol, requiredCol - totalCol);
  }

  for (let i = 0; i < daysInMonth; i++) {
    let temp = `${year}, ${monthMap[month]}, ${i + 1}`;
    sheet.getRange(1, skipCell+1 + i * length, 1, length).merge().setValue(`=TEXT(DATE(${temp}),"dd-mm-yyyy (ddd)")`);

    sheet.getRange(2, skipCell+1 + i * length, 1, length).setValues([attributes]);

  }
}


const monthMap = {
  'JAN': 1,
  'FEB': 2,
  'MAR': 3,
  'APR': 4,
  'MAY': 5,
  'JUN': 6,
  'JUL': 7,
  'AUG': 8,
  'SEP': 9,
  'OCT': 10,
  'NOV': 11,
  'DEC': 12
};

function getDate(year, mth) { return new Date(parseInt(year), monthMap[mth], 0); }


