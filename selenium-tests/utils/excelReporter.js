const ExcelJS = require('exceljs');
const path = require('path');

class ExcelReporter {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
    
    // Create Executive Summary as the FIRST tab so it opens here by default
    this.summarySheet = this.workbook.addWorksheet('Executive Summary');
    
    // Create All Tests as the SECOND tab
    this.allTestsSheet = this.setupSheet('All Tests');
    
    this.suiteSheets = {};
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      totalDuration: 0,
      suites: {}
    };
  }

  setupSheet(name) {
    const sheet = this.workbook.addWorksheet(name.substring(0, 31)); // Max sheet name length is 31
    sheet.columns = [
      { header: 'Test Suite', key: 'suite', width: 35 },
      { header: 'Test Case', key: 'test', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 15 },
      { header: 'Error Message', key: 'error', width: 60 }
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    return sheet;
  }

  addTestResult(suite, test, status, duration, error = '') {
    // 1. Update internal statistics
    this.stats.total++;
    this.stats.totalDuration += (duration || 0);
    if (status.toLowerCase() === 'passed') this.stats.passed++;
    else this.stats.failed++;

    if (!this.stats.suites[suite]) {
      this.stats.suites[suite] = { total: 0, passed: 0, failed: 0 };
    }
    this.stats.suites[suite].total++;
    if (status.toLowerCase() === 'passed') this.stats.suites[suite].passed++;
    else this.stats.suites[suite].failed++;

    // 2. Add to "All Tests" master sheet
    this.addRowToSheet(this.allTestsSheet, suite, test, status, duration, error);

    // 3. Add to the specific module's sheet
    // Remove invalid excel characters like colons
    const cleanSheetName = suite.replace(/[:\/\?\*\[\]]/g, '').trim();
    if (!this.suiteSheets[cleanSheetName]) {
      this.suiteSheets[cleanSheetName] = this.setupSheet(cleanSheetName);
    }
    this.addRowToSheet(this.suiteSheets[cleanSheetName], suite, test, status, duration, error);
  }

  addRowToSheet(sheet, suite, test, status, duration, error) {
    const row = sheet.addRow({
      suite,
      test,
      status: status.toUpperCase(),
      duration,
      error
    });

    if (status.toLowerCase() === 'passed') {
      row.getCell('status').font = { color: { argb: 'FF008000' }, bold: true };
    } else {
      row.getCell('status').font = { color: { argb: 'FFFF0000' }, bold: true };
    }
  }

  populateExecutiveSummary() {
    this.summarySheet.columns = [
      { header: 'Metric / Module Breakdown', key: 'metric', width: 45 },
      { header: 'Total Tests', key: 'total', width: 15 },
      { header: 'Passed', key: 'passed', width: 15 },
      { header: 'Failed', key: 'failed', width: 15 },
      { header: 'Pass Rate', key: 'rate', width: 15 }
    ];
    
    this.summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    this.summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' } // Nice blue header
    };

    const overallRate = this.stats.total > 0 ? ((this.stats.passed / this.stats.total) * 100).toFixed(2) + '%' : '0%';
    
    // Overall Stats Row
    const mainRow = this.summarySheet.addRow({
      metric: 'OVERALL EXECUTION RESULTS',
      total: this.stats.total,
      passed: this.stats.passed,
      failed: this.stats.failed,
      rate: overallRate
    });
    mainRow.font = { bold: true };
    if (this.stats.failed > 0) {
      mainRow.getCell('failed').font = { color: { argb: 'FFFF0000' }, bold: true };
    }
    
    this.summarySheet.addRow({}); // Spacer row

    // Breakdown per Module
    for (const [suite, s] of Object.entries(this.stats.suites)) {
      const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(2) + '%' : '0%';
      const row = this.summarySheet.addRow({
        metric: suite,
        total: s.total,
        passed: s.passed,
        failed: s.failed,
        rate
      });
      
      if (s.failed > 0) {
        row.getCell('failed').font = { color: { argb: 'FFFF0000' }, bold: true };
      }
    }
  }

  async saveReport() {
    // Fill out the summary tab right before saving
    this.populateExecutiveSummary();
    
    const reportPath = path.join(__dirname, '..', 'E2E_Advanced_Report.xlsx');
    await this.workbook.xlsx.writeFile(reportPath);
    console.log(`\n>>> Advanced Excel Report generated at: ${reportPath}`);
  }
}

// Singleton instance to be used across all test suites
const reporter = new ExcelReporter();
module.exports = reporter;
