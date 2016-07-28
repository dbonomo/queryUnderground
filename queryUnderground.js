var FreshUrl;

// function to grab variables from query string
function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

// Store UTM variables as localstorage

// Check browser support
if (typeof(Storage) !== "undefined") {
    // Store each variable, if it's in the query string
    if (getQueryVariable("utm_source") !== false) {
      var utmSource = decodeURI(getQueryVariable("utm_source"));
      localStorage.setItem("utmSource", utmSource);
    }
    if (getQueryVariable("utm_medium") !== false) {
      var utmMedium = decodeURI(getQueryVariable("utm_medium"));
      localStorage.setItem("utmMedium", utmMedium);
    }
    if (getQueryVariable("utm_term") !== false) {
      var utmTerm = decodeURI(getQueryVariable("utm_term"));
      localStorage.setItem("utmTerm", utmTerm);
    }
    if (getQueryVariable("utm_content") !== false) {
      var utmContent = decodeURI(getQueryVariable("utm_content"));
      localStorage.setItem("utmContent", utmContent);
    }
    if (getQueryVariable("utm_campaign") !== false) {
      var utmCampaign = decodeURI(getQueryVariable("utm_campaign"));
      localStorage.setItem("utmCampaign", utmCampaign);
    }

    // Retrieve from local and store as variables
    var localutmSource = localStorage.getItem("utmSource");
    var localutmMedium = localStorage.getItem("utmMedium");
    var localutmTerm = localStorage.getItem("utmTerm");
    var localutmContent = localStorage.getItem("utmContent");
    var localutmCampaign = localStorage.getItem("utmCampaign");

    // log it
    // console.log(localutmSource);
    // console.log(localutmMedium);
    // console.log(localutmTerm);
    // console.log(localutmContent);
    // console.log(localutmCampaign);


    // write variables into the hidden fields with corresponding names if they exist
// Updates for custom field names
// <input name='input_13' id='input_1_13' type='hidden' class='gform_hidden' value='utmSource' />
// <input name='input_9' id='input_1_9' type='hidden' class='gform_hidden' value='utmMedium' />
// <input name='input_10' id='input_1_10' type='hidden' class='gform_hidden' value='utmTerm' />
// <input name='input_11' id='input_1_11' type='hidden' class='gform_hidden' value='utmContent' />
// <input name='input_12' id='input_1_12' type='hidden' class='gform_hidden' value='utmCampaign' />

// updates the custom fields again:
// <input type="hidden" id="utmSource" name="utmSource" class="hidden" value="utmSource">
// <input type="hidden" id="utmMedium" name="utmMedium" class="hidden" value="utmMedium">
// <input type="hidden" id="utmTerm" name="utmTerm" class="hidden" value="utmTerm">
// <input type="hidden" id="utmContent" name="utmContent" class="hidden" value="utmContent">
// <input type="hidden" id="utmCampaign" name="utmCampaign" class="hidden" value="utmCampaign">
    if ( localutmSource !== null) {
      if(document.getElementsByName("utmSource")[0]){
        document.getElementsByName("utmSource")[0].value = localutmSource;
      }
    }
    if ( localutmMedium !== null) {
      if(document.getElementsByName("utmMedium")[0]){
        document.getElementsByName("utmMedium")[0].value = localutmMedium;
      }
    }
    if ( localutmTerm !== null) {
      if(document.getElementsByName("utmTerm")[0]){
        document.getElementsByName("utmTerm")[0].value = localutmTerm;
      }
    }
    if ( localutmContent !== null) {
      if(document.getElementsByName("utmContent")[0]){
        document.getElementsByName("utmContent")[0].value = localutmContent;
      }
    }
    if ( localutmCampaign !== null) {
      if(document.getElementsByName("utmCampaign")[0]){
        document.getElementsByName("utmCampaign")[0].value = localutmCampaign;
      }
    }
} else {
  // if no localstorage, gets UTM variables from the query string
    var utmSource = decodeURI(getQueryVariable("utm_source"));
    var utmMedium = decodeURI(getQueryVariable("utm_medium"));
    var utmTerm = decodeURI(getQueryVariable("utm_term"));
    var utmContent = decodeURI(getQueryVariable("utm_content"));
    var utmCampaign = decodeURI(getQueryVariable("utm_campaign"));
    console.log("Sorry, your browser does not support Web Storage...");

    // and writes the values into the hidden fields
    if ( utmSource !== null) {
      if(document.getElementsByName("utmSource")[0]){
        document.getElementsByName("utmSource")[0].value = utmSource;
      }
    }
    if ( utmMedium !== null) {
      if(document.getElementsByName("utmMedium")[0]){
        document.getElementsByName("utmMedium")[0].value = utmMedium;
      }
    }
    if ( utmTerm !== null) {
      if(document.getElementsByName("utmTerm")[0]){
        document.getElementsByName("utmTerm")[0].value = utmTerm;
      }
    }
    if ( utmContent !== null) {
      if(document.getElementsByName("utmContent")[0]){
        document.getElementsByName("utmContent")[0].value = utmContent;
      }
    }
    if ( utmCampaign !== null) {
      if(document.getElementsByName("utmCampaign")[0]){
        document.getElementsByName("utmCampaign")[0].value = utmCampaign;
      }
    }
}

