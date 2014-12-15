# gatrack.js

![gatrack.js](https://s3.amazonaws.com/bckmn/public/blog/gatrackjs.png)

> Easily track user events with Google Analytics. Test UI/UX theories, compare client performance/speed, even track client-side errors. All user events are tied to all other session data in Google Analytics.

## Is it any good?

You betcha. Check out the [provided index.html](https://github.com/jbckmn/gatrack.js/blob/master/exampl/index.html) demo for working examples.

## Way-cool:

- [Auto-track](#api-usage) events on elements with a class-based API
- Explicit [action hook](#registering-custom-events), works with [any registerable browser event](https://developer.mozilla.org/en-US/docs/Web/Reference/Events) 
- Support for multiple versions of Google's analytics [tracking scripts](#things-youll-need) (_ga_ and *_gaq*)
- Supports multiple loading multiple profiles at once
- Track [client errors as separate events](#tracking-erros), attached to all prior & subsequent interaction data
- All user events are tied to all other session data in Google Analytics
- Weighs under 3kb (_even smaller if you're smart enough to gzip_)
- Provides tracking support for [common events](#api-usage)
  - Scrolling
  - Touches
  - Links
  - Clicks
  - Hovering
  - Errors

## Things you'll need

- A Google Analytics profile
- A version of the [Google Analytics](http://www.google.com/analytics/) tracking script released within the last couple years, installed in your page source

## API usage

The API, on load, detects and tracks events for touch, hover, scroll, click, link and load. To specify category or the action being taken (both optional), simply add data-attributes of `gatrack-category` and/or `gatrack-action` and/or `gatrack-label` and/or `gatrack-value`.

#### Click events

For an element on which you wish to track click events, add a class of `ga-click-trackable`.

#### Link visits

For links (internal or outbound) for which you want to track user interaction, add a class of `ga-link-trackable`.

#### Hover events

For an element on which you wish to track hover events, add a class of `ga-hover-trackable`.

#### Load events

For an element on which you wish to track load events, add a class of `ga-load-trackable`.

#### Touch events

For an element on which you wish to track touch events, add a class of `ga-touch-trackable`.

#### Scroll events

For an element on which you wish to track scroll events, add a class of `ga-scroll-trackable`. You need to specfiy the position at which to trigger the event (either percentage amount or pixel distance, '30%' or '300px', by setting `data-gatrack-scroll-point`). For this type of event, you can also specify scrolling direction ('x' or 'y', by setting `data-gatrack-scroll-direction`) to track , which defaults to 'y', or vertical.

## Registering custom events

*__gatrack.action__(element, category, action [, label, value, callback(result)])*

*__gatrack.link__(element [, category, action, label, value])*

*__gatrack.click__(element [, category, action, label, value])*

*__gatrack.load__(element [, category, action, label, value])*

*__gatrack.touch__(element [, category, action, label, value])*

*__gatrack.hover__(element [, category, action, label, value])*

*__gatrack.scrollAt__(element, scrollPoint [, scrollDirection, category, action, label, value])*

Google Analytics events accept four parameters:
- __category:__ _string_
- __action:__ _string_
- __label:__ _string_
- __value:__ _integer_

In general, the event hooks look for things like an element `id` or `title` attribute to assign to the _action_ parameter when one is not specified either explicitly or in the data-attribute of the element.

In the case of the __link__ event, it looks for the `href` value in absence of an explicity declaration or data-attribute, and the __scrollAt__ event looks for the page title content.

*__gatrack.init__()* is available and can be used to initialize the event listeners on specified elements whenever you like.

The __action__ hook, when given an optional callback function, returns a 'success' string on success and a traditional error object otherwise.

You can [read more specifics](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) about [the event object in Google Analytics](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide).

## Tracking Errors

You can also track errors on your page through gatrack. All you'll need to do is override the native `onerror` function with one for gatrack. 

To start recording errors, you simply need to place the following snippet in a `script` tag so that it will be the first code executed on your page, preferrably in the `head` of your document.

```javascript
// One-liner, minified (use this one!)
(function(g,a,t,r,a,c,k){g[r]=g[r]||{};g[r][a]=t.getTime();g[r][c]=[];g[c]=function(m,u,l,c,e){this.gatrack.onerror.push([m,u,l,c,e])}})(window,document,(new Date()),'gatrack','timer','onerror');
```
```javascript
// Expanded, so you can see
(function(g,a,t,r,a,c,k){
  g[r] = g[r] || {};
  g[r][a] = t.getTime();
  g[r][c] = [];
  g[c] = function( m, u, l, c, e ) {
    this.gatrack.onerror.push([m, u, l, c, e]);
  };
})(window,document,(new Date()),'gatrack','timer','onerror');
```

This snippet will allow you to record errors that are raised even before any other JavaScript code is executed. The gatrack library records errors in the following format:
- __category__: 'Recorded Error'
- __label__: The error's message string
- __action__: 'Error line:column(url)'
- __value__: Time of occurence after HTML load (in seconds, rounded to nearest hundreth)
