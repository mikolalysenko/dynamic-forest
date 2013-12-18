"use strict"

var createVertex = require("../dgraph.js")

var tape = require("tape")

tape("dynamic-graph-simple", function(t) {

  var a = createVertex("a")
  var b = createVertex("b")
  var c = createVertex("c")
  var d = createVertex("d")

  var ab = a.link(b, "ab")
  var bc = b.link(c, "bc")
  var cd = c.link(d, "cd")
  
  bc.cut()
  console.log(a)

  t.end()
})