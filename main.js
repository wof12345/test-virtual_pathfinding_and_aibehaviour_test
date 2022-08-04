//initial calls
generateBackground(numOfGrid); //24384
updateGridInfo();
setGrid();
generateBlockades(currentGridInfo, numOfBlockades);

changeAlgo("Dijkstra", "4-Directional");

function driverFunction(reference, currentNode) {
  // basically the heart of the project. Given current node generates an array of traversable neighbor nodes and ultimately relations(edges).
  if (
    !BINARYSEARCH(
      reference.closedNode,
      0,
      reference.closedNode.length,
      currentNode
    )
  ) {
    let currentNeighbors = [];
    currentNode = +currentNode;
    let arrayToFollow = neighborParams.middle;

    if (elementStat.mode === "4-Directional")
      arrayToFollow = neighborParams.middle4Dir;

    if (currentNode % gridStats.columns === 0) {
      arrayToFollow = neighborParams.right;
      if (elementStat.mode === "4-Directional")
        arrayToFollow = neighborParams.right4Dir;
    }
    if ((currentNode - 1) % gridStats.columns === 0) {
      arrayToFollow = neighborParams.left;
      if (elementStat.mode === "4-Directional")
        arrayToFollow = neighborParams.left4Dir;
    }

    for (let i = 0; i < arrayToFollow.length; i++) {
      let neighborTemporaryNode = currentNode + +arrayToFollow[i];
      let distance;

      if (neighborTemporaryNode <= numOfGrid && neighborTemporaryNode > 0) {
        currentNeighbors.push(neighborTemporaryNode);
        // console.log(neighborTemporaryNode);

        reference.gridToNodeRelations[currentNode].push(neighborTemporaryNode);
        reference.gridToNodeRelations[neighborTemporaryNode].push(currentNode);

        distance = calculateDistance(neighborTemporaryNode, currentNode);
        reference.gridToNodeWeights[currentNode].push(distance);
        reference.gridToNodeWeights[neighborTemporaryNode].push(distance);
      }
    }

    illuminatePath(reference, "", currentNeighbors, "rgba(255, 0, 0, 0.99)");
    numberOfNodesTraversed++;
  }
  // console.log(numberOfNodesTraversed);
}

function determineAlgorithm(reference, elementId) {
  //main algorithm call
  ref1.initiateReferenceInfo(reference.lastPositionId);
  if (elementStat.currentAlgorithm === "Dijkstra")
    Dijkstra(reference, elementId);
  else if (elementStat.currentAlgorithm === "A*") Astar(reference, elementId);
  else if (elementStat.currentAlgorithm === "DFS") {
    DFS(reference, reference.currentSource, 0, elementId);
  } else if (elementStat.currentAlgorithm === "BFS") {
    BFS(reference, elementId);
  }
}

// function placePlayerCharacter(element, elementId, position) {
//   //place reference into initial position
//   currentGridInfo.currentTarget = elementId;
//   if (!playerCharacterPosition.placed) {
//     element.innerHTML = '<div class="playerCharacter"></div>';

//     playerCharacterPosition.placed = true;
//     playerCharacter = document.querySelector(`.playerCharacter`);
//     playerCharacterPosition.posX = position[0];
//     playerCharacterPosition.posY = position[1];
//     playerCharacterPosition.currentPositionId = elementId;
//     playerCharacterPosition.lastPositionId = elementId;

//     generalAnimation(ref1, position);
//     endSequence(playerCharacterPosition.currentPositionId);
//   } else {
//     illuminatePath("", [elementId], "rgba(255, 0, 0, 0.5)");
//     determineAlgorithm(currentGridInfo, elementId);
//   }
// }

let ref1 = new referenceObj(0, 0, "ref1");

background.addEventListener("click", function (e) {
  //main click event listener which initiates everything

  if (e.target) {
    let goingto = +e.target.id;
    let pos = getPosition(goingto);

    if (!pageLogics.add_block_mode_on && !pageLogics.remove_block_mode_on) {
      if (pos) {
        ref1.selectPlacementMode(e, goingto, pos);
      }
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
        // console.log(blockades);
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
        // console.log(blockades);
      }
      if (pageLogics.remove_block_mode_on) {
        // console.log(blockades);
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
        // console.log(blockades);
      }
    }
  }
});

algo_select.addEventListener("change", function (e) {
  //algorithm select event
  let algorithm = algo_select.value;
  let mode = mode_select.value;
  algorithmView.textContent = `Movement algorithm is ${algorithm}. Movement is ${mode}.`;
  elementStat.currentAlgorithm = algorithm;
  elementStat.mode = mode;

  showFloatingMsg(`Algorithm changed to ${elementStat.currentAlgorithm}`, 1000);
});

mode_select.addEventListener("change", function (e) {
  //mode select event
  let algorithm = algo_select.value;
  let mode = mode_select.value;

  changeAlgo(algorithm, mode);

  showFloatingMsg(`Movement changed to ${elementStat.mode}.`, 1000);
});

animation_select.addEventListener("change", () => {
  //animation select event
  let animation_value = animation_select.value;

  elementStat.animationType = animation_value;
});

gridGenerationBtn.addEventListener("click", () => {
  // console.log('clicked');
  resetPlayerChars([ref1]);
  removeElements(background);
  updateGridInfo();
  generateBackground(numOfGrid);
  setGrid();
  updateNeighParams();
  generateBlockades(currentGridInfo, numOfBlockades);
  // console.log(blockades);
  // resetGridInfo();
  // console.log(gridStats);
  // console.log(neighborParams);
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
  resetPlayerChars([ref1]);
  ref1.resetReferenceInfo();
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
  // console.log(e.target.parentNode.className);

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
    // console.log(id);
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
    // console.log(id);
    remove_blockade(currentGridInfo, tempArr);
  }
});
