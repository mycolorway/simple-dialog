(function() {
  var Dialog,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = (function(_super) {
    __extends(Dialog, _super);

    function Dialog() {
      this.remove = __bind(this.remove, this);
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.prototype.opts = {
      content: null,
      width: 600,
      height: "auto",
      modal: false,
      clickModalRemove: true,
      cls: "",
      showRemoveButton: true,
      buttons: ['close'],
      autofocus: true
    };

    Dialog._tpl = {
      dialog: "<div class=\"simple-dialog\">\n  <a class=\"simple-dialog-remove\" href=\"javascript:;\"><i class=\"fa fa-times\"></i></a>\n  <div class=\"simple-dialog-wrapper\">\n    <div class=\"simple-dialog-content\"></div>\n    <div class=\"simple-dialog-buttons\"></div>\n  </div>\n<div>",
      modal: "<div class=\"simple-dialog-modal\"></div>",
      button: "<button type=\"button\"></button>"
    };

    Dialog.prototype._init = function() {
      if (this.opts.content === null) {
        throw "[Dialog] - 内容不能为空";
      }
      Dialog.removeAll();
      this._render();
      this._bind();
      this.el.data("dialog", this);
      return this.refresh();
    };

    Dialog.prototype._render = function() {
      var button, _i, _len, _ref;
      this.el = $(Dialog._tpl.dialog).addClass(this.opts.cls);
      this.wrapper = this.el.find(".simple-dialog-wrapper");
      this.removeButton = this.el.find(".simple-dialog-remove");
      this.contentWrap = this.el.find(".simple-dialog-content");
      this.buttonWrap = this.el.find(".simple-dialog-buttons");
      this.el.css({
        width: this.opts.width,
        height: this.opts.height
      });
      this.contentWrap.append(this.opts.content);
      if (!this.opts.showRemoveButton) {
        this.removeButton.remove();
      }
      if (this.opts.buttons === null) {
        this.buttonWrap.remove();
      } else {
        _ref = this.opts.buttons;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          button = _ref[_i];
          if (button === "close") {
            button = {
              callback: this.remove
            };
          }
          button = $.extend({}, Dialog.defaultButton, button);
          $(Dialog._tpl.button).addClass('btn').addClass(button.cls).html(button.content).on("click", button.callback).appendTo(this.buttonWrap);
        }
      }
      this.el.appendTo("body");
      if (this.opts.autofocus) {
        this.buttonWrap.find(".btn:not(.btn-x)").focus();
      }
      if (this.opts.modal) {
        this.modal = $(Dialog._tpl.modal).appendTo("body");
        if (!this.opts.clickModalRemove) {
          return this.modal.css("cursor", "default");
        }
      }
    };

    Dialog.prototype._bind = function() {
      this.removeButton.on("click.simple-dialog", (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.remove();
        };
      })(this));
      if (this.modal && this.opts.clickModalRemove) {
        this.modal.on("click.simple-dialog", (function(_this) {
          return function(e) {
            return _this.remove();
          };
        })(this));
      }
      return $(document).on("keydown.simple-dialog", (function(_this) {
        return function(e) {
          if (e.which === 27) {
            return _this.remove();
          }
        };
      })(this));
    };

    Dialog.prototype._unbind = function() {
      this.removeButton.off(".simple-dialog");
      if (this.modal && this.opts.clickModalRemove) {
        this.modal.off(".simple-dialog");
      }
      return $(document).off(".simple-dialog");
    };

    Dialog.prototype.setContent = function(content) {
      this.contentWrap.html(content);
      return this.refresh();
    };

    Dialog.prototype.remove = function() {
      this._unbind();
      if (this.modal) {
        this.modal.remove();
      }
      return this.el.remove();
    };

    Dialog.prototype.refresh = function() {
      this.contentWrap.height("auto");
      this.contentWrap.height(this.wrapper.height() - this.buttonWrap.height());
      return this.el.css({
        marginLeft: -this.el.outerWidth() / 2,
        marginTop: -this.el.outerHeight() / 2
      });
    };

    Dialog.removeAll = function() {
      return $(".simple-dialog").each(function() {
        var dialog;
        dialog = $(this).data("dialog");
        return dialog.remove();
      });
    };

    Dialog.defaultButton = {
      content: "关闭",
      callback: $.noop
    };

    return Dialog;

  })(Widget);

  this.simple || (this.simple = {});

  $.extend(this.simple, {
    dialog: function(opts) {
      return new Dialog(opts);
    },
    message: function(opts) {
      opts = $.extend({
        width: 450
      }, opts, {
        buttons: [
          {
            content: "知道了",
            callback: function(e) {
              return $(e.target).closest(".simple-dialog").data("dialog").remove();
            }
          }
        ]
      });
      return new Dialog(opts);
    },
    confirm: function(opts) {
      opts = $.extend({
        confirmCallback: $.noop,
        width: 450,
        buttons: [
          {
            content: "确定",
            callback: function(e) {
              var dialog;
              dialog = $(e.target).closest(".simple-dialog").data("dialog");
              dialog.opts.confirmCallback(e, true);
              return dialog.remove();
            }
          }, {
            content: "取消",
            cls: "btn-x",
            callback: function(e) {
              var dialog;
              dialog = $(e.target).closest(".simple-dialog").data("dialog");
              dialog.opts.confirmCallback(e, false);
              return dialog.remove();
            }
          }
        ]
      }, opts);
      return new Dialog(opts);
    }
  });

  this.simple.dialog.removeAll = Dialog.removeAll;

  this.simple.dialog.setDefaultButton = function(opts) {
    return Dialog.defaultButton = opts;
  };

}).call(this);
