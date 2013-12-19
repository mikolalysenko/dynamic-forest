"use strict"

var createVertex = require("../dgraph.js")
var UnionFind = require("union-find")
var tape = require("tape")

//Executes graph 
function createGraphTester(t, n) {
  var verts = new Array(n)
  var edges = []
  for(var i=0; i<n; ++i) {
    verts[i] = createVertex(i)
  }

  function validateGraph() {
    var forest = new UnionFind(n)
    var euler_forest = new UnionFind(n)
    for(var i=0; i<edges.length; ++i) {
      var e = edges[i]
      t.ok(e[1].s.adjacent.indexOf(e[1]) >= 0)
      t.ok(e[1].t.adjacent.indexOf(e[1]) >= 0)
      t.ok(e[1].level >= 0)
      forest.link(e[0][0], e[0][1])
      if(e[1].euler) {
        t.ok(e[1].level < e[1].s.euler.length)
        t.ok(e[1].level < e[1].t.euler.length)
        euler_forest.link(e[0][0], e[0][1])
        for(var j=0; j<e[1].euler.length; ++j) {
          t.equals(e[1].euler[j].type, "edge")
          t.equals(e[1].euler[j].value, e[1])
          t.equals(e[1].euler[j].s, e[1].s.euler[j])
          t.equals(e[1].euler[j].t, e[1].t.euler[j])
        }
      }
    }
    for(var i=0; i<n; ++i) {
      var v = verts[i]
      var c = n
      for(var j=0; j<v.euler.length; ++j) {
        t.equals(v.euler[j].value, v)
        t.equals(v.euler[j].type, "vertex")
        t.ok(v.euler[j].count() <= n)
        c >>= 1
      }
    }
    for(var i=0; i<n; ++i) {
      for(var j=0; j<n; ++j) {
        var conn = (forest.find(i) === forest.find(j))
        t.equals(verts[i].connected(verts[j]), conn)
        t.equals(euler_forest.find(i) === euler_forest.find(j), conn)
      }
    }
  }

  var tester = {
    link: function(i,j) {
      var e = [[i,j]]
      e.push(verts[i].link(verts[j], e))
      edges.push(e)
      return e
    },
    cut: function(e) {
      e[1].cut()
      edges.splice(edges.indexOf(e), 1)
    },
    verify: validateGraph,
    edges: function() {
      return edges
    }
  }
  return tester
}

tape("dynamic-graph-simple", function(t) {

  var a = createVertex("a")
  var b = createVertex("b")
  var c = createVertex("c")
  var d = createVertex("d")

  var ab = a.link(b, "ab")
  var bc = b.link(c, "bc")
  var cd = c.link(d, "cd")
  
  bc.cut()
  
  t.end()
})

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
    if(i % 50 === 49) {
      tester.verify()
    }
  }
  tester.verify()

  t.end()
})