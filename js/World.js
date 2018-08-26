const TILE_W = 50;
const TILE_H = 50;
const TILE_COLS = 14;
const TILE_ROWS = 12;
const SCORE_SCREEN_WIDTH = 100;

var worldGrid = [0,0,1,0,1,0,0,0,1,0,0,0,0,1,
				 1,0,0,0,0,0,0,0,0,0,1,0,0,0,
				 0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 0,1,0,0,0,0,0,0,0,0,0,0,0,1,
				 0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 1,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				 1,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				 0,0,0,0,0,0,1,0,0,0,0,0,0,0,
				 1,0,0,0,1,0,0,0,0,1,0,0,0,1,
				 ];

const TILE_ROAD = 0;
const TILE_INFECTED = 1;

/*function colRowToArrayIndex(col,row){//will i even need this?
	return col + TILE_COLS * row;
}*/

function drawWorld(){
	var arrayIndex = 0;
	var tileX = 0;
	var tileY = 0;
	for(var eachRow=0;eachRow<TILE_ROWS;eachRow++){
		for(var eachCol=0;eachCol<TILE_COLS;eachCol++){
			var tileKind = worldGrid[arrayIndex];
			var useImg = worldImages[tileKind];
			
			canvasContext.drawImage(useImg, tileX,tileY);
			tileX += TILE_W;
			arrayIndex++;
		}
		tileY += TILE_H;
		tileX = 0;
	}
}