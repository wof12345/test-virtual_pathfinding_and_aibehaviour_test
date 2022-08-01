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

// function BINARYSEARCH(arr, start, end, target, command) {
//   // console.log(command);

//   if (arr[0] > target || arr[end] < target) {
//     return false;
//   }

//   if (end >= start) {
//     let mid = Math.floor(start + (end - start) / 2);

//     if (arr[mid] === target) {
//       if (!command) return true;
//       else return mid;
//     }

//     if (arr[mid] > target)
//       return BINARYSEARCH(arr, start, mid - 1, target, command);

//     return BINARYSEARCH(arr, mid + 1, end, target, command);
//   }
//   return false;
// }

// function binaryInsert(arr, start, end, target) {
//   if (end >= start) {
//     let mid = Math.floor(start + (end - start) / 2);
//     console.log(arr[mid - 1], arr[mid + 1], target);

//     if (
//       arr[mid - 1] < target &&
//       (arr[mid + 1] > target || arr[mid + 1] === undefined) &&
//       arr[mid] > target
//     ) {
//       fixateArrays(blockades, mid, blockades[mid], blockades[mid + 1]);
//       arr[mid] = target;
//       console.log(arr[mid]);

//       return true;
//     }

//     if (arr[mid] > target) return binaryInsert(arr, start, mid - 1, target);

//     return binaryInsert(arr, mid + 1, end, target);
//   }
//   return false;
// } //dated

function simulateDFS(reference, target) {
  if (reference.closedNode.length <= 0) {
    algorithmEndingAction(target, "DFS");
    return;
  }
  let currentVisit = reference.closedNode.shift();
  illuminatePath("", [currentVisit], "rgb(255, 255, 255)");

  setTimeout(() => {
    simulateDFS(reference, target);
  }, 1);
}

function BFS(reference, target) {
  console.log(reference);

  let currentNode = reference.normalNodeIteration.shift();
  driverFunction(currentNode);

  // console.log(reference.normalNodeIteration);
  updateViews(currentNode);

  illuminatePath("", [currentNode], "rgb(255, 255, 255)");
  // console.log(`Adjacents of ${currentNode} : `, reference.gridToNodeRelations[currentNode]);
  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let currentAdjacent = reference.gridToNodeRelations[currentNode][i];

    if (
      reference.gridToNodeLevel[currentAdjacent] === -1 &&
      !BINARYSEARCH(blockades, 0, blockades.length - 1, currentAdjacent)
    ) {
      reference.gridToNodeLevel[currentAdjacent] =
        reference.gridToNodeLevel[currentNode] + 1;
      reference.normalNodeIteration.push(currentAdjacent);
      reference.parentNode[currentAdjacent] = currentNode;
      reference.gridToNodeDistanceFromSource.push(currentAdjacent);

      // console.log(reference.gridToNodeLevel[element], reference.gridToNodeLevel[currentNode], reference.closedNode);
    } else {
    }
  }
  if (currentNode === +target) {
    algorithmEndingAction(target, "");
    return;
  }
  if (reference.normalNodeIteration.length <= 0) {
    algorithmEndingAction(target, "nopath");
    return;
  }
  setTimeout(() => {
    BFS(reference, target);
  }, 0.1);
}

function DFS(reference, currentSource, parent, target) {
  driverFunction(currentSource);
  // console.log(reference.currentSource, target);
  // reference.tsSortstartTime[currentSource] = reference.timeVar++;
  reference.closedNode.push(currentSource);
  // console.log(currentSource, parent);
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
        !BINARYSEARCH(blockades, 0, blockades.length - 1, currentAdjacent)
      ) {
        reference.gridToNodeLevel[currentAdjacent] = 1;
        reference.parentNode[currentAdjacent] = currentSource;
        updateViews(currentAdjacent);

        DFS(reference, currentAdjacent, currentSource, target);
      } else if (
        currentAdjacent !== parent &&
        reference.gridToNodeDistanceFromSource[currentAdjacent] !== 2
      ) {
        reference.cycles++;
      }
    }

    reference.gridToNodeLevel[currentSource] = 2;
    // illuminatePath('override', [currentSource], 'yellow');
    // reference.tsSortendTime[currentSource] = reference.timeVar++;
  }
}

function Dijkstra(reference, target) {
  console.log(reference);

  if (reference.pqForPathfinding.isEmpty()) {
    algorithmEndingAction(target, "nopath");
    return;
  }
  let currentNode = +reference.pqForPathfinding.front().element;
  driverFunction(currentNode);
  reference.pqForPathfinding.remove();
  if (currentNode == target) {
    algorithmEndingAction(target, "");
    return;
  }
  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let neighborNode = +reference.gridToNodeRelations[currentNode][i];
    let weightToNode = +reference.gridToNodeWeights[currentNode][i];
    illuminatePath("", [currentNode], "rgb(255, 255, 255)");
    if (
      reference.gridToNodeDistanceFromSource[currentNode] + weightToNode <
        reference.gridToNodeDistanceFromSource[neighborNode] &&
      !BINARYSEARCH(blockades, 0, blockades.length - 1, neighborNode)
    ) {
      updateViews(neighborNode);
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
    algorithmEndingAction(target, "nopath");
    return;
  }
  currentNode = +reference.pqForPathfinding.front().element;

  // timer("start");
  driverFunction(currentNode);
  // console.log("Driver Complexity : ", timer("stop"));

  reference.pqForPathfinding.remove();
  reference.closedNode.push(currentNode);
  if (currentNode == target) {
    algorithmEndingAction(target, "");
    return;
  }

  // timer("start");
  illuminatePath("", [currentNode], "rgb(255, 255, 255)");
  // console.log("Single illumination Complexity : ", timer("stop"));

  for (let i = 0; i < reference.gridToNodeRelations[currentNode].length; i++) {
    let neighborNode = +reference.gridToNodeRelations[currentNode][i];

    // timer("start");
    let element = document.getElementById(neighborNode);
    let elementColor = element.style.backgroundColor + "";
    // console.log("Dom traversal Complexity", timer("stop"));

    // timer("start");
    // let bool = !BINARYSEARCH(blockades, 0, blockades.length - 1, neighborNode);
    // console.log(timer("stop"));

    // console.log(elementColor);

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
      updateViews(neighborNode);
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
