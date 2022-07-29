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

function binarySearch(arr, start, end, target, command) {
  // console.log(command);

  if (arr[0] > target || arr[end] < target) {
    return false;
  }

  if (end >= start) {
    let mid = Math.floor(start + (end - start) / 2);

    if (arr[mid] === target) {
      if (!command) return true;
      else return mid;
    }

    if (arr[mid] > target)
      return binarySearch(arr, start, mid - 1, target, command);

    return binarySearch(arr, mid + 1, end, target, command);
  }
  return false;
}

function binaryInsert(arr, start, end, target) {
  if (end >= start) {
    let mid = Math.floor(start + (end - start) / 2);
    console.log(arr[mid - 1], arr[mid + 1], target);

    if (
      arr[mid - 1] < target &&
      (arr[mid + 1] > target || arr[mid + 1] === undefined) &&
      arr[mid] > target
    ) {
      fixateArrays(blockades, mid, blockades[mid], blockades[mid + 1]);
      arr[mid] = target;
      console.log(arr[mid]);

      return true;
    }

    if (arr[mid] > target) return binaryInsert(arr, start, mid - 1, target);

    return binaryInsert(arr, mid + 1, end, target);
  }
  return false;
}

function simulateDFS(target) {
  if (currentGridInfo.closedNode.length <= 0) {
    algorithmEndingAction(target, "DFS");
    return;
  }
  let currentVisit = currentGridInfo.closedNode.shift();
  illuminatePath("", [currentVisit], "rgb(255, 255, 255)");

  setTimeout(() => {
    simulateDFS(target);
  }, 1);
}

function BFS(target) {
  let currentNode = currentGridInfo.normalNodeIteration.shift();
  driverFunction(currentNode);

  // console.log(currentGridInfo.normalNodeIteration);
  updateViews(currentNode);

  illuminatePath("", [currentNode], "rgb(255, 255, 255)");
  // console.log(`Adjacents of ${currentNode} : `, currentGridInfo.gridToNodeRelations[currentNode]);
  for (
    let i = 0;
    i < currentGridInfo.gridToNodeRelations[currentNode].length;
    i++
  ) {
    let currentAdjacent = currentGridInfo.gridToNodeRelations[currentNode][i];

    if (
      currentGridInfo.gridToNodeLevel[currentAdjacent] === -1 &&
      !binarySearch(blockades, 0, blockades.length - 1, currentAdjacent)
    ) {
      currentGridInfo.gridToNodeLevel[currentAdjacent] =
        currentGridInfo.gridToNodeLevel[currentNode] + 1;
      currentGridInfo.normalNodeIteration.push(currentAdjacent);
      currentGridInfo.parentNode[currentAdjacent] = currentNode;
      currentGridInfo.gridToNodeDistanceFromSource.push(currentAdjacent);

      // console.log(currentGridInfo.gridToNodeLevel[element], currentGridInfo.gridToNodeLevel[currentNode], currentGridInfo.closedNode);
    } else {
    }
  }
  if (currentNode === +target) {
    algorithmEndingAction(target, "");
    return;
  }
  if (currentGridInfo.normalNodeIteration.length <= 0) {
    algorithmEndingAction(target, "nopath");
    return;
  }
  setTimeout(() => {
    BFS(target);
  }, 0.1);
}

function DFS(currentSource, parent, target) {
  driverFunction(currentSource);
  // console.log(currentGridInfo.currentSource, target);
  // currentGridInfo.tsSortstartTime[currentSource] = currentGridInfo.timeVar++;
  currentGridInfo.closedNode.push(currentSource);
  // console.log(currentSource, parent);
  if (currentSource === +target) {
    simulateDFS(target);
    currentGridInfo.traversalDone = true;
    return;
  }

  if (!currentGridInfo.traversalDone) {
    for (
      let i = 0;
      i < currentGridInfo.gridToNodeRelations[currentSource].length;
      i++
    ) {
      let currentAdjacent =
        currentGridInfo.gridToNodeRelations[currentSource][i];
      if (
        currentGridInfo.gridToNodeLevel[currentAdjacent] === -1 &&
        !binarySearch(blockades, 0, blockades.length - 1, currentAdjacent)
      ) {
        currentGridInfo.gridToNodeLevel[currentAdjacent] = 1;
        currentGridInfo.parentNode[currentAdjacent] = currentSource;
        updateViews(currentAdjacent);

        DFS(currentAdjacent, currentSource, target);
      } else if (
        currentAdjacent !== parent &&
        currentGridInfo.gridToNodeDistanceFromSource[currentAdjacent] !== 2
      ) {
        currentGridInfo.cycles++;
      }
    }

    currentGridInfo.gridToNodeLevel[currentSource] = 2;
    // illuminatePath('override', [currentSource], 'yellow');
    // currentGridInfo.tsSortendTime[currentSource] = currentGridInfo.timeVar++;
  }
}

