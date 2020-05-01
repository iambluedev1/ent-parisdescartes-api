const logger = require('../logger');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());

let browser;

async function create() {
  logger.info('Starting browser');
  browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--start-maximized',
      '--disable-setuid-sandbox',
      '-disable-gpu',
      '--no-first-run',
      '--disable-notifications',
    ],
  });
}

async function open() {
  const context = await browser.createIncognitoBrowserContext();
  return await context.newPage();
}

module.exports = {
  create,
  open
};
