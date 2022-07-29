function generateRandomNumber(array, lowerrange, upperrange) {
  let seed = Math.floor(
    Math.random() * (upperrange - lowerrange + 1) + lowerrange - 1
  );
  // console.log(seed, !binarySearch(array, 0, array.length - 1, seed));
  debugVars.currentIteration++;
  if (debugVars.currentIteration > 50) {
    debugVars.currentIteration = 0;
    return NaN;
  }

  if (!binarySearch(array, 0, array.length - 1, seed) && seed >= lowerrange) {
    // console.log(seed);
    debugVars.currentIteration = 0;
    return seed;
  } else {
    generateRandomNumber(array, lowerrange, upperrange);
  }
}

function stringyfyPQ(PQ) {
  let tempArr = [];
  // console.log(PQ);
  PQ.split(" ").forEach((elm) => {
    if (elm !== "" && elm !== " " && elm !== "NaN") tempArr.push(+elm);
  });

  return tempArr;
}

function PQfyArray(PQ, array) {
  // console.log(PQ);
  PQ.removeAll();
  for (let i = 0; i < array.length; i++) {
    PQ.push(array[i], array[i]);
  }
}

function fixateArrays(array, fromIndex, from, nextElm) {
  if (fromIndex >= array.length || from === undefined) return;

  // console.log(from, nextElm);

  array[fromIndex + 1] = from;
  fixateArrays(array, fromIndex + 1, nextElm, array[fromIndex + 2]);
}

function fixPath(collection) {
  let temp = collection.shift();
  collection.push(temp);
}

function updatePosition() {
  let temp1 = background.offsetTop;
  let temp2 = background.offsetLeft;

  gridStats.fixerVarLeft = temp2;
  gridStats.fixerVarTop = temp1;
}

function updateNeighParams() {
  neighborParams.left = [
    -gridStats.columns,
    -(gridStats.columns - 1),
    1,
    gridStats.columns + 1,
    gridStats.columns,
  ];
  neighborParams.middle = [
    -(gridStats.columns + 1),
    -gridStats.columns,
    -(gridStats.columns - 1),
    -1,
    1,
    gridStats.columns - 1,
    gridStats.columns,
    gridStats.columns + 1,
  ];
  neighborParams.right = [
    -(gridStats.columns + 1),
    -gridStats.columns,
    -1,
    gridStats.columns,
    gridStats.columns - 1,
  ];
  neighborParams.left4Dir = [-gridStats.columns, 1, gridStats.columns];
  neighborParams.middle4Dir = [-gridStats.columns, -1, 1, gridStats.columns];
  neighborParams.right4Dir = [-1, gridStats.columns];
  neighborParams.singleLeft = -1;
  neighborParams.singleRight = 1;
  neighborParams.singleTop = -gridStats.columns;
  neighborParams.singleBottom = gridStats.columns;
  neighborParams.singleCrossLeftBottom = gridStats.columns - 1;
  neighborParams.singleCrossRightBottom = gridStats.columns + 1;
  neighborParams.singleCrossRightTop = -(gridStats.columns - 1);
  neighborParams.singleCrossLeftTop = -(gridStats.columns + 1);
}

function removeElements(parent) {
  let nextLastChild = parent.lastElementChild;
  while (nextLastChild) {
    parent.removeChild(nextLastChild);
    nextLastChild = parent.lastElementChild;
  }
  // parent.childNodes.remove();
}

function updateGridInfo() {
  if (gridColumns.value === "") {
    gridColumns.value = gridStats.columns;
    gridBlocks.value = numOfBlockades;
    gridTotal.value = numOfGrid;
  } else {
    gridStats.columns = +gridColumns.value;
    numOfBlockades = +gridBlocks.value;
    numOfGrid = +gridTotal.value;
  }
}

function setGrid() {
  gridStats.rows = Math.ceil(numOfGrid / gridStats.columns);
  background.style = ` grid-template-columns: repeat(${gridStats.columns}, 20px); grid-template-rows: repeat(${gridStats.rows}, 20px);`;
  background.style.width = `${
    gridStats.columns * playerCharacterPosition.xDistanceConstant
  }px`;
  background.style.height = `${
    gridStats.rows * playerCharacterPosition.yDistanceConstant
  }px`;
}

