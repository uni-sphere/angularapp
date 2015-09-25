module.exports = {
  
  authenticate: function() {
    browser.sleep(1000);
    element(by.id('admin-co-header')).click();
    element(by.id('admin-co-email')).sendKeys('hello@unisphere.eu');
    element(by.id('admin-co-password')).sendKeys('gabgabgab');
    element(by.id('admin-co-sign-in')).click();
    browser.sleep(1000);
    browser.waitForAngular();
  },
  
  wait: function() {
    browser.sleep(1500);
    browser.waitForAngular();
  }
  
}