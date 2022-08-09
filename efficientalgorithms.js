function swap(input, xp, yp) {
  temp = input[xp];
  input[xp] = input[yp];
  input[yp] = temp;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}

function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function simulateDFS(reference, target) {
  if (reference.closedNode.length <= 0) {
    reference.algorithmEndingAction(target, "DFS");
    return;
  }
  let currentVisit = reference.closedNode.shift();

  if (reference.isPlayer)
    illuminatePath(reference, "", [currentVisit], "rgb(255, 255, 255)");

  setTimeout(() => {
    simulateDFS(reference, target);
  }, 1);
}

function BFSrangeGen(reference, node, looped = 0, range) {
  // console.log(range);
  if (range === 2) {
    range = 8;
  } else if (range === 3) {
    range = 25;
  } else if (range === 4) {
    range = 50;
  } else if (range === 5) {
    range = 82;
  }

  // console.log(reference.normalNodeIterationRange);
  if (!looped) reference.normalNodeIterationRange.push(node);

  let currentNode = reference.normalNodeIterationRange.shift();
  // console.log("main : ", currentNode);

  // reference.rangeSet.push(currentNode, currentNode);
  let currentRangeArray = [];

  currentRangeArray = driverFunction(reference, currentNode, 1, range);
  // if (reference.isPlayer) console.log("arrrange", currentRangeArray);

  for (let i = 0; i < currentRangeArray.length; i++) {
    let currentAdjacent = currentRangeArray[i];
    // console.log("neigNode", reference.gridToNodeLevelRange);
    if (currentAdjacent <= numOfGrid && currentAdjacent >= 0) {
      if (reference.gridToNodeLevelRange[currentAdjacent] === -1) {
        reference.gridToNodeLevelRange[currentAdjacent] =
          reference.gridToNodeLevelRange[currentNode] + 1;
        reference.normalNodeIterationRange.push(currentAdjacent);
      }
    }
    // console.log("Normal it :", reference.normalNodeIterationRange);
  }

  if (looped === range) {
    let range = PQtoArray(reference.rangeSet.printPQueue());
    reference.range = range;
    // console.log("loopLog:", range);

    fillerController(reference, "fill", reference.colorCode, "1");
    return reference.rangeSet;
  }
  looped++;

  BFSrangeGen(reference, node, looped, range);
}

function BFS(reference, target) {
  //traversal method. Given a source node and a target node checks all of the source node's neighbors
  //to traverse the graph

  let currentNode = reference.normalNodeIteration.shift();

  driverFunction(reference, currentNode);

  if (reference.isPlayer) {
    illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");
    updateViews(reference, currentNode);
  }

  // console.log(`Adjacents of ${currentNode} : `, reference.gridToNodeRelations[currentNode]);

  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let currentAdjacent = reference.gridToNodeRelations[currentNode][i];
    // console.log(currentAdjacent);

    if (
      reference.gridToNodeLevel[currentAdjacent] === -1 &&
      !BINARYSEARCH(
        currentGridInfo.blockades,
        0,
        currentGridInfo.blockades.length - 1,
        currentAdjacent
      )
    ) {
      reference.gridToNodeLevel[currentAdjacent] =
        reference.gridToNodeLevel[currentNode] + 1;
      reference.normalNodeIteration.push(currentAdjacent);
      reference.parentNode[currentAdjacent] = currentNode;
      reference.gridToNodeDistanceFromSource.push(currentAdjacent);
    }
  }

  if (currentNode === +target) {
    reference.algorithmEndingAction(target, "");
    return;
  }

  if (reference.normalNodeIteration.length <= 0) {
    reference.algorithmEndingAction(target, "nopath");
    return;
  }

  setTimeout(() => {
    BFS(reference, target);
  }, 0.2);
}

