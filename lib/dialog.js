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
      cls: "",
      showRemoveButton: true,
      buttons: ['close']
    };

    Dialog.prototype._tpl = "<div class=\"dialog\">\n  <a class=\"dialog-remove\" href=\"javascript:;\"><i class=\"fa fa-times\"></i></a>\n  <div class=\"dialog-wrapper\">\n    <div class=\"dialog-content\"></div>\n    <div class=\"dialog-buttons\"></div>\n  </div>\n<div>";

    Dialog.prototype._modal = "<div class=\"dialog-modal\"></div>";

    Dialog.prototype._button = "<button type=\"button\"></button>";

    Dialog.prototype._init = function() {
      Dialog.removeAll();
      this._render();
      this._bind();
      this.el.data("dialog", this);
      return this.refresh();
    };

    Dialog.prototype._render = function() {
      var btn, button, _i, _len, _ref;
      this.el = $(this._tpl).addClass(this.opts.cls);
      this.wrapper = this.el.find(".dialog-wrapper");
      this.removeButton = this.el.find(".dialog-remove");
      this.contentWrap = this.el.find(".dialog-content");
      this.buttonWrap = this.el.find(".dialog-buttons");
      this.el.css({
        width: this.opts.width,
        height: this.opts.height
      });
      this.contentWrap.append(this.opts.content);
      if (!this.opts.showRemoveButton) {
        this.removeButton.remove();
      }
      _ref = this.opts.buttons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        btn = $(this._button);
        if (button === "close") {
          btn.html("关闭").on("click", this.remove);
        } else {
          btn.html(button.content || "关闭").on("click", button.callback || $.noop);
        }
        btn.appendTo(this.buttonWrap);
      }
      this.el.appendTo("body");
      if (this.opts.modal) {
        return this.modal = $(this._modal).appendTo("body");
      }
    };

    Dialog.prototype._bind = function() {
      this.removeButton.on("click.simple-dialog", (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.remove();
        };
      })(this));
      if (this.modal) {
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
      if (this.modal) {
        this.modal.off(".simple-dialog");
      }
      return $(document).off(".simple-dialog");
    };

    Dialog.prototype.remove = function() {
      this._unbind();
      if (this.modal) {
        this.modal.remove();
      }
      return this.el.remove();
    };

    Dialog.prototype.refresh = function() {
      this.el.css({
        marginLeft: -this.el.width() / 2,
        marginTop: -this.el.height() / 2
      });
      return this.contentWrap.height(this.wrapper.height() - this.buttonWrap.height());
    };

    Dialog.removeAll = function() {
      return $(".dialog").each(function() {
        var dialog;
        dialog = $(this).data("dialog");
        return dialog.remove();
      });
    };

    return Dialog;

  })(Widget);

  this.simple || (this.simple = {});

  this.simple.dialog = function(opts) {
    return new Dialog(opts);
  };

}).call(this);
