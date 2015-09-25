var helper = require('./helpers/mainHelper.js'),
  path = require('path'),
  url = 'http://localhost:3000',
  firstDocument, documents, padlockOn, padlockOff, uploadButton, uploadInput,
    nodes, bottomRightNode, newNode, firstDropdownClick, link, closePopup, newChapter;

describe('Authenticated user', function() {
    
  beforeEach(function() {
    browser.ignoreSynchronization = true; 
  });
    
  afterEach(function() {
    helper.wait();
  });
  
  it('should authenticate as admin', function() {
    browser.get(url);
    helper.authenticate();
    
    firstDocument = element.all(by.repeater('item in $root.listItems')).first().element(by.css('.item-name')).element(by.tagName('span'));
    closePopup = $('.close-modal');
    documents = element.all(by.repeater('item in $root.listItems'));
    padlockOn = $('.protection-file-on');
    padlockOff = $('.protection-file-off');
    newChapter = element.all(by.css('.dual-submit')).last();
    uploadButton = $('button[type="file"]');
    uploadInput = $('input[type="file"]');
    firstDropdownClick = function() {
      browser.actions().mouseMove(element.all(by.css('.item-name')).first()).perform();
      helper.wait();
      element.all(by.css('.fa-ellipsis-v')).first().click();
      helper.wait();
    };
    nodes = element.all(by.css('.node'));
    bottomRightNode = nodes.first();
    newNode = nodes.last();
    link = element(by.id('share-link'));
  });

  it('should create node', function() {
    nodes.count().then(function(count) {
      bottomRightNode.$('.addNode').click();
      helper.wait();
      expect(nodes.count()).toEqual(count+1);
    });
  });

  it('should rename node', function() {
    newNode.$('.renameNode').click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('test');
    $('.modal-button').click();
    helper.wait();
    expect(newNode.$('.renameNode').getText()).toEqual('test');
  });

  it('should delete completly node', function() {
    newNode.$('.deleteNode').click();
    helper.wait();
    element.all(by.css('.modal-button')).first().click();
    helper.wait();
    expect(newNode.getText()).not.toEqual('test');
  });

  it('should create chapters', function() {
    bottomRightNode.element(by.tagName('circle')).click();
    helper.wait();
    newChapter.click();
    helper.wait();
    expect($('.success').isPresent()).toBe(true);
  });

  it('should rename chapters', function() {
    firstDropdownClick();
    element.all(by.css('.btn-options .active a')).first().click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('test');
    $('.modal-button').click();
    helper.wait();
    expect(firstDocument.getText()).toEqual('test');
  });

  it('should share chapters not main', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(1).click();
    helper.wait();
    expect(link.getText()).toContain('/view/chapters/');
    closePopup.click();
  });

  it('should delete chapters', function() {
    firstDropdownClick();
    helper.wait();
    documents.count().then(function(count) {
      element.all(by.css('.btn-options .active a')).last().click();
      helper.wait();
      expect(documents.count()).toEqual(count-1);
    });
  });

  it('should upload document', function() {
    absolutePath = path.resolve(__dirname, './test.txt');
    helper.wait();
    documents.count().then(function(count) {
      uploadInput.sendKeys(absolutePath);
      helper.wait();
      expect(documents.count()).toEqual(count+1);
    })
  });

  it('should rename document', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).first().click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('renametest');
    $('.modal-button').click();
    helper.wait();
    expect(firstDocument.getText()).toEqual('renametest.txt');
  });

  it('should share document', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(2).click();
    helper.wait();
    expect(link.getText()).toContain('/view/documents/');
    $('.close-modal').click();
  });

  it('should download document', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(1).click();
    helper.wait();
    element.all(by.css('.modal-button')).first().click().then(function() {
      helper.wait();
      expect($('.error').isPresent()).toBe(false);
    });
  });

  it('should lock node', function() {
    newChapter.click();
    helper.wait();
    padlockOff.click();
    helper.wait();
    $('.modal-input').sendKeys('test');
    element.all(by.css('.modal-button')).first().click();
    helper.wait();
    expect(padlockOn.isPresent()).toBe(true);
  });

  it('should download locked document with good password', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(1).click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('test');
    element.all(by.css('.modal-button')).first().click();
    helper.wait();
    element.all(by.css('.modal-button')).get(1).click().then(function() {
      helper.wait();
      expect($('.error').isPresent()).toBe(false);
    });
  });

  it('should not download locked document with wrong password', function() {
    firstDropdownClick();
    helper.wait();
    element.all(by.css('.btn-options .active a')).get(1).click();
    helper.wait();
    $('.modal-input').clear();
    $('.modal-input').sendKeys('wrongpsw');
    element.all(by.css('.modal-button')).first().click().then(function() {
      helper.wait();
      expect($('.error').isPresent()).toBe(true);
      $('.close-modal').click();
    });
  });
  
  it('should delete document', function() {
    firstDropdownClick();
    helper.wait();
    documents.count().then(function(count) {
      element.all(by.css('.btn-options .active a')).last().click();
      helper.wait();
      expect(documents.count()).toEqual(count-1);
    });
  });
  
  it('should unlock node', function() {
    padlockOn.click();
    helper.wait();
    expect(padlockOff.isPresent()).toBe(true);
  });

  it('should delete and transfer node', function() {
    element.all(by.css('.addNode')).first().click();
    helper.wait();
    nodes.count().then(function(count) {
      newNode.$('.deleteNode').click();
      helper.wait();
      element.all(by.css('.modal-button')).last().click();
      helper.wait();
      expect(nodes.count()).toEqual(count-1);
      expect(documents.count()).not.toEqual(0);
      firstDropdownClick();
      helper.wait();
      element.all(by.css('.btn-options .active a')).last().click();
    })
  });

});