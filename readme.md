# gatrack.js

> Easily track user events with Google Analytics.

## Way-cool features:

- Support for both legacy and newer versions of Google's analytics [tracking scripts](#things-youll-need) (_ga_ and __gaq_)
- Weighs under 3kb (_even smaller if you're smart enough to gzip_)
- Explicit [action hook](#registering-custom-events), works with [any registerable browser event](https://developer.mozilla.org/en-US/docs/Web/Reference/Events)
- Provides support for [common events](#api-usage)
  - Scrolling
  - Touches
  - Links
  - Clicks
  - Hovering
- [Auto-track](#api-usage) events on elements with a class-based API

## Things you'll need

- A version of the [Google Analytics](http://www.google.com/analytics/) tracking script released within the last 2-3 years
- A Google Analytics profile

## API usage

The API, on load, detects and tracks events for touch, hover, scroll, click, link and load. To specify category or the action being taken (both optional), simply add data-attributes of `gatrack-category` and/or `gatrack-action`.

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

*__gatrack.action__(element [, category, action, callback(result)])*

*__gatrack.link__(element [, category, action])*

*__gatrack.click__(element [, category, action])*

*__gatrack.load__(element [, category, action])*

*__gatrack.touch__(element [, category, action])*

*__gatrack.hover__(element [, category, action])*

*__gatrack.scrollAt__(element, scrollPoint [, scrollDirection, category, action])*

The __action__ hook, when given an optional callback function, returns a 'success' string on success and a traditional error object otherwise.

In general, the event hooks look for things like an element `id` or `title` attribute to assign to the _action_ parameter when one is not specified either explicitly or in the data-attribute of the element.

In the case of the __link__ event, it looks for the `href` value in absence of an explicity declaration or data-attribute, and the __scrollAt__ event looks for the page title content.

## Examples

Check out the included [index.html](https://github.com/jbckmn/gatrack.js/blob/master/index.html) for a working example.