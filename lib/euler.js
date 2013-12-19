"use strict"

module.exports = createVertex

var treap = require("./treap.js")

function EulerHalfEdge(value, s, t, node, opposite) {
  this.value = value
  this.s = s
  this.t = t
  this.node = node
  this.opposite = opposite
}

var eproto = EulerHalfEdge.prototype

eproto.type = "edge"

eproto.cleanup = function() {
  var v = this.node
  v.remove()
  v.value = null
  this.node = null
  this.opposite = null
  this.s = null
  this.t = null
}

eproto.cut = function() {

  var other = this.opposite
  
  //Split into parts
  var a = this.node
  var b = a.split()
  var c = other.node
  var d = c.split()

  //Pull out the roots
  if(d !== null && a.root() !== d.root()) {
    //a comes before c:
    // [a, bc, d]
    a.concat(d)
  } else if(b !== null && c.root() !== b.root()) {
    //c comes before a:
    // [c, da, b]
    c.concat(b)
  }

  //Clean up mess
  this.cleanup()
  other.cleanup()
}

function EulerVertex(value, node) {
  this.value = value
  this.node = node
}

var vproto = EulerVertex.prototype

vproto.type = "vertex"

//If flag is set, then this vertex has incident edges of at least level v
vproto.setFlag = function(f) {
  this.node.setFlag(f)
}

vproto.path = function(other) {
  return this.node.root() === other.node.root()
}

vproto.makeRoot = function() {
  var a = this.node
  var b = a.split()
  if(b) {
    b.concat(a)
  }
}

vproto.link = function(other, value) {
  //Move both vertices to root
  this.makeRoot()
  other.makeRoot()

  //Create half edges and link them to each other
  var st = new EulerHalfEdge(value, this, other, null, null)
  var ts = new EulerHalfEdge(value, other, this, null, st)
  st.opposite = ts

  //Insert entries in Euler tours
  st.node = this.node.insert(st)
  ts.node = other.node.insert(ts)

  //Link tours together
  this.node.concat(other.node)

  //Return half edge
  return st
}

vproto.count = function() {
  return this.node.root().count
}

vproto.cleanup = function() {
  this.node.remove()
  this.node.value = null
  this.node = null
}

function createVertex(value) {
  var v = new EulerVertex(value, null)
  v.node = treap(v)
  return v
}