(function(win, doc) {
  var initProfile,
    gEBTN = 'getElementsByTagName',
    gEBCN = 'getElementsByClassName',
    aEL = 'addEventListener',
    gaTC = 'gatrackCategory',
    gaTA = 'gatrackAction',
    gaTL = 'gatrackLabel',
    gaTV = 'gatrackValue',
    ds = 'dataset',
    eURIC = encodeURIComponent,
    tempTrack = {
      // Main gatrack handler
      action: function(elem, category, action, label, value, callback) {
        var result = 'success',
          intVal = parseInt(value || 0, 10),
          profile = initProfile ? (initProfile + '.') : ''; // Rudimentary support for multiple profiles
        try {
          win.ga(profile + 'send', 'event', category, action, label, intVal);
        } catch(gaErr) {
          try {
            win._gaq.push(['_trackEvent', category, action, label, intVal]);
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
        var cat = category || elem[ds][gaTC] || 'Link Event',
          act = action || elem[ds][gaTA] || elem.href || elem.title || elem.id,
          lab = label || elem[ds][gaTL] || elem.rel || elem.title,
          val = value || elem[ds][gaTV];
        if (!act && (elem.target && elem.target != '_self')) {
          act = 'Outbound Link';
        } else if (!act) {
          act = 'Internal Link';
        }
        elem[aEL]('click', clickEvent, false);
        function clickEvent(evt) {
          gatrack.action(elem, cat, act, lab, val);
        }
      },
      // Trigger GA event on buttons or clickable elements
      click: function(elem, category, action, label, value){
        var cat = category || elem[ds][gaTC] || 'Click Event',
          act = action || elem[ds][gaTA] || elem.title || elem.id || 'Unspecified click',
          lab = label || elem[ds][gaTL],
          val = value || elem[ds][gaTV];
        elem[aEL]('click', clickEvent, false);
        function clickEvent() {
          gatrack.action(elem, cat, act, lab, val);
        }
      },
      // Trigger GA event at certain scroll positions
      scrollAt: function(elem, scrollPoint, direction, category, action, label, value){
        var px,
          point = scrollPoint || elem[ds].gatrackScrollPoint,
          direct = direction || elem[ds].gatrackScrollDirection || 'y',
          cat = category || elem[ds][gaTC] || 'Scroll Event',
          act = action || elem[ds][gaTA] || elem.title || elem.id || doc[gEBTN]('title')[0].textContent || point,
          lab = label || elem[ds][gaTL] || direct,
          val = value || elem[ds][gaTV];
        if(point.slice(-1) == '%') {
          px = val = (direct == 'y' ? elem.clientHeight : elem.clientWidth) * parseInt(point.slice(0,(point.length - 2)))/100;
        } else if (point.slice(-2) == 'px') {
          px = val = parseInt(point.slice(0,(point.length - 3)));
        }
        elem[aEL]('scroll', scrollEvent, false);
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
        var cat = category || elem[ds][gaTC] || 'Hover Event',
          act = action || elem[ds][gaTA] || elem.title || elem.id || 'Unspecified hover',
          lab = label || elem[ds][gaTL],
          val = value || elem[ds][gaTV];
        elem[aEL]('mouseover', mouseEvent, false);
        function mouseEvent(){
          gatrack.action(elem, cat, act, lab, val);
        }
      },
      touch: function(elem, category, action, label, value){
        var cat = category || elem[ds][gaTC] || 'Touch Event',
          act = action || elem[ds][gaTA] || elem.title || elem.id || 'Unspecified touch',
          lab = label || elem[ds][gaTL],
          val = value || elem[ds][gaTV];
        elem[aEL]('touchstart', touchEvent, false);
        function touchEvent(){
          gatrack.action(elem, cat, act, lab, val);
        }
      },
      load: function(elem, category, action, label, value){
        var cat = category || elem[ds][gaTC] || 'Load Event',
          act = action || elem[ds][gaTA] || elem.title || elem.id || 'Unspecified load',
          lab = label || elem[ds][gaTL],
          val = value || elem[ds][gaTV];
        elem[aEL]('load', loadEvent, false);
        function loadEvent(){
          gatrack.action(elem, cat, act, lab, val);
        }
      },
      timer: (win.gatrack ? win.gatrack.timer : (new Date()).getTime()),
      onerror: {
        push: function(errArray){
          var cat = 'Recorded Error',
            lab = errArray[0],
            err = errArray[4],
            act = ('Error line:col(url) ' + errArray[2].toString() + ':' + errArray[3].toString() + '(' + errArray[1] + ')'),
            val = Math.round(((new Date()).getTime() - tempTrack.timer)/100)/10; // Record value as time (in seconds, ronded to nearest hundreth)
          tempTrack.action(undefined, cat, act, lab, val);
        }
      },
      init: function(profile){
        // Find and bind pre-determined trackable elements
        var linkable = doc[gEBCN]('ga-link-trackable'),
          loadable = doc[gEBCN]('ga-load-trackable'),
          scrollable = doc[gEBCN]('ga-scroll-trackable'),
          hoverable = doc[gEBCN]('ga-hover-trackable'),
          touchable = doc[gEBCN]('ga-touch-trackable'),
          clickable = doc[gEBCN]('ga-click-trackable'),
          i;
        initProfile = profile;
        for (i = linkable.length - 1; i >= 0; i--) {
          this.link(linkable[i]);
        }
        for (i = loadable.length - 1; i >= 0; i--) {
          this.load(loadable[i]);
        }
        for (i = scrollable.length - 1; i >= 0; i--) {
          this.scrollAt(scrollable[i]);
        }
        for (i = hoverable.length - 1; i >= 0; i--) {
          this.hover(hoverable[i]);
        }
        for (i = touchable.length - 1; i >= 0; i--) {
          this.touch(touchable[i]);
        }
        for (i = clickable.length - 1; i >= 0; i--) {
          this.click(clickable[i]);
        }
      }
    };
  tempTrack.init();
  // Catach our own errors
  if (win.gatrack && win.gatrack.onerror){
    for (var i = 0; i < win.gatrack.onerror.length; i++) {
      tempTrack.onerror.push(win.gatrack.onerror[i]);
    }
  }
  win.gatrack = tempTrack;
})(this, this.document);