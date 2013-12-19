"use strict"

var createGraphTester = require("./lib/graph-tester.js")
var tape = require("tape")

tape("dynamic-graph-simple", function(t) {

  var tester = createGraphTester(t, 4)
  tester.verify()

  var ab = tester.link(0, 1)
  var bc = tester.link(1, 2)
  t.ok(!tester.connected(0, 3), "connection sanity check")

  var cd = tester.link(2, 3)
  t.ok(tester.connected(0, 3), "connection sanity check")

  tester.verify()
  tester.cut(bc)
  tester.verify()
  t.ok(!tester.connected(0, 3), "connection sanity check")

  t.end()
})