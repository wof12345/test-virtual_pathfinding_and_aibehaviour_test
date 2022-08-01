let numberOfNodesTraversed = 0;

let currentPath = []; //stores the most recent used path

let gridTotal = GETDOMQUERY("#total_nodes"); //stores container of total number of nodes
let gridColumns = GETDOMQUERY("#columns"); //column input and view
let gridBlocks = GETDOMQUERY("#blocks"); //block input and view
let gridGenerationBtn = GETDOMQUERY(".grid_gen"); //generation button
let gridresetBtn = GETDOMQUERY(`.grid_reset`); //reset button
let algo_select = GETDOMQUERY(`#algo`); //algo select component
let mode_select = GETDOMQUERY(`#mode`); //direction mode select component
let animation_select = GETDOMQUERY(`#animation_type`); //animation type select
let sourceView = GETDOMQUERY(`#source`); //current source
let currentView = GETDOMQUERY(`#current`); //current node
let targetView = GETDOMQUERY(`#target`); //destination node
let algorithmView = GETDOMQUERY(`.header`); //current algorithm
let background = GETDOMQUERY(`.master_container`); //outer most grid container
let floatingMsg = GETDOMQUERY(`.floating_message`); //message view

let playerCharacter = GETDOMQUERY(`.playerCharacter`); //traversal reference

let traversalOptionbtn = GETDOMQUERY(`.traversal_options`); //traversal options
let gridOptionbtn = GETDOMQUERY(`.grid_options`); //grid option button
let droppables = GETDOMQUERY(`.node_traversal_info`); //view toggolabe options

let add_block = GETDOMQUERY(`.grid_add_block`); //add block button
let remove_block = GETDOMQUERY(`.grid_remove_block`); //remove block button

let numOfGrid = 2000; //stores node count
let numOfBlockades = 20; //blockade count

let gridStats = {
  columns: 50,
  rows: 0, //don't manipulate
  fixerVarTop: background.offsetTop,
  fixerVarLeft: background.offsetLeft,
}; //current grid statistics

let playerClickCounter = 0; //counts clicks

let blockades = []; //stores blockades

// let moveLogic = {
//   triedYpos: false,
//   triedXpos: false,
// }; outadated

let timeConst = 100; //

let playerCharacterPosition = {
  placed: false,
  lastPositionId: 1,
  currentPositionId: 1,
  posX: 0,
  posY: 0,
  yChangeConstant: gridStats.columns,
  xDistanceConstant: 20,
  yDistanceConstant: 20,
}; //reference statistics

let elementStat = {
  moveComplete: true,
  currentAlgorithm: "DFS",
  animationType: "Normal",
  mode: "8-Directional",
}; //selected options and conditions

let neighborParams = {
  left: [
    -gridStats.columns,
    -(gridStats.columns - 1),
    1,
    gridStats.columns + 1,
    gridStats.columns,
  ],
  middle: [
    -(gridStats.columns + 1),
    -gridStats.columns,
    -(gridStats.columns - 1),
    -1,
    1,
    gridStats.columns - 1,
    gridStats.columns,
    gridStats.columns + 1,
  ],
  right: [
    -(gridStats.columns + 1),
    -gridStats.columns,
    -1,
    gridStats.columns,
    gridStats.columns - 1,
  ],
  left4Dir: [-gridStats.columns, 1, gridStats.columns],
  middle4Dir: [-gridStats.columns, -1, 1, gridStats.columns],
  right4Dir: [-1, gridStats.columns],
  singleLeft: -1,
  singleRight: 1,
  singleTop: -gridStats.columns,
  singleBottom: gridStats.columns,
  singleCrossLeftBottom: gridStats.columns - 1,
  singleCrossRightBottom: gridStats.columns + 1,
  singleCrossRightTop: -(gridStats.columns - 1),
  singleCrossLeftTop: -(gridStats.columns + 1),
}; //hardcoded auto adjusting neighbour navigation parameters

let currentGridInfo = {
  gridToNodeRelations: [],
  gridToNodeDistanceFromSource: [],
  gridToNodeWeights: [],
  gridToNodeLevel: [],
  pqForPathfinding: new PriorityQueue(),
  blockades: new PriorityQueue(),
  parentNode: [],
  closedNode: [],
  allCheckedNodes: [],
  currentSource: 0,
  currentTarget: 0,
  gridToNodeDistanceToTarget: [],
  currentSmallestfCost: Infinity,
  timeVar: 0,
  cycles: 0,
  tsSortstartTime: [],
  tsSortendTime: [],
  normalNodeIteration: [],
  traversalDone: false,
  lastSelectedNode: null,
}; //current traversal storages and information

let debugVars = {
  maxIteration: 20,
  currentIteration: 0,
}; //debug

let pageKeyPressRecords = {
  currentKeyPressed: null,
}; //keypress stores

let pageLogics = {
  grid_optionOpen: false,
  traversal_optionOpen: false,
  add_block_mode_on: false,
  remove_block_mode_on: false,
}; //UI view logics

class referenceObj {
  constructor(posx, posy, referenceName) {
    this.posX = posx;
    this.posY = posy;
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
    this.lastSelectedNode = null;
    (this.placed = false),
      (this.lastPositionId = 1),
      (this.currentPositionId = 1),
      (this.yChangeConstant = gridStats.columns),
      (this.xDistanceConstant = 20),
      (this.yDistanceConstant = 20);
    this.referenceName = referenceName;
  }

  initialPlacement(element, elementId, position) {
    //place reference into initial position
    this.currentTarget = elementId;
    if (!this.placed) {
      element.innerHTML = `<div class="${this.referenceName} reference"></div>`;

      this.placed = true;
      this.posX = position[0];
      this.posY = position[1];
      this.currentPositionId = elementId;
      this.lastPositionId = elementId;

      generalAnimation(position);
      endSequence(playerCharacterPosition.currentPositionId);
    } else {
      illuminatePath("", [elementId], "rgba(255, 0, 0, 0.5)");
      determineAlgorithm(currentGridInfo, elementId);
    }
  }
}

let ref1 = new referenceObj(20, 20);

console.log(ref1.placed);
