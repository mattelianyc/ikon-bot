require('dotenv').config()
const puppeteer = require('puppeteer');

const booking = {
  date: "Sat Jan 16 2021",
  mountain: "Winter Park Resort",
  attemptsBeforeFail: 100
};

(async () => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 960,
    height: 720,
    deviceScaleFactor: 1,
  });
  await page.goto('https://account.ikonpass.com/en/login');

  await page.type('#email', process.env.USER_EMAIL); // Types instantly
  await page.type('#sign-in-password', process.env.USER_PASS); // Types instantly

  await page.waitFor(3000);
  
  await page.click('.submit');
  
  await page.waitFor(3000);
  
  await page.evaluate(() => document.querySelector('[href="/myaccount/add-reservations/"]').click())
  
  await page.waitFor(3000);
  

  let isAvailable;

  for (let index = 0; index < booking.attemptsBeforeFail; index++) {

    await page.waitFor(2000);
    
    await page.type('input', `${booking.mountain}`);
  
    await page.waitFor(2000);
    
    await page.evaluate(() => document.querySelector('.react-autosuggest__suggestions-list > li').click())
    
    await page.waitFor(1000);
    
    await page.evaluate(() => {
      let continueButtonXPathResult = document.evaluate("//span[contains(., 'Continue')]", document, null, XPathResult.ANY_TYPE, null )
      continueButtonXPathResult.iterateNext().click();
    });
    
    await page.waitFor(1000);
    
    isAvailable = await page.evaluate(booking => {
      
      let dateUnavailable = document.querySelector(`.DayPicker-Day[aria-label="${booking.date}"]`).classList.contains('DayPicker-Day--unavailable');
      
      if(dateUnavailable) {
        return false;
      } else {
        return true;
      }
  
    }, booking);
    
    await page.waitFor(1000);
  
    // console.log('is availabe? ',  isAvailable);
  
    if(isAvailable) {
  
      await page.evaluate(booking => document.querySelector(`.DayPicker-Day[aria-label="${booking.date}"]`).click(), booking)
  
      await page.waitFor(2000);
  
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
      
      await page.waitFor(3000);

      await browser.close();

    } else {
      
      await page.reload();
      
      await page.waitFor(2000);
  
    }

  }
  

})();
