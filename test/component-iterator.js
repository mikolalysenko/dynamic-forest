"use strict"

function ComponentIterator(node) {
  this._node = node
}

var proto = ComponentIterator.prototype

Object.defineProperty(proto, "size", {
  get: function() {
    return this._node.root().count
  }
})

proto.next = function() {
  var n = this._node.next
  while(n) {
    if(n.value.type === "vertex") {
      break
    }
    n = n.next
  }
  this._node = n
  return !!n
}

proto.prev = function() {
  var p = this._node.prev
  while(p) {
    if(p.value.type === "vertex") {
      break
    }
    p = p.prev
  }
  this._node = prototype
  return !!p
}