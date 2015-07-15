(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-dialog', ["jquery","simple-module"], function (a0,b1) {
      return (root['dialog'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['dialog'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Dialog, dialog,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Dialog = (function(superClass) {
  extend(Dialog, superClass);

  function Dialog() {
    this.remove = bind(this.remove, this);
    return Dialog.__super__.constructor.apply(this, arguments);
  }

  Dialog.i18n = {
    'zh-CN': {
      cancel: '取消',
      close: '关闭',
      ok: '确定',
      known: '知道了'
    },
    'en': {
      cancel: 'cancel',
      close: 'close',
      ok: 'ok',
      known: 'ok'
    }
  };

  Dialog.prototype.opts = {
    content: null,
    width: 600,
    height: "auto",
    modal: false,
    clickModalRemove: true,
    cls: "",
    showRemoveButton: true,
    buttons: ['close'],
    focusButton: ".btn:first"
  };

  Dialog._mobile = (function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/.test(navigator.userAgent)) {
      return true;
    }
    return false;
  })();

  Dialog._tpl = {
    dialog: "<div class=\"simple-dialog\">\n  <a class=\"simple-dialog-remove\" href=\"javascript:;\"><i class=\"icon-cross\"><span>&#10005;</span></i></a>\n  <div class=\"simple-dialog-wrapper\">\n    <div class=\"simple-dialog-content\"></div>\n    <div class=\"simple-dialog-buttons\"></div>\n  </div>\n<div>",
    modal: "<div class=\"simple-dialog-modal\"></div>",
    button: "<button type=\"button\"></button>"
  };

  Dialog.prototype._init = function() {
    if (this.opts.content === null) {
      throw "[Dialog] - content shouldn't be empty";
    }
    Dialog.removeAll();
    this._render();
    this._bind();
    this.el.data("dialog", this);
    this.refresh();
    if (this.opts.focusButton) {
      return this.buttonWrap.find(this.opts.focusButton).focus();
    }
  };

  Dialog.prototype._render = function() {
    var button, i, len, ref;
    this.el = $(Dialog._tpl.dialog).addClass(this.opts.cls);
    this.wrapper = this.el.find(".simple-dialog-wrapper");
    this.removeButton = this.el.find(".simple-dialog-remove");
    this.contentWrap = this.el.find(".simple-dialog-content");
    this.buttonWrap = this.el.find(".simple-dialog-buttons");
    this.el.toggleClass('simple-dialog-mobile', Dialog._mobile);
    this.el.css({
      width: this.opts.width,
      height: this.opts.height
    });
    this.contentWrap.append(this.opts.content);
    if (!this.opts.showRemoveButton) {
      this.removeButton.remove();
    }
    if (this.opts.buttons === null || this.opts.buttons === false) {
      this.buttonWrap.remove();
    } else {
      ref = this.opts.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        if (button === "close") {
          button = {
            callback: this.remove
          };
        }
        button = $.extend({}, Dialog.defaultButton, button);
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
    this.trigger('destroy.simple-dialog');
    this._unbind();
    if (this.modal) {
      this.modal.remove();
    }
    return this.el.remove();
  };

  Dialog.prototype.refresh = function() {
    this.contentWrap.height("auto");
    this.contentWrap.height(this.wrapper.height() - this.buttonWrap.outerHeight(true));
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
    text: Dialog.prototype._t('close'),
    callback: $.noop
  };

  return Dialog;

})(SimpleModule);

dialog = function(opts) {
  return new Dialog(opts);
};

dialog.message = function(opts) {
  opts = $.extend({
    width: 450
  }, opts, {
    buttons: [
      {
        text: Dialog._t('known'),
        callback: function(e) {
          return $(e.target).closest(".simple-dialog").data("dialog").remove();
        }
      }
    ]
  });
  return new Dialog(opts);
};

dialog.confirm = function(opts) {
  opts = $.extend({
    callback: $.noop,
    width: 450,
    buttons: [
      {
        text: Dialog._t('ok'),
        callback: function(e) {
          dialog = $(e.target).closest(".simple-dialog").data("dialog");
          dialog.opts.callback(e, true);
          return dialog.remove();
        }
      }, {
        text: Dialog._t('cancel'),
        cls: "btn-link",
        callback: function(e) {
          dialog = $(e.target).closest(".simple-dialog").data("dialog");
          dialog.opts.callback(e, false);
          return dialog.remove();
        }
      }
    ]
  }, opts);
  return new Dialog(opts);
};

dialog.removeAll = Dialog.removeAll;

dialog.setDefaultButton = function(opts) {
  return Dialog.defaultButton = opts;
};

return dialog;

}));
