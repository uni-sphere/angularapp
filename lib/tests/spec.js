var helper = require('./helpers/mainHelper.js');
var path = require('path');
var url = 'http://localhost:3000';

describe('Unisphere IFMA production App authenticated user', function() {
    
  beforeEach(function() {
    browser.ignoreSynchronization = true; 
  });
    
  afterEach(function() {
    helper.wait();
  });
  
  it('should authenticate as admin', function() {
    browser.get(url);
    helper.authenticate();
  });
  //
  // it('should create node', function() {
  //   element.all(by.css('.node')).count().then(function(count) {
  //     element.all(by.css('.addNode')).first().click();
  //     helper.wait();
  //     expect(element.all(by.css('.node')).count()).toEqual(count+1);
  //   });
  // });
  //
  // it('should rename node', function() {
  //   element.all(by.css('.renameNode')).last().click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(element.all(by.css('.renameNode')).last().getText()).toEqual('test');
  // });
  //
  // it('should delete completly node', function() {
  //   element.all(by.css('.node')).last().$('.deleteNode').click();
  //   helper.wait();
  //   element.all(by.css('.modal-button')).first().click();
  //   helper.wait();
  //   expect(element.all(by.css('.node')).last().getText()).not.toEqual('test');
  // });

  it('should create chapters', function() {
    element.all(by.css('.node')).first().element(by.tagName('circle')).click();
    // helper.wait();
    // element.all(by.css('.dual-submit')).last().click();
    // helper.wait();
    // expect($('.success').isPresent()).toBe(true);
  });
  //
  // it('should rename chapters', function() {
  //   browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
  //   helper.wait();
  //   element.all(by.css('.fa-ellipsis-v')).first().click();
  //   helper.wait();
  //   element.all(by.css('.btn-options .active a')).first().click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(element.all(by.css('.item-name')).first().element(by.tagName('span')).getText()).toEqual('test');
  // });

  it('should share chapters not main', function() {
    browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
    element.all(by.css('.fa-ellipsis-v')).first().click();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(1).click();
    helper.wait();
    expect(element(by.id('share-link')).getText()).toContain('/view/chapters/');
    $('.close-modal').click();
  });

  it('should delete chapters', function() {
    browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
    element.all(by.css('.fa-ellipsis-v')).first().click();
    helper.wait();
    element.all(by.css('.item-name')).count().then(function(count) {
      element.all(by.css('.btn-options .active a')).last().click();
      helper.wait();
      expect(element.all(by.repeater('.item-name')).count()).toEqual(count-1); ++++++++++++++++++++++++
    });
  });

  it('should upload document', function() {
    absolutePath = path.resolve(__dirname, './test.txt');
    helper.wait();
    element.all(by.css('.item-name')).count().then(function(count) {
      $('button[type="file"]').click();
      helper.wait();
      $('input[type="file"]').sendKeys(absolutePath);
      helper.wait();
      expect(element.all(by.css('.item-name')).count()).toEqual(count+1);
    })
  });

  // it('should rename document', function() {
  //   browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
  //   element.all(by.css('.fa-ellipsis-v')).first().click();
  //   helper.wait();
  //   element.all(by.css('.btn-options .active a')).first().click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('renametest');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(element.all(by.css('.item-name')).first().element(by.tagName('span')).getText()).toEqual('renametest');
  // });

  // it('should share document', function() {
//     browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
//     element.all(by.css('.fa-ellipsis-v')).first().click();
//     helper.wait();
//     element.all(by.css('.btn-options .active a')).get(2).click();
//     helper.wait();
//     helper.wait();
//     expect(element(by.id('share-link')).getText()).toContain('/view/documents/');
//     $('.close-modal').click();
//   });
//
//   it('should download document', function() {
//     browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
//     element.all(by.css('.fa-ellipsis-v')).first().click();
//     helper.wait();
//     element.all(by.css('.btn-options .active a')).get(1).click();
//     helper.wait();
//     element.all(by.css('.modal-button')).first().click().then(function() {
//       helper.wait();
//       expect($('.error').isPresent()).toBe(false);
//     });
//   });
//
//   it('should delete document', function() {
//     browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
//     element.all(by.css('.fa-ellipsis-v')).first().click();
//     helper.wait();
//     element.all(by.css('.item-name')).count().then(function(count) {
//       element.all(by.css('.btn-options .active a')).last().click();
//       helper.wait();
//       expect(element.all(by.css('.item-name')).count()).toEqual(count-1);
//     });
//   });
//
//   it('should lock node', function() {
//     $('.protection-file-off').click();
//     helper.wait();
//     $('.modal-input').sendKeys('test');
//     $('.modal-button').click();
//     helper.wait();
//     expect($('.protection-file-on').isPresent()).toBe(true);
//   });
//
//   it('should download locked document with good password', function() {
//     browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
//     element.all(by.css('.fa-ellipsis-v')).first().click();
//     helper.wait();
//     element.all(by.css('.btn-options .active a')).get(1).click();
//     helper.wait();
//     $('.modal-input').clear();
//     $('.modal-input').sendKeys('test');
//     $('.modal-button').click();
//     helper.wait();
//     element.all(by.css('.modal-button')).get(1).click().then(function() {
//       helper.wait();
//       expect($('.error').isPresent()).toBe(false);
//     });
//   });
//
//   it('should not download locked document with wrong password', function() {
//     browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
//     element.all(by.css('.fa-ellipsis-v')).first().click();
//     helper.wait();
//     element.all(by.css('.btn-options .active a')).get(1).click();
//     helper.wait();
//     $('.modal-input').clear();
//     $('.modal-input').sendKeys('wrongpsw');
//     $('.modal-button').click().then(function() {
//       helper.wait();
//       expect($('.error').isPresent()).toBe(true);
//       $('.close-modal').click();
//     });
//   });
//
//   it('should unlock node', function() {
//     $('.protection-file-on').click();
//     helper.wait();
//     expect($('.protection-file-off').isPresent()).toBe(true);
//   });
//
//   it('should delete and transfer node', function() {
//     element.all(by.css('.addNode')).first().click();
//     helper.wait();
//     element.all(by.css('.node')).last().$('.deleteNode').click();
//     helper.wait();
//     element.all(by.css('.modal-button')).last().click();
//     helper.wait();
//     expect(element.all(by.css('.node')).last().$('.renameNode').getText()).toEqual('L');
//     expect(element.all(by.css('.item-name')).count()).not.toEqual(0);
//   });
  
});