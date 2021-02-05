require('dotenv').config()
const puppeteer = require('puppeteer');

const books = {
  draftkings: {
    url: 'https://sportsbook.draftkings.com'
  },
  fanduel: {
    url: 'https://co.sportsbook.fanduel.com/sports'
  },
  mgm: {
    url: 'https://sports.co.betmgm.com/en/sports'
  }
};

(async () => {

  const browser = await puppeteer.launch({headless: false});
  
  const draftkings = await browser.newPage();
  const fanduel = await browser.newPage();
  const mgm = await browser.newPage();
  
  
  (await browser.pages()).map(async (page) => {
    await page.setViewport({
      width: 1400,
      height: 1000,
      deviceScaleFactor: 1,
    });
  });

  // DRAFTKINGS LOGIN
  await draftkings.bringToFront();
  await draftkings.goto(books.draftkings.url);
  await draftkings.waitForSelector('[data-test-id]');
  await draftkings.evaluate(() => document.querySelector('[data-test-id]').click())
  await draftkings.evaluate(() => document.querySelector('[data-test-id="log-in-sign-up-link"]').click())
  await draftkings.waitForSelector('#sportsbook-login-email-input')
  await draftkings.type('#sportsbook-login-email-input', process.env.DRAFTKINGS_EMAIL); // Types instantly
  await draftkings.type('#sportsbook-login-password-input', process.env.DRAFTKINGS_PASSWORD); // Types instantly
  await draftkings.waitForSelector('#sportsbook-login-button')
  await draftkings.evaluate(() => document.querySelector('#sportsbook-login-button').click())
  
  // FANDUEL LOGIN
  await fanduel.bringToFront();
  await fanduel.goto(books.fanduel.url);
  await fanduel.waitForSelector('.login_btn');
  await fanduel.evaluate(() => document.querySelector('.login_btn').click())
  await fanduel.waitForSelector('#login-email');
  await fanduel.type('#login-email', process.env.FANDUEL_EMAIL); // Types instantly
  await fanduel.type('#login-password', process.env.FANDUEL_PASSWORD); // Types instantly
  await fanduel.waitForSelector('[data-test-id="button-submit"]')
  await fanduel.evaluate(() => document.querySelector('[data-test-id="button-submit"]').click())
  
  // MGM LOGIN
  await mgm.bringToFront();
  await mgm.goto(books.mgm.url);
  await mgm.waitForSelector('.menu-item-link');
  await mgm.evaluate(() => document.querySelector('[href="https://www.co.betmgm.com/en/labelhost/login"]').click());
  await mgm.waitForSelector('input[name="username"]');
  await mgm.type('input[name="username"]', process.env.MGM_EMAIL); // Types instantly
  await mgm.type('input[name="password"]', process.env.MGM_PASSWORD); // Types instantly
  await mgm.waitForSelector('button.login');
  await mgm.evaluate(() => document.querySelector('button.login').click());

})();