function Dijkstra(target) {
  if (currentGridInfo.pqForPathfinding.isEmpty()) {
    algorithmEndingAction(target, "nopath");
    return;
  }
  let currentNode = +currentGridInfo.pqForPathfinding.front().element;
  driverFunction(currentNode);
  currentGridInfo.pqForPathfinding.remove();
  if (currentNode == target) {
    algorithmEndingAction(target, "");
    return;
  }
  for (
    let i = 0;
    i < currentGridInfo.gridToNodeRelations[currentNode].length;
    i++
  ) {
    let neighborNode = +currentGridInfo.gridToNodeRelations[currentNode][i];
    let weightToNode = +currentGridInfo.gridToNodeWeights[currentNode][i];
    illuminatePath("", [currentNode], "rgb(255, 255, 255)");
    if (
      currentGridInfo.gridToNodeDistanceFromSource[currentNode] + weightToNode <
        currentGridInfo.gridToNodeDistanceFromSource[neighborNode] &&
      !binarySearch(blockades, 0, blockades.length - 1, neighborNode)
    ) {
      updateViews(neighborNode);
      currentGridInfo.gridToNodeDistanceFromSource[neighborNode] =
        currentGridInfo.gridToNodeDistanceFromSource[currentNode] +
        weightToNode;
      currentGridInfo.pqForPathfinding.push(
        neighborNode,
        currentGridInfo.gridToNodeDistanceFromSource[neighborNode]
      );
      currentGridInfo.parentNode[neighborNode] = currentNode;
    } else {
    }
  }
  setTimeout(() => {
    currentGridInfo.gridToNodeLevel[currentNode] = currentGridInfo
      .gridToNodeLevel[currentNode]++;
    currentGridInfo.closedNode.push(currentNode);
    Dijkstra(target);
  }, 0.1);
}

function Astar(target) {
  let currentNode;

  if (currentGridInfo.pqForPathfinding.isEmpty()) {
    algorithmEndingAction(target, "nopath");
    return;
  }
  currentNode = +currentGridInfo.pqForPathfinding.front().element;

  // timer("start");
  driverFunction(currentNode);
  // console.log("Driver Complexity : ", timer("stop"));

  currentGridInfo.pqForPathfinding.remove();
  currentGridInfo.closedNode.push(currentNode);
  if (currentNode == target) {
    algorithmEndingAction(target, "");
    return;
  }

  // timer("start");
  illuminatePath("", [currentNode], "rgb(255, 255, 255)");
  // console.log("Single illumination Complexity : ", timer("stop"));

  for (
    let i = 0;
    i < currentGridInfo.gridToNodeRelations[currentNode].length;
    i++
  ) {
    let neighborNode = +currentGridInfo.gridToNodeRelations[currentNode][i];

    // timer("start");
    let element = document.getElementById(neighborNode);
    let elementColor = element.style.backgroundColor + "";
    // console.log("Dom traversal Complexity", timer("stop"));

    // timer("start");
    // let bool = !binarySearch(blockades, 0, blockades.length - 1, neighborNode);
    // console.log(timer("stop"));

    // console.log(elementColor);

    let gCost = calculateDistance(currentGridInfo.currentSource, neighborNode);
    let hCost = calculateDistance(neighborNode, target);
    let fCost = gCost + hCost;

    if (
      fCost < currentGridInfo.gridToNodeDistanceFromSource[neighborNode] &&
      elementColor !== "rgb(0, 0, 0)" &&
      !binarySearch(
        currentGridInfo.closedNode,
        0,
        currentGridInfo.closedNode.length - 1,
        neighborNode
      )
    ) {
      updateViews(neighborNode);
      currentGridInfo.gridToNodeDistanceFromSource[neighborNode] = fCost;
      currentGridInfo.pqForPathfinding.push(neighborNode, hCost);
      currentGridInfo.parentNode[neighborNode] = currentNode;
    } else {
    }
  }

  setTimeout(() => {
    currentGridInfo.gridToNodeLevel[currentNode] = currentGridInfo
      .gridToNodeLevel[currentNode]++;
    Astar(target);
  }, 0.1);
}
