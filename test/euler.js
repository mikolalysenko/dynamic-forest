"use strict"

var tape = require("tape")
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
      if(pe.type === "edge") {
        t.equals(ce, pe.t, "check prev-edge")
      } else {
        t.equals(ce, pe, "check prev-vert")
        t.equals(ce, ne)
        t.equals(ce, v)
        t.equals(cur.next, null)
        t.equals(cur.prev, null)
      }
      if(ne.type === "edge") {
        t.equals(ce, ne.s, "check next-edge")
      } else {
        t.equals(ce, ne, "check next-vert")
        t.equals(ce, pe)
        t.equals(ce, v)
        t.equals(cur.next, null)
        t.equals(cur.prev, null)
      }
    } else {
      t.ok(false, "check type - fail")
    }
    cur = cur.next
  }
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

  var ab = a.link(b)

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

  var ac = a.link(c)
  
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