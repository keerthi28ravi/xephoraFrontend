const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { getDriver } = require('../utils/driverSetup');
const reporter = require('../utils/excelReporter');

describe('Authentication Flow E2E Tests', function() {
  let driver;
  const targetUrl = 'http://localhost:5173/login';

  before(async function() {
    driver = await getDriver();
  });

  after(async function() {
    await reporter.saveReport();
    await driver.quit();
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      reporter.addTestResult(
        'Authentication Flow',
        this.currentTest.title,
        'failed',
        this.currentTest.duration,
        this.currentTest.err.message
      );
    } else if (this.currentTest.state === 'passed') {
      reporter.addTestResult(
        'Authentication Flow',
        this.currentTest.title,
        'passed',
        this.currentTest.duration
      );
    }
  });

  it('Should successfully login in diagnostic mode', async function() {
    await driver.get(targetUrl);
    
    // Wait for email input
    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('operator@nexus.net');
    await passInput.sendKeys('password123');
    await submitBtn.click();

    // Verify it navigates to the dashboard by waiting for a specific dashboard element or URL change
    await driver.wait(until.urlContains('/app/dashboard'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/app/dashboard');
  });
});
