let background = document.querySelector(`.background`)
let floatingMsg = document.querySelector(`.floating_message`)
let playerCharacter;
let currentPath = [];
let playerClickCounter = 0;
let blockades = [];
let movementScheme = 1;
let moveLogic = {
    triedYpos: false,
    triedXpos: false,
}
let timeConst = 100;
let playerCharacterPosition = {
    placed: false,
    lastPositionId: 1,
    currentPositionId: 1,
    posX: 0,
    posY: 0,
    yChangeConstant: 96,
    xDistanceConstant: 10,
    yDistanceConstant: 10,
}
let elementStat = {
    moveComplete: true,
    // moveIteration: 0,
}

function generateRandomNumber(limit) {
    return Math.random() * limit + 1;
}

function generateBackground(count) {
    for (let counter = 1; counter <= count; counter++)
        background.insertAdjacentHTML('beforeend', `<div class="landmark seed_${counter}" id="${counter}"></div>`)
}

function generateBlockades(count) {
    for (let counter = 1; counter <= count; counter++) {
        let seed = Math.round(generateRandomNumber(7000));
        blockades.push(seed);
    }
    paintBlockades(blockades);
}

function paintBlockades(array) {
    for (let counter = 0; counter < array.length; counter++) {
        document.getElementById(array[counter]).style = 'background-color:black'
    }
}

generateBackground(12192); //24384
generateBlockades(500);
quickSort(blockades, 0, blockades.length - 1);

function showFloatingMsg(string) {
    floatingMsg.textContent = string;
    floatingMsg.style = `padding:20px;width:max-content`

    setTimeout(() => {
        floatingMsg.textContent = ``;
        floatingMsg.style = null;
    }, 1000)
}

function generalAnimation(position) {
    playerCharacter.style = `transform :translate(${position[0]}px,${position[1]}px)`
}

function executeFirst(id, coordinate) {
    // let increased = false;
    // let originalId = id;
    if (coordinate === 'x') {
        playerCharacterPosition.posX += playerCharacterPosition.xDistanceConstant;
        id += 1;
    } else {
        playerCharacterPosition.posX -= playerCharacterPosition.xDistanceConstant;
        id -= 1;
    }
    // } else {
    //     if (!moveLogic.triedXpos) {
    //         playerCharacterPosition.posX += playerCharacterPosition.xDistanceConstant;
    //         id += 1;
    //         // moveLogic.triedXpos = true;
    //     } else {
    //         playerCharacterPosition.posX -= playerCharacterPosition.xDistanceConstant;
    //         id -= 1;
    //         moveLogic.triedXpos = false;
    //     }
    // }
    // if (destinationCoordinates[0] === 0 && (playerCharacterPosition.posX < 0 || playerCharacter.posX === 1)) {
    //     playerCharacterPosition.posX = 0;
    // }
    // console.log(`First : `, playerCharacterPosition.posX, playerCharacterPosition.posY, id, `Gotten coords : `, destinationCoordinates[1], playerCharacterPosition.posY);
    // let res = binarySearch(blockades, 0, blockades.length - 1, id)
    // if (res !== false) {
    //     if (true) {
    //         playerCharacterPosition.posX -= playerCharacterPosition.xDistanceConstant;
    //     } else {
    //         playerCharacterPosition.posX += playerCharacterPosition.xDistanceConstant
    //     }

    //     id = executeSecond(originalId, destinationCoordinates);
    //     return id;
    // }

    generalAnimation([playerCharacterPosition.posX, playerCharacterPosition.posY]);
    return id;
}

function executeSecond(id, coordinate) {
    // let increased = false;
    // let originalId = id;
    if (coordinate === 'y') {
        playerCharacterPosition.posY += playerCharacterPosition.yDistanceConstant;
        id += playerCharacterPosition.yChangeConstant;

    } else {
        playerCharacterPosition.posY -= playerCharacterPosition.yDistanceConstant;
        id -= playerCharacterPosition.yChangeConstant;
    }
    // } else {
    //     if (!moveLogic.triedYpos) {
    //         playerCharacterPosition.posY += playerCharacterPosition.yDistanceConstant;
    //         id += playerCharacterPosition.yChangeConstant;
    //         // moveLogic.triedYpos = true;
    //     } else {
    //         playerCharacterPosition.posY -= playerCharacterPosition.yDistanceConstant;
    //         id -= playerCharacterPosition.yChangeConstant;
    //         moveLogic.triedYpos = false;
    //     }
    // }
    // console.log(`Second : `, playerCharacterPosition.posX, playerCharacterPosition.posY, id, `Gotten coords : `, destinationCoordinates[1], playerCharacterPosition.posY);

    // let res = binarySearch(blockades, 0, blockades.length - 1, id)
    // if (res !== false) {
    //     if (true) {
    //         playerCharacterPosition.posY -= playerCharacterPosition.yDistanceConstant;
    //     } else {
    //         playerCharacterPosition.posY += playerCharacterPosition.yDistanceConstant
    //     }

    //     // console.log(`Tobe destination : `, destinationCoordinates);

    //     id = executeFirst(originalId, destinationCoordinates);
    //     return id;
    // }
    console.log(id);


    generalAnimation([playerCharacterPosition.posX, playerCharacterPosition.posY]);
    return id;
}

