function generateRandomNumber(limit) {
    return Math.random() * limit + 1;
}

function fixPath(collection) {
    let temp = collection.shift();
    collection.push(temp);
    console.log(collection);

}

function generateBackground(count) {
    for (let counter = 1; counter <= count; counter++)
        background.insertAdjacentHTML('beforeend', `<div class="landmark seed_${counter}" id="${counter}"></div>`)
}

function generateBlockades(count) {
    for (let counter = 1; counter <= count; counter++) {
        let seed = Math.round(generateRandomNumber(numOfGrid));
        blockades.push(seed);
    }
    illuminatePath('override', blockades, 'rgb(0, 0, 0)');
}

function showFloatingMsg(string) {
    floatingMsg.textContent = string;
    floatingMsg.style = `padding:20px;width:max-content`

    setTimeout(() => {
        floatingMsg.textContent = ``;
        floatingMsg.style = null;
    }, 1000)
}

function endSequence(currentPositionId) {
    elementStat.moveComplete = true;
    playerCharacterPosition.lastPositionId = currentPositionId;
    document.getElementById(playerCharacterPosition.currentPositionId).style = ``;
}

function getPosition(elm2) {
    let elm = document.getElementById(elm2);
    // console.log(elm2)
    let xpos = elm.offsetLeft - 14;
    let ypos = elm.offsetTop - 10;
    return [xpos, ypos];
}

function illuminatePath(command, currentPath, color) {
    // console.log(currentGridInfo.allCheckedNodes);
    for (let iteration = 0; iteration < currentPath.length; iteration++) {
        if (currentPath[iteration] && +currentPath[iteration] > 0 && +currentPath[iteration] < numOfGrid) {
            // console.log(currentPath[iteration]);
            let element = document.getElementById(currentPath[iteration]);
            let elementColor = element.style.backgroundColor + '';

            // console.log(elementColor, elementColor !== 'rgb(255, 255, 255)');

            if (command === "override") {
                element.style = `background-color:${color};`
            }


            // console.log(elementColor,color,elementColor !== color);

            if (elementColor !== 'rgb(255, 255, 255)' && elementColor !== color && elementColor != 'rgb(0, 0, 0)') {
                element.style = `background-color:${color};`

                if (color !== 'rgb(0, 0, 0)') {
                    currentGridInfo.allCheckedNodes.push(currentPath[iteration]);
                    // console.log(currentPath[iteration], elementColor, color);
                }
                // console.log(element, elementColor);

            }
        }
    }
}

function generalAnimation(position) {
    playerCharacter.style = `transform :translate(${position[0]}px,${position[1]}px)`
}

function initiateGridInfo(elementId) {
    for (let i = 0; i < numOfGrid; i++) {
        currentGridInfo.gridToNodeRelations[i + 1] = [];
        currentGridInfo.gridToNodeWeights[i + 1] = [];
        currentGridInfo.gridToNodeLevel[i + 1] = [];
        currentGridInfo.gridToNodeDistanceFromSource[i + 1] = Infinity;
        currentGridInfo.gridToNodeDistanceToTarget[i + 1] = -1;
    }
    currentGridInfo.pqForPathfinding.push(elementId, 0);
    currentGridInfo.gridToNodeDistanceFromSource[elementId] = 0;
    currentGridInfo.gridToNodeLevel[elementId] = -1;
    currentGridInfo.parentNode[elementId] = -1;
    // currentGridInfo.closedNode.push(elementId);
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
    tempi = 0;
    // console.log(currentGridInfo.allCheckedNodes);
    illuminatePath('override', currentGridInfo.allCheckedNodes, 'rgb(0, 255, 0)');
    currentGridInfo.allCheckedNodes = [];
    heuristicDetails.boolean = [false, false, false, false, false, false, false, false];
}

function printShortestPath(parents, node) {
    // console.log(`Parents and node`, parents, node + "");

    if (parents[node] === -1) {
        currentPath.push(node + "");
        return;
    }

    printShortestPath(parents, parents[node]);


    // console.log(node + " ");
    currentPath.push(node + "");

}

function printShortestPathAstar(parents, node) {

    if (parents[node] === -1 || debugVars.currentIteration > 10) {
        currentPath.push(node + "");
        return;
    }
    // debugVars.currentIteration++;


    printShortestPathAstar(parents, parents[node]);
    currentPath.push(node + "");
    // console.log(node + " ");


}

function algorithmEndingAction(target) {
    // illuminatePath('', currentGridInfo.closedNode, 'rgb(255, 255, 255)');
    illuminatePath('override', [currentGridInfo.currentSource], 'yellow');
    // console.log(currentGridInfo.gridToNodeRelations[target]);
    // console.log(currentGridInfo.gridToNodeWeights[target]);
    // console.log(currentGridInfo.gridToNodeDistanceFromSource[target]);
    // console.log(currentGridInfo.parentNode);
    if (elementStat.currentAlgorithm === "Dijkstra")
        printShortestPath(currentGridInfo.parentNode, target)
    else {
        printShortestPathAstar(currentGridInfo.parentNode, target);
        // fixPath(currentPath)
    }
    if (currentPath.length <= 0) {
        showFloatingMsg(`No path valid! `);
    } else {
        placePlayerCharacterGrid(target);
        illuminatePath('override', currentPath, 'yellow');

    }
    console.log(currentPath);

    // console.log(currentPath);

}

function placePlayerCharacterGrid(target) {
    if (currentPath.length <= 0) {
        playerCharacterPosition.lastPositionId = target;
        elementStat.moveComplete = true;
        return;
    }
    let position = getPosition(currentPath.shift());
    // console.log(currentPath)


    generalAnimation(position);

    setTimeout(() => {
        placePlayerCharacterGrid(target);

    }, 200)
}

function soCalledHeuristic(source, target) {
    let sourcePos = getPosition(source);
    let targetPos = getPosition(target);

    let distance = Math.pow((sourcePos[0] - targetPos[0]), 2) + Math.pow((sourcePos[1] - targetPos[1]), 2);

    //  console.log(`distance : ` , distance);


    return distance;
}