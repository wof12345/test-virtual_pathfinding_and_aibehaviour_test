let numberOfNodesTraversed = 0;

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

let numOfGrid = 1000; //stores node count
let numOfBlockades = 100; //blockade count
let nodeSizes = "30px";

let gridStats = {
  columns: 40,
  rows: 0, //don't manipulate
  fixerVarTop: background.offsetTop - 40,
  fixerVarLeft: background.offsetLeft - 6,
  referenceSizeWidth: nodeSizes,
  referenceSizeHeight: nodeSizes,
}; //current grid statistics

// console.log(gridStats.fixerVarTop);

let playerClickCounter = 0; //counts clicks

let timeConst = 100; //

let player = "";

let gridConstants = {
  yChangeConstant: gridStats.columns,
  xDistanceConstant: 10,
  yDistanceConstant: 10,
}; //reference statistics

let traversalTypeInfo = {
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
    -gridStats.columns,
    -(gridStats.columns - 1),
    -(gridStats.columns + 1),
    -1,
    1,
    gridStats.columns - 1,
    gridStats.columns + 1,
    gridStats.columns,
  ],
  right: [
    -gridStats.columns,
    -(gridStats.columns + 1),
    -1,
    gridStats.columns - 1,
    gridStats.columns,
  ],
  left4Dir: [-gridStats.columns, 1, gridStats.columns],
  middle4Dir: [-gridStats.columns, -1, 1, gridStats.columns],
  right4Dir: [-gridStats.columns, -1, gridStats.columns],
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
  nodes: [],
  blockades: [],
  blockadesPQ: new PriorityQueue(),
  allCheckedNodes: [],
  currentSource: 0,
  currentTarget: 0,
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
