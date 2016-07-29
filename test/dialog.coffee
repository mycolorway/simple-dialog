expect = chai.expect
SimpleDialog = require '../src/dialog'
describe "dialog", ->
  it "should see dialog if everything is ok", ->
    expect(true).to.equal(true)
    dialog = new SimpleDialog
      content: "hello world"
    expect($(".simple-dialog").length).to.equal(1)


  it "should see throw error if no content", ->
    f = ()->
      new SimpleDialog()
    expect(f).to.throw(Error)


  it "should exsit only one dialog at same time", ->
    dialog1 = new SimpleDialog
      cls: "dialog-1"
      content: "hello"

    dialog2 = new SimpleDialog
      cls: "dialog-2"
      content: "hello"

    expect($(".dialog-1").length).to.equal(0)
    expect($(".dialog-2").length).to.equal(1)
    expect($(".simple-dialog").length).to.equal(1)


  it "should remove when click remove button", ->
    dialog = new SimpleDialog
      content: "hello"

    dialog.el.find(".simple-dialog-remove").click()
    expect($(".simple-dialog").length).to.equal(0)


  it "should remove when click modal", ->
    dialog = new SimpleDialog
      modal: true
      content: "hello"

    modal = $(".simple-dialog-modal")
    expect(modal.length).equal(1)
    modal.click()
    expect($(".simple-dialog-modal").length).equal(0)

  it "should remove when click the button created by config [close]", ->
    dialog = new SimpleDialog
      modal: true
      buttons: ["close"]
      content: "hello"

    dialog.el.find("button").click()
    expect($(".simple-dialog").length).equal(0)


  it "should remove when call simple.dialog.removeAll", ->
    dialog = new SimpleDialog
      content: "hello"

    SimpleDialog.removeAll()
    expect($(".simple-dialog").length).equal(0)


  it "should remove when ESC keydown", ->
    dialog = new SimpleDialog
      content: "hello"

    esc = $.Event "keydown", which: 27
    $(document).trigger(esc)
    expect($(".simple-dialog").length).equal(0)



  it "should focus first button default", ->
    dialog = new SimpleDialog
      content: "hello"
      buttons: ['close']

    # this is bug of phantomjs
    # https://github.com/guard/guard-jasmine/issues/48
    button = dialog.buttonWrap.find('.btn:first')
    # expect(button.is(':focus')).toBe(true)
    expect(button[0] == document.activeElement).to.be.true

  it "should trigger destroy event when dialog remove", ->
    dialog = new SimpleDialog
      content: "hello"

    eventTriggered = false
    dialog.on 'destroy', ->
      eventTriggered = true

    dialog.remove()
    expect(eventTriggered).to.be.true

describe "message", ->
  it "should see only one button called 知道了", ->
    SimpleDialog.locales.message.button = '知道了'
    message = SimpleDialog.message
      content: "hello"

    button = message.el.find("button")
    expect(button.length).equal(1)
    expect(button.html()).equal("知道了")
