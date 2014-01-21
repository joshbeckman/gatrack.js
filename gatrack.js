(function(window, document) {
  window.gatrack = window.gatrack || {
    action: function(elem, category, action, callback) {
      var result = 'success';
      try {
        window.ga('send', 'event', category, action);
      } catch(gaErr) {
        try {
          window._gaq.push(['_trackEvent', category, action]);
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
      if (!cat && (elem.target && elem.target != '_self')) {
        cat = 'Outbound Link';
      } else if (!cat) {
        cat = 'Link Event';
      }
      elem.addEventListener('click', clickEvent, false);
      function clickEvent(evt) {
        gatrack.action(elem, cat, act);
      }
    },
    // Trigger GA event on buttons or clickable elements
    click: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Click Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified click';
      elem.addEventListener('click', clickEvent, false);
      function clickEvent() {
        gatrack.action(elem, cat, act);
      }
    },
    // Trigger GA event at certain scroll positions
    scrollAt: function(elem, scrollPoint, direction, category, action){
      var px,
        point = scrollPoint || elem.dataset.gatrackScrollPoint,
        direct = direction || elem.dataset.gatrackScrollDirection || 'y',
        cat = category || elem.dataset.gatrackCategory || 'Scroll Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || document.getElementsByTagName('title')[0].textContent || 'Unspecified scroll';
      if(point.slice(-1) == '%') {
        px = (direct == 'y' ? elem.clientHeight : elem.clientWidth) * parseInt(point.slice(0,(point.length - 2)))/100;
      } else if (point.slice(-2) == 'px') {
        px = parseInt(point.slice(0,(point.length - 3)));
      }
      elem.addEventListener('scroll', scrollEvent, false);
      function scrollEvent() {
        var start;
        if (direct == 'y') {
          start = this.scrollY + this.clientHeight;
        } else {
          start = this.scrollX + this.clientWidth;
        }
        if (start > px) {
          gatrack.action(elem, cat, act);
        }
      }
    },
    hover: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Hover Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified hover';
      elem.addEventListener('mouseover', mouseEvent, false);
      function mouseEvent(){
        gatrack.action(elem, cat, act);
      }
    },
    touch: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Touch Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified touch';
      elem.addEventListener('touchstart', touchEvent, false);
      function touchEvent(){
        gatrack.action(elem, cat, act);
      }
    },
    load: function(elem, category, action){
      var cat = category || elem.dataset.gatrackCategory || 'Load Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified load';
      elem.addEventListener('load', loadEvent, false);
      function loadEvent(){
        gatrack.action(elem, cat, act);
      }
    },
    init: function(){
      // Find and bind pre-determined trackable elements
      var linkable = document.getElementsByClassName('ga-link-trackable'),
        loadable = document.getElementsByClassName('ga-load-trackable'),
        scrollable = document.getElementsByClassName('ga-scroll-trackable'),
        hoverable = document.getElementsByClassName('ga-hover-trackable'),
        touchable = document.getElementsByClassName('ga-touch-trackable'),
        clickable = document.getElementsByClassName('ga-click-trackable'),
        i;
      for (i = linkable.length - 1; i >= 0; i--) {
        gatrack.link(linkable[i]);
      }
      for (i = loadable.length - 1; i >= 0; i--) {
        gatrack.load(loadable[i]);
      }
      for (i = scrollable.length - 1; i >= 0; i--) {
        gatrack.scrollAt(scrollable[i]);
      }
      for (i = hoverable.length - 1; i >= 0; i--) {
        gatrack.hover(hoverable[i]);
      }
      for (i = touchable.length - 1; i >= 0; i--) {
        gatrack.touch(touchable[i]);
      }
      for (i = clickable.length - 1; i >= 0; i--) {
        gatrack.click(clickable[i]);
      }
    }
  };
  window.gatrack.init();
})(this, this.document);