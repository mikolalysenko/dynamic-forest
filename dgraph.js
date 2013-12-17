"use strict"

module.exports = createGraph

function Forest(roots) {
  this.roots = roots
}

function Graph(vertices, forests) {
  this.vertices = vertices
  this.forests = forests
}

function Vertex(incidence, euler) {
  this.incidence = incidence
  this._euler = euler
}

function Edge(u, v, level) {
  this.u = u
  this.v = v
  this._level = level
}
