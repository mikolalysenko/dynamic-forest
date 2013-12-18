"use strict"

exports.insert = insertEdge
exports.remove = removeEdge
exports.level = levelIndex
exports.index = index

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

function index(list, e) {
  return bounds.eq(list, e, compareEdges)
}

function removeEdge(list, e) {
  var idx = index(list, e)
  if(idx >= 0) {
    list.splice(idx, 1)
  }
}

function levelIndex(list, i) {
  return bounds.ge(list, i, compareLevel)
}