"use strict"

exports.insert = insertEdge
exports.remove = removeEdge
exports.level = levelIndex

var bounds = require("binary-search-bounds")

function compareEdges(a, b) {
  var d = a.level - b.level
  if(d) {
    return d
  }
  return a.key - b.key
}

function compareLevel(a, i) {
  return a.level - i
}

function insertEdge(list, e) {
  list.splice(bounds.gt(list, e, compareEdges), 0, e)
}

function removeEdge(list, e) {
  var idx = bounds.eq(list, e, compareEdges)
  if(idx >= 0) {
    list.splice(idx, 1)
  }
}

function levelIndex(list, i) {
  return bounds.gt(list, i, compareLevel)
}