function generateBackground(count) {
  let tempArr = "";
  for (let counter = 1; counter <= count; counter++) {
    tempArr += `<div class="landmark seed_${counter}" id="${counter}"></div>`;
    tempArr += "\n";
  }
  background.innerHTML = tempArr;
  // console.log(tempArr);

  // background.insertAdjacentHTML(
  // "beforeend",

  // );
}

function generateBlockades(count) {
  illuminatePath("override", blockades, "rgb(0, 255, 0)");
  blockades = [];
  currentGridInfo.blockades.removeAll();
  currentGridInfo.allCheckedNodes = [];
  console.log("debug :", blockades);

  for (let counter = 1; counter <= count; counter++) {
    let seed = generateRandomNumber(blockades, 1, numOfGrid + 1);
    // console.log(seed);
    if (seed !== NaN && seed) {
      currentGridInfo.blockades.push(seed, seed);
      blockades = stringyfyPQ(currentGridInfo.blockades.printPQueue());
    } else {
      counter--;
    }
  }
  // console.log(blockades);
  illuminatePath("override", blockades, "rgb(0, 0, 0)");
}

function showFloatingMsg(string, time) {
  floatingMsg.textContent = string;
  floatingMsg.style = `padding:20px;width:max-content`;

  setTimeout(() => {
    floatingMsg.textContent = ``;
    floatingMsg.style = null;
  }, time);
}

function updateViews(current) {
  sourceView.value = currentGridInfo.currentSource;
  currentView.value = current;
  targetView.value = currentGridInfo.currentTarget;
}

function endSequence(currentPositionId) {
  elementStat.moveComplete = true;
  playerCharacterPosition.lastPositionId = currentPositionId;
  document.getElementById(playerCharacterPosition.currentPositionId).style = ``;
}

function getPosition(elm2) {
  if (elm2) {
    let elm = document.getElementById(elm2);
    let xpos = elm.offsetLeft - gridStats.fixerVarLeft;
    let ypos = elm.offsetTop - gridStats.fixerVarTop;
    return [xpos, ypos];
  }
}

function resetPlayerChar() {
  if (playerCharacterPosition.placed)
    document.getElementById(`1`).lastChild.remove();
  playerCharacterPosition.placed = false;
  elementStat.moveComplete = true;
}

function illuminatePath(command, currentPath, color) {
  for (let iteration = 0; iteration < currentPath.length; iteration++) {
    if (
      currentPath[iteration] &&
      +currentPath[iteration] > 0 &&
      +currentPath[iteration] <= numOfGrid
    ) {
      let element = document.getElementById(currentPath[iteration]);
      let elementColor = element.style.backgroundColor + "";

      if (command === "override") {
        element.style = `background-color:${color};`;
      }

      if (
        elementColor !== "rgb(255, 255, 255)" &&
        elementColor !== color &&
        elementColor != "rgb(0, 0, 0)"
      ) {
        element.style = `background-color:${color};`;

        if (color !== "rgb(0, 0, 0)") {
          currentGridInfo.allCheckedNodes.push(currentPath[iteration]);
        }
      }
    }
  }
}

function generalAnimation(position) {
  playerCharacter.style = `transform :translate(${position[0]}px,${position[1]}px)`;
  playerCharacterPosition.posX = position[0];
  playerCharacterPosition.posY = position[1];
}

function basicPageAnimation(elmArray, styles) {
  for (let i = 0; i < elmArray.length; i++) {
    elmArray[i].style = styles[i];
  }
}

function controlGridOptionDrop(value) {
  if (!value) {
    basicPageAnimation([droppables[0]], [`height:30px;width:70px`]);
    pageLogics.grid_optionOpen = true;
  } else {
    basicPageAnimation([droppables[0]], [``]);
    pageLogics.grid_optionOpen = false;
  }
}

function controlTraversalOptionDrop(value) {
  if (!value) {
    basicPageAnimation([droppables[1]], [`height:40px;width:80px`]);
    pageLogics.traversal_optionOpen = true;
  } else {
    basicPageAnimation([droppables[1]], [``]);
    pageLogics.traversal_optionOpen = false;
  }
}

