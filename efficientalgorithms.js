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

function BFS(reference, target) {
  // console.log(reference);

  let currentNode = reference.normalNodeIteration.shift();
  driverFunction(reference, currentNode);

  // console.log(reference.normalNodeIteration);
  if (reference.isPlayer) updateViews(reference, currentNode);

  if (reference.isPlayer)
    illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");

  // console.log(`Adjacents of ${currentNode} : `, reference.gridToNodeRelations[currentNode]);
  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let currentAdjacent = reference.gridToNodeRelations[currentNode][i];

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
    } else {
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
  }, 0.1);
}

function DFS(reference, currentSource, parent, target) {
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

    if (reference.isPlayer)
      illuminatePath(reference, "", [currentNode], "rgb(255, 255, 255)");

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
      if (reference.isPlayer) updateViews(reference, neighborNode);

      reference.gridToNodeDistanceFromSource[neighborNode] =
        reference.gridToNodeDistanceFromSource[currentNode] + weightToNode;
      reference.pqForPathfinding.push(
        neighborNode,
        reference.gridToNodeDistanceFromSource[neighborNode]
      );
      reference.parentNode[neighborNode] = currentNode;
    } else {
    }
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
  let currentNode;

  if (reference.pqForPathfinding.isEmpty()) {
    reference.algorithmEndingAction(target, "nopath");
    return;
  }
  currentNode = +reference.pqForPathfinding.front().element;

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
    let fCost = gCost + hCost;

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
