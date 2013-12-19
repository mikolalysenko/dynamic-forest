"use strict"

exports.treapToList = treapToList
exports.treapToEuler = treapToEuler

function treapToList(treap) {
  if(!treap) {
    return []
  }
  var l = []
  for(var cur=treap.first(); cur; cur=cur.next) {
    l.push(cur.value)
  }
  return l
}

function treapToEuler(treap) {
  return treapToList(treap).map(function(v) { return v.value })
}