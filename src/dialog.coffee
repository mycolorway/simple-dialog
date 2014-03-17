class Dialog extends Widget
  opts:
    content: null
    width: 600
    height: "auto"
    modal: false
    cls: ""
    showRemoveButton: true
    buttons: ['close']


  @_tpl:
    dialog: """
      <div class="simple-dialog">
        <a class="simple-dialog-remove" href="javascript:;"><i class="fa fa-times"></i></a>
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
      throw "[Dialog] - 内容不能为空"

    Dialog.removeAll()
    @_render()
    @_bind()
    @el.data("dialog", @)
    @refresh()



  _render: () ->
    @el = $(Dialog._tpl.dialog).addClass @opts.cls
    @wrapper = @el.find(".simple-dialog-wrapper")
    @removeButton = @el.find(".simple-dialog-remove")
    @contentWrap = @el.find(".simple-dialog-content")
    @buttonWrap = @el.find(".simple-dialog-buttons")

    @el.css
      width: @opts.width
      height: @opts.height

    # TODO should encode content for xss
    # or the all template should be handle with template engine
    @contentWrap.append(@opts.content)

    unless @opts.showRemoveButton
      @removeButton.remove()

    for button in @opts.buttons
      if button is "close"
        button =
          callback: @remove

      button = $.extend({}, Dialog.defaultButton, button)

      $(Dialog._tpl.button)
        .addClass button.cls
        .html button.content
        .on "click", button.callback
        .appendTo @buttonWrap

    @el.appendTo("body")

    if @opts.modal
      @modal = $(Dialog._tpl.modal).appendTo("body")


  _bind: () ->
    @removeButton.on "click.simple-dialog", (e) =>
      e.preventDefault()
      @remove()

    if @modal
      @modal.on "click.simple-dialog", (e) =>
        @remove()

    $(document).on "keydown.simple-dialog", (e) =>
      if e.which is 27
        @remove()


  _unbind: () ->
    @removeButton.off(".simple-dialog")
    @modal.off(".simple-dialog") if @modal
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
    @contentWrap.height(@wrapper.height() - @buttonWrap.height())

    @el.css
      marginLeft: - @el.width() / 2
      marginTop: - @el.height() / 2


  @removeAll: () ->
    $(".simple-dialog").each () ->
      dialog = $(@).data("dialog")
      dialog.remove()


  @defaultButton:
    content: "关闭"
    cls: "btn"
    callback: $.noop



@simple ||= {}

$.extend(@simple, {

  dialog: (opts) ->
    return new Dialog opts

  message: (opts) ->
    opts = $.extend(opts, {
      buttons: [{
        content: "知道了"
        callback: (e) ->
          $(e.target).closest(".simple-dialog")
            .data("dialog").remove()
      }]
    })

    return new Dialog opts

  confirm: (opts) ->
    opts = $.extend({
      buttons: [{
        content: "确定"
        callback: (e) ->
          $(e.target).closest(".simple-dialog")
            .data("dialog").remove()
      }, {
        content: "取消"
        callback: (e) ->
          $(e.target).closest(".simple-dialog")
            .data("dialog").remove()
      }]
    }, opts)

    return new Dialog opts
})

@simple.dialog.removeAll = Dialog.removeAll
@simple.dialog.setDefaultButton = (opts) ->
  Dialog.defaultButton = opts
