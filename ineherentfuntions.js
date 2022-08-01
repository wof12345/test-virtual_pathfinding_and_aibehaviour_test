// function generateRandomNumber(array, lowerrange, upperrange) {
//   let seed = Math.floor(
//     Math.random() * (upperrange - lowerrange + 1) + lowerrange - 1
//   );
//   // console.log(seed, !BINARYSEARCH(array, 0, array.length - 1, seed));
//   debugVars.currentIteration++;
//   if (debugVars.currentIteration > 50) {
//     debugVars.currentIteration = 0;
//     return NaN;
//   }

//   if (!BINARYSEARCH(array, 0, array.length - 1, seed) && seed >= lowerrange) {
//     // console.log(seed);
//     debugVars.currentIteration = 0;
//     return seed;
//   } else {
//     generateRandomNumber(array, lowerrange, upperrange);
//   }
// }

function PQtoArray(PQ) {
  //turns given priority queue into array
  let tempArr = [];
  // console.log(PQ);
  PQ.split(" ").forEach((elm) => {
    if (elm !== "" && elm !== " " && elm !== "NaN") tempArr.push(+elm);
  });

  return tempArr;
}

function PQfyArray(PQ, array) {
  //turns given array into priority queue
  // console.log(PQ);
  PQ.removeAll();
  for (let i = 0; i < array.length; i++) {
    PQ.push(array[i], array[i]);
  }
}

// function fixateArrays(array, fromIndex, from, nextElm) {      //dated ineffiecient
//   if (fromIndex >= array.length || from === undefined) return;

//   // console.log(from, nextElm);

//   array[fromIndex + 1] = from;
//   fixateArrays(array, fromIndex + 1, nextElm, array[fromIndex + 2]);
// } //move array element by 1 index forward

// function fixPath(collection) {
//   let temp = collection.shift();
//   collection.push(temp);
// } //dated

function updatePosition() {
  //adjusts the constant relativlely different value for the reference
  let temp1 = background.offsetTop;
  let temp2 = background.offsetLeft;

  gridStats.fixerVarLeft = temp2;
  gridStats.fixerVarTop = temp1;
}

function updateNeighParams() {
  //updates neighbor navigation directions given on column change
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
  //removes childs of a given parent through DOM
  let nextLastChild = parent.lastElementChild;
  while (nextLastChild) {
    parent.removeChild(nextLastChild);
    nextLastChild = parent.lastElementChild;
  }
  // parent.childNodes.remove();
}

function updateGridInfo() {
  //updates grid statistics on column change
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
  //adjust grid
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
  //main function to generate grid
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
  //generate and update blockades
  illuminatePath("override", blockades, "rgb(0, 255, 0)");
  blockades = [];
  ref1.blockades.removeAll();
  ref1.allCheckedNodes = [];
  // console.log("debug :", blockades);

  for (let counter = 1; counter <= count; counter++) {
    let seed = GENERATERANDOMNUMBER(blockades, 1, numOfGrid + 1, "integer");
    // console.log(seed);
    if (seed !== NaN && seed) {
      ref1.blockades.push(seed, seed);
      blockades = PQtoArray(ref1.blockades.printPQueue());
    } else {
      counter--;
    }
  }
  // console.log(blockades);
  illuminatePath("override", blockades, "rgb(0, 0, 0)");
}

function showFloatingMsg(string, time) {
  //invokes floating message window with given message
  floatingMsg.textContent = string;
  floatingMsg.style = `padding:20px;width:max-content`;

  setTimeout(() => {
    floatingMsg.textContent = ``;
    floatingMsg.style = null;
  }, time);
}

function updateViews(current) {
  //update traversal view information
  sourceView.value = currentGridInfo.currentSource;
  currentView.value = current;
  targetView.value = currentGridInfo.currentTarget;
}

function endSequence(currentPositionId) {
  //called when reference moves to destination
  elementStat.moveComplete = true;
  playerCharacterPosition.lastPositionId = currentPositionId;
  document.getElementById(playerCharacterPosition.currentPositionId).style = ``;
}

function getPosition(elm2) {
  //gets postion of the reference
  if (elm2) {
    let elm = document.getElementById(elm2);
    let xpos = elm.offsetLeft - gridStats.fixerVarLeft;
    let ypos = elm.offsetTop - gridStats.fixerVarTop;
    return [xpos, ypos];
  }
}

function resetPlayerChar() {
  //resets reference
  if (playerCharacterPosition.placed)
    document.getElementById(`1`).lastChild.remove();
  playerCharacterPosition.placed = false;
  elementStat.moveComplete = true;
}

