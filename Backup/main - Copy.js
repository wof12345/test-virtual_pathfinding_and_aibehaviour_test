generateBackground(numOfGrid); //24384
generateBlockades(7000);
quickSort(blockades, 0, blockades.length - 1);

function driverFunction(currentNode) {
    let currentNeighbors = [];
    let arrayToFollow = neighborParams.middle;

    if (currentNode % 96 === 0) {
        arrayToFollow = neighborParams.right;
    }
    if ((currentNode - 1) % 96 === 0) {
        arrayToFollow = neighborParams.left;
    }

    for (let i = 0; i < arrayToFollow.length; i++) {
        let neighTemNode = currentNode + +arrayToFollow[i];
        let parentPosition, position, distance;

        if (neighTemNode <= numOfGrid && neighTemNode > 0) {
            currentNeighbors.push(neighTemNode)

            currentGridInfo.gridToNodeRelations[currentNode].push(neighTemNode);
            currentGridInfo.gridToNodeRelations[neighTemNode].push(currentNode);

            position = getPosition(neighTemNode);
            parentPosition = getPosition(currentNode)
            distance = Math.pow((position[0] - parentPosition[0]), 2) + Math.pow((position[1] - parentPosition[1]), 2);
            currentGridInfo.gridToNodeWeights[currentNode].push(distance);
            currentGridInfo.gridToNodeWeights[neighTemNode].push(distance);
        }
    }

    illuminatePath('', currentNeighbors, 'rgba(255, 0, 0, 0.99)')
    tempi++;
}

// function driverFunctionHeuristic(currentNode) {
//     let currentNeighbors = [];
//     let arrayToFollow = neighborParams.middle;
//     let finalNode;
//     // console.log('Passed Node : ',currentNode);
//     heuristicDetails.initiated = false;
//     heuristicDetails.boolean = [false, false, false, false, false, false, false, false]


//     if (currentNode % 96 === 0) {
//         arrayToFollow = neighborParams.right;
//     }
//     if ((currentNode - 1) % 96 === 0) {
//         arrayToFollow = neighborParams.left;
//     }

//     finalNode = soCalledHeuristic(currentNode, currentGridInfo.currentTarget, heuristicDetails.heuristicNextClosest, 0, 0)

//     console.log(`FinalNode : `,finalNode);

//     let parentPosition, position, distance;
//     currentNeighbors.push(finalNode)

//     currentGridInfo.gridToNodeRelations[currentNode].push(finalNode);
//     currentGridInfo.gridToNodeRelations[finalNode].push(currentNode);

//     position = getPosition(finalNode);
//     parentPosition = getPosition(currentNode)
//     distance = Math.pow((position[0] - parentPosition[0]), 2) + Math.pow((position[1] - parentPosition[1]), 2);
//     currentGridInfo.gridToNodeWeights[currentNode].push(distance);
//     currentGridInfo.gridToNodeWeights[finalNode].push(distance);


//     illuminatePath('', currentNeighbors, 'rgba(255, 0, 0, 0.99)')
//     tempi++;
// }

function determineJourneyStats(elementId) {
    initiateGridInfo(playerCharacterPosition.lastPositionId);
    if (elementStat.currentAlgorithm === 'Dijkstra')
        Dijkstra(elementId);
    else
        Astar(elementId);
}

function placePlayerCharacter(element, elementId, position) {
    currentGridInfo.currentTarget = elementId;
    if (element.lastChild ?.className !== 'playerCharacter' && !playerCharacterPosition.placed) {
        element.insertAdjacentHTML('beforeend', '<div class="playerCharacter"></div>')
        playerCharacterPosition.placed = true;
        playerCharacter = document.querySelector(`.playerCharacter`)
        playerCharacterPosition.posX = position[0];
        playerCharacterPosition.posY = position[1];
        playerCharacterPosition.currentPositionId = elementId;
        playerCharacterPosition.lastPositionId = elementId;

        generalAnimation(position);
        // testFunction(20);
        endSequence(playerCharacterPosition.currentPositionId);
    } else {
        determineJourneyStats(elementId);
    }
    // console.log('Pos : ', playerCharacterPosition.currentPositionId);

}

background.addEventListener('click', function(e) {
    let goingto = e.target;
    let topPos = goingto.offsetTop - 10;
    let leftPos = goingto.offsetLeft - 14;
    if (goingto.className === 'playerCharacter') {
        // console.log('current position : ', leftPos, topPos);

    }
    if (elementStat.moveComplete && !binarySearch(blockades, 0, blockades.length - 1, +goingto.id) && !(goingto.className === 'playerCharacter')) {
        elementStat.moveComplete = false;
        playerCharacterPosition.currentPositionId = goingto.id;
        playerClickCounter++;
        resetGridInfo();
        // console.log(currentGridInfo);


        if (e.target.className !== 'playerCharacter') {
            if (!playerCharacterPosition.placed)
                goingto = document.querySelector(`.seed_1`);

            placePlayerCharacter(goingto, playerCharacterPosition.currentPositionId, [leftPos, topPos]);
        }
    }
})

document.body.addEventListener('keydown', function(e) {
    // console.log(e.key);

    if (e.key === 't') {
        if (elementStat.currentAlgorithm === 'Dijkstra')
            elementStat.currentAlgorithm = 'A*';
        else
            elementStat.currentAlgorithm = 'Dijkstra';

        showFloatingMsg(`Algorithm changed to ${elementStat.currentAlgorithm}`);
    }
})

// function testFunction(value) {
//     if (value <= 0) return;

//     let temppos1, temppos2;
//     if (generateRandomNumber(100) < 20) {
//         temppos1 = 10;
//         temppos2 = 10;
//     } else if (generateRandomNumber(100) < 40) {
//         temppos1 = 10;
//         temppos2 = -10;
//     } else if (generateRandomNumber(100) < 60) {
//         temppos1 = -10;
//         temppos2 = 10;
//     } else if (generateRandomNumber(100) < 80) {
//         temppos1 = -10;
//         temppos2 = -10;
//     }

//     playerCharacterPosition.posX += temppos1;
//     playerCharacterPosition.posY += temppos2;

//     console.log(temppos1, temppos2);


//     generalAnimation([playerCharacterPosition.posX, playerCharacterPosition.posY])
//     setTimeout(() => {
//         testFunction(--value)
//     }, 2000)
// }