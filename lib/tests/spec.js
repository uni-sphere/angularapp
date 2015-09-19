var helper = require('./helpers/mainHelper.js');

describe('Unisphere IFMA production App authenticated user', function() {
    
  beforeEach(function() {
    browser.ignoreSynchronization = true; 
  });
    
  afterEach(function() {
    helper.wait();
  });
  
  //////////
  // node //
  //////////
  
  it('should authenticate as admin', function() {
    browser.get('http://localhost:3000');
    helper.authenticate();
  });
  
  // it('should create node', function() {
  //   var n = 0
  //   element.all(by.css('.node')).count().then(function(count) {
  //     element.all(by.css('.addNode')).first().click();
  //     helper.wait();
  //     expect(element.all(by.css('.node')).count()).toEqual(count+1);
  //   });
  // });
  //
  // it('should rename node', function() {
  //   var el = element.all(by.css('.renameNode')).first();
  //   el.click();
  //   helper.wait();
  //   $('.modal-input').clear();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(el.getText()).toEqual('test');
  // });
  
  // it('should delete and transfer node', function() {
  //   var el = element.all(by.css('.node')).first();
  //   el.$('.deleteNode').click();
  //   helper.wait();
  //   element.all(by.css('.modal-button')).last().click();
  //   helper.wait();
  //   expect(el.$('.renameNode').getText()).toEqual('L');
  //   expect(element.all(by.css('.item-name')).count()).not.toEqual(0);
  // });
  
  // it('should delete completly node', function() {
  //   element.all(by.css('.addNode')).first().click();
  //   helper.wait();
  //   el = element.all(by.css('.node'))
  //   el.$('.deleteNode').click();
  //   helper.wait();
  //   element.all(by.css('.modal-button')).first().click();
  //   helper.wait();
  //   expect(el.$('.renameNode').getText()).toEqual('L');
  //   expect(element.all(by.css('.item-name')).count()).toEqual(0);
  // });
 
  // //////////////
  // // chapters //
  // //////////////
 
  it('should create chapters', function() {
    element.all(by.css('.node')).first().element(by.tagName('circle')).click();
  //   helper.wait();
  //   element.all(by.css('.dual-submit')).last().click();
  //   expect(element.all(by.css('.item-name')).count()).not.toEqual(0);
  // helper.wait();
  // element.all(by.css('.fa-ellipsis-v')).first().click();
  })  ;
  
  it('should rename chapters', function() {
    browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
    helper.wait();
    element.all(by.css('.fa-ellipsis-v')).first().click();
    helper.wait();
    element.all(by.repeater('item in dropdownMenu')).first().click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('test');
    $('.modal-button').click();
    helper.wait();
    expect(element.all(by.css('.item-name')).first().element(by.tagName('span')).getText()).toEqual('test');
  });
  
  // it('should delete chapters', function() {
  //   element.all(by.css('.fa-ellipsis-v')).first().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(3).click();
  //   helper.wait();
  //   expect(element.all(by.css('.item-name')).count()).toEqual(0);
  // });
  //
  // it('should share chapters not main', function() {
  //   element.all(by.css('.fa-ellipsis-v')).first().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(2).click();
  //   helper.wait();
  //   expect($('.share-link').getText()).toContain('eu/view/chapters/');
  // });
  //
  // it('should share chapters main', function() {
  //   $('.fa-bars').click();
  //   helper.wait();
  //   $('.fa-bars').element.all(by.css('.dropdown-item')).first().click();
  //   helper.wait();
  //   expect($('.share-link').getText()).toContain('eu/view/chapters/');
  // });
  //
  // ///////////////
  // // documents //
  // ///////////////
  //
  // it('should create document', function() {
  //   //
  // });
  //
  // it('should rename document', function() {
  //   element.all(by.css('.fa-ellipsis-v')).last().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).first().click();
  //   helper.wait();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect(element.all(by.css('.item-name')).first().element(by.tagName('span')).getText()).toEqual('test');
  // });
  //
  // it('should delete document', function() {
  //   element.all(by.css('.fa-ellipsis-v')).last().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(3).click();
  //   helper.wait();
  //   expect(element.all(by.css('.item-name')).count()).toEqual(0);
  // });
  //
  // it('should share document', function() {
  //   element.all(by.css('.fa-ellipsis-v')).last().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(2).click();
  //   helper.wait();
  //   expect($('.share-link').getText()).toContain('eu/view/documents/');
  // });
  //
  // it('should download document', function() {
  //   element.all(by.css('.fa-ellipsis-v')).last().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(1).click();
  //   helper.wait();
  //   //
  // });
  //
  // ///////////////////////////////
  // // again with padlock locked //
  // ///////////////////////////////
  //
  // it('should lock node', function() {
  //   $('.fa-unlock-alt').click();
  //   helper.wait();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   expect($('.protection-file-on').count()).toEqual(1);
  // });
  //
  // it('should unlock node', function() {
  //   $('.protection-file-on').click();
  //   helper.wait();
  //   expect($('.fa-unlock-alt').count()).toEqual(1);
  // });
  //
  // it('should download locked document', function() {
  //   $('.fa-unlock-alt').click();
  //   helper.wait();
  //   $('.modal-input').sendKeys('test');
  //   $('.modal-button').click();
  //   helper.wait();
  //   element.all(by.css('.fa-ellipsis-v')).last().click();
  //   helper.wait();
  //   element.all(by.css('.dropdowMenu')).get(1).click();
  //   helper.wait();
  //   //
  // });
  
  
});