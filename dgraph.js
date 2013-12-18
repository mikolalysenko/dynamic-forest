"use strict"

module.exports = createVertex

var createEulerVertex = require("./lib/euler.js")
var elist = require("./lib/edge-list.js")

var KEY_COUNTER = 0

//Raise the level of an edge, optionally inserting into higher level trees
function raiseLevel(edge) {
  var s = edge.s
  var t = edge.t
  //Update position in edge lists
  removeEdge(s, edge)
  removeEdge(t, edge)
  edge.level += 1
  elist.insert(s.adjacent, edge)
  elist.insert(t.adjacent, edge)
  
  //Update flags for s
  if(s.euler.length <= edge.level) {
    s.euler.push(createEulerVertex(s))
  }
  var es = s.euler[edge.level]
  es.setFlag(true)

  //Update flags for t
  if(t.euler.length <= edge.level) {
    t.euler.push(createEulerVertex(t))
  }
  var et = t.euler[edge.level]
  et.setFlag(true)

  //Relink if necessary
  if(edge.euler) {
    edge.euler.push(es.link(et))
  }
}

//Remove edge from list and update flags
function removeEdge(vertex, edge) {
  var adj = vertex.adjacent
  var idx = elist.index(adj, edge)
  adj.splice(idx, 1)
  //Check if flag needs to be updated
  if(!((idx < adj.length && adj[idx].level === edge.level) ||
       (idx > 0 && adj[idx-1].level === edge.level))) {
    vertex.euler[edge.level].setFlag(false)
  }
}

//Add an edge to all spanning forests with level <= edge.level
function link(edge) {
  var es = edge.s.euler
  var et = edge.t.euler
  var euler = new Array(edge.level+1)
  for(var i=0; i<euler.length; ++i) {
    euler[i] = es[i].link(et[i])
  }
  edge.euler = euler
}

function DynamicEdge(value, key, s, t, level, euler) {
  this.value = value
  this.key = key  //Used to sort edges in list
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
  var level

  //Search over tv for edge connecting to tw
  function visit(node) {
    if(node.flag) {
      var v = node.value.value
      var adj = v.adjacent
      for(var ptr=elist.level(adj, level); ptr<adj.length && adj[ptr].level === level; ++ptr) {
        var e = adj[ptr]
        var es = e.s
        var et = e.t
        if(es.euler[level].path(et.euler[level])) {
          raiseLevel(e)
          ptr -= 1
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

  removeEdge(this.s, this)
  removeEdge(this.t, this)
  if(this.euler) {
    //Cut edge from tree
    for(var i=0; i<this.euler.length; ++i) {
      this.euler[i].cut()
    }

    //Find replacement, looping over levels
    for(var i=this.level; i>=0; --i) {
      var tv = this.s.euler[i].node.root()
      var tw = this.t.euler[i].node.root()
      level = i
      if(tv.count > tw.count) {
        visit(tw)
      } else {
        visit(tv)
      }
    }
  }
  this.s = this.t = this.euler = null
  this.level = 32
}

function DynamicVertex(value, euler, adjacent) {
  this.value = value
  this.euler = euler
  this.adjacent = adjacent
}

var vproto = DynamicVertex.prototype

vproto.connected = function(other) {
  return this.euler[0].path(other.euler[0])
}

vproto.link = function(other, value) {
  var e = new DynamicEdge(value, (KEY_COUNTER++), this, other, 0, null)
  if(!this.euler[0].path(other.euler[0])) {
    link(e)
  }
  this.euler[0].setFlag(true)
  other.euler[0].setFlag(true)
  elist.insert(this.adjacent, e)
  elist.insert(other.adjacent, e)
  return e
}

vproto.valueOf = function() {
  return this.value
}

//Returns the number of vertices in this connected component
vproto.componentSize = function() {
  return this.euler[0].count()
}

//Removes the vertex from the graph
vproto.cut = function() {
  while(this.adjacent.length > 0) {
    this.adjacent[this.adjacent.length-1].cut()
  }
}

function createVertex(value) {
  var euler = [null]
  var v = new DynamicVertex(value, euler, [])
  euler[0] = createEulerVertex(v)
  return v
}