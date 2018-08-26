var canvas;
var canvasContext;
//var time = 0;
var infected = [];
var waveInfectedAmmount = 2;//see input.js to set this
var wave = 1;//see input.js to set this
var spawnTimer = 0;//see input.js to set this
var gameStarted = false;
var myInterval;
var framesBetweenSpawns = 60;//see input.js to set this

function startGame(){//called from input.js when necessary

	var framesPerSecond = 30
	if(gameStarted){
		myInterval = setInterval(updateAll, 1000/framesPerSecond);
	}
}

function newWave(){//create new wave when the last one is empty, called in input.js
	if(infected.length <=0){
		wave++;
		if(wave>=5){
			framesBetweenSpawns = 30;
		}
		waveInfectedAmmount += wave;
		spawnTimer = 0;
		infected = [];
		prepareWave();
	}
}

window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	showLoadingScreen();

	initializePlayerLocation();
	
	loadImages();
	playerInput();
}

function showLoadingScreen(){
	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES...", canvas.width/2-50,canvas.height/2, 'white');
}

function prepareWave(){//put infected instances in an array and set their spawn times
	for(var i=0;i<waveInfectedAmmount;i++){
		infected[i] = new infectedClass();
		infected[i].spawnTime = framesBetweenSpawns * i;
	}
}
			
function updateAll(){
		//console.log(gameStarted);
		//console.log(spawnTimer);
		updateWorld();
		updateInfected();
		updatePlayer();
		updateScoreScreen();

		//helper for mouse coords
		/*var targetTileX = Math.floor(targetX / TILE_W);
		var targetTileY = Math.floor(targetY / TILE_H);
		
		//colorText(targetTileX+","+targetTileY, targetX+10,targetY-10, 'yellow');
		colorText(targetX+","+targetY, targetX+10,targetY-10, 'yellow');*/
		
		//infected[1].drawhitbox();
		
		//auto player rotation for testing
		/*targetX = (canvas.width/2) - 50*Math.cos(-time*0.54);
		targetY = (canvas.height/2 + 50)-50*Math.sin(-time*0.54);
		time++*/
		gameReset();
}

function updateInfected(){
	for(var i=infected.length-1;i>=0;i--){//reverse checking the array because detectLaserDamage can remove elements from it
		detectSecondaryDamage(i);/*checking if spawned inside the fuction
		if I put this at the if bellow it breaks the game somehow (if i kill the last infected 
		of a wave with secondary, the last infected of the next wave doesn't spawn, maybe doesn't 
		even exist! weird stuff!)depending on order of functions, or
		if I put this in the for for bellow it introduces error (because it can remove elements 
		from the array and they can't be checked, stutters the game)*/
	}
	
	for(var i=infected.length-1;i>=0;i--){
		if(infected[i].spawnTime == spawnTimer){//spawn them at the right time
			infected[i].spawn = true;
		}
		if(infected[i].spawn == true){//update and damage them only if they have spawned
			infected[i].draw();
			infected[i].movement();
			infected[i].hitDetectionSetup();
		}
	}
	spawnTimer++;//counts the time to spawn
}

function updatePlayer(){
	rotatePlayer();
	drawPlayer();
	playerImage = playerPic;//resetting this all the time seems quite ineficcient,but...
	playerHitDetectionSetup();
}

function updateWorld(){//would like to add more to this(walls, covers, cracks on ground, destroyed objects, etc.)
	drawWorld();
}

function updateScoreScreen(){
	drawScoreboard();
	drawScore();
}

function drawScore(){
	colorText("Player Life: "+playerLife, canvas.width-95,100, 'white');
	drawPlayerLifeBar();
	colorText("Total Killed: "+infectedKilled, canvas.width-95,200, 'white');
	colorText("Remaining", canvas.width-95,300, 'white');
	colorText("This Wave: "+infected.length, canvas.width-95,310, 'white');
	colorText("Current Wave: "+wave, canvas.width-95,400, 'white');
}

function drawScoreboard(){
	colorRect(canvas.width - 2*TILE_W ,0, 2*TILE_W,canvas.height, 'black');
	colorRect(canvas.width - 2*TILE_W ,0, 2,canvas.height, 'yellow');
}