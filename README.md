dynamic-forest
==============
Maintains a spanning forest for an arbitrary undirected graph under incremental edge insertions and deletions.  Implementation based on the following algorithm:

J. Holm, K. de Lichtenberg and M. Thorrup.  ["Poly-logarithmic deterministic fully-dynamic algorithms for connectivity, minimum spanning tree, 2-edge connectivity and biconnectivity"](http://www.cs.princeton.edu/courses/archive/fall09/cos521/Handouts/polylogarithmic.pdf). 2001.  Journal of the ACM

Connectivity queries can be answered in `O(log(size of component))`, and updates take `O(log(number of vertices)^2)` time.  The total space complexity is `O((number of edges + number of vertices) * log(number of vertices))`.

This code works both in node.js and in the browser using [browserify](http://browserify.org/).

[![testling badge](https://ci.testling.com/mikolalysenko/dynamic-forest.png)](https://ci.testling.com/mikolalysenko/dynamic-forest)

[![build status](https://secure.travis-ci.org/mikolalysenko/dynamic-forest.png)](http://travis-ci.org/mikolalysenko/dynamic-forest)

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

//Cut the edge between b and c
bc.cut()

//Still connected
console.log(a.connected(c))    //Prints "true"

//Cut edge between a and d
da.cut()

//Finally a and c are disconnected
console.log(a.connected(c))   //Prints "false"
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

### `vertex.valueOf()`
The user specified value associated to this vertex

### `vertex.adjacent`
An array of all the edges incident to this vertex


### `var edge = vertex.link(other[, value])`
Creates an edge linking `vertex` to `other` in the graph.

* `other` the vertex to link to
* `value` is an optional user specified value for the edge

**Returns** A new edge linking `vertex` to `other`

**Complexity** `O(log(number of vertices))`, but amortized `O(log(number of vertices)^2)`

### `vertex.connected(other)`
Check if two vertices are connected by a path

* `other` is the other vertex to check

**Complexity** `O(log(size of component))`

**Returns** `true` if there is a path connecting `vertex` to `other` within the graph

### `vertex.cut()`
Disconnects the vertex from the rest of the graph

### `vertex.componentSize()`
Number of vertices in the connected component containing this vertex

### `var iterator = vertex.component()`
Returns an iterator for the connected component containing the vertex

## Edges

### `edge.s`
The first vertex of the edge

### `edge.t`
The second vertex of the edge

### `edge.valueOf()`
The user-specified value associated with the edge

### `edge.cut()`
Removes the edge from the graph

**Time Complexity** `O(log(number of vertices)^2)` amortized

## Component Iterator

The component iterator object supports fast traversal of connected components within the graph.

### `iterator.vertex()`
Returns the vertex at the position of the iteroator

### `iterator.size()`
Returns the number of vertices in the connected component

### `iterator.valid()`
Returns `true` if the iterator is valid or not

### `iterator.next()`
Advances the iterator to the next position

### `iterator.hasNext()`
Returns true if iterator has a successor

### `iterator.prev()`
Moves iterator back one vertex

### `iterator.hasPrev()`
Returns true if iterator has a predecessor

### `iterator.first()`
Move iterator to first vertex in component

### `iterator.last()`
Advance iterator to last vertex in component

# Credits
(c) 2013 Mikola Lysenko. MIT License