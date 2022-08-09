//initial calls
generateBackground(numOfGrid); //24384
updateGridInfo();
setGrid();
generateBlockades(currentGridInfo, numOfBlockades);

changeAlgo("Bellman ford", "4-Directional");

function driverFunction(reference, currentNode, rangeGen, rangeLevel) {
  // basically the heart of the project. Given current node generates an array of traversable neighbor nodes and ultimately relations(edges).

  if (
    1
    // !BINARYSEARCH(
    //   reference.closedNode,
    //   0,
    //   reference.closedNode.length,
    //   currentNode
    // )
  ) {
    let currentNeighbors = [];
    currentNode = +currentNode;
    let arrayToFollow = neighborParams.middle;

    if (traversalTypeInfo.mode === "4-Directional" && !rangeGen) {
      arrayToFollow = neighborParams.middle4Dir;
    }

    if (currentNode % gridStats.columns === 0) {
      arrayToFollow = neighborParams.right;
      if (traversalTypeInfo.mode === "4-Directional" && !rangeGen)
        arrayToFollow = neighborParams.right4Dir;
    }
    if ((currentNode - 1) % gridStats.columns === 0) {
      arrayToFollow = neighborParams.left;
      if (traversalTypeInfo.mode === "4-Directional" && !rangeGen)
        arrayToFollow = neighborParams.left4Dir;
    }
    // if (reference.isPlayer) console.log(arrayToFollow);
    // console.log(arrayToFollow);

    for (let i = 0; i < arrayToFollow.length; i++) {
      let neighborTemporaryNode = currentNode + +arrayToFollow[i];

      if (!rangeGen) {
        let distance;
        if (neighborTemporaryNode <= numOfGrid && neighborTemporaryNode > 0) {
          currentNeighbors.push(neighborTemporaryNode);

          reference.gridToNodeRelations[currentNode]?.push(
            neighborTemporaryNode
          );
          reference.gridToNodeRelations[neighborTemporaryNode].push(
            currentNode
          );

          distance = calculateDistance(neighborTemporaryNode, currentNode);
          // console.log(currentNode, neighborTemporaryNode, distance);

          reference.gridToNodeWeights[currentNode].push(distance);
          reference.gridToNodeWeights[neighborTemporaryNode].push(distance);
        }
      } else {
        if (neighborTemporaryNode >= 0) {
          // console.log(currentNode + -1 * rangeLevel);

          if (
            neighborTemporaryNode >=
            currentNode - gridStats.columns * rangeLevel
          ) {
            // console.log("pushed :", neighborTemporaryNode);

            currentNeighbors.push(neighborTemporaryNode);
            reference.rangeSet.push(
              neighborTemporaryNode,
              neighborTemporaryNode
            );
          }
        }
      }
    }

    if (reference.isPlayer && !rangeGen) {
      illuminatePath(reference, "", currentNeighbors, "rgba(255, 0, 0, 0.99)");
      numberOfNodesTraversed++;
    }

    // if (rangeGen)
    // console.log("currentNode range", currentNode, currentNeighbors);

    return currentNeighbors;
  }
}

function determineAlgorithm(reference, elementId) {
  //main algorithm call
  // console.log(reference.referenceName);

  reference.resetReferenceInfo();
  reference.initiateReferenceInfo(reference.lastPositionId);

  if (traversalTypeInfo.currentAlgorithm === "Dijkstra")
    Dijkstra(reference, elementId);
  else if (traversalTypeInfo.currentAlgorithm === "Bellman ford")
    BellmanFord(reference, elementId);
  else if (traversalTypeInfo.currentAlgorithm === "A*")
    Astar(reference, elementId);
  else if (traversalTypeInfo.currentAlgorithm === "DFS")
    DFS(reference, reference.currentSource, 0, elementId);
  else if (traversalTypeInfo.currentAlgorithm === "BFS")
    BFS(reference, elementId);
}

// initiateBehaviour();

var ref1 = new referenceObj("ref1", true, "black");
var ref2 = new referenceObj("ref2", false, "blue");
var ref3 = new referenceObj("ref3", false, "white");

function initiateBehaviour() {
  // ref2.initiateReferenceInfo();
  // ref2.selectPlacementMode("", 2);
  // ref2.placeInSeed(100);

  setInterval(() => {
    // console.log(currentGridInfo.blockades);
    // timer("start");

    let rand = GENERATERANDOMNUMBER([], 1, numOfGrid, "integer", 0);
    let rand1 = GENERATERANDOMNUMBER(
      currentGridInfo.blockades,
      1,
      numOfGrid,
      "integer",
      0
    );

    if (!BINARYSEARCH([], 0, currentGridInfo.blockades.length - 1, rand))
      ref2.selectPlacementMode("", rand);

    if (
      !BINARYSEARCH(
        currentGridInfo.blockades,
        0,
        currentGridInfo.blockades.length - 1,
        rand1
      )
    )
      ref3.selectPlacementMode("", rand1);

    // console.log("Time taken to generate AI path : ", timer("stop"));

    // console.log(rand, rand1);
  }, 5000);
}

