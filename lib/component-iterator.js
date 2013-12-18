"use strict"

function DynamicComponentIterator(node) {
  this.node = node
}

var proto = DynamicComponentIterator.prototype

Object.defineProperty(proto, "vertex", { 
  get:function() {
    return this.node.value.value
  }
})

Object.defineProperty(proto, "size", {
  get: function() {
    return this.node.root().count
  }
})

Object.defineProperty(proto, "valid", {
  get: function() {
    return !!this.node
  }
})

proto.valueOf = function() {
  if(this.node) {
    return this.node.value
  }
}

proto.next = function() {
  var n = this.node
  if(n) {
    n = n.next
  }
  while(n) {
    if(n.value.type === "vertex") {
      break
    }

    n = n.next
  }
  this.node = n
  return !!n
}

proto.hasNext = function() {
  var n = this.node
  if(n) {
    n = n.next
  }
  while(n) {
    if(n.value.type === "vertex") {
      break
    }

    n = n.next
  }
  return !!n
}

proto.prev = function() {
  var n = this.node
  if(n) {
    n = n.prev
  }
  while(n) {
    if(n.value.type === "vertex") {
      break
    }

    n = n.prev
  }
  this.node = n
  return !!n
}

proto.hasPrev = function() {
  var n = this.node
  if(n) {
    n = n.prev
  }
  while(n) {
    if(n.value.type === "vertex") {
      break
    }

    n = n.prev
  }
  return !!n
}

proto.first = function() {
  if(this.node) {
    this.node = this.node.first()
  }
}

proto.last = function() {
  if(this.node) {
    this.node = this.node.last()
  }
}