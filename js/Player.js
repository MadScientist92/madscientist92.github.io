var playerPic = document.createElement("img");
var playerPicPrimary = document.createElement("img");
var playerPicSecondary = document.createElement("img");
var playerImage = playerPic;

var playerX = 350;
var playerY = 300;
var playerAngle = 0;

var playerLife = 100;//see input.js to set this
var playerInvincibilityFrames = 20;
var playerHitCooldown = 0;

var playerNotDamagedRecently = true;

var infectedKilled = 0;//see input.js to set this

function initializePlayerLocation(){
	playerX = canvas.width / 2 - TILE_W;
	playerY = canvas.height / 2;
}

function playerHitDetectionSetup(){
	if(playerHitCooldown > 0){
		playerHitCooldown--;
	}else{
		playerNotDamagedRecently = true;
	}
	//console.log(playerHitCooldown);
	
	if(primaryRateCount > 0){
		primaryRateCount--;
	}
}

function gameReset(){//stops the game if you win or lose and displays proper message to restart
	if(playerLife<=0){
		showLoseScreen();
		gameStarted = false;
		infected = [];
		clearInterval(myInterval);
	}
	if(wave>10){
		showWinScreen();
		gameStarted = false;
		infected = [];
		clearInterval(myInterval);
	}
}

function showLoseScreen(){
	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("YOU LOSE!", canvas.width/2-30,canvas.height/2-100, 'red');
	colorText("LEFT CLICK TO RESTART GAME!", canvas.width/2 - 85,canvas.height/2, 'white');
}

function showWinScreen(){
	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("YOU WIN!", canvas.width/2-30,canvas.height/2-100, 'aquamarine');
	colorText("LEFT CLICK TO RESTART GAME!", canvas.width/2 - 85,canvas.height/2, 'white');
}

function rotatePlayer(){//this is a mess, brace yourself!
	
	var targetXDist = targetX - playerX;
	var targetYDist = targetY - playerY;

	if(targetXDist != 0){
		
		var tang = targetYDist / targetXDist;//tangent
		var targetAng = Math.atan(tang) + (targetXDist/Math.abs(targetXDist) )* Math.PI / 2;//angle between player center and mouse position (+/- Pi/2 for actual alignment, may be different depending on orientation of image loaded)

		var deltaAng = Math.abs(targetAng - playerAngle);//absolute difference of above angle with player rotation angle to calculate the direction of the delayed turning (see below)
		
		if(deltaAng > 0.01 && deltaAng < Math.PI){//if mouse moved enough but less than a straight angle
			playerAngle += (targetAng - playerAngle)*0.35;//lurp the angle for smoother motion in more frames (formula used bellow as well)
			
		}else if(deltaAng > 0.01 && deltaAng > Math.PI){//if mouse moved enough and more than a straight angle(reverse the rotation direction to take the short way)
			var angleToTurn = (targetAng - playerAngle)*0.35;
			var playerAngleTemp = playerAngle - angleToTurn;//separate variable needed bellow
			
			if(targetAng>0 && playerAngleTemp<0 && playerAngleTemp > - Math.PI){//if the cursor is bottom right and player facing bottom left(lurp lag)
				targetAng -= 2*Math.PI;//for correct lurp calculation
				angleToTurn = (targetAng - playerAngleTemp)*0.35;
				playerAngleTemp = playerAngle - angleToTurn;
			}else if(targetAng<0 && playerAngleTemp>0 && playerAngleTemp < Math.PI){//if the cursor is bottom left and player facing bottom right(lurp lag)
				targetAng += 2*Math.PI;
				angleToTurn = (targetAng - playerAngleTemp)*0.35;
				playerAngleTemp = playerAngle - angleToTurn;
			}
			
			//if statement bellow to solve problem at the bottom half of the screen, where the angle should go from -Pi to Pi and vice versa
			if(playerAngleTemp < - Math.PI){//mouse moves from bottom left to bottom right area realtive to the player
				playerAngleTemp += 2.0 * Math.PI;//add 2*Pi to move to correct possition
				playerAngleTemp +=  angleToTurn;//reverse last move (that's why we need seperate variable in this step)
				
				var angleToTurnNew = (targetAng - playerAngleTemp)*0.35;
				playerAngle = playerAngleTemp + angleToTurnNew;
				
			}else if(playerAngleTemp > Math.PI){//mouse moves from bottom right to bottom left area relative to the player
				playerAngleTemp -= 2.0 * Math.PI;//add 2*Pi to move to correct possition
				playerAngleTemp +=  angleToTurn;//reverse last move (that's why we need seperate variable in this step)
				
				var angleToTurnNew = (targetAng - playerAngleTemp)*0.35;
				playerAngle = playerAngleTemp + angleToTurnNew;

			}else{
				playerAngle = playerAngleTemp;//just in case...
			}
			
		}else{
			playerAngle = targetAng;//if not enough juice on the rotation :P
		}
	
	}else if(targetXDist = 0){//why am I using tan... (goes infinite here so we set the angle dirrectly)
		if(targetYDist >= 0){
			playerAngle = 0;
		
		}else if(targetYDist < 0){
			playerAngle = Math.PI;
		}
	}
	//console.log("player angle:"+playerAngle);
	//console.log("target angle:"+targetAng);
}

function drawPlayerLifeBar(){
	canvasContext.strokeStyle = 'white'
		canvasContext.strokeRect(canvas.width-95,120, 90,10);
		if(playerLife <= 25){
			canvasContext.fillStyle = 'red'
		}else if(playerLife <=50){
			canvasContext.fillStyle = 'yellow'
		}else{
			canvasContext.fillStyle = 'green'
		}
		canvasContext.fillRect(canvas.width-94,121, 88*playerLife/100,8);
}

function drawPlayer(){
	drawImageCenteredWithRotation(playerPic, playerX,playerY, playerAngle);
}