/*! (C) WebReflection Mit Style License */
var Handler=function(){"use strict";function a(e){return this[e.type](e)}function f(e){var t=e.type,n=t+s,r,i,o,u;if(n in this){for(r=[].concat(this[n]),i=e.target,o=0,u=i?r.length:0;o<u;o++)i.matches(r[o])&&(u=-1);if(-1<u)return}return a.call(this,e)}function l(e){e.currentTarget[i+n](e.type,this,e.eventPhase===e.CAPTURING_PHASE)}function c(r,i,a){var f=i[r+n],l;for(l in a)l!==e&&l!==t&&o.test(l)&&typeof a[l]=="function"&&(u||(u=l+s in a),f.call(i,l,a,!!a[l+"Capture"]))}var e="handleEvent",t="releaseEvent",n="EventListener",r="add",i="remove",s="Target",o=/^[a-z]/i,u;return{add:function(i,s){return u=!1,c(r,i,s),e in s||(s.handleEvent=u?f:a),t in s||(s.releaseEvent=l),i},remove:function(t,n){return u=!0,c(i,t,n),t}}}();