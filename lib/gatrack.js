(function(window, document) {
  window.gatrack = window.gatrack || {
    action: function(elem, category, action, callback) {
      var result = 'success';
      try {
        ga('send', 'event', category, action);
      } catch(gaErr) {
        try {
          _gaq.push(['_trackEvent', category, action]);
        } catch(gaqErr) {
          result = gaqErr;
        }
      }
      if (callback) {
        callback(result);
      }
    },
    // Trigger GA event on links
    link: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory,
        act = action || elem.dataset.gatrackAction || elem.href || elem.title || elem.id || 'Unspecified link';
      if (!cat && ((elem.target && elem.target == '_blank') || (elem.href && (elem.href.slice(0,4) == 'http')))) {
        cat = 'Outbound Links';
      } else if (!category) {
        cat = 'Internal Links';
      }
      elem.addeventlistener('click', clickEvent, false);
      function clickEvent() {
        gatrack.action(elem, cat, act, function(result) {
          if (elem.href) {
            setTimeout(function(){
              window.open(elem.href, elem.target);
            }, 100);
          }
        });
      }
    },
    // Trigger GA event on buttons or clickable elements
    click: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory,
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified click';
      elem.addeventlistener('click', clickEvent, false);
      function clickEvent() {
        gatrack.action(elem, cat, act);
      }
    },
    // Trigger GA event at certain scroll positions
    scrollAt: function(elem, scrollPoint, direction, category, action){
      var px,
        point = scrollPoint || elem.dataset.gatrackScrollPoint,
        direct = direction || elem.dataset.gatrackScrollDirection || 'y',
        cat = category || elem.dataset.gatrackCategory || 'Scroll Element',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || document.getElementsByTagName('title')[0].textContent || 'Unspecified scroll';
      if(point.slice(-1) == '%') {
        px = (direct == 'y' ? elem.clientHeight : elem.clientWidth) * parseInt(point.slice(0,(point.length - 2)))/100;
      } else if (point.slice(-2) == 'px') {
        px = parseInt(point.slice(0,(point.length - 3)));
      }
      elem.addeventlistener('scroll', scrollEvent, false);
      function scrollEvent() {
        var start;
        if (direct == 'y') {
          start = elem.scrollY;
        } else {
          start = elem.scrollX;
        }
        if (start > px) {
          gatrack.action(elem, cat, act);
        }
      }
    },
    hover: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Hover Element',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified hover';
      elem.addeventlistener('mouseover', mouseEvent, false);
      function mouseEvent(){
        gatrack.action(elem, cat, act);
      }
    },
    touch: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Touch Element',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified touch';
      elem.addeventlistener('touchstart', touchEvent, false);
      function touchEvent(){
        gatrack.action(elem, cat, act);
      }
    },
    load: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Load Element',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified load';
      elem.addeventlistener('load', loadEvent, false);
      function loadEvent(){
        gatrack.action(elem, cat, act);
      }
    }
  };
  // Find and bind pre-determined trackable elements
  var linkable = document.getElementsByClassName('ga-link-trackable'),
    i = linkable.length - 1,
    loadable = document.getElementsByClassName('ga-load-trackable'),
    j = loadable.length - 1,
    scrollable = document.getElementsByClassName('ga-scroll-trackable'),
    k = scrollable.length - 1,
    hoverable = document.getElementsByClassName('ga-hover-trackable'),
    l = hoverable.length - 1,
    touchable = document.getElementsByClassName('ga-touch-trackable'),
    m = touchable.length - 1,
    clickable = document.getElementsByClassName('ga-click-trackable'),
    n = clickable.length - 1;
  for (; i >= 0; i--) {
    linkable[i].addeventlistener('click', makeLinkTracker, false);
  }
  for (; j >= 0; j--) {
    loadable[i].addeventlistener('load', makeLoadTracker, false);
  }
  for (; k >= 0; k--) {
    loadable[i].addeventlistener('scroll', makeScrollTracker, false);
  }
  for (; l >= 0; l--) {
    hoverable[i].addeventlistener('mouseover', makeHoverTracker, false);
  }
  for (; m >= 0; m--) {
    touchable[i].addeventlistener('touchstart', makeTouchTracker, false);
  }
  for (; n >= 0; n--) {
    clickable[i].addeventlistener('click', makeClickTracker, false);
  }
  function makeClickTracker () {
    gatrack.click(this);
  }
  function makeTouchTracker () {
    gatrack.touch(this);
  }
  function makeHoverTracker () {
    gatrack.hover(this);
  }
  function makeScrollTracker () {
    gatrack.scrollAt(this);
  }
  function makeLinkTracker () {
    gatrack.link(this);
  }
  function makeLoadTracker () {
    gatrack.load(this);
  }
})(this, this.document);