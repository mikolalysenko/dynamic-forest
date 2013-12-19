"use strict"

module.exports = createGraphTester

var createVertex = require("../../dgraph.js")
var UnionFind = require("union-find")
var bits = require("bit-twiddle")

//Executes graph 
function createGraphTester(t, n) {
  var verts = new Array(n)
  var edges = []
  for(var i=0; i<n; ++i) {
    verts[i] = createVertex(i)
  }

  var log2N = bits.log2(n)

  function validateGraph(skipConn) {
    var forest = new UnionFind(n)
    var euler_forest = new UnionFind(n)
    for(var i=0; i<edges.length; ++i) {
      var e = edges[i]
      t.ok(e[1].s.adjacent.indexOf(e[1]) >= 0, "checking edge contained in s adj list")
      t.ok(e[1].t.adjacent.indexOf(e[1]) >= 0, "checking edge contained in t adj list")
      t.ok(e[1].level >= 0, "checking level is > 0")
      t.ok(e[1].level < log2N, "checking level is valid " + e[1].level + " < " + log2N)
      forest.link(e[0][0], e[0][1])
      if(e[1].euler) {
        t.ok(e[1].level < e[1].s.euler.length, "checking euler tree s entries present")
        t.ok(e[1].level < e[1].t.euler.length, "checkign euler tree t entries present")
        euler_forest.link(e[0][0], e[0][1])
        for(var j=0; j<e[1].euler.length; ++j) {
          t.ok(e[1].euler[j], "checking euler entry " + j)
          t.equals(e[1].euler[j].type, "edge", "checking euler type=edge")
          t.equals(e[1].euler[j].value, e[1], "checking pointers")
          t.equals(e[1].euler[j].s, e[1].s.euler[j], "checking s-link consistent")
          t.equals(e[1].euler[j].t, e[1].t.euler[j], "checking t-link consistent")
        }
      }
    }
    for(var i=0; i<n; ++i) {
      var v = verts[i]
      var c = n
      t.ok(v.euler.length <= log2N, "checking num levels < " + log2N)
      for(var j=0; j<v.euler.length; ++j) {
        t.equals(v.euler[j].value, v, "checking vertex euler entry consistent @ level" + j)
        t.equals(v.euler[j].type, "vertex", "checking vertex type consistent @ level " + j)
        t.ok(v.euler[j].count() <= c, "checking component size consistent: " + v.euler[j].count() + "<=" + c)
        c >>= 1
      }
    }
    if(skipConn) {
      return
    }
    for(var i=0; i<n; ++i) {
      for(var j=0; j<n; ++j) {
        var conn = (forest.find(i) === forest.find(j))
        t.equals(verts[i].connected(verts[j]), conn, "checking connectivity")
        t.equals(euler_forest.find(i) === euler_forest.find(j), conn, "checking connectivity for forest")
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
    connected: function(i, j) {
      return verts[i].connected(verts[j])
    },
    edges: function() {
      return edges
    }
  }
  return tester
}
