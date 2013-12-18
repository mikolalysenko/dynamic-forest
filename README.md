dynamic-forest
==============
Maintains a spanning forest for an arbitrary undirected graph under incremental edge insertions and deletions.  Implementation based on the following algorithm:

J. Holm, K. de Lichtenberg and M. Thorrup.  ["Poly-logarithmic deterministic fully-dynamic algorithms for connectivity, minimum spanning tree, 2-edge connectivity and biconnectivity"](http://www.cs.princeton.edu/courses/archive/fall09/cos521/Handouts/polylogarithmic.pdf). 2001.  Journal of the ACM

# Example

```javascript
//Load the module
var createVertex = require("dynamic-forest")

//Create some vertices
var a = createVertex("a")
var b = createVertex("b")
var c = createVertex("c")
var d = createVertex("d")

//Print out connectivity between a and c
console.log(a.connected(c))   //Prints out "false"

//Link vertices together in a cycle
var ab = a.link(b)
var bc = b.link(c)
var cd = c.link(d)
var da = d.link(a)

//Vertices are now connected
console.log(a.connected(c))     //Prints out "true"

bc.cut()

console.log

```

# Install

```sh
npm install dynamic-forest
```

# API

```javascript
var createVertex = require("dynamic-forest")
```

## Vertices

### `var vertex = createVertex([value])`
Creates a vertex

* `value` is an optional user specified value that is stored with the vertex

**Returns** A new vertex object

### `vertex.value`
The user specified value associated to this vertex

### `vertex.adjacent`
An array of all the edges incident to this vertex

### `vertex.componentSize`
Number of vertices in the connected component containing this vertex

### `vertex.connected(other)`
Check if two vertices are connected by a path

* `other` is the other vertex to check

**Returns** `true` if there is a path connecting `vertex` to `other` within the graph

### `var edge = vertex.link(other[, value])`
Creates an edge linking `vertex` to `other` in the graph.

* `other` the vertex to link to
* `value` is an optional user specified value for the edge

**Returns** A new edge linking `vertex` to `other`

## Edges

### `edge.s`
The first vertex of the edge

### `edge.t`
The second vertex of the edge

### `edge.value`
The user-specified value associated with the edge

### `edge.cut()`
Removes the edge from the graph

# Credits
(c) 2013 Mikola Lysenko. MIT License