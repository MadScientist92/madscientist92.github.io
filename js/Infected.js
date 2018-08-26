var infectedPic = document.createElement("img");
const INFECTED_LEFT = 0;
const INFECTED_TOP = 1;
const INFECTED_RIGHT = 2;
const INFECTED_BOTTOM = 3;

function infectedClass(){
	this.x;
	this.y;
	this.speed = 2 + Math.floor(wave/3);//increases every 3 waves
	this.damage = 10;

	this.distanceFromPlayer;
	this.ang = 0;

	this.spawnLocation = Math.floor(Math.random() * 4);//from 0 to 3(see constants above class), used for using the right sprite
	//console.log(this.spawnLocation);
	this.spawnTime = 0;
	this.spawn = false;
	
	this.hitboxHalfWidth = 15;
	this.torsoTopRelatedToCenter = -25;//to calculate headshot and torso damage
	this.torsoBottomRelatedToCenter = 20;//to calculate torso and legs damage

	this.life = 50;
	this.secondaryCooldown = 0;//since secondary laser can hit multiple targets we need to check this for every seperate instance


	//next 4 used for hitbox visualizations
	//this.isOverHitbox = false;
	/*this.headTargeted = false;
	this.bodyTargeted = false;
	this.legsTargeted = false;*/

	this.resetPosition = function(){//spawn offscreen depending on random direction
		if(this.spawnLocation == INFECTED_LEFT){
			this.x = -100;
			this.y = Math.random() * canvas.height;
		}else if(this.spawnLocation == INFECTED_TOP){
			this.x = Math.random() * (canvas.width - SCORE_SCREEN_WIDTH);
			this.y = -100;
		}else if(this.spawnLocation == INFECTED_RIGHT){
			this.x = canvas.width;
			this.y = Math.random() * canvas.height;
		}else if(this.spawnLocation == INFECTED_BOTTOM){
			this.x = Math.random() * (canvas.width - SCORE_SCREEN_WIDTH);
			this.y = canvas.height + 100;
		}
	}
	
	this.resetPosition();//calling it immediately(only once is fine)
	
	
	this.damagePlayer = function(){
		if(playerNotDamagedRecently){
			playerHitCooldown = playerInvincibilityFrames;
			playerNotDamagedRecently = false;
			playerLife -= Math.floor(this.damage);
			//console.log(playerLife);
		}
	}
	
	this.movement = function(){
		var distX = this.x - playerX;
		var distY = this.y - playerY;
		this.distanceFromPlayer = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
		//console.log(this.distanceFromPlayer);
		
		if(this.distanceFromPlayer > 50){
			var speedX = this.speed * Math.sin(this.ang);//sin here and cos on y because of the way the angle is calculated (0 rads vertically and +- Pi/2 horizontally)
			var speedY = this.speed * Math.cos(this.ang);
			this.x -= speedX;
			this.y += speedY;
			//console.log(this.ang,this.x,this.y);
		}else{
			this.damagePlayer();
		}
	}
	
	this.determineAngle = function(){
		var distX = this.x - playerX;
		var distY = this.y - playerY;

		if(distX == 0){//again, why tangent!
			if(distY >=0){
				this.ang = Math.PI;
			}else{
				this.ang = 0;
			}
		}else{
			var infectedTang = distY / distX;
			this.ang = Math.atan(infectedTang) + (distX/Math.abs(distX)) * Math.PI / 2;
		}
		//console.log(infectedAng,playerAngle);
	}
	
	this.determineAngle();//calling it immediately(only once is fine for linear movement)

	this.draw = function(){
		canvasContext.drawImage(infectedPic, 
		100*this.spawnLocation,0, 100,100,//location in spritesheet(top left corner and width + height)
		this.x - infectedPic.width / 8,this.y - infectedPic.height / 2,100,100);//location ingame
		this.drawLifeBar();
	}

	this.drawLifeBar = function(){
		canvasContext.strokeStyle = 'white'
		canvasContext.strokeRect(this.x - 15,this.y - infectedPic.height/2-10, 30,10);
		if(this.life <= 15){
			canvasContext.fillStyle = 'red'
		}else if(this.life <=25){
			canvasContext.fillStyle = 'yellow'
		}else{
			canvasContext.fillStyle = 'green'
		}
		canvasContext.fillRect(this.x - 14,this.y - infectedPic.height/2-9, 28*this.life/50,8);
	}
	
	/*this.drawHitbox = function(){//only 1 each time!
		//secondary hitbox
		this.isOverHitbox = this.damagedBySecondary();
		if(this.isOverHitbox){
			canvasContext.strokeStyle = 'red';
		}else{
			canvasContext.strokeStyle = 'green';
		}
		
		//primary hitbox
		//canvasContext.strokeStyle = 'white'
		if(this.headTargeted == true){
			canvasContext.strokeStyle = 'red';
		}else if(this.bodyTargeted == true){
			canvasContext.strokeStyle = 'green';
		}else if(this.legsTargeted == true){
			canvasContext.strokeStyle = 'blue';
		}

		canvasContext.strokeRect(this.x - 15,this.y - infectedPic.height / 2, 30,100);
	}*/

	this.damagedByPrimary = function(){
		if(targetX >= this.x - this.hitboxHalfWidth && targetX <= this.x + this.hitboxHalfWidth){
			if(targetY >= this.y - infectedPic.height/2 && targetY < this.y + this.torsoTopRelatedToCenter){
				//this.headTargeted = true;
				this.life -= headshotDamage;
				//console.log(this.life);
			}else if(targetY >= this.y + this.torsoTopRelatedToCenter && targetY < this.y + this.torsoBottomRelatedToCenter){
				//this.bodyTargeted = true;
				this.life -= torsoshotDamage;
				//console.log(this.life);
			}else if(targetY >= this.y + this.torsoBottomRelatedToCenter && targetY <= this.y + infectedPic.height/2){
				//this.legsTargeted = true;
				this.life -= legshotDamage;
				this.speed *= 0.75
				//console.log(this.life);
			}//if head, torso, or legs hit
		}//if within the width of the hitbox
	}//function end

	this.hitDetectionSetup = function(){//reduce cooldowns over time
		if(this.secondaryCooldown > 0){
			this.secondaryCooldown--;
		}
		//next used for hitbox visualization
		/*this.headTargeted = false;
		this.bodyTargeted = false;
		this.legsTargeted = false;
		
		if(targetX >= this.x - 15 && targetX <= this.x + 15){
			if(targetY >= this.y - infectedPic.height/2 && targetY < this.y - 25){
				this.headTargeted = true;
			}else if(targetY >= this.y - 25 && targetY < this.y + 20){
				this.bodyTargeted = true;
			}else if(targetY >= this.y + 20 && targetY <= this.y + infectedPic.height/2){
				this.legsTargeted = true;
			}
		}*/
	}

	this.diagonalSetupForSecondary = function(){//get the correct points for the diagonal hitbox (for secondary) depending on infected location
		if(this.ang >= 0 && this.ang < Math.PI / 2){
			var x1temp = this.x - this.hitboxHalfWidth;
			var y1temp = this.y - infectedPic.height / 2;
			var x2temp = this.x + this.hitboxHalfWidth;
			var y2temp = this.y + infectedPic.height / 2;
		}else if(this.ang >= Math.PI / 2 && this.ang <= Math.PI){
			var x1temp = this.x + this.hitboxHalfWidth;
			var y1temp = this.y - infectedPic.height / 2;
			var x2temp = this.x - this.hitboxHalfWidth;
			var y2temp = this.y + infectedPic.height / 2;
		}else if(this.ang >= - Math.PI / 2 && this.ang < 0){
			var x1temp = this.x - this.hitboxHalfWidth;
			var y1temp = this.y + infectedPic.height / 2;
			var x2temp = this.x + this.hitboxHalfWidth;
			var y2temp = this.y - infectedPic.height / 2;
		}else if(this.ang > - Math.PI && this.ang < - Math.PI / 2){
			var x1temp = this.x + this.hitboxHalfWidth;
			var y1temp = this.y + infectedPic.height / 2;
			var x2temp = this.x - this.hitboxHalfWidth;
			var y2temp = this.y - infectedPic.height / 2;
		}
		return{
			x1:x1temp,
			y1:y1temp,
			x2:x2temp,
			y2:y2temp
		}
	}

	this.damagedBySecondary = function (){
		if(this.secondaryCooldown <= 0){
			this.secondaryCooldown = laserDamageRateCooldown;
			var x0 = playerX;
			var y0 = playerY;
			
			var coords = this.diagonalSetupForSecondary();
			var x1 = coords.x1;
			var y1 = coords.y1;
			var x2 = coords.x2;
			var y2 = coords.y2;
			
			
			var distOneX = x1 - x0;
			var distOneY = y1 - y0;
			var distTwoX = x2 - x0;
			var distTwoY = y2 - y0;
			
			var tangOne = distOneY / distOneX;
			var tangTwo = distTwoY / distTwoX;
			
			var angOne = Math.atan(tangOne) + (distOneX/Math.abs(distOneX)) * Math.PI / 2;
			var angTwo = Math.atan(tangTwo) + (distTwoX/Math.abs(distTwoX)) * Math.PI / 2;
			
			//console.log(angOne,angTwo,playerAngle)
			if(Math.abs(angOne - angTwo)> Math.PI){
				if(playerAngle > angOne || playerAngle < angTwo){
					this.life -= laserDamage * Math.abs(100/this.distanceFromPlayer);
					this.damage *= 0.95;
					//console.log(this.life,this.damage);
					/*return true;
				}else{
					return false;*/
				}
			}else{
				if(playerAngle > angOne && playerAngle < angTwo){
					this.life -= laserDamage * Math.abs(100/this.distanceFromPlayer);
					this.damage *= 0.95;
					//console.log(this.life,this.damage);
					/*return true;
				}else{
					return false;*/
				}//if target within hitbox angle
			}//if normal case or near bottom (one point of diagonal hitbox close to Pi and the other close to -Pi)
		}//if within cooldown
	}//end of infectedDamagedBySecondary function
}//end of infectedClass