function illuminatePath(command, currentPath, color) {
  // using DOM, given command, color and path array illuminates them
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
  //updates reference position
  playerCharacter.style = `transform :translate(${position[0]}px,${position[1]}px)`;
  playerCharacterPosition.posX = position[0];
  playerCharacterPosition.posY = position[1];
}

function basicPageAnimation(elmArray, styles) {
  //function to simplify animation and DOM style
  for (let i = 0; i < elmArray.length; i++) {
    elmArray[i].style = styles[i];
  }
}

function controlGridOptionDrop(value) {
  //grid option view controller
  if (!value) {
    basicPageAnimation([droppables[0]], [`height:30px;width:70px`]);
    pageLogics.grid_optionOpen = true;
  } else {
    basicPageAnimation([droppables[0]], [``]);
    pageLogics.grid_optionOpen = false;
  }
}

function controlTraversalOptionDrop(value) {
  //traversal option view controller
  if (!value) {
    basicPageAnimation([droppables[1]], [`height:40px;width:80px`]);
    pageLogics.traversal_optionOpen = true;
  } else {
    basicPageAnimation([droppables[1]], [``]);
    pageLogics.traversal_optionOpen = false;
  }
}

function initiateGridInfo(elementId) {
  //initited current grid info based on reference position
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

function resetReferenceInfo(reference) {
  //resets all grid info
  reference.gridToNodeRelations = [];
  reference.gridToNodeDistanceFromSource = [];
  reference.gridToNodeDistanceToTarget = [];
  reference.gridToNodeWeights = [];
  reference.gridToNodeLevel = [];
  reference.parentNode = [];
  reference.pqForPathfinding.removeAll();
  currentPath = [];
  reference.closedNode = [];
  reference.currentSmallestfCost = Infinity;
  reference.cycles = 0;
  reference.timeVar = 0;
  tempi = 0;
  illuminatePath("override", currentGridInfo.allCheckedNodes, "rgb(0, 255, 0)");
  illuminatePath("override", blockades, "rgb(0, 0, 0)");
  reference.allCheckedNodes = [];
  reference.tsSortendTime = [];
  reference.tsSortstartTime = [];
  reference.normalNodeIteration = [];
  reference.traversalDone = false;
}

function simulatePath(parents, node) {
  //not always shortest depending on the algorithm
  if (parents[node] === -1) {
    currentPath.push(node + "");
    return;
  }

  simulatePath(parents, parents[node]);

  // console.log(node);

  currentPath.push(node + "");
}

function algorithmEndingAction(target, command) {
  //called after reference reach destination
  if (command !== "nopath") {
    illuminatePath("override", [currentGridInfo.currentSource], "yellow");
    illuminatePath("override", [target], "yellow");
    // console.log(currentGridInfo.parentNode);

    simulatePath(currentGridInfo.parentNode, target);

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
  //positions reference
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
  //calculates distance between given nodes
  let sourcePos = getPosition(source);
  let targetPos = getPosition(target);

  let distance =
    Math.pow(sourcePos[0] - targetPos[0], 2) +
    Math.pow(sourcePos[1] - targetPos[1], 2);

  return distance;
}

function block_add_mode_toggle(value) {
  //toggles into block drag adding mode
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
  //toggles into block drag removing mode
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

function processShiftBlockAddAndRemove(id, command) {
  //process shift click adds and removes for add block or remove block
  console.log(id);

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
            !BINARYSEARCH(
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
            BINARYSEARCH(
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
          !BINARYSEARCH(
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
          BINARYSEARCH(
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
  //given array is push into blockades
  // console.log(id);
  illuminatePath(`override`, id, "rgb(0, 0, 0)");
  for (let i = 0; i < id.length; i++) {
    currentGridInfo.blockades.push(id[i], id[i]);
  }
  blockades = PQtoArray(currentGridInfo.blockades.printPQueue());
  // binaryInsert(blockades, 0, blockades.length - 1, id)
}

function remove_blockade(id) {
  //given array is removed from blockades given they exist
  //   console.log(id);

  illuminatePath(`override`, id, "rgb(0, 255, 0)");
  blockades = PQtoArray(currentGridInfo.blockades.printPQueue());
  for (let i = 0; i < id.length; i++) {
    let idx = BINARYSEARCH(blockades, 0, blockades.length - 1, id[i], "F");
    blockades.splice(idx, 1);
  }
  PQfyArray(currentGridInfo.blockades, blockades);
  //   console.log(blockades);
}

function timer(command) {
  //timer
  if (command === `start`) {
    let dateob = performance.now();
    lastTimerValue = dateob;
  }

  if (command === `stop`) {
    let dateob = performance.now();
    return (Math.abs(dateob - lastTimerValue) / 1000).toFixed(8);
  }
}
