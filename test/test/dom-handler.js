//remove:
var Handler = require('../build/dom-handler.node.js');
//:remove

wru.test([
  {
    name: 'main',
    test: function () {
      wru.assert(typeof Handler == "object");
    }
  },{
    name: 'adds handleEvent automagically',
    test: function () {
      Handler.add(document.documentElement, {
        click: wru.async(function (e) {
          this.releaseEvent(e);
          wru.assert('this is the right event', e.type === 'click');
        })
      });
      document.documentElement.dispatchEvent(
        new CustomEvent('click')
      );
    }
  },{
    name: 'releaseEvent actually releases',
    test: function () {
      var i = 0;
      var done = wru.async(function () {
        wru.assert('OK');
      });
      var dispatch = function () {
        document.documentElement.dispatchEvent(
          new CustomEvent('click')
        );
      };
      Handler.add(document.documentElement, {
        click: function (e) {
          ++i;
          this.releaseEvent(e);
          setTimeout(function () {
            dispatch();
            setTimeout(function() {
              if (i === 1) done();
            }, 100);
          }, 100);
        }
      });
      dispatch();
    }
  }, {
    name: 'already present handlers are not touched or fired',
    test: function () {
      function handleEvent() {
        ++i;
      }
      var done = wru.async(function() {
        wru.assert(i === 0);
      });
      var i = 0;
      var o = {handleEvent: handleEvent};
      Handler.add(document.documentElement, o);
      wru.assert('handleEvent method didn\'t change', o.handleEvent === handleEvent);
      document.documentElement.dispatchEvent(
        new CustomEvent('handleEvent')
      );
      Handler.remove(document.documentElement, o);
      done();
    }
  },{
    name: 'eventTarget works as expected',
    test: function () {
      Handler.add(document.documentElement, {
        customTarget: 'body',
        custom: wru.async(function (e) {
          wru.assert(e.target === document.body);
        })
      });
      document.body.dispatchEvent(
        new CustomEvent('custom', {
          bubbles: true
        })
      );
    }
  }
]);
