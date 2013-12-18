"use strict"

//This is a custom binary tree data structure
//The reason for using this instead of an array or some generic search tree is that:
//
//    * Nodes are ordered by position not sorted by key
//    * On average tree height is O(log(number of nodes))
//    * Concatenation and splitting both take O(log(N))
//    * Has augmentations for size and edge level incidence flag
//    * Node references are not invalidated during updates
//    * Has threaded pointers for fast sequential traversal
//

module.exports = createTreap

function TreapNode(value, flag, flagAggregate, count, priority, parent, left, right, next, prev) {
  this.value = value
  this.flag = flag
  this.flagAggregate = flagAggregate
  this.count = count
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
    p.update()
    this.update()
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
  var p = this.parent
  while(p) {
    p.update()
    p = p.parent
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
    var nn = this.right = new TreapNode(value, false, false, 1, Math.random(), this, null, null, this.next, this)
    if(this.next) {
      this.next.prev = nn
    }
    this.next = nn
    nn.bubbleUp()
    return nn
  }
  var v = this.next
  var nn = v.left = new TreapNode(value, false, false, 1, Math.random(), v, null, null, v, this)
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
  var c = a.count
  a.count = b.count
  b.count = c
  var f = a.flag
  a.flag = b.flag
  b.flag = f
  f = a.flagAggregate
  a.flagAggregate = b.flagAggregate
  b.flagAggregate = f
}

proto.update = function() {
  var c = 1
  var f = this.flag
  if(this.left) {
    c += this.left.count
    f = f || this.left.flagAggregate
  }
  if(this.right) {
    c += this.right.count
    f = f || this.right.flagAggregate
  }
  this.count = c
  this.flagAggregate = f
}

//Set new flag state and propagate up tree
proto.setFlag = function(f) {
  this.flag = f
  for(var v=this; v; v=v.parent) {
    var pstate = v.flagAggregate
    v.update()
    if(pstate === v.flagAggregate) {
      break
    }
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
    //Update all ancestor counts
    var p = node.parent
    while(p) {
      p.update()
      p = p.parent
    }
  }
  //Remove all pointers from detached node
  node.parent = node.left = node.right = node.prev = node.next = null
  node.count = 1
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
    a.update()
    return a
  } else {
    b.left = concatRecurse(a, b.left)
    b.left.parent = b
    b.update()
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
  return new TreapNode(value, false, false, 1, Math.random(), null, null, null, null, null)
}