function DFS(reference, currentSource, parent, target) {
  //traversal method. Given a source node and a target node checks one of the source node's neighbors and does the same until the last connected node then repeats the same for
  //rest of the source's neighbors
  //to traverse the graph
  driverFunction(reference, currentSource);
  reference.closedNode.push(currentSource);
  if (currentSource === +target) {
    simulateDFS(reference, target);
    reference.traversalDone = true;
    return;
  }

  if (!reference.traversalDone) {
    for (
      let i = 0;
      i < reference.gridToNodeRelations[currentSource].length;
      i++
    ) {
      let currentAdjacent = reference.gridToNodeRelations[currentSource][i];
      if (
        reference.gridToNodeLevel[currentAdjacent] === -1 &&
        !BINARYSEARCH(
          currentGridInfo.blockades,
          0,
          currentGridInfo.blockades.length - 1,
          currentAdjacent
        )
      ) {
        reference.gridToNodeLevel[currentAdjacent] = 1;
        reference.parentNode[currentAdjacent] = currentSource;
        if (reference.isPlayer) updateViews(reference, currentAdjacent);

        DFS(reference, currentAdjacent, currentSource, target);
      } else if (
        currentAdjacent !== parent &&
        reference.gridToNodeDistanceFromSource[currentAdjacent] !== 2
      ) {
        reference.cycles++;
      }
    }

    reference.gridToNodeLevel[currentSource] = 2;
  }
}

function Dijkstra(reference, target) {
  //uses BFS to compare Edge weights and distance to find the shortest path to target
  // console.log(reference);

  if (reference.pqForPathfinding.isEmpty()) {
    reference.algorithmEndingAction(target, "nopath");
    return;
  }
  let currentNode = +reference.pqForPathfinding.front().element;

  driverFunction(reference, currentNode);

  reference.pqForPathfinding.remove();
  if (currentNode == target) {
    reference.algorithmEndingAction(target, "");
    return;
  }
  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let neighborNode = +reference.gridToNodeRelations[currentNode][i];
    let weightToNode = +reference.gridToNodeWeights[currentNode][i];

    if (
      reference.gridToNodeDistanceFromSource[currentNode] + weightToNode <
        reference.gridToNodeDistanceFromSource[neighborNode] &&
      !BINARYSEARCH(
        currentGridInfo.blockades,
        0,
        currentGridInfo.blockades.length - 1,
        neighborNode
      )
    ) {
      reference.gridToNodeDistanceFromSource[neighborNode] =
        reference.gridToNodeDistanceFromSource[currentNode] + weightToNode;
      reference.pqForPathfinding.push(
        neighborNode,
        reference.gridToNodeDistanceFromSource[neighborNode]
      );
      reference.parentNode[neighborNode] = currentNode;
    }
  }

  if (reference.isPlayer) {
    illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");
    updateViews(reference, currentNode);
  }

  setTimeout(() => {
    reference.gridToNodeLevel[currentNode] = reference.gridToNodeLevel[
      currentNode
    ]++;
    reference.closedNode.push(currentNode);
    Dijkstra(reference, target);
  }, 0.1);
}

