"use strict"

module.exports = createTreap

function TreapNode(value, priority, parent, left, right, next, prev) {
  this.value = value
  this.priority = priority
  this.parent = parent
  this.left = left
  this.right = right
  this.next = next
  this.prev = prev
}

var proto = TreapNode.prototype

proto.bubbleUp = function() {
  while(true) {
    var p = this.parent
    if(!p || p.priority < this.priority) {
      break
    }
    if(this === p.left) {
      var b = this.right
      p.left = b
      if(b) {
        b.parent = p
      }
      this.right = p
    } else {
      var b = this.left
      p.right = b
      if(b) {
        b.parent = p
      }
      this.left = p
    }
    var gp = p.parent
    p.parent = this
    this.parent = gp
    if(gp) {
      if(gp.left === p) {
        gp.left = this
      } else {
        gp.right = this
      }
    }
  }
}

proto.root = function() {
  var n = this
  while(n.parent) {
    n = n.parent
  }
  return n
}

proto.first = function() {
  var l = this.root()
  while(l.left) {
    l = l.left
  }
  return l
}

proto.last = function() {
  var r = this.root()
  while(r.right) {
    r = r.right
  }
  return r
}

proto.insert = function(value) {
  if(!this.right) {
    var nn = this.right = new TreapNode(value, Math.random(), this, null, null, this.next, this)
    if(this.next) {
      this.next.prev = nn
    }
    this.next = nn
    nn.bubbleUp()
    return nn
  }
  var v = this.next
  var nn = v.left = new TreapNode(value, Math.random(), v, null, null, v, this)
  v.prev = nn
  this.next = nn
  nn.bubbleUp()
  return nn
}

function swapNodes(a, b) {
  var p = a.priority
  a.priority = b.priority
  b.priority = p
  var t = a.parent
  a.parent = b.parent
  if(b.parent) {
    if(b.parent.left === b) {
      b.parent.left = a
    } else {
      b.parent.right = a
    }
  }
  b.parent = t
  if(t) {
    if(t.left === a) {
      t.left = b
    } else {
      t.right = b
    }
  }
  t = a.left
  a.left = b.left
  if(b.left) {
    b.left.parent = a
  }
  b.left = t
  if(t) {
    t.parent = b
  }
  t = a.right
  a.right = b.right
  if(b.right) {
    b.right.parent = a
  }
  b.right = t
  if(t) {
    t.parent = b
  }
  t = a.next
  a.next = b.next
  if(b.next) {
    b.next.prev = a
  }
  b.next = t
  if(t) {
    t.prev = b
  }
  t = a.prev
  a.prev = b.prev
  if(b.prev) {
    b.prev.next = a
  }
  b.prev = t
  if(t) {
    t.next = b
  }
}

proto.remove = function() {
  var node = this
  if(node.left && node.right) {
    var other = node.next
    swapNodes(other, node)
  }
  if(node.next) {
    node.next.prev = node.prev
  }
  if(node.prev) {
    node.prev.next = node.next
  }
  var r = null
  if(node.left) {
    r = node.left
  } else {
    r = node.right
  }
  if(r) {
    r.parent = node.parent
  }
  if(node.parent) {
    if(node.parent.left === node) {
      node.parent.left = r
    } else {
      node.parent.right = r
    }
  }
  //Remove all pointers from detached node
  node.parent = node.left = node.right = node.prev = node.next = null
}

proto.split = function() {
  var node = this
  var s = node.insert()
  s.priority = -Infinity
  s.bubbleUp()
  var l = s.left
  var r = s.right
  if(l) {
    l.parent = null
  }
  if(r) {
    r.parent = null
  }
  if(s.prev) {
    s.prev.next = null
  }
  if(s.next) {
    s.next.prev = null
  }
  return r
}

function concatRecurse(a, b) {
  if(a === null) {
    return b
  } else if(b === null) {
    return a
  } else if(a.priority < b.priority) {
    a.right = concatRecurse(a.right, b)
    a.right.parent = a
    return a
  } else {
    b.left = concatRecurse(a, b.left)
    b.left.parent = b
    return b
  }
}

proto.concat = function(other) {
  if(!other) {
    return
  }
  var ra = this.root()
  var ta = ra
  while(ta.right) {
    ta = ta.right
  }
  var rb = other.root()
  var sb = rb
  while(sb.left) {
    sb = sb.left
  }
  ta.next = sb
  sb.prev = ta
  var r = concatRecurse(ra, rb)
  r.parent = null
  return r
}

function createTreap(value) {
  return new TreapNode(value, Math.random(), null, null, null, null, null)
}