// Check for UTM variables in localstorage

FreshUrl = (function() {
  FreshUrl.libraries = {
    googleAnalytics: {
      present: function() {
        return window._gaq || window[window.GoogleAnalyticsObject];
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(FreshUrl.libraries.googleAnalytics.present).then(function() {
          var ga;
          if (ga = window._gaq) {
            return ga.push(function() {
              return ready();
            });
          } else if (ga = window[window.GoogleAnalyticsObject]) {
            return ga(function() {
              return ready();
            });
          }
        });
      }
    },
    hubspot: {
      present: function() {
        return window._hsq || FreshUrl.scriptFrom(/\/\/(js\.hubspot\.com|js.hs-analytics\.net)/);
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(function() {
          return window._hsq;
        }).then(function() {
          return _hsq.push(function() {
            return ready();
          });
        });
      }
    },
    clicky: {
      present: function() {
        return window.clicky || window.clicky_site_ids || FreshUrl.scriptFrom(/\/\/static\.getclicky\.com/);
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(function() {
          return window.clicky_obj;
        }).then(ready);
      }
    },
    pardot: {
      present: function() {
        return window.piAId || window.piCId || FreshUrl.scriptContains(/\.pardot\.com\/pd\.js/);
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(function() {
          var _ref, _ref1;
          return (_ref = window.pi) != null ? (_ref1 = _ref.tracker) != null ? _ref1.url : void 0 : void 0;
        }).then(ready);
      }
    },
    simplex: {
      present: function() {
        return window.simplex || FreshUrl.scriptFrom(/\/simplex\.js/);
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(function() {
          return window.simplex;
        }).then(ready);
      }
    },
    analyticsJs: {
      present: function() {
        var _ref;
        return (_ref = window.analytics) != null ? _ref.ready : void 0;
      },
      ready: function(ready) {
        return FreshUrl.waitsFor(function() {
          var _ref;
          return (_ref = window.analytics) != null ? _ref.ready : void 0;
        }).then(function() {
          return analytics.ready(ready);
        });
      }
    }
  };

  FreshUrl.originalUrl = window.location.href;

  function FreshUrl(waitList) {
    var iframeListener, item, _i, _len;
    if (waitList == null) {
      waitList = [];
    }
    if (!window.history.replaceState) {
      return;
    }
    this.key = 0;
    this._isReady = {};
    for (_i = 0, _len = waitList.length; _i < _len; _i++) {
      item = waitList[_i];
      if (typeof item === "string" && FreshUrl.libraries[item]) {
        this.wait(FreshUrl.libraries[item].ready, item);
      } else if (typeof item === "function") {
        this.wait(item);
      } else {
        if (typeof console !== "undefined" && console !== null) {
          console.log("FreshURL: Don't know how to wait for " + item);
        }
      }
    }
    if (waitList.length === 0) {
      if (this.allReady()) {
        this.allReadyCallback();
      }
    }
    FreshUrl.updateWistiaIframes();
    iframeListener = function(event) {
      if (event.data === 'new-wistia-iframe') {
        return FreshUrl.updateWistiaIframes();
      }
    };
    if (typeof window !== "undefined" && window !== null) {
      window.addEventListener('message', iframeListener, false);
    }
  }

  FreshUrl.prototype.wait = function(trigger, key) {
    if (key == null) {
      key = this.nextKey();
    }
    this._isReady[key] = false;
    return trigger((function(_this) {
      return function() {
        return _this.ready(key);
      };
    })(this));
  };

  FreshUrl.prototype.ready = function(key) {
    this._isReady[key] = true;
    if (this.allReady()) {
      return this.allReadyCallback();
    }
  };

  FreshUrl.prototype.allReady = function() {
    var key, notReady, value, _ref;
    notReady = [];
    _ref = this._isReady;
    for (key in _ref) {
      value = _ref[key];
      if (!value) {
        notReady.push(key);
      }
    }
    return notReady.length === 0;
  };

  FreshUrl.prototype.allReadyCallback = function() {
    return window.history.replaceState({}, '', FreshUrl.cleanUrl());
  };

  FreshUrl.cleanUrl = function() {
    var cleanSearch;
    cleanSearch = window.location.search.replace(/utm_[^&]+&?/g, '').replace(/(wkey|wemail)[^&]+&?/g, '').replace(/(_hsenc|_hsmi|hsCtaTracking)[^&]+&?/g, '').replace(/&$/, '').replace(/^\?$/, '');
    return window.location.pathname + cleanSearch + window.location.hash;
  };

  FreshUrl.poll = function(cond, callback, interval, timeout) {
    var pollFn, pollTimeout, start;
    if (interval == null) {
      interval = 50;
    }
    if (timeout == null) {
      timeout = 5000;
    }
    pollTimeout = null;
    start = new Date().getTime();
    pollFn = function() {
      if (new Date().getTime() - start > timeout) {
        return;
      }
      if (cond()) {
        return callback();
      } else {
        clearTimeout(pollTimeout);
        return pollTimeout = setTimeout(pollFn, interval);
      }
    };
    return pollTimeout = setTimeout(pollFn, 1);
  };

  FreshUrl.waitsFor = function(cond) {
    return {
      then: function(callback) {
        return FreshUrl.poll(cond, callback);
      }
    };
  };

  FreshUrl.prototype.nextKey = function() {
    return this.key += 1;
  };

  FreshUrl.scriptFrom = function(re) {
    var script, _i, _len, _ref, _ref1;
    _ref = document.getElementsByTagName('script');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      script = _ref[_i];
      if ((_ref1 = script.getAttribute('src')) != null ? _ref1.match(re) : void 0) {
        return true;
      }
    }
    return false;
  };

  FreshUrl.scriptContains = function(re) {
    var script, _i, _len, _ref, _ref1;
    _ref = document.getElementsByTagName('script');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      script = _ref[_i];
      if ((_ref1 = script.innerHTML) != null ? _ref1.match(re) : void 0) {
        return true;
      }
    }
    return false;
  };

  FreshUrl.librariesPresent = function() {
    var library, name, _ref, _results;
    _ref = FreshUrl.libraries;
    _results = [];
    for (name in _ref) {
      library = _ref[name];
      if (library.present()) {
        _results.push(name);
      }
    }
    return _results;
  };

  FreshUrl.wistiaIframes = function() {
    var iframe, _i, _len, _ref, _results;
    _ref = document.getElementsByTagName('iframe');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      iframe = _ref[_i];
      if (iframe.src.match(/\/\/.*\.wistia\..*\//)) {
        _results.push(iframe);
      }
    }
    return _results;
  };

  FreshUrl.updateWistiaIframes = function() {
    var e, iframe, message, _i, _len, _ref, _results;
    message = {
      method: 'updateProperties',
      args: [
        {
          params: {
            pageUrl: this.originalUrl
          },
          options: {
            pageUrl: this.originalUrl
          }
        }
      ]
    };
    _ref = this.wistiaIframes();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      iframe = _ref[_i];
      try {
        _results.push(iframe.contentWindow.postMessage(message, '*'));
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  return FreshUrl;

})();

if (typeof _freshenUrlAfter !== "undefined" && _freshenUrlAfter !== null) {
  window.freshUrl = new FreshUrl(_freshenUrlAfter);
} else if (window.dataLayer) {
  dataLayer.push(function() {
    return window.freshUrl = new FreshUrl(FreshUrl.librariesPresent());
  });
} else {
  window.freshUrl = new FreshUrl(FreshUrl.librariesPresent());
}
