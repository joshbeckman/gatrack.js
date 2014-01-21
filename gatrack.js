(function(window, document) {
  window.gatrack = window.gatrack || {
    action: function(elem, category, action, label, value, callback) {
      var result = 'success',
        intVal = parseInt(value || 0, 10);
      try {
        window.ga('send', 'event', category, action, label, intVal);
      } catch(gaErr) {
        try {
          window._gaq.push(['_trackEvent', category, action, label, intVal]);
        } catch(gaqErr) {
          result = gaqErr;
        }
      }
      if (callback) {
        callback(result);
      }
    },
    // Trigger GA event on links
    link: function(elem, category, action, label, value){
      var cat = category || elem.dataset.gatrackCategory || 'Link Event',
        act = action || elem.dataset.gatrackAction || elem.href || elem.title || elem.id,
        lab = label || elem.dataset.gatrackLabel,
        val = value || elem.dataset.gatrackValue;
      if (!act && (elem.target && elem.target != '_self')) {
        act = 'Outbound Link';
      } else if (!act) {
        act = 'Internal Link';
      }
      elem.addEventListener('click', clickEvent, false);
      function clickEvent(evt) {
        gatrack.action(elem, cat, act, lab, val);
      }
    },
    // Trigger GA event on buttons or clickable elements
    click: function(elem, category, action, label, value){
      var cat = category || elem.dataset.gatrackCategory || 'Click Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified click',
        lab = label || elem.dataset.gatrackLabel,
        val = value || elem.dataset.gatrackValue;
      elem.addEventListener('click', clickEvent, false);
      function clickEvent() {
        gatrack.action(elem, cat, act, lab, val);
      }
    },
    // Trigger GA event at certain scroll positions
    scrollAt: function(elem, scrollPoint, direction, category, action, label, value){
      var px,
        point = scrollPoint || elem.dataset.gatrackScrollPoint,
        direct = direction || elem.dataset.gatrackScrollDirection || 'y',
        cat = category || elem.dataset.gatrackCategory || 'Scroll Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || document.getElementsByTagName('title')[0].textContent || point,
        lab = label || elem.dataset.gatrackLabel || direct,
        val = value || elem.dataset.gatrackValue;
      if(point.slice(-1) == '%') {
        px = val = (direct == 'y' ? elem.clientHeight : elem.clientWidth) * parseInt(point.slice(0,(point.length - 2)))/100;
      } else if (point.slice(-2) == 'px') {
        px = val = parseInt(point.slice(0,(point.length - 3)));
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
          gatrack.action(elem, cat, act, lab, val);
        }
      }
    },
    hover: function(elem, category, action, label, value){
      var cat = category || elem.dataset.gatrackCategory || 'Hover Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified hover',
        lab = label || elem.dataset.gatrackLabel,
        val = value || elem.dataset.gatrackValue;
      elem.addEventListener('mouseover', mouseEvent, false);
      function mouseEvent(){
        gatrack.action(elem, cat, act, lab, val);
      }
    },
    touch: function(elem, category, action, label, value){
      var cat = category || elem.dataset.gatrackCategory || 'Touch Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified touch',
        lab = label || elem.dataset.gatrackLabel,
        val = value || elem.dataset.gatrackValue;
      elem.addEventListener('touchstart', touchEvent, false);
      function touchEvent(){
        gatrack.action(elem, cat, act, lab, val);
      }
    },
    load: function(elem, category, action, label, value){
      var cat = category || elem.dataset.gatrackCategory || 'Load Event',
        act = action || elem.dataset.gatrackAction || elem.title || elem.id || 'Unspecified load',
        lab = label || elem.dataset.gatrackLabel,
        val = value || elem.dataset.gatrackValue;
      elem.addEventListener('load', loadEvent, false);
      function loadEvent(){
        gatrack.action(elem, cat, act, lab, val);
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