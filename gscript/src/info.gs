function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Utility')
    .addItem('Spreadsheet Information', 'showSheetInfo')
    .addToUi();
}

function showSheetInfo() {
  let h = SpreadsheetApp.getActiveSpreadsheet().getSheets().length*40+56;
  h = h>700?700:h;
  const htmlOutput = HtmlService.createHtmlOutputFromFile('info_widget')
    .setTitle('Information')
    .setWidth(400).setHeight(h);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput,'Spreadsheet Information');
}

function getSheetInfo() {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  let sheetInfo = [];
  let totalCells = 0;

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const numRows = sheet.getMaxRows();
    const numColumns = sheet.getMaxColumns();
    const numCells = numRows * numColumns;
    totalCells += numCells;

    sheetInfo.push({
      name: sheetName,
      rows: numRows,
      columns: numColumns,
      cells: numCells
    });
  });

  return {
    sheetInfo: sheetInfo,
    totalCells: totalCells
  };
}
