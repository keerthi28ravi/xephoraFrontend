const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { getDriver } = require('../utils/driverSetup');
const reporter = require('../utils/excelReporter');

describe('Navigation and Game Hub E2E Tests', function() {
  let driver;

  before(async function() {
    driver = await getDriver();
    
    // We need to login first to access the dashboard
    await driver.get('http://localhost:5173/login');
    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.sendKeys('test_nav@nexus.net');
    await passInput.sendKeys('password123');
    await submitBtn.click();
    await driver.wait(until.urlContains('/app/dashboard'), 5000);
  });

  after(async function() {
    await reporter.saveReport();
    await driver.quit();
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      reporter.addTestResult(
        'Navigation Flow',
        this.currentTest.title,
        'failed',
        this.currentTest.duration,
        this.currentTest.err.message
      );
    } else if (this.currentTest.state === 'passed') {
      reporter.addTestResult(
        'Navigation Flow',
        this.currentTest.title,
        'passed',
        this.currentTest.duration
      );
    }
  });

  it('Should successfully navigate to the Game Modes Hub', async function() {
    // Navigate using the sidebar link
    const modesLink = await driver.wait(until.elementLocated(By.css('a[href="/app/modes"]')), 5000);
    await modesLink.click();
    
    await driver.wait(until.urlContains('/app/modes'), 5000);
    
    // Verify a mode card is visible (e.g. Memory Nexus)
    const memoryCard = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Memory Nexus")]')), 5000);
    expect(await memoryCard.isDisplayed()).to.be.true;
  });
});
