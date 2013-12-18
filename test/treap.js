"use strict"

var tape = require("tape")
var treap = require("../lib/treap.js")

function checkTreap(t, treap) {
  var root = treap.root()
  //Check priorities, generate inorder list
  var list = []
  function visitRec(node, parent) {
    var c = 1, f = node.flag
    t.equals(node.root(), root)
    t.equals(node.parent, parent, "checking parent of " +  node.value + " expect " + (parent ? parent.value : "null"))
    if(node.left) {
      t.ok(node.left.priority > node.priority, "checking left priority dominance of " + node.value)
      t.ok(node.prev, node.value + " has a prev node")
      var r = visitRec(node.left, node)
      c += r[0]
      f = f || r[1]
    }
    list.push(node)
    if(node.right) {
      t.ok(node.right.priority > node.priority, "checking right priority dominance of " + node.value)
      t.ok(node.next, node.value + " has a next node")
      var r = visitRec(node.right, node)
      c += r[0]
      f = f || r[1]
    }
    t.equals(c, node.count, "checking count")
    t.equals(f, node.flagAggregate, "checking flagAggregate")
    return [c, f]
  }
  var n = visitRec(root, null)
  t.equals(n[0], list.length, "checking total count")
  t.equals(n[1], list.some(function(v) { v.flag }), "checking flag")
  //Check linked list and tree are consistent
  for(var i=0; i<list.length; ++i) {
    if(i > 0) {
      t.equals(list[i].prev, list[i-1], list[i].value + " prev pointer")
    } else {
      t.equals(list[i].prev, null, "first item")
      t.equals(list[i].left, null, "no left ptr for first")
    }
    if(i < list.length-1) {
      t.equals(list[i].next, list[i+1], list[i].value + " next pointer")
    } else {
      t.equals(list[i].next, null, "last item")
      t.equals(list[i].right, null, "no right ptr for last")
    }
  }
  t.equals(treap.first(), list[0], "first matches")
  t.equals(treap.last(), list[list.length-1], "last matches")
}

function treapItems(treap) {
  var list = []
  function visit(node) {
    if(node.left) {
      visit(node.left)
    }
    list.push(node.value)
    if(node.right) {
      visit(node.right)
    }
  }
  visit(treap.root())
  return list
}

tape("treap-basic", function(t) {

  var a = treap("a")
  var b = a.insert("b")
  var c = b.insert("c")

  checkTreap(t, a)
  t.same(treapItems(a), ["a", "b", "c"])
  
  b.remove()
  checkTreap(t, a)
  t.same(treapItems(a), ["a", "c"])

  a.remove()
  checkTreap(t, c)
  t.same(treapItems(c), ["c"])

  var d = c.insert("d")
  var e = d.insert("e")
  var f = e.insert("f")
  checkTreap(t, c)
  t.same(treapItems(c), ["c", "d", "e", "f"])
  
  d.remove()
  checkTreap(t, c)
  t.same(treapItems(c), ["c", "e", "f"])

  t.end()
})

tape("treap-random", function(t) {
  //Build a random treap
  var x = treap(-1)
  var nodes = [x]
  var list = [-1]
  for(var i=0; i<100; ++i) {
    var h = (Math.random() * list.length)|0
    var n = nodes[h]
    nodes.splice(h, 0, n.insert(i))
    list.splice(h, 0, i)
    if(i % 20 === 0) {
      checkTreap(t, x)
      var values = nodes.map(function(v) { return v.value })
      t.same(values, list)
    }
  }
  checkTreap(t, x)
  var values = nodes.map(function(v) { return v.value })
  t.same(values, list)
  for(var i=0; i<100; ++i) {
    var h = (Math.random() * list.length)|0
    var n = nodes[h]
    n.remove()
    nodes.splice(h, 1)
    list.splice(h, 1)

    if(i % 20 === 0) {
      checkTreap(t, nodes[0])
      var values = nodes.map(function(v) { return v.value })
      t.same(values, list)
    }
  }
  checkTreap(t, nodes[0])
  var values = nodes.map(function(v) { return v.value })
  t.same(values, list)
  t.end()
})

tape("treap-merge-split-simple", function(t) {
  var x = treap(0)
  var list = [ 0 ]
  var nodes = [x]
  for(var i=1; i<10; ++i) {
    list.push(i)
    nodes.push(nodes[i-1].insert(i))
  }
  checkTreap(t, x)
  t.same(treapItems(x), list)

  for(var i=0; i<9; ++i) {
    var lo = list.slice(0, i+1)
    var hi = list.slice(i+1)

    var x = nodes[i]
    var y = x.split()
    
    checkTreap(t, x)
    t.same(treapItems(x), lo)
    checkTreap(t, y)
    t.same(treapItems(y), hi)
    y.concat(x)
    checkTreap(t, y)
    t.same(treapItems(y), hi.concat(lo))
    y = nodes[nodes.length-1]
    x = y.split()
    checkTreap(t, x)
    t.same(treapItems(x), lo)
    checkTreap(t, y)
    t.same(treapItems(y), hi)
    x.concat(y)    
    checkTreap(t, x)
    t.same(treapItems(x), list)
  }

  var y = treap("a")
  y.last().insert("b")
  y.last().insert("c")
  checkTreap(t, y)
  t.same(treapItems(y), ["a", "b", "c"])

  x.concat(y)
  checkTreap(t, x)
  t.same(treapItems(x), [0,1,2,3,4,5,6,7,8,9,"a","b","c"])

  x = nodes[nodes.length-1]
  y = x.split()

  checkTreap(t, y)
  checkTreap(t, x)
  t.same(treapItems(x), list)

  t.end()
})
