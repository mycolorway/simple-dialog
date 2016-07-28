class Dialog extends SimpleModule
  @opts:
    content: null
    width: 450
    modal: false
    fullscreen: false
    clickModalRemove: true
    cls: ""
    showRemoveButton: true
    buttons: null
    focusButton: ".btn:first"
  @locales:
    confirm:
      buttons: ['ok', 'cancel']
    message:
      button: 'known'


  @_count: 0

  @_tpl:
    dialog: """
      <div class="simple-dialog">
        <div class="simple-dialog-wrapper">
          <div class="simple-dialog-content"></div>
          <div class="simple-dialog-buttons"></div>
        </div>
        <a class="simple-dialog-remove" href="javascript:;">
          <i class="icon-cross"><span>&#10005;</span></i>
        </a>
      </div>
    """

    modal: """
      <div class="simple-dialog-modal"></div>
    """

    button: """
      <button type="button"></button>
    """


  constructor: (opts)->
    super
    @opts = $.extend {}, Dialog.opts, opts
    if @opts.content is null
      throw new Error "[Dialog] - content shouldn't be empty"

    @id = ++ Dialog._count

    Dialog.removeAll()
    @_render()
    @_bind()
    @el.data("dialog", @)

    if @opts.buttons && @opts.focusButton
      @buttonWrap.find(@opts.focusButton).focus()

  _render: () ->
    @el = $(Dialog._tpl.dialog).addClass @opts.cls
    @wrapper = @el.find(".simple-dialog-wrapper")
    @removeButton = @el.find(".simple-dialog-remove")
    @contentWrap = @el.find(".simple-dialog-content")
    @buttonWrap = @el.find(".simple-dialog-buttons")


    @el.toggleClass 'simple-dialog-fullscreen', @opts.fullscreen

    @el.css
      width: @opts.width

    @contentWrap.append(@opts.content)

    unless @opts.showRemoveButton
      @removeButton.remove()

    unless @opts.buttons
      @buttonWrap.remove()
      @buttonWrap = null
    else
      for button in @opts.buttons
        if button is "close"
          button =
            callback: =>
              @remove()

        button = $.extend({}, button)

        $(Dialog._tpl.button)
          .addClass 'btn'
          .addClass button.cls
          .html button.text
          .on "click", button.callback
          .appendTo @buttonWrap

    @el.appendTo("body")

    if @opts.modal
      @modal = $(Dialog._tpl.modal).appendTo("body")
      @modal.css("cursor", "default") unless @opts.clickModalRemove


  _bind: ->
    @removeButton.on "click.simple-dialog", (e) =>
      e.preventDefault()
      @remove()

    if @modal and @opts.clickModalRemove
      @modal.on "click.simple-dialog", (e) =>
        @remove()

    $(document).on "keydown.simple-dialog-#{@id}", (e) =>
      if e.which is 27
        @remove()



  _unbind: ->
    @removeButton.off(".simple-dialog")
    @modal.off(".simple-dialog") if @modal and @opts.clickModalRemove
    $(document).off(".simple-dialog-#{@id}")
    $(window).off(".simple-dialog-#{@id}")

  setContent: (content) ->
    @contentWrap.html(content)

  remove: ->
    @trigger 'destroy'
    @_unbind()
    @modal.remove() if @modal
    @el.remove()
    $('body').removeClass('simple-dialog-scrollable')



  @removeAll: ->
    $(".simple-dialog").each () ->
      dialog = $(@).data("dialog")
      dialog.remove()

Dialog.message = (opts) ->
  opts = $.extend(true,{
    cls: "simple-dialog-message"
    buttons: Dialog.message.buttons
  }, opts, {
    cls: "simple-dialog-message" + (if opts.cls then " #{opts.cls}" else '')
  })

  return new Dialog opts

Dialog.message.buttons = [{
  text: Dialog.locales.message.button
  callback: (e) ->
    $(e.target).closest(".simple-dialog")
      .data("dialog").remove()
}]


Dialog.confirm = (opts) ->
  opts = $.extend({
    callback: $.noop
    cls: "simple-dialog-confirm"
    buttons: Dialog.confirm.buttons
  }, opts, {
    cls: "simple-dialog-confirm" + (if opts.cls then " #{opts.cls}" else '')
  })

  return new Dialog opts

Dialog.confirm.buttons = [{
  text: Dialog.locales.confirm.buttons[0]
  callback: (e) ->
    dialog = $(e.target).closest(".simple-dialog").data("dialog")
    dialog.opts.callback(e, true)
    dialog.remove()
}, {
  text: Dialog.locales.confirm.buttons[1]
  cls: "btn-link"
  callback: (e) ->
    dialog = $(e.target).closest(".simple-dialog").data("dialog")
    dialog.opts.callback(e, false)
    dialog.remove()
}]


module.exports = Dialog
