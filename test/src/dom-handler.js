function() {'use strict';
  // @link https://gist.github.com/WebReflection/9814013
  var
    HANDLE_EVENT = 'handleEvent',
    RELEASE_EVENT = 'releaseEvent',
    EVENT_LISTENER = 'EventListener',
    ADD = 'add',
    REMOVE = 'remove',
    TARGET = 'Target',
    re = /^[a-z]/i,
    useTarget
  ;

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
        matches = [].concat(this[typeTarget]),
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
      loopAnd(ADD, node, handler);
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
      loopAnd(REMOVE, node, handler);
      return node;
    }
  };

}