"use strict"

var createVertex = require("../dgraph.js")

var tape = require("tape")

tape("dynamic-graph-simple", function(t) {

  var a = createVertex("a")
  var b = createVertex("b")
  var c = createVertex("c")
  var d = createVertex("d")

  var ab = a.link(b)
  var ac = a.link(c)
  var cd = c.link(d)
  var bc = b.link(c)

  console.log(c)
  ab.cut()
  console.log(c)


  t.end()
})