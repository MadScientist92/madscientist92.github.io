var targetX;
var targetY;

var rightMousePressed = false;

var primaryRateCooldown = 7;
var primaryRateCount = 0;
var laserDamageRateCooldown = 3;

var headshotDamage = 30;
var torsoshotDamage = 20;
var legshotDamage = 15;
var laserDamage = 10;

function calculateMousePos(evt){
		var rect = canvas.getBoundingClientRect();
		//var root = document.documentElement;
		var mouseX = evt.clientX - rect.left;// - root.scrollLeft;
		var mouseY = evt.clientY - rect.top;// - root.scrollTop;
		return {
			x:mouseX,
			y:mouseY
		};
	}

function detectSecondaryDamage(pos){//called in updateInfected, main.js
	if(rightMousePressed){
		playerImage = playerPicSecondary;
		if(infected[pos].spawn == true){
			infected[pos].damagedBySecondary();
			if(infected[pos].life <=0){
				infected.splice(pos,1);
				//console.log("now");
				infectedKilled++;
				newWave();
			}//if infected died remove it from array and check if we need new wave
		}//if infected has spawned yet
	}//if right mouse button is pressed
}//end of function

function resetValues(){//reset on game restart
	gameStarted = true;
	framesBetweenSpawns = 60;
	spawnTimer = 0;
	playerLife = 100;
	waveInfectedAmmount = 2;
	wave = 1;
	infectedKilled = 0;
}

function detectPrimaryDamage(){
	if(primaryRateCount<=0 && rightMousePressed == false){
		primaryRateCount = primaryRateCooldown;
		playerImage = playerPicPrimary;
		for(var i=0;i<infected.length;i++){
			infected[i].damagedByPrimary();//if I want auto weapon must be called in updateAll, similar to detectLaserDamage
			if(infected[i].life <= 0){
				infected.splice(i,1);
				infectedKilled++;
				newWave();
			}//if infected died remove it from array and check if we need new wave
		}//for all infected instances in current wave
	}//if within shooting rate
}//end of function

function handleMouseDown(e) {
	//e.button describes the mouse button that was clicked
	// 0 is left, 1 is middle, 2 is right
	if(e.button == 2){
		rightMousePressed = true;
		
	}else if(e.button === 0) {
		if(gameStarted == false){//start or restart game on left click
			resetValues();
			prepareWave();
			startGame();
		}else{//damage on left click
			detectPrimaryDamage();
		}
	}
}

function handleMouseUp(e) {
	if (e.button == 2) {
		rightMousePressed = false;
	}
}

function playerInput(){//setting up input
	canvas.addEventListener('mousemove',
	function(evt){
		var mousePos = calculateMousePos(evt);
		targetX = mousePos.x;
		targetY = mousePos.y;
	});
	
	canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mouseup', handleMouseUp);
	canvas.addEventListener('contextmenu',
	function(e){
		e.preventDefault();//prevent menu from appearing when right clicking over canvas
	})
}

