const ExcelJS = require('exceljs');
const path = require('path');

class ExcelReporter {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('Test Results');
    
    // Setup Columns
    this.worksheet.columns = [
      { header: 'Test Suite', key: 'suite', width: 25 },
      { header: 'Test Case', key: 'test', width: 40 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 15 },
      { header: 'Error Message', key: 'error', width: 50 }
    ];

    // Style the header row
    this.worksheet.getRow(1).font = { bold: true };
    this.worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
  }

  addTestResult(suite, test, status, duration, error = '') {
    const row = this.worksheet.addRow({
      suite,
      test,
      status: status.toUpperCase(),
      duration,
      error
    });

    if (status === 'passed') {
      row.getCell('status').font = { color: { argb: 'FF008000' }, bold: true };
    } else {
      row.getCell('status').font = { color: { argb: 'FFFF0000' }, bold: true };
    }
  }

  async saveReport() {
    const reportPath = path.join(__dirname, '..', 'E2E_Test_Report.xlsx');
    await this.workbook.xlsx.writeFile(reportPath);
    console.log(`\n>>> Excel Report generated at: ${reportPath}`);
  }
}

// Singleton instance to be used across all test suites
const reporter = new ExcelReporter();
module.exports = reporter;