function executeGeneral(id, destinationCoordinates) {
    if (destinationCoordinates[0] > playerCharacterPosition.posX) {
        playerCharacterPosition.posX += playerCharacterPosition.xDistanceConstant;
        id += 1;
    } else if (destinationCoordinates[0] < playerCharacterPosition.posX) {
        playerCharacterPosition.posX -= playerCharacterPosition.xDistanceConstant;
        id -= 1;
    }

    if (destinationCoordinates[1] > playerCharacterPosition.posY) {
        playerCharacterPosition.posY += playerCharacterPosition.yDistanceConstant;
        id += playerCharacterPosition.yChangeConstant;
    } else if (destinationCoordinates[1] < playerCharacterPosition.posY) {
        playerCharacterPosition.posY -= playerCharacterPosition.yDistanceConstant;
        id -= playerCharacterPosition.yChangeConstant;
    }

    // console.log(`General : `, playerCharacterPosition.posX, playerCharacterPosition.posY);

    generalAnimation([playerCharacterPosition.posX, playerCharacterPosition.posY]);

    return id;
}

function illuminatePath(command) {
    for (let iteration = 0; iteration < currentPath.length; iteration++) {
        if (currentPath[iteration])
            document.getElementById(currentPath[iteration]).style = 'background-color:white;'
    }
    if (command === "erase") {
        for (let iteration = 0; iteration < currentPath.length; iteration++) {
            if (currentPath[iteration])
                document.getElementById(currentPath[iteration]).style = '';
        }
    }
}

function endSequence(currentPositionId) {
    elementStat.moveComplete = true;
    playerCharacterPosition.lastPositionId = currentPositionId;
    document.getElementById(playerCharacterPosition.currentPositionId).style = ``;
}

function determineNextPath(currentPath, id, idForConsideration) {
    // console.log(axis.splice(moveIteration));
    // console.log(axis);


    if (currentPath === 'x') {
        let res = binarySearch(blockades, 0, blockades.length - 1, id + playerCharacterPosition.yDistanceConstant)

    }

}

function runMoveSequenceIneffecient(axis, length, moveIteration, position, id) {
    // let preid;
    // if(axis[0]==='x')
    // preid= id+1;
    // else
    // preid=id+playerCharacterPosition.yChangeConstant;
    let res = binarySearch(blockades, 0, blockades.length - 1, id)
    if (res) {

        // let completePath=[];
        // let latterHalf = axis.splice(moveIteration);
        // let fontHalf = determineNextPath(axis[moveIteration], id, moveIteration);

        console.log(id);
        return;
    } else {

        // console.log('current id : ', id, axis[moveIteration]);
        // if (playerCharacterPosition.lastPositionId === id || isNaN(id)) {
        //     let lastId = currentPath[currentPath.length - 2];
        //     if (lastId !== undefined)
        //         playerCharacterPosition.lastPositionId = lastId;
        //     else
        //         playerCharacterPosition.lastPositionId = playerCharacterPosition.lastPositionId;

        //     playerCharacterPosition.currentPositionId = lastId;
        //     console.log('lastvalid : ', lastId);
        //     // it+=4;
        //     // console.log('valid paths : ', currentPath);
        //     // return;
        // }


        if (moveIteration < length) {
            console.log('Iteration : ', moveIteration);

            if (axis[moveIteration] === 'x' || axis[moveIteration] === '-x') {
                id = executeFirst(id, axis[moveIteration])
                currentPath.push(id);
            } else if (axis[moveIteration] === 'y' || axis[moveIteration] === '-y') {
                id = executeSecond(id, axis[moveIteration])
                currentPath.push(id);
            }
        }


        illuminatePath();
        if (moveIteration >= length) {
            // console.log('end called','end Id : ',id,'end position : ', position);

            endSequence(playerCharacterPosition.currentPositionId);
            return;
        }
    }

    setTimeout(() => {
        runMoveSequenceIneffecient(axis, length, ++moveIteration, position, id);
    }, timeConst)


}

