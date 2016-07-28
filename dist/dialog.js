/**
 * simple-dialog v1.1.12
 * https://github.com/mycolorway/simple-dialog
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * https://github.com/mycolorway/simple-dialog/license.html
 *
 * Date: 2016-07-28
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('simple-module'));
  } else {
    root.SimpleDialog = factory(root.jQuery,root.SimpleModule);
  }
}(this, function ($,SimpleDialog) {
var define, module, exports;
var b = (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Dialog,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Dialog = (function(superClass) {
  extend(Dialog, superClass);

  Dialog.opts = {
    content: null,
    width: 450,
    modal: false,
    fullscreen: false,
    clickModalRemove: true,
    cls: "",
    showRemoveButton: true,
    buttons: null,
    focusButton: ".btn:first"
  };

  Dialog.locales = {
    confirm: {
      buttons: ['ok', 'cancel']
    },
    message: {
      button: 'known'
    }
  };

  Dialog._count = 0;

  Dialog._tpl = {
    dialog: "<div class=\"simple-dialog\">\n  <div class=\"simple-dialog-wrapper\">\n    <div class=\"simple-dialog-content\"></div>\n    <div class=\"simple-dialog-buttons\"></div>\n  </div>\n  <a class=\"simple-dialog-remove\" href=\"javascript:;\">\n    <i class=\"icon-cross\"><span>&#10005;</span></i>\n  </a>\n</div>",
    modal: "<div class=\"simple-dialog-modal\"></div>",
    button: "<button type=\"button\"></button>"
  };

  function Dialog(opts) {
    Dialog.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Dialog.opts, opts);
    if (this.opts.content === null) {
      throw new Error("[Dialog] - content shouldn't be empty");
    }
    this.id = ++Dialog._count;
    Dialog.removeAll();
    this._render();
    this._bind();
    this.el.data("dialog", this);
    if (this.opts.buttons && this.opts.focusButton) {
      this.buttonWrap.find(this.opts.focusButton).focus();
    }
  }

  Dialog.prototype._render = function() {
    var button, i, len, ref;
    this.el = $(Dialog._tpl.dialog).addClass(this.opts.cls);
    this.wrapper = this.el.find(".simple-dialog-wrapper");
    this.removeButton = this.el.find(".simple-dialog-remove");
    this.contentWrap = this.el.find(".simple-dialog-content");
    this.buttonWrap = this.el.find(".simple-dialog-buttons");
    this.el.toggleClass('simple-dialog-fullscreen', this.opts.fullscreen);
    this.el.css({
      width: this.opts.width
    });
    this.contentWrap.append(this.opts.content);
    if (!this.opts.showRemoveButton) {
      this.removeButton.remove();
    }
    if (!this.opts.buttons) {
      this.buttonWrap.remove();
      this.buttonWrap = null;
    } else {
      ref = this.opts.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        if (button === "close") {
          button = {
            callback: (function(_this) {
              return function() {
                return _this.remove();
              };
            })(this)
          };
        }
        button = $.extend({}, button);
        $(Dialog._tpl.button).addClass('btn').addClass(button.cls).html(button.text).on("click", button.callback).appendTo(this.buttonWrap);
      }
    }
    this.el.appendTo("body");
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
    return $(document).on("keydown.simple-dialog-" + this.id, (function(_this) {
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
    $(document).off(".simple-dialog-" + this.id);
    return $(window).off(".simple-dialog-" + this.id);
  };

  Dialog.prototype.setContent = function(content) {
    return this.contentWrap.html(content);
  };

  Dialog.prototype.remove = function() {
    this.trigger('destroy');
    this._unbind();
    if (this.modal) {
      this.modal.remove();
    }
    this.el.remove();
    return $('body').removeClass('simple-dialog-scrollable');
  };

  Dialog.removeAll = function() {
    return $(".simple-dialog").each(function() {
      var dialog;
      dialog = $(this).data("dialog");
      return dialog.remove();
    });
  };

  return Dialog;

})(SimpleModule);

Dialog.message = function(opts) {
  opts = $.extend(true, {
    cls: "simple-dialog-message",
    buttons: Dialog.message.buttons
  }, opts, {
    cls: "simple-dialog-message" + (opts.cls ? " " + opts.cls : '')
  });
  return new Dialog(opts);
};

Dialog.message.buttons = [
  {
    text: Dialog.locales.message.button,
    callback: function(e) {
      return $(e.target).closest(".simple-dialog").data("dialog").remove();
    }
  }
];

Dialog.confirm = function(opts) {
  opts = $.extend({
    callback: $.noop,
    cls: "simple-dialog-confirm",
    buttons: Dialog.confirm.buttons
  }, opts, {
    cls: "simple-dialog-confirm" + (opts.cls ? " " + opts.cls : '')
  });
  return new Dialog(opts);
};

Dialog.confirm.buttons = [
  {
    text: Dialog.locales.confirm.buttons[0],
    callback: function(e) {
      var dialog;
      dialog = $(e.target).closest(".simple-dialog").data("dialog");
      dialog.opts.callback(e, true);
      return dialog.remove();
    }
  }, {
    text: Dialog.locales.confirm.buttons[1],
    cls: "btn-link",
    callback: function(e) {
      var dialog;
      dialog = $(e.target).closest(".simple-dialog").data("dialog");
      dialog.opts.callback(e, false);
      return dialog.remove();
    }
  }
];

module.exports = Dialog;

},{}]},{},[1]);

return b(1);
}));
