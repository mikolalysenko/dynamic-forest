"use strict"

var tape = require("tape")
var shuffle = require("knuth-shuffle").knuthShuffle
var randomTree = require("random-tree")
var createVertex = require("../lib/euler.js")

function tourOf(v) {
  v.makeRoot()
  var cur = v.node.first()
  var list = []
  while(cur) {
    if(cur.value.type === "edge") {
      list.push([ cur.value.s.value, cur.value.t.value ])
    } else if(cur.value.type === "vertex") {
      list.push([ cur.value.value, cur.value.value ])
    }
    cur = cur.next
  }
  return list
}

function checkEulerTour(t, v) {
  var cur = v.node.first()
  var count = 0
  while(cur) {

    var prev = cur.prev || cur.last()
    var next = cur.next || cur.first()

    var pe = prev.value
    var ce = cur.value
    var ne = next.value

    t.equals(ce.node, cur)
    if(ce.type === "edge") { 
      //Verify opposite node is consistent
      var o = ce.opposite
      t.equals(o.opposite, ce, "checking opposite link")
      t.equals(o.s, ce.t, "check opposite head")
      t.equals(o.t, ce.s, "check opposite tail")
      //Check is s/t
      if(pe.type === "edge") {
        t.equals(ce.s, pe.t, "check head - e")
      } else {
        t.equals(ce.s, pe, "check head - v")
      }
      if(ne.type === "edge") {
        t.equals(ce.t, ne.s, "check tail - e")
      } else {
        t.equals(ce.t, ne, "check tail - v")
      }
    } else if(ce.type === "vertex") {
      ++count
      if(pe.type === "edge") {
        t.equals(ce, pe.t, "check prev-edge")
      } else {
        t.equals(ce, pe, "check circular connectivity singleton")
        t.equals(ce, ne, "check circular connectivity")
        t.equals(ce, v, "check circular connectivity")
        t.equals(cur.next, null, "must be root")
        t.equals(cur.prev, null, "must be root")
      }
      if(ne.type === "edge") {
        t.equals(ce, ne.s, "check next-edge")
      } else {
        t.equals(ce, pe, "check circular connectivity for singleton")
        t.equals(ce, ne, "check circular connectivity")
        t.equals(ce, v, "check circular connectivity")
        t.equals(cur.next, null, "must be root")
        t.equals(cur.prev, null, "must be root")
      }
    } else {
      t.ok(false, "check type - fail")
    }
    cur = cur.next
  }
  t.equals(v.count(), count, "checking count is consistent")
}

tape("euler-tour-tree-simple", function(t) {

  var a = createVertex("a")
  var b = createVertex("b")
  var c = createVertex("c")

  t.same(tourOf(a), [["a", "a"]])
  t.same(tourOf(b), [["b", "b"]])
  t.same(tourOf(c), [["c", "c"]])

  checkEulerTour(t, a)
  checkEulerTour(t, b)
  checkEulerTour(t, c)
  t.ok(a.path(a), "a --- a")
  t.ok(!a.path(b), "a -/- b")
  t.ok(!a.path(c), "a -/- c")
  t.ok(!b.path(a), "b -/- a")
  t.ok(b.path(b), "b --- b")
  t.ok(!b.path(c), "b -/- c")
  t.ok(!c.path(a), "c -/- a")
  t.ok(!c.path(b), "c -/- b")
  t.ok(c.path(c), "c --- c")

  var ab = a.link(b, "ab")

  t.same(tourOf(a), [["a", "b"], ["b", "b"], ["b", "a"], ["a", "a"]])
  t.same(tourOf(b), [["b", "a"], ["a", "a"], ["a", "b"], ["b", "b"]])
  t.same(tourOf(c), [["c", "c"]])

  checkEulerTour(t, a)
  checkEulerTour(t, b)
  checkEulerTour(t, c)
  t.ok(a.path(a), "a --- a")
  t.ok(a.path(b), "a --- b")
  t.ok(!a.path(c), "a -/- c")
  t.ok(b.path(a), "b --- a")
  t.ok(b.path(b), "b --- b")
  t.ok(!b.path(c), "b -/- c")
  t.ok(!c.path(a), "c -/- a")
  t.ok(!c.path(b), "c -/- b")
  t.ok(c.path(c), "c --- c")

  var ac = a.link(c, "ac")

  
  checkEulerTour(t, a)
  checkEulerTour(t, b)
  checkEulerTour(t, c)
  t.ok(a.path(a), "a --- a")
  t.ok(a.path(b), "a --- b")
  t.ok(a.path(c), "a --- c")
  t.ok(b.path(a), "b --- a")
  t.ok(b.path(b), "b --- b")
  t.ok(b.path(c), "b --- c")
  t.ok(c.path(a), "c --- a")
  t.ok(c.path(b), "c --- b")
  t.ok(c.path(c), "c --- c")

  ab.cut()

  checkEulerTour(t, a)
  checkEulerTour(t, b)
  checkEulerTour(t, c)
  t.ok(a.path(a), "a --- a")
  t.ok(!a.path(b), "a -/- b")
  t.ok(a.path(c), "a --- c")
  t.ok(!b.path(a), "b -/- a")
  t.ok(b.path(b), "b --- b")
  t.ok(!b.path(c), "b -/- c")
  t.ok(c.path(a), "c --- a")
  t.ok(!c.path(b), "c -/- b")
  t.ok(c.path(c), "c --- c")
  
  t.end()
})

tape("random-euler-tree", function(t) {
  for(var i=0; i<2; ++i) {
    var tree = randomTree(16)
    var v = new Array(16)
    var e = new Array(15)
    for(var j=0; j<16; ++j) {
      v[j] = createVertex(j)
    }
    for(var j=0; j<15; ++j) {
      var x = tree[j]
      e[j] = v[x[1]].link(v[x[0]], [x[0], x[1]])
      checkEulerTour(t, v[0])
    }
    shuffle(e)
    for(var j=0; j<15; ++j) {
      var v = e[j].s
      var u = e[j].t
      t.ok(v.path(u), "checking path connectivity before unlink")
      t.ok(u.path(v), "checking path connectivity before unlink")
      e[j].cut()
      checkEulerTour(t, v)
      checkEulerTour(t, u)
      t.ok(!v.path(u), "checking unlink successful")
      t.ok(!u.path(v), "checking unlink successful")
    }
  }
  t.end()
})
