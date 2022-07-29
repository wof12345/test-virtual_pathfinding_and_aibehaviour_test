let tempi = 0;
let currentPath = [];
let background = document.querySelector(`.background`)
let floatingMsg = document.querySelector(`.floating_message`)
let playerCharacter = document.querySelector(`.playerCharacter`)
let numOfGrid = 12192;
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
    currentAlgorithm: 'Dijkstra',
}
let neighborParams = {
    left: [-96, -95, 1, 97, 96],
    middle: [-97, -96, -95, -1, 1, 95, 96, 97],
    right: [-97, -96, -1, 96, 95],
    singleLeft: -1,
    singleRight: 1,
    singleTop: -96,
    singleBottom: 96,
    singleCrossLeftBottom: 95,
    singleCrossRightBottom: 97,
    singleCrossRightTop: -95,
    singleCrossLeftTop: -97,
}

let currentGridInfo = {
    gridToNodeRelations: [],
    gridToNodeDistanceFromSource: [],
    gridToNodeWeights: [],
    gridToNodeLevel: [],
    pqForPathfinding: new PriorityQueue(),
    parentNode: [],
    closedNode: [],
    allCheckedNodes: [],
    currentSource: 0,
    currentTarget: 0,
    gridToNodeDistanceToTarget: [],
    currentSmallestfCost: Infinity,
}

let debugVars = {
    maxIteration: 20,
    currentIteration: 0,
}

let heuristicDetails = {
    boolean: [false, false, false, false, false, false, false, false],
    heuristicNextClosest: [
        [0, 0, 0],
        [1, 5, 6],
        [2, 7, 8],
        [3, 6, 7],
        [4, 5, 8],
        [5, 1, 4],
        [6, 1, 3],
        [7, 2, 3],
        [8, 2, 4]
    ],
    initiated: false,
}