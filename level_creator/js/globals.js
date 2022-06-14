//MAIN GRID
const CANVAS_WIDTH = 910;
const CANVAS_HEIGHT = 700;
const grid = [];

//MOUSE COORDS
var mouse = {
	x: CANVAS_WIDTH / 2,
	y: CANVAS_HEIGHT / 2
}

const SHADOW = "rgba(0, 0, 0, 0.3)";

var editingBlocks = true;

var floating_cache = {
	content: null,
	pause: false
};

const boxSize = 35;
var player = null;
const exportedEnemies = [];
const exportedBlocks = [];
const exportedPits = [];
var holding = false;

//ASSETS//
const REGULAR_BLOCK = 1;
const LOOSE_BLOCK = 2;
const PIT = 3;
const PLAYER = 4;
const BROWN_TANK = 5;

var currAsset = REGULAR_BLOCK;

function switchEditing(isEditingBlocks) {
	if (isEditingBlocks) {
		//remove floating cache to stop rendering tank overview because we are now editing blocks
		editingBlocks = true;
		floating_cache.content = null;
	} else {
		//set floating cache to the current floating asset
		editingBlocks = false;

		switch (currAsset) {
			case PLAYER:
				floating_cache.content = new Player(0.5, 0);
				break;
			case BROWN_TANK:
				floating_cache.content = new BrownTank(0.5, 0);
				break;
		}
	}
}