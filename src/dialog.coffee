class Dialog extends SimpleModule
  @i18n:
    'zh-CN':
      cancel: '取消'
      close: '关闭'
      ok: '确定'
      known: '知道了'
    'en':
      cancel: 'cancel'
      close: 'close'
      ok: 'ok'
      known: 'ok'
  opts:
    content: null
    width: 600
    height: "auto"
    modal: false
    clickModalRemove: true
    cls: ""
    showRemoveButton: true
    buttons: ['close']
    focusButton: ".btn:first"

  @_mobile: do ->
    return true if /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/.test navigator.userAgent
    return false

  @_tpl:
    dialog: """
      <div class="simple-dialog">
        <a class="simple-dialog-remove" href="javascript:;"><i class="icon-cross"><span>&#10005;</span></i></a>
        <div class="simple-dialog-wrapper">
          <div class="simple-dialog-content"></div>
          <div class="simple-dialog-buttons"></div>
        </div>
      <div>
    """

    modal: """
      <div class="simple-dialog-modal"></div>
    """

    button: """
      <button type="button"></button>
    """


  _init: () ->
    if @opts.content is null
      throw "[Dialog] - content shouldn't be empty"

    Dialog.removeAll()
    @_render()
    @_bind()
    @el.data("dialog", @)
    @refresh()

    if @opts.focusButton
      @buttonWrap.find(@opts.focusButton).focus()

  _render: () ->
    @el = $(Dialog._tpl.dialog).addClass @opts.cls
    @wrapper = @el.find(".simple-dialog-wrapper")
    @removeButton = @el.find(".simple-dialog-remove")
    @contentWrap = @el.find(".simple-dialog-content")
    @buttonWrap = @el.find(".simple-dialog-buttons")

    @el.toggleClass 'simple-dialog-mobile', Dialog._mobile

    @el.css
      width: @opts.width
      height: @opts.height

    # TODO should encode content for xss
    # or the all template should be handle with template engine
    @contentWrap.append(@opts.content)

    unless @opts.showRemoveButton
      @removeButton.remove()

    if @opts.buttons is null or @opts.buttons is false
      @buttonWrap.remove()
    else
      for button in @opts.buttons
        if button is "close"
          button =
            callback: @remove

        button = $.extend({}, Dialog.defaultButton, button)

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


  _bind: () ->
    @removeButton.on "click.simple-dialog", (e) =>
      e.preventDefault()
      @remove()

    if @modal and @opts.clickModalRemove
      @modal.on "click.simple-dialog", (e) =>
        @remove()

    $(document).on "keydown.simple-dialog", (e) =>
      if e.which is 27
        @remove()


  _unbind: () ->
    @removeButton.off(".simple-dialog")
    @modal.off(".simple-dialog") if @modal and @opts.clickModalRemove
    $(document).off(".simple-dialog")


  setContent: (content) ->
    @contentWrap.html(content)
    @refresh()


  remove: () =>
    @_unbind()
    @modal.remove() if @modal
    @el.remove()


  refresh: () ->
    @contentWrap.height("auto")
    @contentWrap.height(@wrapper.height() - @buttonWrap.outerHeight(true))

    @el.css
      marginLeft: - @el.outerWidth() / 2
      marginTop: - @el.outerHeight() / 2


  @removeAll: () ->
    $(".simple-dialog").each () ->
      dialog = $(@).data("dialog")
      dialog.remove()


  @defaultButton:
    text: @::_t 'close'
    callback: $.noop


dialog = (opts) ->
  return new Dialog opts

dialog.message = (opts) ->
  opts = $.extend({width: 450}, opts, {
    buttons: [{
      text: Dialog._t 'known'
      callback: (e) ->
        $(e.target).closest(".simple-dialog")
          .data("dialog").remove()
    }]
  })

  return new Dialog opts

dialog.confirm = (opts) ->
  opts = $.extend({
    callback: $.noop
    width: 450
    buttons: [{
      text: Dialog._t 'ok'
      callback: (e) ->
        dialog = $(e.target).closest(".simple-dialog").data("dialog")
        dialog.opts.callback(e, true)
        dialog.remove()
    }, {
      text: Dialog._t 'cancel'
      cls: "btn-link"
      callback: (e) ->
        dialog = $(e.target).closest(".simple-dialog").data("dialog")
        dialog.opts.callback(e, false)
        dialog.remove()
    }]
  }, opts)
  return new Dialog opts

dialog.removeAll = Dialog.removeAll
dialog.setDefaultButton = (opts) ->
  Dialog.defaultButton = opts
