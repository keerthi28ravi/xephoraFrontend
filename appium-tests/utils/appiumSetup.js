const { remote } = require('webdriverio');
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const adbPath = process.env.ANDROID_HOME 
  ? path.join(process.env.ANDROID_HOME, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb')
  : 'C:\\Users\\Raja\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const APP_PACKAGE = 'com.xephora.app';
const APP_ACTIVITY = '.MainActivity';
const os = require('os');

// Dynamically resolve local IPv4 address (excluding virtual machine interfaces)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Try to find WiFi/Ethernet interface first
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wifi') || lowerName.includes('wireless') || lowerName.includes('ethernet') || lowerName.includes('wlan')) {
          return net.address;
        }
      }
    }
  }

  // Exclude typical VMware subnet hosts (192.168.20.x, 192.168.50.x)
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!net.address.startsWith('192.168.20.') && !net.address.startsWith('192.168.50.')) {
          return net.address;
        }
      }
    }
  }

  // General fallback
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const PC_IP = getLocalIP();
console.log(`[AppiumSetup] Detected local PC IP for testing: ${PC_IP}`);

function runAdb(...args) {
  try {
    const result = spawnSync(adbPath, args, { encoding: 'utf8', timeout: 10000 });
    return (result.stdout || '') + (result.stderr || '');
  } catch (e) {
    return '';
  }
}

function getConnectedDevice() {
  try {
    const output = execSync(`"${adbPath}" devices`, { encoding: 'utf8', timeout: 10000 });
    const lines = output.trim().split('\n');

    // Prefer physical devices over emulators
    const allDevices = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts[1] && parts[1].trim() === 'device') {
        allDevices.push(parts[0].trim());
      }
    }

    if (allDevices.length === 0) {
      throw new Error(
        'No Android device found.\n' +
        '  → Connect your phone via USB and enable USB Debugging\n' +
        '  → Settings > Developer options > USB Debugging = ON\n' +
        '  → Run: adb devices  (should list your device)'
      );
    }

    // Pick a physical device first (UDID is not "emulator-xxxx")
    const physical = allDevices.find(d => !d.startsWith('emulator-'));
    const udid = physical || allDevices[0];
    console.log(`[AppiumSetup] Using device: ${udid} ${physical ? '(physical)' : '(emulator)'}`);
    return udid;

  } catch (e) {
    console.error('[AppiumSetup] Device detection failed:', e.message);
    throw e;  // Hard fail — do not silently fall back to a wrong device
  }
}

function enableWebViewDebugging(udid) {
  console.log('[AppiumSetup] Enabling WebView debugging via adb...');
  // Enable USB debugging and webview debugging
  runAdb('-s', udid, 'shell', 'settings', 'put', 'global', 'debug_app', APP_PACKAGE);
  // Forward chrome debugger port
  runAdb('-s', udid, 'forward', 'tcp:9222', 'localabstract:chrome_devtools_remote');
  console.log('[AppiumSetup] WebView debugging port forwarded.');
}

async function getAppiumDriver() {
  const deviceUdid = getConnectedDevice();
  
  // Use cross-platform relative path to find the APK
  const apkPath = path.resolve(__dirname, '../../frontend/android/app/build/outputs/apk/debug/app-debug.apk');
  
  // Enable webview debugging before connecting
  enableWebViewDebugging(deviceUdid);

  const caps = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Device',
    'appium:udid': deviceUdid,
    'appium:appPackage': APP_PACKAGE,
    'appium:appActivity': APP_ACTIVITY,
    'appium:noReset': true,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    // WebView / Chromedriver caps
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:webviewDevtoolsPort': 9222,
    'appium:chromedriver_autodownload': true,
    'appium:autoGrantPermissions': true,
    'appium:skipUnlock': true
  };

  if (fs.existsSync(apkPath)) {
    caps['appium:app'] = apkPath;
    console.log(`[AppiumSetup] Found APK at ${apkPath}, telling Appium to install it.`);
  } else {
    console.log(`[AppiumSetup] APK not found at ${apkPath}. Assuming app is already installed on device.`);
  }

  const options = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: caps,
    logLevel: 'error',
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3
  };

  console.log(`[AppiumSetup] Connecting to Appium on ${options.hostname}:${options.port} targeting device ${deviceUdid}`);
  const driver = await remote(options);
  console.log('[AppiumSetup] Appium session created successfully.');
  return driver;
}

async function switchToWebView(driver, timeoutMs = 60000) {
  console.log('[AppiumSetup] Waiting for WebView context to become available...');
  const startTime = Date.now();
  let contexts = [];
  let attempt = 0;

  while (Date.now() - startTime < timeoutMs) {
    attempt++;
    try {
      contexts = await driver.getContexts();
      const webviewCtx = contexts.find(c => String(c).toUpperCase().includes('WEBVIEW'));
      
      console.log(`[AppiumSetup] Attempt ${attempt}: contexts = ${JSON.stringify(contexts)}`);
      
      if (webviewCtx) {
        await driver.switchContext(webviewCtx);
        console.log(`[AppiumSetup] Switched to: ${webviewCtx}`);
        // Give the WebView a moment to stabilize
        await new Promise(r => setTimeout(r, 1500));
        return webviewCtx;
      }
    } catch (err) {
      console.log(`[AppiumSetup] Context check error (attempt ${attempt}): ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  // If WebView still not found, run in NATIVE_APP mode as fallback
  console.warn(`[AppiumSetup] WARNING: WebView context not found after ${timeoutMs}ms. Tests will run in NATIVE_APP mode.`);
  return 'NATIVE_APP';
}

module.exports = {
  getAppiumDriver,
  switchToWebView,
  APP_PACKAGE,
  APP_ACTIVITY,
  PC_IP          // exported so test file can use the same IP
};