function initiateGridInfo(elementId) {
  for (let i = 0; i < numOfGrid; i++) {
    currentGridInfo.gridToNodeRelations[i + 1] = [];
    currentGridInfo.gridToNodeWeights[i + 1] = [];
    currentGridInfo.gridToNodeLevel[i + 1] = [];
    currentGridInfo.tsSortstartTime[i + 1] = [];
    currentGridInfo.tsSortendTime[i + 1] = [];
    currentGridInfo.gridToNodeDistanceFromSource[i + 1] = Infinity;
    currentGridInfo.gridToNodeDistanceToTarget[i + 1] = -1;
    currentGridInfo.gridToNodeLevel[i] = -1;
  }
  currentGridInfo.pqForPathfinding.push(elementId, 0);
  currentGridInfo.normalNodeIteration.push(elementId);
  currentGridInfo.gridToNodeDistanceFromSource[elementId] = 0;
  currentGridInfo.gridToNodeLevel[elementId] = 1;
  currentGridInfo.parentNode[elementId] = -1;
  currentGridInfo.allCheckedNodes.push(elementId);
  currentGridInfo.currentSource = elementId;
}

function resetGridInfo() {
  currentGridInfo.gridToNodeRelations = [];
  currentGridInfo.gridToNodeDistanceFromSource = [];
  currentGridInfo.gridToNodeDistanceToTarget = [];
  currentGridInfo.gridToNodeWeights = [];
  currentGridInfo.gridToNodeLevel = [];
  currentGridInfo.parentNode = [];
  currentGridInfo.pqForPathfinding.removeAll();
  currentPath = [];
  currentGridInfo.closedNode = [];
  currentGridInfo.currentSmallestfCost = Infinity;
  currentGridInfo.cycles = 0;
  currentGridInfo.timeVar = 0;
  tempi = 0;
  illuminatePath("override", currentGridInfo.allCheckedNodes, "rgb(0, 255, 0)");
  illuminatePath("override", blockades, "rgb(0, 0, 0)");
  currentGridInfo.allCheckedNodes = [];
  currentGridInfo.tsSortendTime = [];
  currentGridInfo.tsSortstartTime = [];
  currentGridInfo.normalNodeIteration = [];
  currentGridInfo.traversalDone = false;
}

function printShortestPath(parents, node) {
  if (parents[node] === -1) {
    currentPath.push(node + "");
    return;
  }

  printShortestPath(parents, parents[node]);

  // console.log(node);

  currentPath.push(node + "");
}

function algorithmEndingAction(target, command) {
  if (command !== "nopath") {
    illuminatePath("override", [currentGridInfo.currentSource], "yellow");
    illuminatePath("override", [target], "yellow");
    // console.log(currentGridInfo.parentNode);

    printShortestPath(currentGridInfo.parentNode, target);

    placePlayerCharacterGrid(target);
    illuminatePath("override", currentPath, "yellow");
    // console.log(currentPath);
  } else {
    showFloatingMsg(`No path valid!`, 3000);
    updateViews("No path!");
    resetPlayerChar();
  }
}

function placePlayerCharacterGrid(target) {
  if (elementStat.animationType === "Normal") {
    if (currentPath.length <= 0) {
      playerCharacterPosition.lastPositionId = target;
      elementStat.moveComplete = true;
      return;
    }

    let position = getPosition(currentPath.shift());
    generalAnimation(position);

    setTimeout(() => {
      placePlayerCharacterGrid(target);
    }, 200);
  } else {
    let position = getPosition(currentPath.pop());
    playerCharacterPosition.lastPositionId = target;
    elementStat.moveComplete = true;
    generalAnimation(position);
  }
}

function calculateDistance(source, target) {
  let sourcePos = getPosition(source);
  let targetPos = getPosition(target);

  let distance =
    Math.pow(sourcePos[0] - targetPos[0], 2) +
    Math.pow(sourcePos[1] - targetPos[1], 2);

  return distance;
}

function block_add_mode_toggle(value) {
  if (!value) {
    basicPageAnimation(
      [add_block],
      ["box-shadow : 1px 1px 1px 2px rgba(0, 0, 0, .5);"]
    );
  } else {
    basicPageAnimation([add_block], [""]);
    pageLogics.add_block_mode_on = false;
  }
}

