"use strict"

module.exports = createVertex

var createEulerVertex = require("./lib/euler.js")
var elist = require("./lib/edge-list.js")

var FOREST_LEVELS = 28

//Raise the level of an edge, optionally inserting into higher level trees
function raiseLevel(edge) {
  var s = edge.s
  var t = edge.t
}

//Remove edge from list and update flags
function removeEdge(vertex, edge) {
}

//Add an edge to all spanning trees
function link(edge) {
}

function DynamicEdge(value, key, s, t, level, euler) {
  this.value = value
  this.key = key
  this.s = s
  this.t = t
  this.level = level
  this.euler = euler
}

var eproto = DynamicEdge.prototype

eproto.valueOf = function() {
  return this.value
}

eproto.cut = function() {
  removeEdge(this.s, this)
  removeEdge(this.t, this)
  if(this.euler) {
    //Cut edge from tree
    for(var i=0; i<this.euler.length; ++i) {
      this.euler[i].cut()
    }

    //Find replacement, looping over levels
    for(var i=this.level; i>=0; --i) {
      var tv = this.s.euler[i].root()
      var tw = this.t.euler[i].root()
      if(tv.count > tw.count {
        var tmp = tv
        tv = tw
        tw = tv 
      }

      //Search over tv for edge connecting to tw
      function visit(node) {
        if(node.flag) {
          var v = node.value.value
          var adj = v.adjacent
          for(var ptr=elist.level(adj, i); ptr<adj.length && adj[ptr].level === i; ++ptr) {
            var e = adj[ptr]
            var es = e.s
            var et = e.t
            if(es.euler[i].path(et.euler[i])) {
              raiseLevel(e)
            } else {
              //Found the edge, relink components
              link(e)
              return true
            }
          }
        }
        if(node.left && node.left.flagAggregate) {
          if(visit(node.left)) {
            return true
          }
        }
        if(node.right && node.right.flagAggregate) {
          if(visit(node.right)) {
            return true
          }
        }
        return false
      }
      visit(tv)
    }
  }
  this.s = this.t = this.euler = null
  this.level = FOREST_LEVELS + 1
}

function DynamicVertex(value, euler, adjacent) {
  this.value = value
  this.euler = euler
  this.adjacent = adjacent
}

var vproto = DynamicVertex.prototype

vproto.path = function(other) {
  return this.euler[0].path(other.euler[0])
}

vproto.link = function(other, value) {
  var e = new DynamicEdge(value, Math.random(), this, other, 0, null)
  if(!this.path(other)) {
    link(e)
  }
  s.euler[0].setFlag(true)
  t.euler[0].setFlag(true)
  elist.insert(this.adjacent, e)
  elist.insert(other.adjacent, e)
  return e
}

vproto.valueOf = function() {
  return this.value
}

function createVertex(value) {
  var euler = new Array(FOREST_LEVELS)
  var v = new DynamicVertex(value, euler, [])
  for(var i=0; i<FOREST_LEVELS; ++i) {
    euler[i] = createEulerVertex(v)
  }
  return v
}