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
    width: 450
    modal: false
    fullscreen: false
    clickModalRemove: true
    cls: ""
    showRemoveButton: true
    buttons: ['close']
    focusButton: ".btn:first"
    titleSelector: 'h3:first'
    contentSelector: '.simple-dialog-content'
    buttonSelector: '.simple-dialog-buttons'

  @_count: 0

  @_mobile: do ->
    ua = navigator.userAgent
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/.test ua

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


  constructor: ->
    super
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

    $(window).on "resize.simple-dialog-#{@id}", (e) =>
      @maxContentHeight = null


  _unbind: ->
    @removeButton.off(".simple-dialog")
    @modal.off(".simple-dialog") if @modal and @opts.clickModalRemove
    $(document).off(".simple-dialog-#{@id}")
    $(window).off(".simple-dialog-#{@id}")


  _initContentScroll: ->
    @_topShadow ||= do =>
      $('<div class="content-top-shadow" />')
        .appendTo @wrapper

    @_bottomShadow ||= do =>
      $('<div class="content-bottom-shadow" />')
        .appendTo @wrapper

    contentPosition = @contentEl.position()
    contentW = @contentEl.width()
    shadowH = @_bottomShadow.height()
    @_topShadow.css
      width: contentW
      top: contentPosition.top
      left: contentPosition.left
    @_bottomShadow.css
      width: contentW
      top: contentPosition.top + @contentEl.innerHeight() - shadowH
      left: contentPosition.left

    @contentEl.css 'overflow-y': 'auto'
      .css 'position', 'relative'

    scrollHeight = @contentEl[0].scrollHeight
    innerHeight =  @contentEl.innerHeight()
    @contentEl.off 'scroll.simple-dialog'
      .on 'scroll.simple-dialog', (e) =>
        scrollTop = @contentEl.scrollTop()
        topScrolling = scrollTop > 0
        bottomScrolling = scrollHeight - scrollTop - innerHeight > 1
        @wrapper.toggleClass 'top-scrolling', topScrolling
          .toggleClass 'bottom-scrolling', bottomScrolling
      .trigger 'scroll'

  setContent: (content) ->
    @contentWrap.html(content)

    @contentEl = null
    @titleEl = null
    @buttonEl = null
    @maxContentHeight = null
    @_topShadow = null
    @_bottomShadow = null



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


  @defaultButton:
    text: 'close'
    callback: $.noop


Dialog.message = (opts) ->
  opts = $.extend({
    cls: "simple-dialog-message"
    buttons: [{
      text: 'known'
      callback: (e) ->
        $(e.target).closest(".simple-dialog")
          .data("dialog").remove()
    }]
  }, opts, {
    cls: "simple-dialog-message" + (if opts.cls then " #{opts.cls}" else '')
  })

  return new Dialog opts

Dialog.confirm = (opts) ->
  opts = $.extend({
    callback: $.noop
    cls: "simple-dialog-confirm"
    buttons: [{
      text: 'ok'
      callback: (e) ->
        dialog = $(e.target).closest(".simple-dialog").data("dialog")
        dialog.opts.callback(e, true)
        dialog.remove()
    }, {
      text: 'cancel'
      cls: "btn-link"
      callback: (e) ->
        dialog = $(e.target).closest(".simple-dialog").data("dialog")
        dialog.opts.callback(e, false)
        dialog.remove()
    }]
  }, opts, {
    cls: "simple-dialog-confirm" + (if opts.cls then " #{opts.cls}" else '')
  })

  return new Dialog opts

Dialog.setDefaultButton = (opts) ->
  Dialog.defaultButton = opts

module.exports = Dialog
