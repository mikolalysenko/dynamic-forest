"use strict"

var createGraphTester = require("../lib/graph-tester.js")
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

/*
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
*/

/*
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
*/


function IyerSequence(t, levels) {

}