function runMoveSequenceEfficient(it, total, position, id) {
    id = executeGeneral(id, position)
    currentPath.push(id);

    // console.log(`Id : `, id);

    illuminatePath();

    if (it >= total) {
        endSequence(playerCharacterPosition.currentPositionId);
        return;
    }


    setTimeout(() => {
        runMoveSequenceEfficient(++elementStat.moveIteration, total, position, id);
    }, timeConst)
}

function determineJourneyStats(destinationCoordinates, position, elementId) {
    let loopsForX = Math.floor(Math.abs(destinationCoordinates[0] / playerCharacterPosition.xDistanceConstant));
    let loopsForY = Math.floor(Math.abs(destinationCoordinates[1] / playerCharacterPosition.yDistanceConstant));
    let latter, forth, axis = [],
        tracebackPaths = [];

    // if (loopsForX < loopsForY) {
    //     forth = loopsForX;
    //     latter = loopsForY;
    //     axis[0] = 'x';
    //     axis[1] = 'y';
    // } else {
    //     forth = loopsForY;
    //     latter = loopsForX;
    //     axis[0] = 'y';
    //     axis[1] = 'x';
    // }

    console.log('posion/destiation : ', destinationCoordinates, playerCharacterPosition.posX, playerCharacterPosition.posY);

    // let total = loopsForX + loopsForY;
    for (let i = 0; i < loopsForX; i++) {
        if (position[0] > playerCharacterPosition.posX) {
            axis.push('x');
            tracebackPaths.push('-x');
        } else {
            axis.push('-x');
            tracebackPaths.push('x');
        }

    }
    for (let i = 0; i < loopsForY; i++) {
        if (position[1] > playerCharacterPosition.posY) {
            axis.push('y');
            tracebackPaths.push('-y');
        } else {
            axis.push('-y');
            tracebackPaths.push('y');
        }

    }
    console.log('Axis : ', axis);

    // let totalLoops = (loopsForX > loopsForY ? loopsForX : loopsForY)
    // console.log(`Loops required : `, loopsForX, loopsForY);

    currentPath.push(playerCharacterPosition.lastPositionId)

    if (movementScheme === 2) {
        // runMoveSequenceEfficient(elementStat.moveIteration, totalLoops, position, +playerCharacterPosition.lastPositionId)
    } else {
        // console.log(`Passed position : ` + position,` Last position Id passed : ` + playerCharacterPosition.lastPositionId,`Passed element stats : ` + axis, total, forth );

        runMoveSequenceIneffecient(axis, axis.length, 0, position, +playerCharacterPosition.lastPositionId);
    }
}

function placePlayerCharacter(element, elementId, position) {

    if (element.lastChild ?.className !== 'playerCharacter' && !playerCharacterPosition.placed) {
        element.insertAdjacentHTML('beforeend', '<div class="playerCharacter"></div>')
        playerCharacterPosition.placed = true;
        playerCharacter = document.querySelector(`.playerCharacter`)
        playerCharacterPosition.posX = position[0];
        playerCharacterPosition.posY = position[1];
        playerCharacterPosition.currentPositionId = elementId;
        playerCharacterPosition.lastPositionId = elementId;

        generalAnimation(position);
        endSequence(playerCharacterPosition.currentPositionId);
    } else {
        let distanceX = position[0] - playerCharacterPosition.posX;
        let distanceY = position[1] - playerCharacterPosition.posY;

        // console.log(`Distance crossed : (${distanceX},${distanceY})`);
        determineJourneyStats([distanceX, distanceY], position, elementId);
        // console.log(`Current position : `, position);
    }
}

background.addEventListener('click', function(e) {
    let goingto = e.target;
    if (goingto.className === 'playerCharacter') {
        console.log('current position : ', goingto.offsetLeft - 14, goingto.offsetTop - 10);

    }
    if (elementStat.moveComplete && !binarySearch(blockades, 0, blockades.length - 1, +goingto.id) && !(goingto.className === 'playerCharacter')) {
        if (playerClickCounter > 1) elementStat.moveComplete = false;
        elementStat.moveIteration = 1;

        let topPos = goingto.offsetTop - 10;
        let leftPos = goingto.offsetLeft - 14;
        playerCharacterPosition.currentPositionId = goingto.id;
        playerClickCounter++;
        illuminatePath('erase');
        currentPath = [];

        console.log('Element position : ', goingto.offsetLeft, goingto.offsetTop, playerCharacterPosition.currentPositionId);

        paintBlockades(blockades);
        if (e.target.className !== 'playerCharacter') {
            if (!playerCharacterPosition.placed)
                goingto = document.querySelector(`.seed_1`);

            placePlayerCharacter(goingto, playerCharacterPosition.currentPositionId, [leftPos, topPos]);
        }
    }
})

