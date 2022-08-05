class referenceObj {
  constructor(referenceName, isPlayer, colorCode) {
    this.isPlayer = isPlayer;
    this.colorCode = colorCode;

    this.posX = 0;
    this.posY = 0;

    this.tempi = 0;
    this.currentPath = [];
    this.gridToNodeRelations = [];
    this.gridToNodeDistanceFromSource = [];
    this.gridToNodeWeights = [];
    this.gridToNodeLevel = [];
    this.pqForPathfinding = new PriorityQueue();
    this.blockades = new PriorityQueue();
    this.parentNode = [];
    this.closedNode = [];
    this.allCheckedNodes = [];
    this.currentSource = 0;
    this.currentTarget = 0;
    this.gridToNodeDistanceToTarget = [];
    this.currentSmallestfCost = Infinity;
    this.timeVar = 0;
    this.cycles = 0;
    this.tsSortstartTime = [];
    this.tsSortendTime = [];
    this.normalNodeIteration = [];
    this.traversalDone = false;

    this.moveComplete = true;

    (this.placed = false),
      (this.lastPositionId = 1),
      (this.currentPositionId = 1),
      (this.yChangeConstant = gridStats.columns),
      (this.xDistanceConstant = 20),
      (this.yDistanceConstant = 20);
    this.referenceName = referenceName;
  }

  initiateReferenceInfo(elementId) {
    //initiated current grid info based on reference position
    for (let i = 0; i < numOfGrid; i++) {
      this.gridToNodeRelations[i + 1] = [];
      this.gridToNodeWeights[i + 1] = [];
      this.gridToNodeLevel[i + 1] = [];
      // this.tsSortstartTime[i + 1] = [];
      // this.tsSortendTime[i + 1] = [];
      this.gridToNodeDistanceFromSource[i + 1] = Infinity;
      this.gridToNodeDistanceToTarget[i + 1] = -1;
      this.gridToNodeLevel[i] = -1;
    }
    this.pqForPathfinding.push(elementId, 0);
    this.normalNodeIteration.push(elementId);
    this.gridToNodeDistanceFromSource[elementId] = 0;
    this.gridToNodeLevel[elementId] = 1;
    this.parentNode[elementId] = -1;
    this.allCheckedNodes.push(elementId);
    this.currentSource = elementId;
  }

  placementDetermination(element, elementId, position) {
    //place reference into initial position
    this.currentTarget = elementId;
    // console.log(this.placed, this.referenceName);

    if (!this.placed) {
      element.insertAdjacentHTML(
        "beforeend",
        `<div class="${this.referenceName} reference ${this.colorCode}"></div>`
      );

      this.referenceObjDOM = GETDOMQUERY(`.${this.referenceName}`);

      this.placed = true;
      this.posX = position[0];
      this.posY = position[1];
      this.currentPositionId = elementId;
      this.lastPositionId = elementId;

      generalAnimation(this, position);
      endSequence(this);
    } else {
      if (this.isPlayer)
        illuminatePath(this, "", [elementId], "rgba(255, 0, 0, 0.5)");

      determineAlgorithm(this, elementId);
    }
  }

  algorithmEndingAction(target, command) {
    //called after reference reach destination
    if (command !== "nopath") {
      illuminatePath(
        this,
        "override",
        [this.currentSource],
        this.colorCode,
        0.7
      );

      this.simulatePath(this.parentNode, target);

      this.placeReference(target);

      // console.log(this.currentPath);

      illuminatePath(this, "override", this.currentPath, this.colorCode, 0.5);
      illuminatePath(this, "override", [target], this.colorCode, 0.7);
    } else {
      showFloatingMsg(`No path valid!`, 3000);
      updateViews("No path!");
      this.resetPlayerChar();
      this.resetReferenceInfo();
    }
  }

  selectPlacementMode(className, goingto) {
    if (goingto) {
      let pos = getPosition(goingto);
      let topPos = pos[1];
      let leftPos = pos[0];
      updatePosition();
      if (
        this.moveComplete &&
        !BINARYSEARCH(
          currentGridInfo.blockades,
          0,
          currentGridInfo.blockades.length - 1,
          goingto
        )
      ) {
        // playerClickCounter++;

        this.moveComplete = false;
        this.currentPositionId = goingto; //note

        this.resetReferenceInfo(this);

        if (className !== "playerCharacter") {
          if (!this.placed) goingto = document.querySelector(`.seed_1`);

          this.placementDetermination(goingto, this.currentPositionId, [
            leftPos,
            topPos,
          ]);
        }
      }
    }
  }

  simulatePath(parents, node) {
    //not always shortest depending on the algorithm

    if (parents[node] === -1) {
      this.currentPath.push(node + "");
      return;
    }

    this.simulatePath(parents, parents[node]);

    this.currentPath.push(node + "");
  }

  placeReference(target) {
    //positions reference
    if (traversalTypeInfo.animationType === "Normal") {
      if (this.currentPath.length <= 0) {
        this.lastPositionId = target;
        this.moveComplete = true;
        return;
      }

      let position = getPosition(this.currentPath.shift());
      generalAnimation(this, position);

      setTimeout(() => {
        this.placeReference(target);
      }, 200);
    } else {
      let position = getPosition(this.currentPath.pop());
      this.lastPositionId = target;
      this.moveComplete = true;
      generalAnimation(this, position);
    }
  }

  resetReferenceInfo() {
    //resets all grid info
    this.gridToNodeRelations = [];
    this.gridToNodeDistanceFromSource = [];
    this.gridToNodeDistanceToTarget = [];
    this.gridToNodeWeights = [];
    this.gridToNodeLevel = [];
    this.parentNode = [];
    this.pqForPathfinding.removeAll();
    this.currentPath = [];
    this.closedNode = [];
    this.currentSmallestfCost = Infinity;
    this.cycles = 0;
    this.timeVar = 0;
    this.tempi = 0;
    illuminatePath(this, "override", this.allCheckedNodes, "rgb(0, 255, 0)");
    illuminatePath(this, "override", currentGridInfo.blockades, "rgb(0, 0, 0)");
    this.allCheckedNodes = [];
    this.tsSortendTime = [];
    this.tsSortstartTime = [];
    this.normalNodeIteration = [];
    this.traversalDone = false;
  }

  resetPlayerChar() {
    //resets reference
    if (this.placed) GETDOMQUERY(`.${this.referenceName}`).remove();
    this.placed = false;
    this.moveComplete = true;
  }

  placeInSeed(target) {
    let position = getPosition(target);
    console.log(position);

    generalAnimation(this, position);
  }

  logself() {
    return this;
  }
}