function block_remove_mode_toggle(value) {
  if (!value) {
    basicPageAnimation(
      [remove_block],
      ["box-shadow : 1px 1px 1px 2px rgba(0, 0, 0, .5);"]
    );
  } else {
    basicPageAnimation([remove_block], [""]);
    pageLogics.remove_block_mode_on = false;
  }
}

function processAndReturn(id, command) {
  let tempArr = [];
  if (currentGridInfo.lastSelectedNode === null) {
    currentGridInfo.lastSelectedNode = id;
  } else {
    let pos = getPosition(id);
    let startPos = getPosition(currentGridInfo.lastSelectedNode);
    let distanceX = pos[0] - startPos[0];
    let distanceY = pos[1] - startPos[1];
    let Xreq = distanceX / playerCharacterPosition.xDistanceConstant;
    let Yreq = distanceY / playerCharacterPosition.yDistanceConstant;
    let idFlag = currentGridInfo.lastSelectedNode;

    for (let i = 0; i <= Math.abs(Yreq); i++) {
      for (let j = 0; j < Math.abs(Xreq); j++) {
        if (Xreq > 0) {
          currentGridInfo.lastSelectedNode += neighborParams.singleRight;
        } else {
          currentGridInfo.lastSelectedNode += neighborParams.singleLeft;
        }
        // console.log(currentGridInfo.lastSelectedNode);
        if (command === "add") {
          if (
            !binarySearch(
              blockades,
              0,
              blockades.length - 1,
              currentGridInfo.lastSelectedNode
            )
          ) {
            tempArr.push(currentGridInfo.lastSelectedNode);
          }
        } else {
          if (
            binarySearch(
              blockades,
              0,
              blockades.length - 1,
              currentGridInfo.lastSelectedNode
            )
          ) {
            tempArr.push(currentGridInfo.lastSelectedNode);
          }
        }
      }
      if (i === Math.abs(Yreq)) break;

      currentGridInfo.lastSelectedNode = idFlag;

      if (Yreq > 0) {
        idFlag += neighborParams.singleBottom;
        currentGridInfo.lastSelectedNode += neighborParams.singleBottom;
      } else {
        idFlag += neighborParams.singleTop;
        currentGridInfo.lastSelectedNode += neighborParams.singleTop;
      }
      // console.log(currentGridInfo.lastSelectedNode, idFlag);
      if (command === "add") {
        if (
          !binarySearch(
            blockades,
            0,
            blockades.length - 1,
            currentGridInfo.lastSelectedNode
          )
        ) {
          tempArr.push(currentGridInfo.lastSelectedNode);
        }
      } else {
        if (
          binarySearch(
            blockades,
            0,
            blockades.length - 1,
            currentGridInfo.lastSelectedNode
          )
        ) {
          tempArr.push(currentGridInfo.lastSelectedNode);
        }
      }
    }
    // console.log(blockades);

    currentGridInfo.lastSelectedNode = null;
    return tempArr;
  }
}

function add_blockade(id) {
  // console.log(id);
  illuminatePath(`override`, id, "rgb(0, 0, 0)");
  for (let i = 0; i < id.length; i++) {
    currentGridInfo.blockades.push(id[i], id[i]);
  }
  blockades = stringyfyPQ(currentGridInfo.blockades.printPQueue());
  // binaryInsert(blockades, 0, blockades.length - 1, id)
}

function remove_blockade(id) {
  //   console.log(id);

  illuminatePath(`override`, id, "rgb(0, 255, 0)");
  blockades = stringyfyPQ(currentGridInfo.blockades.printPQueue());
  for (let i = 0; i < id.length; i++) {
    let idx = binarySearch(blockades, 0, blockades.length - 1, id[i], "F");
    blockades.splice(idx, 1);
  }
  PQfyArray(currentGridInfo.blockades, blockades);
  //   console.log(blockades);
}

function timer(command) {
  if (command === `start`) {
    let dateob = performance.now();
    lastTimerValue = dateob;
  }

  if (command === `stop`) {
    let dateob = performance.now();
    return (Math.abs(dateob - lastTimerValue) / 1000).toFixed(8);
  }
}
