const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const spreadsheetUi = SpreadsheetApp.getUi();

function main() {
  spreadsheetUi
    .createMenu('Attendence Gen✨')
    .addItem('Inital Setup', 'initalSetup')
    .addItem('Candidate Setup', '_candidate_setup')
    .addItem('Fake Data', 'fakeData')
    .addItem('Delete', 'deleteAllSheets')
    .addToUi();
}

function deleteAllSheets(){
 let sheets = spreadsheet.getSheets();

sheets.forEach((e)=>{
  if(Object.keys(monthMap).some((a)=> e.getName().startsWith(a))){
    spreadsheet.deleteSheet(e);
  }
});
}


function initalSetup() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('inital_form')
    .setTitle('🛠️ Setup Attendance Sheet')
    .setWidth(500);

  spreadsheetUi.showSidebar(htmlOutput);
}


function _candidate_setup() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('candidate_setup_form')
    .setTitle('⏬ Candidate Setup')
    .setWidth(400);

  spreadsheetUi.showSidebar(htmlOutput);
}

function showErrorDialog(message) {
    const htmlOutput = HtmlService.createHtmlOutput(`😭 ${message}`).setHeight(40).setWidth(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "⚠️ Error");
}

function showCompleteTaskDialog(message) {
   const htmlOutput = HtmlService.createHtmlOutput(`😊 ${message}`).setHeight(40).setWidth(400);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "✅ Task Complete Successfully");
}


function calculateAttendancePercentages() {
  let sheet = spreadsheet.getSheetByName('JUL 2024'); // Change to your sheet name
  const range = sheet.getDataRange();
  const data = range.getValues();

  const headers = data[1];
  const attendanceColumns = [];
  const statuses = ["P", "PL", "SL", "HPL", "HSL", "WFH", "FFL", "HFFL", "BL", "LWP", "HLWP", "BRL", "HBRL", "HWFH", "WO", "HO", "ML", "HML"];
  const statusIndexes = {};
  
  // Find the indexes of the columns containing 'ATT_STATUS'
  headers.forEach((header, index) => {
    if (header.includes('ATT_STATUS')) {
      attendanceColumns.push(index);
    }
  });



  // Initialize the statusIndexes with empty arrays for each status
  statuses.forEach(status => {
    statusIndexes[status] = new Array(data.length - 1).fill(0);
  });
  
  // Calculate the percentages
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const counts = {};
    let total_count = 0;
    
    attendanceColumns.forEach(index => {
      const status = row[index];
      if (status) {
        counts[status] = (counts[status] || 0) + 1;
        total_count++;
      }
    });
    
    statuses.forEach(status => {
      const percentage = total_count ? (counts[status] || 0) / total_count * 100 : 0;
      statusIndexes[status][i - 1] = Math.round(percentage * 100) / 100; // Round to 2 decimal places
    });
  }
  
  // Write the percentages back to the sheet
  const resultHeaders = ['DEPARTMENT', 'TEAM', 'EMP_ID', 'EMP_NAME', ...statuses];
  const resultData = [resultHeaders];
  
  for (let i = 1; i < data.length; i++) {
    const row = [data[i][0], data[i][1], data[i][2], data[i][3]];
    statuses.forEach(status => {
      row.push(statusIndexes[status][i - 1]);
    });
    resultData.push(row); 
  }

  sheet = spreadsheet.getSheetByName('Sheet8');

  // Check if we need to insert new columns
  const requiredColumns = resultHeaders.length;
  const currentColumns = sheet.getMaxColumns();
  
  if (currentColumns < requiredColumns) {
    sheet.insertColumnsAfter(currentColumns, requiredColumns - currentColumns);
  }
  
  resultData.splice(1, 1);

  const resultRange = sheet.getRange(1, 1, resultData.length, resultData[0].length);
  resultRange.setValues(resultData);
}




