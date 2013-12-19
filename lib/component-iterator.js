"use strict"

function DynamicComponentIterator(node) {
  this.node = node
}

var proto = DynamicComponentIterator.prototype

proto.vertex = function() {
  return this.node.value.value
}

proto.size = function() {
  return this.node.root().count
}

proto.valid = function() {
  return !!this.node
}

proto.valueOf = function() {
  if(this.node) {
    return this.vertex().value
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
    if(this.node.value.type !== "vertex") {
      this.next()
    }
  }
}

proto.last = function() {
  if(this.node) {
    this.node = this.node.last()
    if(this.node.value.type !== "vertex") {
      this.prev()
    }
  }
}