class Dialog extends Widget
  opts:
    content: null
    width: 600
    height: "auto"
    modal: false
    cls: ""
    showRemoveButton: true
    buttons: ['close']


  _tpl: """
    <div class="dialog">
      <a class="dialog-remove" href="javascript:;"><i class="fa fa-times"></i></a>
      <div class="dialog-wrapper">
        <div class="dialog-content"></div>
        <div class="dialog-buttons"></div>
      </div>
    <div>
  """

  _modal: """
    <div class="dialog-modal"></div>
  """


  _button: """
    <button type="button"></button>
  """


  _init: () ->
    Dialog.removeAll()
    @_render()
    @_bind()
    @el.data("dialog", @)
    @refresh()



  _render: () ->
    @el = $(@_tpl).addClass @opts.cls
    @wrapper = @el.find(".dialog-wrapper")
    @removeButton = @el.find(".dialog-remove")
    @contentWrap = @el.find(".dialog-content")
    @buttonWrap = @el.find(".dialog-buttons")

    @el.css
      width: @opts.width
      height: @opts.height

    # TODO should encode content for xss
    # or the all template should be handle with template engine
    @contentWrap.append(@opts.content)

    unless @opts.showRemoveButton
      @removeButton.remove()

    for button in @opts.buttons
      btn = $(@_button)

      if button is "close"
        btn.html("关闭")
          .on("click", @remove)
      else
        btn.html(button.content || "关闭")
          .on("click", button.callback || $.noop)

      btn.appendTo(@buttonWrap)

    @el.appendTo("body")

    if @opts.modal
      @modal = $(@_modal).appendTo("body")


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


  remove: () =>
    @_unbind()
    @modal.remove() if @modal
    @el.remove()


  refresh: () ->
    @el.css
      marginLeft: - @el.width() / 2
      marginTop: - @el.height() / 2

    @contentWrap.height(@wrapper.height() - @buttonWrap.height())


  @removeAll: () ->
    $(".dialog").each () ->
      dialog = $(@).data("dialog")
      dialog.remove()



@simple ||= {}

@simple.dialog = (opts) ->
  return new Dialog opts