document.body.addEventListener('keydown', function(e) {
    if (e.key === 't') {
        if (movementScheme === 1)
            movementScheme = 2;
        else
            movementScheme = 1;
    }
    showFloatingMsg('Movement scheme changed');
})

function soCalledHeuristic(source, target, nextInOrder, iterator, currentQuery) {
    let sourcePos = getPosition(source);
    let targetPos = getPosition(target);
    let finalnode = source;
    let distance = Math.pow((sourcePos[0] - targetPos[0]), 2) + Math.pow((sourcePos[1] - targetPos[1]), 2);

    console.log(source, sourcePos, target, targetPos, nextInOrder[currentQuery], iterator, distance);

    if ((sourcePos[0] > targetPos[0] && sourcePos[1] === targetPos[1] && !heuristicDetails.boolean[0]) || nextInOrder[currentQuery][iterator] === 1) {
        finalnode = source + neighborParams.singleLeft;
        heuristicDetails.boolean[0] = true;
        currentQuery = 0;
        console.log('Inted : 1');
    } else if ((sourcePos[0] < targetPos[0] && sourcePos[1] === targetPos[1] && !heuristicDetails.boolean[1]) || nextInOrder[currentQuery][iterator] === 2) {
        finalnode = source + neighborParams.singleRight;
        heuristicDetails.boolean[1] = true;
        currentQuery = 1;
        console.log('Inted : 2');
    } else if ((sourcePos[0] === targetPos[0] && sourcePos[1] < targetPos[1] && !heuristicDetails.boolean[2]) || nextInOrder[currentQuery][iterator] === 3) {
        finalnode = source + neighborParams.singleBottom;
        heuristicDetails.boolean[2] = true;
        currentQuery = 2;
        console.log('Inted : 3');
    } else if ((sourcePos[0] === targetPos[0] && sourcePos[1] > targetPos[1] && !heuristicDetails.boolean[3]) || nextInOrder[currentQuery][iterator] === 4) {
        finalnode = source + neighborParams.singleTop;
        heuristicDetails.boolean[3] = true;
        currentQuery = 3;
        console.log('Inted : 4');
    } else if ((sourcePos[0] > targetPos[0] && sourcePos[1] > targetPos[1] && !heuristicDetails.boolean[4]) || nextInOrder[currentQuery][iterator] === 5) {
        finalnode = source + neighborParams.singleCrossLeftTop;
        heuristicDetails.boolean[4] = true;
        currentQuery = 4;
        console.log('Inted : 5');
    } else if ((sourcePos[0] > targetPos[0] && sourcePos[1] < targetPos[1] && !heuristicDetails.boolean[5]) || nextInOrder[currentQuery][iterator] === 6) {
        finalnode = source + neighborParams.singleCrossLeftBottom;
        heuristicDetails.boolean[5] = true;
        currentQuery = 5;
        console.log('Inted : 6');
    } else if ((sourcePos[0] < targetPos[0] && sourcePos[1] < targetPos[1] && !heuristicDetails.boolean[6]) || nextInOrder[currentQuery][iterator] === 7) {
        finalnode = source + neighborParams.singleCrossRightBottom;
        heuristicDetails.boolean[6] = true;
        currentQuery = 6;
        console.log('Inted : 7');
    } else if ((sourcePos[0] < targetPos[0] && sourcePos[1] > targetPos[1] && !heuristicDetails.boolean[7]) || nextInOrder[currentQuery][iterator] === 8) {
        finalnode = source + neighborParams.singleCrossRightTop;
        heuristicDetails.boolean[7] = true;
        currentQuery = 7;
        console.log('Inted : 8');
    }
    console.log(`LastQ : `, currentQuery);
    console.log('Node checked : ', finalnode);



    heuristicDetails.initiated = true;


    if (!binarySearch(blockades, 0, blockades.length - 1, finalnode) || finalnode === source)
        return finalnode;
    else
        soCalledHeuristic(source, target, nextInOrder, ++iterator, currentQuery);
}