background.addEventListener("click", function (e) {
  //main click event listener which initiates everything

  if (e.target) {
    let goingto = +e.target.id;
    // console.log(ref2.posX, ref2.posY);

    if (!pageLogics.add_block_mode_on && !pageLogics.remove_block_mode_on) {
      ref1.selectPlacementMode(e.target.className, goingto);
      // ref2.selectPlacementMode("", 200);
    } else {
      if (
        !BINARYSEARCH(
          currentGridInfo.blockades,
          0,
          currentGridInfo.blockades.length - 1,
          goingto
        ) &&
        pageLogics.add_block_mode_on
      ) {
        let tempArr = [goingto];
        if (pageKeyPressRecords.currentKeyPressed === "Shift") {
          let isValid = processShiftBlockAddAndRemove(
            currentGridInfo,
            goingto,
            "add"
          );
          if (isValid) tempArr = isValid;
        } else {
          currentGridInfo.lastSelectedNode = null;
        }
        add_blockade(currentGridInfo, tempArr);
      }
      if (pageLogics.remove_block_mode_on) {
        let tempArr = [goingto];
        if (pageKeyPressRecords.currentKeyPressed === "Shift") {
          let isValid = processShiftBlockAddAndRemove(
            currentGridInfo,
            goingto,
            "remove"
          );
          if (isValid) tempArr = isValid;
        } else {
          currentGridInfo.lastSelectedNode = null;
        }
        remove_blockade(currentGridInfo, tempArr);
      }
    }
  }
});

algo_select.addEventListener("change", function (e) {
  //algorithm select event
  let algorithm = algo_select.value;
  let mode = mode_select.value;
  algorithmView.textContent = `Movement algorithm is ${algorithm}. Movement is ${mode}.`;
  traversalTypeInfo.currentAlgorithm = algorithm;
  traversalTypeInfo.mode = mode;

  showFloatingMsg(
    `Algorithm changed to ${traversalTypeInfo.currentAlgorithm}`,
    1000
  );
});

mode_select.addEventListener("change", function (e) {
  //mode select event
  let algorithm = algo_select.value;
  let mode = mode_select.value;

  changeAlgo(algorithm, mode);

  showFloatingMsg(`Movement changed to ${traversalTypeInfo.mode}.`, 1000);
});

animation_select.addEventListener("change", () => {
  //animation select event
  let animation_value = animation_select.value;

  traversalTypeInfo.animationType = animation_value;
});

gridGenerationBtn.addEventListener("click", () => {
  // console.log('clicked');
  resetPlayerChars([ref1, ref2, ref3]);
  removeElements(background);
  updateGridInfo();
  generateBackground(numOfGrid);
  setGrid();
  updateNeighParams();
  generateBlockades(currentGridInfo, numOfBlockades);
});

gridOptionbtn.addEventListener("click", () => {
  //option btn event
  controlGridOptionDrop(pageLogics.grid_optionOpen);
  updatePosition();
});

traversalOptionbtn.addEventListener("click", () => {
  //traversal btn event
  controlTraversalOptionDrop(pageLogics.traversal_optionOpen);
  updatePosition();
});

gridresetBtn.addEventListener("click", () => {
  //reset grid called after grid change or algorithm ends
  resetPlayerChars([ref1, ref2, ref3]);
  ref1.resetReferenceInfo();
  ref2.resetReferenceInfo();
  ref3.resetReferenceInfo();
});

add_block.addEventListener("click", () => {
  //add block event
  if (!pageLogics.add_block_mode_on) {
    pageLogics.add_block_mode_on = true;
    block_add_mode_toggle(false);
  } else {
    pageLogics.add_block_mode_on = false;
    block_add_mode_toggle(true);
  }
});

remove_block.addEventListener("click", (e) => {
  //remove block event
  if (!pageLogics.remove_block_mode_on) {
    pageLogics.remove_block_mode_on = true;
    block_remove_mode_toggle(false);
  } else {
    pageLogics.remove_block_mode_on = false;
    block_remove_mode_toggle(true);
  }
});

window.addEventListener("resize", () => {
  //update reference position on resizing window
  updatePosition();
});

document.addEventListener("click", function (e) {
  //general click listener
  if (
    e.target.parentNode.className !== "master_container" &&
    pageLogics.add_block_mode_on &&
    e.target.className !== "grid_add_block" &&
    e.target &&
    e.target.className !== "master_container"
  ) {
    block_add_mode_toggle(true);
  }

  if (
    e.target.parentNode.className !== "master_container" &&
    pageLogics.remove_block_mode_on &&
    e.target.className !== "grid_remove_block" &&
    e.target &&
    e.target.className !== "master_container"
  ) {
    block_remove_mode_toggle(true);
  }
});

document.addEventListener("keydown", (e) => {
  //general keypress listener
  pageKeyPressRecords.currentKeyPressed = e.key;
});

document.addEventListener("keyup", (e) => {
  //general keyup listener
  if (e.key === pageKeyPressRecords.currentKeyPressed) {
    pageKeyPressRecords.currentKeyPressed = null;
  }
});

document.addEventListener("dragover", (e) => {
  //general dragover listener
  let element = e.target;
  let id = +element.getAttribute("id");
  let tempArr = [id];
  if (
    !BINARYSEARCH(
      currentGridInfo.blockades,
      0,
      currentGridInfo.blockades.length - 1,
      id
    ) &&
    pageLogics.add_block_mode_on
  ) {
    add_blockade(currentGridInfo, tempArr);
  }

  if (
    BINARYSEARCH(
      currentGridInfo.blockades,
      0,
      currentGridInfo.blockades.length - 1,
      id
    ) &&
    pageLogics.remove_block_mode_on
  ) {
    remove_blockade(currentGridInfo, tempArr);
  }
});
