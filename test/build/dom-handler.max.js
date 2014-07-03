/*!
Copyright (C) 2014 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var Handler = (function() {'use strict';

  var
    HANDLE_EVENT = 'handleEvent',
    RELEASE_EVENT = 'releaseEvent',
    EVENT_LISTENER = 'EventListener',
    ADD = 'add',
    REMOVE = 'remove',
    TARGET = 'Target',
    arr = Array.prototype,
    re = /^[a-z]/i,
    useTarget
  ;

  function grabNode(node) {
    return typeof node === 'string' ?
      document.querySelector(node) :
      node;
  }

  function handleEvent(e) {
    return this[e.type](e);
  }

  function handleTargetEvent(e) {
    var
      type = e.type,
      typeTarget = type + TARGET,
      matches, target, i, length
    ;
    if (typeTarget in this) {
      for (
        matches = arr.concat(this[typeTarget]),
        target = e.target,
        i = 0,
        length = target ? matches.length : 0;
        i < length; i++
      ) {
        if (target.matches(matches[i])) length = -1;
      }
      if (-1 < length) return;
    }
    return handleEvent.call(this, e);
  }

  function releaseEvent(e) {
    e.currentTarget[REMOVE + EVENT_LISTENER](
      e.type, this, e.eventPhase === e.CAPTURING_PHASE
    );
  }

  function loopAnd(action, node, handler) {
    var method = node[action + EVENT_LISTENER], key;
    for (key in handler) {
      if (
        key !== HANDLE_EVENT &&
        key !== RELEASE_EVENT &&
        re.test(key) &&
        typeof handler[key] === 'function'
      ) {
        if (!useTarget) useTarget = (key + TARGET) in handler;
        method.call(
          node, key, handler, !!handler[key + 'Capture']
        );
      }
    }
  }

  return {
    add: function add(node, handler) {
      useTarget = false;
      loopAnd(ADD, grabNode(node), handler);
      if (!(HANDLE_EVENT in handler)) {
        handler.handleEvent = useTarget ?
          handleTargetEvent : handleEvent;
      }
      if (!(RELEASE_EVENT in handler)) {
        handler.releaseEvent = releaseEvent;
      }
      return node;
    },
    remove: function remove(node, handler) {
      useTarget = true;
      loopAnd(REMOVE, grabNode(node), handler);
      return node;
    }
  };

}());