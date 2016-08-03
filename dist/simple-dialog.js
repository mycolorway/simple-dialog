/**
 * simple_dialog v2.0.0
 * https://github.com/mycolorway/simple-dialog
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * https://github.com/mycolorway/simple-dialog/license.html
 *
 * Date: 2016-08-3
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('simple-module'));
  } else {
    root.SimpleDialog = factory(root.jQuery,root.SimpleModule);
  }
}(this, function ($,SimpleModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"simple-dialog":[function(require,module,exports){
var SimpleDialog,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SimpleDialog = (function(superClass) {
  extend(SimpleDialog, superClass);

  SimpleDialog.opts = {
    content: null,
    width: 450,
    modal: false,
    fullscreen: false,
    cls: "",
    showRemoveButton: true,
    buttons: null,
    focusButton: ".button:first"
  };

  SimpleDialog._count = 0;

  SimpleDialog.locales = {
    confirm: {
      buttonOk: 'ok',
      buttonCancel: 'cancel'
    },
    message: {
      button: 'known'
    }
  };

  SimpleDialog.message = function(opts) {
    opts = $.extend(true, {
      cls: "simple-dialog-message",
      buttons: [
        {
          text: opts.buttonText || SimpleDialog.locales.message.button,
          callback: function(e) {
            return $(e.target).closest(".simple-dialog").data('simpleDialog').remove();
          }
        }
      ]
    }, opts, {
      cls: "simple-dialog-message" + (opts.cls ? " " + opts.cls : '')
    });
    return new SimpleDialog(opts);
  };

  SimpleDialog.confirm = function(opts) {
    var buttons;
    buttons = [
      {
        text: opts.confirmText || SimpleDialog.locales.confirm.buttonOk,
        callback: function(e) {
          var dialog;
          dialog = $(e.target).closest(".simple-dialog").data('simpleDialog');
          dialog.opts.callback(e, true);
          return dialog.remove();
        }
      }, {
        text: opts.cancelText || SimpleDialog.locales.confirm.buttonCancel,
        cls: "button-link",
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
    return new SimpleDialog(opts);
  };

  SimpleDialog._tpl = {
    dialog: "<div class=\"simple-dialog\">\n  <div class=\"simple-dialog-wrapper\">\n    <div class=\"simple-dialog-content\"></div>\n    <div class=\"simple-dialog-buttons\"></div>\n  </div>\n  <a class=\"simple-dialog-remove\" href=\"javascript:;\">\n    <i class=\"icon-cross\"><span>&#10005;</span></i>\n  </a>\n</div>",
    modal: "<div class=\"simple-dialog-modal\"></div>",
    button: "<button type=\"button\"></button>"
  };

  function SimpleDialog(opts) {
    SimpleDialog.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, SimpleDialog.opts, opts);
    if (this.opts.content === null) {
      throw new Error("[SimpleDialog] - option content is required");
    }
    this.id = ++SimpleDialog._count;
    SimpleDialog.removeAll();
    this._render();
    this._bind();
    this.el.data('simpleDialog', this);
    this._focus();
  }

  SimpleDialog.prototype._focus = function() {
    if (this.opts.buttons && this.opts.focusButton) {
      return this.buttonWrap.find(this.opts.focusButton).focus();
    }
  };

  SimpleDialog.prototype._toggleFullscreen = function() {
    this.el.toggleClass('simple-dialog-fullscreen', this.opts.fullscreen);
    if (this.opts.fullscreen) {
      return $('body').addClass('simple-dialog-scrollable');
    }
  };

  SimpleDialog.prototype._setWidth = function() {
    return this.el.css({
      width: this.opts.width
    });
  };

  SimpleDialog.prototype._renderButtons = function() {
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
        results.push($(SimpleDialog._tpl.button).addClass('button').addClass(button.cls).html(button.text).on("click", button.callback).appendTo(this.buttonWrap));
      }
      return results;
    }
  };

  SimpleDialog.prototype._setModal = function() {
    if (this.opts.modal) {
      return this.modal = $(SimpleDialog._tpl.modal).appendTo("body");
    }
  };

  SimpleDialog.prototype._render = function() {
    this.el = $(SimpleDialog._tpl.dialog).addClass(this.opts.cls);
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

  SimpleDialog.prototype._bind = function() {
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

  SimpleDialog.prototype._unbind = function() {
    this.removeButton.off(".simple-dialog");
    if (this.modal) {
      this.modal.off(".simple-dialog");
    }
    $(document).off(".simple-dialog-" + this.id);
    return $(window).off(".simple-dialog-" + this.id);
  };

  SimpleDialog.prototype.setContent = function(content) {
    return this.contentWrap.html(content);
  };

  SimpleDialog.prototype.remove = function() {
    this.trigger('destroy');
    this._unbind();
    if (this.modal) {
      this.modal.remove();
    }
    this.el.remove();
    return $('body').removeClass('simple-dialog-scrollable');
  };

  SimpleDialog.removeAll = function() {
    return $(".simple-dialog").each(function() {
      var dialog;
      dialog = $(this).data('simpleDialog');
      return dialog.remove();
    });
  };

  return SimpleDialog;

})(SimpleModule);

module.exports = SimpleDialog;

},{}]},{},[]);

return b('simple-dialog');
}));
