dom-handler
===========

[Live Test Page](http://webreflection.github.io/dom-handler/test/)


A simple fully cross browser library that could change forever the way you interact with DOM and events.

It's completely dependencies free, it's natively fast, and it fits in less than 1KB.

#### example
The most basic example is a click, performed once, and never again.
```js
Handler.add(document.documentElement, {
  click: function (e) {
    console.log(e.type);
    this.releaseEvent(e);
  }
});
```
The handler object is not even assigned once, it's capable of handling any kind of event and remove whenever it's needed via `this.releaseEvent(event)` and it's natively bound without any need to use function bind, which also means less amount of RAM needed, always able to drop a handler/listener without the need to reference each bound function, and ideally better performance too.

To remove from any handler, at any time, all attached events:
```js
Handler.add(document.documentElement, {
  click: function (e) {
    console.log(e.type);
  },
  dropHandler: function (e) {
    Handler.remove(e.currentTarget, this);
  }
});
```
By W3C specifications the `event.currentTarget` property is always present and is always the original `Node` where the generic function hr handler were attached. Accordingly, a simple call like this:
```js
document.documentElement.dispatchEvent(
  new CustomEvent('dropHandler')
);
```
Will free forever from all listeners defined in the handler object.

#### capture
This simple script lets us capture events, if necessary, through a basic key convention:
```js
Handler.add(document.documentElement, {
  clickCapture: true,
  click: function (e) {
    console.log(e.type);
  }
});
```
In this case the event phase will be [capturing instead of bubbling](http://www.quirksmode.org/js/events_order.html).

#### delegate
It is possible to delegate listeners too, handy to simplify and boost up listeners per nodes.
```js
Handler.add(
  'ul.menu',
  {
    // each li inside this ul will trigger `click`
    clickDelegate: 'li',
    click: function (e) {
      console.log(e.delegated.nodeName); // LI
    }
  }
);
```

#### custom methods and properties
only properties that are functions, starts with `[a-zA-Z]`, and are not `handleEvent` or `releaseEvent` will be set as DOM handler, feel free to use any other name or value to do whatever you want.
```js
Handler.add(document.documentElement, {
  counter: 0,
  _showWinner: function () {
    alert('Congratulations, you did ' + this.counter + '!');
  },
  click: function (e) {
    if (++this.counter === 10) {
      this.releaseEvent(e);
      this._showWinner();
    }
  }
});
```

#### performance
The worst case scenario I could measure [triggers 3600 operations](http://jsperf.com/handleevent) per second in a cheap Android 2 hardware.

While I believe if we have 3000 listeners acting on `touchmove`, the problem is not exactly the handler, talking with numbers this means that even `mousemove` or `thouchmove` events, fired at 60FPS, will never be concretely affected since the amount of time taken natively to dispatch these kind of events is, again in the worst case scenario, `0.27` millisecons out of `16.66` milliseconds we have per each frame.

On average, mobile phones will simply have **0.2 millisecond** less time to do everything needed to be done and whenever this will be the real world bottleneck, you can always change that single listener to use a callback instead of rewriting the whole app.

#### no more leaks
The feature that comes for free is the ability to somehow link an object to a DOM node without needing to reference it.
Once the DOM node will be removed and its reference canceled, there won't be any leak left since the counter reference for all handlers will be just 0.
This is a very welcome implicit side effect, and an easier way than `WeakMaps`. It also means we can create any sort of pattern and behavior simply via events, customs or user-generated, interacting with a transparent, by default unreachable, and for this reason more secure, JavaScript object, able to do much more than a generic `node.dataset` access.

#### As Summary
This is the **easiest**, yet **performant** and probably the **most efficient** way to deal with one or more handlers, confining as _plugin objects_ different behaviors or logic without interferring with each other.

#### What About IE8 ?
If you use upfront [a DOM4 normalizer like this one](https://github.com/WebReflection/dom4#dom4) you can forget about IE8 problems as well as function expressions VS function declarations since adding and removing an object won't ever suffer those kind of problems!
