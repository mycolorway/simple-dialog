/**
 * simple-dialog v1.1.13
 * https://github.com/mycolorway/simple-dialog
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * https://github.com/mycolorway/simple-dialog/license.html
 *
 * Date: 2016-07-29
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('simple-module'));
  } else {
    root.SimpleDialog = factory(root.jQuery,root.SimpleModule);
  }
}(this, function ($,SimpleDialog) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"simple-dialog":[function(require,module,exports){
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
    cls: "",
    showRemoveButton: true,
    buttons: null,
    focusButton: ".btn:first"
  };

  Dialog._count = 0;

  Dialog.locales = {
    confirm: {
      buttons: ['ok', 'cancel']
    },
    message: {
      button: 'known'
    }
  };

  Dialog.message = function(opts) {
    opts = $.extend(true, {
      cls: "simple-dialog-message",
      buttons: [
        {
          text: Dialog.locales.message.button,
          callback: function(e) {
            return $(e.target).closest(".simple-dialog").data('simpleDialog').remove();
          }
        }
      ]
    }, opts, {
      cls: "simple-dialog-message" + (opts.cls ? " " + opts.cls : '')
    });
    return new Dialog(opts);
  };

  Dialog.confirm = function(opts) {
    var buttons;
    buttons = [
      {
        text: Dialog.locales.confirm.buttons[0],
        callback: function(e) {
          var dialog;
          dialog = $(e.target).closest(".simple-dialog").data('simpleDialog');
          dialog.opts.callback(e, true);
          return dialog.remove();
        }
      }, {
        text: Dialog.locales.confirm.buttons[1],
        cls: "btn-link",
        callback: function(e) {
          var dialog;
          dialog = $(e.target).closest(".simple-dialog").data('simpleDialog');
          dialog.opts.callback(e, false);
          return dialog.remove();
        }
      }
    ];
    opts = $.extend({
      callback: $.noop,
      cls: "simple-dialog-confirm",
      buttons: buttons
    }, opts, {
      cls: "simple-dialog-confirm" + (opts.cls ? " " + opts.cls : '')
    });
    return new Dialog(opts);
  };

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
    this.el.data('simpleDialog', this);
    this._focus();
  }

  Dialog.prototype._focus = function() {
    if (this.opts.buttons && this.opts.focusButton) {
      return this.buttonWrap.find(this.opts.focusButton).focus();
    }
  };

  Dialog.prototype._toggleFullscreen = function() {
    this.el.toggleClass('simple-dialog-fullscreen', this.opts.fullscreen);
    if (this.opts.fullscreen) {
      return $('body').addClass('simple-dialog-scrollable');
    }
  };

  Dialog.prototype._setWidth = function() {
    return this.el.css({
      width: this.opts.width
    });
  };

  Dialog.prototype._renderButtons = function() {
    var button, i, len, ref, results;
    if (!this.opts.showRemoveButton) {
      this.removeButton.remove();
    }
    if (!this.opts.buttons) {
      this.buttonWrap.remove();
      return this.buttonWrap = null;
    } else {
      ref = this.opts.buttons;
      results = [];
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
        results.push($(Dialog._tpl.button).addClass('btn').addClass(button.cls).html(button.text).on("click", button.callback).appendTo(this.buttonWrap));
      }
      return results;
    }
  };

  Dialog.prototype._setModal = function() {
    if (this.opts.modal) {
      return this.modal = $(Dialog._tpl.modal).appendTo("body");
    }
  };

  Dialog.prototype._render = function() {
    this.el = $(Dialog._tpl.dialog).addClass(this.opts.cls);
    this.wrapper = this.el.find(".simple-dialog-wrapper");
    this.removeButton = this.el.find(".simple-dialog-remove");
    this.contentWrap = this.el.find(".simple-dialog-content");
    this.buttonWrap = this.el.find(".simple-dialog-buttons");
    this._toggleFullscreen();
    this._setWidth();
    this.contentWrap.append(this.opts.content);
    this._renderButtons();
    this.el.appendTo("body");
    return this._setModal();
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
    if (this.modal) {
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
      dialog = $(this).data('simpleDialog');
      return dialog.remove();
    });
  };

  return Dialog;

})(SimpleModule);

module.exports = Dialog;

},{}]},{},[]);

return b('simple-dialog');
}));