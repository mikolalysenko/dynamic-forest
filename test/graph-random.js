"use strict"

var createGraphTester = require("./lib/graph-tester.js")
var tape = require("tape")

tape("random-tester", function(t) {

  var tester = createGraphTester(t, 64)
  for(var i=0; i<1000; ++i) {
    if(Math.random() < 0.25) {
      var e = tester.edges()
      var h = (Math.random() * e.length)|0
      if(h < e.length) {
        tester.cut(e[h])
      }
    } else {
      var sv = (Math.random() * 64)|0
      var tv = (Math.random() * 64)|0
      if(!tester.connected(sv,tv)) {
        tester.link(sv, tv)
      }
    }
    if(i % 200 === 199) {
      tester.verify(true)
    }
  }
  tester.verify(true)

  t.end()
})
