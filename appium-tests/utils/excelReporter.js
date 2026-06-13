const ExcelJS = require('exceljs');
const path = require('path');

// ─── Color Palette ────────────────────────────────────────────
const COLORS = {
  headerBg:      'FF1A1A2E',   // Dark navy
  headerFg:      'FFFFFFFF',   // White
  passGreen:     'FF00C853',   // Vivid green
  failRed:       'FFD50000',   // Vivid red
  summaryBg:     'FF16213E',   // Dark blue
  summaryFg:     'FFFFFFFF',
  moduleHeader:  'FF0F3460',   // Medium blue
  moduleFg:      'FFFFFFFF',
  altRowBg:      'FFF0F4FF',   // Light blue-ish alt row
  normalBg:      'FFFFFFFF',
  overallPass:   'FF00C853',
  overallFail:   'FFD50000',
  overallBg:     'FF2196F3',   // Bold blue for overall row
  borderColor:   'FFBDBDBD',
};

function applyBorder(row, columns) {
  columns.forEach(col => {
    const cell = row.getCell(col);
    cell.border = {
      top:    { style: 'thin', color: { argb: COLORS.borderColor } },
      left:   { style: 'thin', color: { argb: COLORS.borderColor } },
      bottom: { style: 'thin', color: { argb: COLORS.borderColor } },
      right:  { style: 'thin', color: { argb: COLORS.borderColor } },
    };
  });
}

class ExcelReporter {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
    this.workbook.creator = 'Xephora QA Automation';
    this.workbook.lastModifiedBy = 'Appium E2E Runner';

    // Tab 1 — Executive Summary (created first so it's the default open tab)
    this.summarySheet = this.workbook.addWorksheet('Executive Summary', {
      tabColor: { argb: 'FF2196F3' }
    });

    // Tab 2 — All Tests master log
    this.allTestsSheet = this._setupDetailSheet('All Tests', 'FF607D8B');

    // Per-suite sheets (created dynamically)
    this.suiteSheets = {};