function Astar(reference, target) {
  //uses a heuristic to find the most optimal (not shortest) path to target. Way faster than Dijkstra

  if (reference.pqForPathfinding.isEmpty()) {
    reference.algorithmEndingAction(target, "nopath");
    return;
  }
  let currentNode = +reference.pqForPathfinding.front().element;

  // timer("start");
  driverFunction(reference, currentNode);
  // console.log("Driver Complexity : ", timer("stop"));

  reference.pqForPathfinding.remove();
  reference.closedNode.push(currentNode);
  if (currentNode == target) {
    reference.algorithmEndingAction(target, "");
    return;
  }

  // timer("start");
  if (reference.isPlayer)
    illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");
  // console.log("Single illumination Complexity : ", timer("stop"));

  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let neighborNode = +reference.gridToNodeRelations[currentNode][i];

    // timer("start");
    let element = document.getElementById(neighborNode);
    let elementColor = element.style.backgroundColor + "";
    // console.log("Dom traversal Complexity", timer("stop"));

    let gCost = calculateDistance(reference.currentSource, neighborNode);
    let hCost = calculateDistance(neighborNode, target);
    let fCost = gCost + hCost; //sum of traversal cost for current node from source and current node to target

    if (
      fCost < reference.gridToNodeDistanceFromSource[neighborNode] &&
      elementColor !== "rgb(0, 0, 0)" &&
      !BINARYSEARCH(
        reference.closedNode,
        0,
        reference.closedNode.length - 1,
        neighborNode
      )
    ) {
      if (reference.isPlayer) updateViews(reference, neighborNode);
      reference.gridToNodeDistanceFromSource[neighborNode] = fCost;
      reference.pqForPathfinding.push(neighborNode, hCost);
      reference.parentNode[neighborNode] = currentNode;
    } else {
    }
  }

  setTimeout(() => {
    reference.gridToNodeLevel[currentNode] = reference.gridToNodeLevel[
      currentNode
    ]++;
    Astar(reference, target);
  }, 0.1);
}

function BellmanFord(reference, target, foundpath = false) {
  // Relax all edges |V| - 1 times. A simple
  // shortest path from src to any other
  // vertex can have at-most |V| - 1 edges

  if (reference.pqForPathfinding.isEmpty()) {
    // reference.algorithmEndingAction(target, "nopath");
    for (let i = 1; i <= reference.gridToNodeRelations.length - 1; i++) {
      if (i === 1) console.log(reference.gridToNodeRelations);

      // console.log(i);

      let x = reference.gridToNodeRelations[i][0];
      let y = reference.gridToNodeRelations[i][1];
      let weight = reference.gridToNodeWeights[i];
      if (
        reference.gridToNodeDistanceFromSource[x] != Infinity &&
        reference.gridToNodeDistanceFromSource[x] + weight <
          reference.gridToNodeDistanceFromSource[y]
      )
        console.log("Graph contains negative weight cycle");
    }

    console.log("Vertex Distance from Source");
    for (let i = 1; i <= numOfGrid; i++)
      console.log(i, reference.gridToNodeDistanceFromSource[i]);
    return;
  }
  let currentNode = +reference.pqForPathfinding.front().element;

  driverFunction(reference, currentNode);

  reference.pqForPathfinding.remove();
  if (currentNode == target) {
    reference.algorithmEndingAction(target, "");
    // return;
  }

  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let neighborNode = +reference.gridToNodeRelations[currentNode][i];
    let weightToNode = +reference.gridToNodeWeights[currentNode][i];

    if (
      reference.gridToNodeDistanceFromSource[currentNode] + weightToNode <
        reference.gridToNodeDistanceFromSource[neighborNode] &&
      !BINARYSEARCH(
        currentGridInfo.blockades,
        0,
        currentGridInfo.blockades.length - 1,
        neighborNode
      )
    ) {
      illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");

      reference.gridToNodeDistanceFromSource[neighborNode] =
        reference.gridToNodeDistanceFromSource[currentNode] + weightToNode;
      reference.pqForPathfinding.push(
        neighborNode,
        reference.gridToNodeDistanceFromSource[neighborNode]
      );

      if (!foundpath) reference.parentNode[neighborNode] = currentNode;
    }
  }

  if (reference.isPlayer) {
    illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");
    updateViews(reference, currentNode);
  }
  // check for negative-weight cycles.
  // The above step guarantees shortest
  // distances if graph doesn't contain
  // negative weight cycle.  If we get a
  // shorter path, then there is a cycle.

  setTimeout(() => {
    reference.gridToNodeLevel[currentNode] = reference.gridToNodeLevel[
      currentNode
    ]++;
    reference.closedNode.push(currentNode);
    BellmanFord(reference, target, foundpath);
  }, 0.1);
}
