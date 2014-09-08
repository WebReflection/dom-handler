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
      setTimeout(function () {
        document.documentElement.dispatchEvent(
          new CustomEvent('click')
        );
      }, 100);
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
      setTimeout(dispatch, 100);
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
      setTimeout(done, 100);
    }
  },{
    name: 'eventDelegate works as expected',
    test: function () {
      Handler.add(document.documentElement, {
        customDelegate: 'body',
        custom: wru.async(function (e) {
          wru.assert(e.target === document.body);
        })
      });
      setTimeout(function () {
        document.body.dispatchEvent(
          new CustomEvent('custom', {
            bubbles: true
          })
        );
      }, 100);
    }
  },{
    name: 'eventDelegate works from subnodes too',
    test: function () {
      Handler.add(document.documentElement, {
        anotherDelegate: 'body',
        another: wru.async(function (e) {
          document.body.removeChild(text.parentNode);
          wru.assert(e.delegated === document.body);
        })
      });
      var text = document.body.appendChild(
        document.createElement('div')
      ).appendChild(
        document.createTextNode('text')
      );
      setTimeout(function () {
        text.dispatchEvent(
          new CustomEvent('another', {
            bubbles: true
          })
        );
      }, 100);
    }
  },{
    name: 'pass string instead of node',
    test: function () {
      Handler.add('html', {
        click: wru.async(function (e) {
          this.releaseEvent(e);
          wru.assert(
            'this is the right node',
            e.currentTarget === document.documentElement
          );
        })
      });
      setTimeout(function () {
        document.documentElement.dispatchEvent(
          new CustomEvent('click')
        );
      }, 100);
    }
  },{
    name: 'returns the node instead of the string',
    test: function () {
      wru.assert(Handler.add('html', {}) === document.documentElement);
    }
  }
]);
