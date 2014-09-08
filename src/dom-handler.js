function () {'use strict';

  function grabNode(node) {
    return typeof node === 'string' ?
      document.querySelector(node) :
      node;
  }

  function handleEvent(e) {
    return this[e.type](e);
  }

  function handleDelegatedEvent(e) {
    var
      delegated = this[e.type + 'Delegate'],
      matches, target, currentTarget, i, length
    ;
    if (delegated) {
      for (
        matches = Array.prototype.concat(delegated),
        target = e.target,
        currentTarget = e.currentTarget,
        i = 0,
        length = target ? matches.length : 0;
        i < length; i++
      ) {
        do {
          if (target.nodeType === 1 &&
              target.matches(matches[i])
          ) {
            e.delegated = target;
            length = -1;
          }
        } while (
          -1 < length &&
          target !== currentTarget &&
          (target = target.parentNode)
        );
      }
      if (-1 < length) return;
    }
    return handleEvent.call(this, e);
  }

  function releaseEvent(e) {
    e.currentTarget.removeEventListener(
      e.type, this, e.eventPhase === e.CAPTURING_PHASE
    );
  }

  function loopAnd(action, node, handler, delegated) {
    var method = node[action + 'EventListener'], key;
    for (key in handler) {
      if (
        key !== 'handleEvent' &&
        key !== 'releaseEvent' &&
        /^[a-z]/i.test(key) &&
        typeof handler[key] === 'function'
      ) {
        if (!delegated) delegated = (key + 'Delegate') in handler;
        method.call(
          node, key, handler, !!handler[key + 'Capture']
        );
      }
    }
    return delegated;
  }

  return {
    add: function add(node, handler) {
      var
        target = grabNode(node),
        delegated = loopAnd('add', target, handler, false)
      ;
      if (!handler.handleEvent) {
        handler.handleEvent = delegated ?
          handleDelegatedEvent : handleEvent;
      }
      if (!handler.releaseEvent) {
        handler.releaseEvent = releaseEvent;
      }
      return target;
    },
    remove: function remove(node, handler) {
      var target = grabNode(node);
      loopAnd('remove', target, handler, true);
      return target;
    }
  };

}