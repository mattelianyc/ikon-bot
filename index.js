require('dotenv').config()
const puppeteer = require('puppeteer');

const booking = {
  date: "Wed Jan 20 2021"
};

(async () => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://account.ikonpass.com/en/login');

  await page.type('#email', process.env.USER_EMAIL); // Types instantly
  await page.type('#sign-in-password', process.env.USER_PASS); // Types instantly

  await page.waitFor(3000);
  
  await page.click('.submit');
  
  await page.waitFor(3000);
  
  await page.evaluate(() => document.querySelector('[href="/myaccount/add-reservations/"]').click())
  
  await page.waitFor(3000);
  
  await page.type('input', 'Winter Park Resort');
  
  await page.waitFor(2000);
  
  await page.evaluate(() => document.querySelector('.react-autosuggest__suggestions-list > li').click())
  
  await page.waitFor(1000);
  
  await page.evaluate(() => {
    let continueButtonXPathResult = document.evaluate("//span[contains(., 'Continue')]", document, null, XPathResult.ANY_TYPE, null )
    continueButtonXPathResult.iterateNext().click();
  });
  
  await page.waitFor(1000);
  
  await page.evaluate(booking => document.querySelector(`.DayPicker-Day[aria-label="${booking.date}"]`).click(), booking);
  
  await page.waitFor(1000);
  
  await page.evaluate(() => {
    let saveButtonXPathResult = document.evaluate("//span[contains(., 'Save')]", document, null, XPathResult.ANY_TYPE, null )
    saveButtonXPathResult.iterateNext().click();
  });
  
  await page.waitFor(2000);
  
  await page.evaluate(() => {
    let continueToConfirmButtonXPathResult = document.evaluate("//span[contains(., 'Confirm')]", document, null, XPathResult.ANY_TYPE, null )
    continueToConfirmButtonXPathResult.iterateNext().click();
  });
  
  await page.waitFor(2000);
  
  await page.click('input')
  
  await page.waitFor(2000);
  
  await page.evaluate(() => {
    let confirmReservationsButtonXPathResult = document.evaluate("//span[contains(., 'Reservations')]", document, null, XPathResult.ANY_TYPE, null )
    confirmReservationsButtonXPathResult.iterateNext().click();
  });
  
  // await browser.close();

})();
