require('chromedriver');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function getDriver() {
  const options = new chrome.Options();
  // Using standard window size since full maximization can vary per display
  options.addArguments('window-size=1920,1080');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    
  return driver;
}

module.exports = { getDriver };
