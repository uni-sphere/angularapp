var helper = require('./helpers/mainHelper.js');
var path = require('path');
var url = 'http://localhost:3000';
var documents, chapters, padlockOn, padlockOff, uploadButton, uploadInput, nodes, bottomRightNode, newNode, firstDropdownClick, link

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
    
    documents = element.all(by.model('listItems')).first().all(by.repeater('item in listItems'));
    chapters = element.all(by.model('listItems')).last().all(by.repeater('item in listItems'));
    padlockOn = $('.protection-file-on');
    padlockOff = $('.protection-file-off');
    uploadButton = $('button[type="file"]');
    uploadInput = $('input[type="file"]');
    firstDropdownClick = function() {
      firstDropdownClick();
      helper.wait();
      element.all(by.css('.fa-ellipsis-v')).first().click();
      helper.wait();
    };
    nodes = element.all(by.css('.node'));
    bottomRightNode = nodes.first();
    newNode = nodes.last();
    link = element(by.id('share-link'));
  });

  // it('should create node', function() {
  //   nodes.count().then(function(count) {
  //     bottomRightNode.$('.addNode').click();
  //     helper.wait();
  //     expect(nodes.count()).toEqual(count+1);
  //   });
  // });
  //
  // it('should rename node', function() {
  //   newNode.$('.renameNode')).click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(newNode.$('.renameNode').getText()).toEqual('test');
  // });
  //
  // it('should delete completly node', function() {
  //   newNode.$('.deleteNode').click();
  //   helper.wait();
  //   element.all(by.css('.modal-button')).first().click();
  //   helper.wait();
  //   expect(newNode.getText()).not.toEqual('test');
  // });

  // it('should create chapters', function() {
  //   bottomRightNode.element(by.tagName('circle')).click();
  //   helper.wait();
  //   element.all(by.css('.dual-submit')).last().click();
  //   helper.wait();
  //   expect($('.success').isPresent()).toBe(true);
  // });

  // it('should rename chapters', function() {
  //   firstDropdownClick();
  //   element.all(by.css('.btn-options .active a')).first().click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(chapters.first().element(by.tagName('span')).getText()).toEqual('test');
  // });

  // it('should share chapters not main', function() {
  //   firstDropdownClick();
  //   helper.wait();
  //   element.all(by.css('.btn-options .active a')).get(1).click();
  //   helper.wait();
  //   expect(link.getText()).toContain('/view/chapters/');
  //   $('.close-modal').click();
  // });

  // it('should delete chapters', function() {
  //   firstDropdownClick();
  //   helper.wait();
  //   chapters.count().then(function(count) {
  //     element.all(by.css('.btn-options .active a')).last().click();
  //     helper.wait();
  //     expect(chapters.count()).toEqual(count-1);
  //   });
  // });

  // it('should upload document', function() {
  //   absolutePath = path.resolve(__dirname, './test.txt');
  //   helper.wait();
  //   documents.count().then(function(count) {
  //     console.log(count);
  //     uploadButton.click();
  //     helper.wait();
  //     uploadInput.sendKeys(absolutePath);
  //     helper.wait();
  //     expect(documents.count()).toEqual(count+1);
  //   })
  // });

  // it('should rename document', function() {
  //   firstDropdownClick();
  //   helper.wait();
  //   element.all(by.css('.btn-options .active a')).first().click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('renametest');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(documents.first().element(by.tagName('span')).getText()).toEqual('renametest');
  // });

  // it('should share document', function() {
//     firstDropdownClick();
//     helper.wait();
//     element.all(by.css('.btn-options .active a')).get(2).click();
//     helper.wait();
//     helper.wait();
//     expect(link.getText()).toContain('/view/documents/');
//     $('.close-modal').click();
//   });
//
//   it('should download document', function() {
//     firstDropdownClick();
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
//     firstDropdownClick();
//     helper.wait();
//     element.all(documents.count().then(function(count) {
//       element.all(by.css('.btn-options .active a')).last().click();
//       helper.wait();
//       expect(documents.count()).toEqual(count-1);
//     });
//   });
//
  // it('should lock node', function() {
  //   padlockOff.click();
  //   helper.wait();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(padlockOn.isPresent()).toBe(true);
  // });
//
//   it('should download locked document with good password', function() {
//     firstDropdownClick();
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
//     firstDropdownClick();
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
//     padlockOn.click();
//     helper.wait();
//     expect(padlockOff.isPresent()).toBe(true);
//   });
//
//   it('should delete and transfer node', function() {
//     element.all(by.css('.$('.addNode')')).first().click();
//     helper.wait();
//     newNode.$('.deleteNode').click();
//     helper.wait();
//     element.all(by.css('.modal-button')).last().click();
//     helper.wait();
//     expect(newNode.$('.renameNode').getText()).toEqual('L');
//     expect(documents.count()).not.toEqual(0);
//   });
  
});