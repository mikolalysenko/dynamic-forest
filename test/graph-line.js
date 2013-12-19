"use strict"

var createGraphTester = require("../lib/graph-tester.js")
var tape = require("tape")

function testLineGraph(t, h) {
  var n = 1 << h
  var tester = createGraphTester(t, n)
  var edges = new Array(n-1)
  for(var i=1; i<n; ++i) {
    edges[i-1] = tester.link(i-1, i)
  }
  t.ok(tester.connected(0, n-1), "checking initial connectivity")
  for(var i=h-1; i>=0; --i) {
    var s = (1<<i)
    t.ok(tester.connected(0, s), "checking connectivity of component @ " + s)
    for(var j=s-1; j<n-1; j+=s) {
      if(edges[j]) {
        tester.cut(edges[j])
        edges[j] = null
      }
    }
    tester.verify()
    t.ok(!tester.connected(0, s), "checking components are cut successfully @ " + s)
  }
}

tape("line-graph", function(t) {
  testLineGraph(t, 5)
  t.end()
})