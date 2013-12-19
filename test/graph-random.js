"use strict"

var createGraphTester = require("../lib/graph-tester.js")
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
      var s = (Math.random() * 64)|0
      var t = (Math.random() * 64)|0
      tester.link(s, t)
    }
    if(i % 200 === 199) {
      tester.verify()
    }
  }
  tester.verify()

  t.end()
})
