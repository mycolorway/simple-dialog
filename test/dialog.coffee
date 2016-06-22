expect = chai.expect
SimpleDialog = require '../src/dialog'
describe "dialog", ->
  it "should see dialog if everything is ok", ->
    expect(true).to.equal(true)
    dialog = new SimpleDialog
      content: "hello world"
    expect($(".simple-dialog").length).to.equal(1)


  xit "should see throw error if no content", ->
    expect(simple.dialog).toThrow()


  xit "should exsit only one dialog at same time", ->
    dialog1 = simple.dialog
      cls: "dialog-1"
      content: "hello"

    dialog2 = simple.dialog
      cls: "dialog-2"
      content: "hello"

    expect($(".dialog-1").length).toBe(0)
    expect($(".dialog-2").length).toBe(1)
    expect($(".simple-dialog").length).toBe(1)


  xit "should remove when click remove button", ->
    dialog = simple.dialog
      content: "hello"

    dialog.el.find(".simple-dialog-remove").click()
    expect($(".simple-dialog").length).toBe(0)


  xit "should remove when click modal", ->
    dialog = simple.dialog
      modal: true
      content: "hello"

    modal = $(".simple-dialog-modal")
    expect(modal.length).toBe(1)
    modal.click()
    expect($(".simple-dialog-modal").length).toBe(0)


  xit "should not remove when set clickModalRemove false and click modal", ->
    dialog = simple.dialog
      modal: true
      clickModalRemove: false
      content: "hello"

    modal = $(".simple-dialog-modal")
    expect(modal.length).toBe(1)
    modal.click()
    expect($(".simple-dialog-modal").length).toBe(1)


  xit "should remove when click the button created by config [close]", ->
    dialog = simple.dialog
      modal: true
      buttons: ["close"]
      content: "hello"

    dialog.el.find("button").click()
    expect($(".simple-dialog").length).toBe(0)


  xit "should remove when call simple.dialog.removeAll", ->
    dialog = simple.dialog
      content: "hello"

    simple.dialog.removeAll()
    expect($(".simple-dialog").length).toBe(0)


  xit "should change default class when set defaultButton", ->
    simple.dialog.setDefaultButton
      text: "tinyfive"
      cls: "tinyfive"

    dialog = simple.dialog
      content: "hello"
      buttons: [{
        test: 1
      }]

    button = dialog.buttonWrap.find('button')

    expect(button.html()).toEqual("tinyfive")
    expect(/tinyfive/.test(button.attr('class'))).toBeTruthy()


  xit "should remove when ESC keydown", ->
    dialog = simple.dialog
      content: "hello"

    esc = $.Event "keydown", which: 27
    $(document).trigger(esc)
    expect($(".simple-dialog").length).toBe(0)


  xit "should change position and height when content change and refresh", ->
    dialog = simple.dialog
      content: "hello"

    oTop = dialog.el.css("marginTop")
    oHeight = dialog.el.outerHeight()

    content = "<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>"
    dialog.setContent(content)

    nTop = dialog.el.css("marginTop")
    nHeight = dialog.el.outerHeight()

    expect(oTop).not.toEqual(nTop)
    expect(oHeight).not.toEqual(nHeight)


  xit "should focus first button default", ->
    dialog = simple.dialog
      content: "hello"

    # this is bug of phantomjs
    # https://github.com/guard/guard-jasmine/issues/48
    button = dialog.buttonWrap.find('.btn:first')
    # expect(button.is(':focus')).toBe(true)
    expect(button[0] == document.activeElement).toBe(true)

  xit "should trigger destroy event when dialog remove", ->
    dialog = simple.dialog
      content: "hello"

    eventTriggered = false
    dialog.on 'destroy', ->
      eventTriggered = true

    dialog.remove()
    expect(eventTriggered).toBe(true)

  xit 'should show scroll shadow if content is too long', ->
    winH = $(window).height()
    dialog = simple.dialog
      content: "<div style=\"height: #{winH + 200}px;\">long content</div>"

    expect(dialog.wrapper.hasClass('bottom-scrolling')).toBe(true)

xdescribe "message", ->
  it "should see only one button called 知道了", ->
    message = simple.dialog.message
      content: "hello"

    button = message.el.find("button")
    expect(button.length).toBe(1)
    expect(button.html()).toEqual("知道了")