    this.stats = {
      total:         0,
      passed:        0,
      failed:        0,
      totalDuration: 0,
      startTime:     new Date(),
      suites:        {}
    };
  }

  // ── Create a formatted detail sheet ───────────────────────
  _setupDetailSheet(name, tabColor = 'FF9E9E9E') {
    const sheetName = name.substring(0, 31);
    const sheet = this.workbook.addWorksheet(sheetName, {
      tabColor: { argb: tabColor }
    });

    sheet.columns = [
      { header: '#',              key: 'idx',      width: 6  },
      { header: 'Test Suite',    key: 'suite',    width: 35 },
      { header: 'Test Case',     key: 'test',     width: 55 },
      { header: 'Status',        key: 'status',   width: 12 },
      { header: 'Duration (ms)', key: 'duration', width: 16 },
      { header: 'Error Message', key: 'error',    width: 65 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell, colNum) => {
      cell.font = { bold: true, color: { argb: COLORS.headerFg }, size: 11 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    });
    applyBorder(headerRow, ['idx','suite','test','status','duration','error']);

    sheet._rowCount = 1; // internal tracker
    return sheet;
  }

  // ── Add a single test result row ───────────────────────────
  addTestResult(suite, testName, status, duration, error = '') {
    // ── Update stats ──────────────────────────────────────
    this.stats.total++;
    this.stats.totalDuration += (duration || 0);
    const passed = status.toLowerCase() === 'passed';
    if (passed) this.stats.passed++; else this.stats.failed++;

    if (!this.stats.suites[suite]) {
      this.stats.suites[suite] = { total: 0, passed: 0, failed: 0, duration: 0 };
    }
    this.stats.suites[suite].total++;
    this.stats.suites[suite].duration += (duration || 0);
    if (passed) this.stats.suites[suite].passed++; else this.stats.suites[suite].failed++;

    // ── Add to "All Tests" sheet ──────────────────────────
    this._addDetailRow(this.allTestsSheet, this.stats.total, suite, testName, status, duration, error);

    // ── Add to per-module sheet ───────────────────────────
    const cleanName = suite.replace(/[:\\/?\*\[\]]/g, '').trim().substring(0, 31);
    if (!this.suiteSheets[cleanName]) {
      // Pick a color per module
      const moduleColors = [
        'FF4CAF50','FFE91E63','FF9C27B0','FF3F51B5',
        'FFFF9800','FF009688','FF795548','FF607D8B','FF00BCD4'
      ];
      const colorIdx = Object.keys(this.suiteSheets).length % moduleColors.length;
      this.suiteSheets[cleanName] = this._setupDetailSheet(cleanName, moduleColors[colorIdx]);
    }
    const suiteSheet = this.suiteSheets[cleanName];
    suiteSheet._rowCount = (suiteSheet._rowCount || 1);
    suiteSheet._rowCount++;
    this._addDetailRow(suiteSheet, suiteSheet._rowCount - 1, suite, testName, status, duration, error);
  }

  _addDetailRow(sheet, idx, suite, testName, status, duration, error) {
    const passed = status.toLowerCase() === 'passed';
    const rowNum = sheet.lastRow ? sheet.lastRow.number + 1 : 2;
    const isAlt = (rowNum % 2 === 0);

    const row = sheet.addRow({
      idx,
      suite,
      test:     testName,
      status:   passed ? '✅ PASS' : '❌ FAIL',
      duration: duration || 0,
      error:    error || ''
    });

    row.height = 18;

    // Alternate row shading
    const bgColor = isAlt ? COLORS.altRowBg : COLORS.normalBg;
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { vertical: 'middle', wrapText: false };
      cell.font = { size: 10 };
    });

    // Status cell coloring
    const statusCell = row.getCell('status');
    statusCell.font = {
      color: { argb: passed ? COLORS.passGreen : COLORS.failRed },
      bold: true, size: 10
    };

    applyBorder(row, ['idx','suite','test','status','duration','error']);
  }

  // ── Build Executive Summary Sheet ─────────────────────────
  _buildExecutiveSummary() {
    const sheet = this.summarySheet;
    const endTime = new Date();
    const totalSec = ((endTime - this.stats.startTime) / 1000).toFixed(1);
    const overallRate = this.stats.total > 0
      ? ((this.stats.passed / this.stats.total) * 100).toFixed(1) + '%'
      : '0.0%';

    // ── Title block ─────────────────────────────────────
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = '🚀  XEPHORA MOBILE APP — END-TO-END TEST REPORT';
    titleCell.font = { bold: true, size: 16, color: { argb: COLORS.headerFg } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 36;

    sheet.mergeCells('A2:F2');
    const subCell = sheet.getCell('A2');
    subCell.value = `Generated: ${endTime.toLocaleString()}   |   Total Execution Time: ${totalSec}s   |   Platform: Android (Appium + UiAutomator2)`;
    subCell.font = { italic: true, size: 10, color: { argb: 'FF90A4AE' } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D0D1A' } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(2).height = 18;

    // Spacer
    sheet.addRow([]);

    // ── Overall Metrics Header ───────────────────────────
    sheet.columns = [
      { key: 'a', width: 42 },
      { key: 'b', width: 14 },
      { key: 'c', width: 14 },
      { key: 'd', width: 14 },
      { key: 'e', width: 14 },
      { key: 'f', width: 20 },
    ];

    const metricHeaderRow = sheet.addRow(['Module / Metric', 'Total Tests', 'Passed ✅', 'Failed ❌', 'Pass Rate', 'Avg Duration (ms)']);
    metricHeaderRow.height = 24;
    metricHeaderRow.eachCell((cell, col) => {
      cell.font = { bold: true, size: 11, color: { argb: COLORS.moduleFg } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.moduleHeader } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF2196F3' } },
        right:  { style: 'thin',   color: { argb: COLORS.borderColor } }
      };
    });

    // ── Overall Results Row ──────────────────────────────
    const avgDur = this.stats.total > 0
      ? (this.stats.totalDuration / this.stats.total).toFixed(0)
      : 0;

    const overallRow = sheet.addRow([
      '📊  OVERALL EXECUTION RESULTS',
      this.stats.total,
      this.stats.passed,
      this.stats.failed,
      overallRate,
      avgDur
    ]);
    overallRow.height = 22;
    overallRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12, color: { argb: COLORS.summaryFg } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.overallBg } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    overallRow.getCell(3).font = { bold: true, color: { argb: COLORS.passGreen }, size: 12 };
    overallRow.getCell(4).font = {
      bold: true,
      color: { argb: this.stats.failed > 0 ? COLORS.failRed : COLORS.passGreen },
      size: 12
    };

    // ── Per-Module Breakdown ─────────────────────────────
    let rowIdx = 0;
    for (const [suiteName, s] of Object.entries(this.stats.suites)) {
      rowIdx++;
      const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) + '%' : '0.0%';
      const avgMs = s.total > 0 ? (s.duration / s.total).toFixed(0) : 0;
      const isAlt = rowIdx % 2 === 0;

      const row = sheet.addRow([
        `  ${suiteName}`,
        s.total,
        s.passed,
        s.failed,
        rate,
        avgMs
      ]);
      row.height = 20;
      const bg = isAlt ? COLORS.altRowBg : COLORS.normalBg;
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', indent: cell.col === 1 ? 1 : 0 };
        cell.font = { size: 10 };
        cell.border = { bottom: { style: 'hair', color: { argb: COLORS.borderColor } } };
      });
      row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle', indent: 2 };
      row.getCell(3).font = { color: { argb: COLORS.passGreen }, bold: true, size: 10 };
      if (s.failed > 0) {
        row.getCell(4).font = { color: { argb: COLORS.failRed }, bold: true, size: 10 };
      }
    }

    // ── Legend / Footer ──────────────────────────────────
    sheet.addRow([]);
    sheet.addRow([]);
    const legendRow = sheet.addRow(['ℹ️  Legend: ✅ PASS = Test succeeded   |   ❌ FAIL = Test assertion or infrastructure failure']);
    legendRow.getCell(1).font = { italic: true, size: 9, color: { argb: 'FF607D8B' } };
    sheet.mergeCells(`A${legendRow.number}:F${legendRow.number}`);
  }

  // ── Save Report to Disk ────────────────────────────────────
  async saveReport() {
    this._buildExecutiveSummary();

    const reportPath = path.join(__dirname, '..', 'E2E_Mobile_Report.xlsx');
    await this.workbook.xlsx.writeFile(reportPath);
    
    console.log('\n══════════════════════════════════════════════');
    console.log('  📊 E2E MOBILE TEST REPORT GENERATED');
    console.log(`  📁 Path: ${reportPath}`);
    console.log(`  🧪 Total: ${this.stats.total} | ✅ Pass: ${this.stats.passed} | ❌ Fail: ${this.stats.failed}`);
    const rate = this.stats.total > 0
      ? ((this.stats.passed / this.stats.total) * 100).toFixed(1)
      : '0.0';
    console.log(`  📈 Pass Rate: ${rate}%`);
    console.log('══════════════════════════════════════════════\n');

    return reportPath;
  }
}

// Singleton used across all test files
const reporter = new ExcelReporter();
module.exports = reporter;
