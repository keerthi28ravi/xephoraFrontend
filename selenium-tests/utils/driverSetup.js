require('chromedriver');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function getDriver() {
  const options = new chrome.Options();
  options.addArguments('window-size=1920,1080');

  // Run headless in CI (GitHub Actions sets HEADLESS=true)
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = { getDriver };
