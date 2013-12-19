"use strict"

var createGraphTester = require("../lib/graph-tester.js")
var tape = require("tape")

function createTree(t, levels) {
  var n = (((1 << (2*(levels+1)))-1) / 3)|0
  var tester = createGraphTester(t, n)

  var tree = [ [0] ]
  var branches = [ ]
  var ptr = 1
  
  for(var i=0; i<levels; ++i) {
    var l = tree[i]
    var links = new Array(tree[i].length)
    var next = []
    for(var j=0; j<l.length; ++j) {
      var h = new Array(4)
      for(var k=0; k<4; ++k) {
        h[k] = tester.link(l[j], ptr)
        next.push(ptr++)
      }
      links[j] = h
    }
    branches.push(links)
    tree.push(next)
  }

  function iyerSequence(k) {
    if(k === 0) {
      return
    }
    var l = tree[k-1]
    var b = branches[k-1]
    iyerSequence(k-1)
    for(var i=0; i<l.length; ++i) {
      var h = b[i]
      var e0 = h[0]
      var e1 = h[1]
      tester.cut(e0)
      tester.cut(e1)
      h[0] = tester.link(e0[0][0], e0[0][1])
      h[1] = tester.link(e1[0][0], e1[0][1])
    }
    iyerSequence(k-1)
    for(var i=0; i<l.length; ++i) {
      var h = b[i]
      var e0 = h[2]
      var e1 = h[3]
      tester.cut(e0)
      tester.cut(e1)
      h[2] = tester.link(e0[0][0], e0[0][1])
      h[3] = tester.link(e1[0][0], e1[0][1])
    }
  }

  //Verify structure of tree
  return {
    nodes: tree,
    links: branches,
    tester: tester,
    iyerSequence: iyerSequence
  }
}


tape("dynamic-graph-simple", function(t) {
  for(var i=1; i<5; ++i) {
    var tree = createTree(t, i)
    tree.iyerSequence(i)
    tree.tester.verify(true)
  }

  t.end()
})