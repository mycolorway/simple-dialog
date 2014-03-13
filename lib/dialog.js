(function() {
  var Url;

  Url = (function() {
    function Url(url) {
      var arr, host, prefix;
      url || (url = location.toString());
      if (!url) {
        return null;
      }
      this._url = url;
      this.protocol = "";
      this.host = "";
      this.port = "";
      this.pathname = "";
      this.search = {};
      this.hash = "";
      url = url.split("//");
      if (url.length === 1) {
        url = url[0];
      } else {
        this.protocol = url[0];
        url = url[1];
      }
      arr = url.split("/");
      host = arr[0].split(":");
      this.host = host[0];
      if (host.length > 1) {
        this.port = host[1];
      }
      if (arr.length > 1) {
        prefix = "/";
      } else {
        prefix = "";
      }
      this.pathname = "" + prefix + (arr.slice(1, arr.length).join('/').split('?')[0].split('#')[0]);
      this.hash = url.split("#")[1] || "";
      this.search = Url.parseParams((url.split("?")[1] || "").split("#")[0]);
    }

    Url.parseParams = function(str) {
      var k, obj, param, v, _i, _len, _ref, _ref1;
      obj = {};
      _ref = str.split('&');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        _ref1 = param.split('='), k = _ref1[0], v = _ref1[1];
        if (k) {
          obj[k] = v;
        }
      }
      return obj;
    };

    Url.serializeParams = function(obj) {
      var k, v;
      if (!obj) {
        return "";
      }
      return ((function() {
        var _results;
        _results = [];
        for (k in obj) {
          v = obj[k];
          _results.push([k, v].join('='));
        }
        return _results;
      })()).join('&');
    };

    Url.prototype.toString = function(type) {
      var search, url;
      if (type == null) {
        type = "absolute";
      }
      url = "";
      if (!/absolute|relative/.test(type)) {
        return url;
      }
      if (type === "absolute") {
        if (this.protocol) {
          url += "" + this.protocol + "//";
        }
        if (this.host) {
          url += "" + this.host;
        }
        if (this.port) {
          url += ":" + this.port;
        }
      }
      url += this.pathname;
      search = Url.serializeParams(this.search);
      if (search) {
        url += "?" + search;
      }
      if (this.hash) {
        url += "#" + this.hash;
      }
      return url;
    };

    Url.prototype.setParam = function() {
      var args, k, obj, v;
      args = arguments;
      if (args.length === 1 && typeof args[0] === "object") {
        obj = args[0];
      } else if (args.length === 2) {
        obj = {};
        obj[args[0].toString()] = args[1].toString();
      } else {
        return false;
      }
      this.search || (this.search = {});
      for (k in obj) {
        v = obj[k];
        this.search[k.toString()] = v.toString();
      }
      return this.search;
    };

    Url.prototype.getParam = function(name) {
      return this.search[name];
    };

    Url.prototype.removeParam = function(name) {
      return delete this.search[name];
    };

    return Url;

  })();

  if (!this.simple) {
    this.simple = {};
  }

  this.simple.url = function(url) {
    return new Url(url);
  };

}).call(this);
