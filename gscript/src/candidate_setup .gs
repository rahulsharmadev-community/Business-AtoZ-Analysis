

function _importCandidate(formObject) {
  const cSpreadsheet = _getSpreadsheetUrl(formObject.spreadsheetId);
  const cSheet = cSpreadsheet.getSheetByName(formObject.sheetName);
  if (!cSheet) return showErrorDialog(`${formObject.sheetName} not found in spreadsheet.`)

  const startCell = formObject.startCell;
  const selectedCols = formObject.selectedCols.map(e => `Col${e}`);
  const sortCol = `Col${formObject.sortCol}`;
  const sortAscending = formObject.sortAscending;
  const months = formObject.months;

  const sheets = spreadsheet.getSheets();


  for (var i in months) {
    let sheet = sheets.find((e) => e.getName().startsWith(months[i]));
    const maxColumns = sheet.getMaxColumns();

    let value = `=QUERY(IMPORTRANGE("${cSpreadsheet.getId()}", "${cSheet.getName()}!${startCell}:MAX"),`
    value += `"SELECT ${selectedCols.join(",")} ORDER BY ${sortCol} ${sortAscending ? "ASC" : "DESC"}", 0)`;

    let maxRow = sheet.getMaxRows();
    if (maxRow >= 3) sheet.deleteRows(3, maxRow - 3); // Inital delete all rows 

    sheet.insertRowsAfter(3, cSheet.getMaxRows() - extractNumber(startCell));
    sheet.getRange(3, 1).setValue(value);


    sheet.getRange(3, 1, sheet.getMaxRows(), selectedCols.length)
      .setHorizontalAlignment('left')
      .setBackground('#f3f3f3');

    sheet.setColumnWidths(1, maxColumns, 130);
    
  }

  showCompleteTaskDialog("Candidate Data Setup Successfully");
}

function _getSpreadsheetUrl(str) {
  let id = str;

  // Extract spreadsheet ID if URL is provided
  if (str.includes('docs.google.com')) {
    const urlParts = str.split('/');
    const idIndex = urlParts.indexOf('d') + 1;
    if (idIndex > 0 && idIndex < urlParts.length) {
      id = urlParts[idIndex];
    } else {
      showErrorDialog('Invalid Spreedsheet Url');
      return;
    }
  }

  try {
    const temp = SpreadsheetApp.openById(id);
    return temp;
  } catch (e) {
    showErrorDialog('Invalid Spreedsheet Id or Url');
  }
}


function removeBlankRows(sheet) {
  // Get the range of data in the sheet
  var range = sheet.getDataRange();
  var values = range.getValues();

  // Iterate through rows from bottom to top
  for (var i = values.length - 1; i >= 0; i--) {
    var cell = values[i][0];
    // Check if the row is blank (all cells are empty or null)
    var isEmpty = cell === "" || cell === null;

    if (isEmpty) {
      sheet.deleteRow(i + 1);
    }
  }
}

function extractNumber(str) {
  // Use regular expression to find the first occurrence of a number in the string
  const match = str.match(/\d+/);

  // Return the number if found, otherwise return null
  return match ? parseInt(match[0], 10) : null;
}


