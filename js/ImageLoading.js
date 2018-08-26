var worldImages = [];
var picsToLoad = 0;

function countLoadedImagesAndShowStartScreen(){//called by beginLoadingImage func keping count how many images to lodad and declaring start of the programm when all are loaded
	picsToLoad--;
	//console.log(picsToLoad);
	if (picsToLoad == 0){
		//startGame();//in main.js
		showStartScreen();
	}
}

function showStartScreen(){//after images done loading
	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LEFT CLICK TO START GAME!", canvas.width/2 - 80,150, 'aquamarine');
	colorText("TUTORIAL:", canvas.width/2 - 35,canvas.height/2, 'yellow');
	colorText("PRESS LEFT MOUSE BUTTON over the infected to shoot bullets at them.", canvas.width/2 - 190,canvas.height/2+20, 'white');
	colorText("Headshots do more damage and shooting the legs reduces their speed.", canvas.width/2 - 180,canvas.height/2+30, 'white');
	colorText("HOLD RIGHT MOUSE BUTTON to shoot your laser.", canvas.width/2 - 140,canvas.height/2+50, 'white');
	colorText("The laser deals more damage the closer the infected is to the player.", canvas.width/2 - 180,canvas.height/2+60, 'white');
	colorText("It also reduces the damage that infected deal to you when they reach you.", canvas.width/2 - 190,canvas.height/2+70, 'white');
	colorText("Survive 10 waves to WIN!", canvas.width/2 - 68,canvas.height/2+90, 'white');
	colorText("Thank You and Have Fun!", canvas.width/2 - 70,canvas.height/2+150, 'aquamarine');
}

function beginLoadingImage(imgVar, fileName){
	imgVar.onload = countLoadedImagesAndShowStartScreen();
	imgVar.src = "images/" + fileName;
}

function loadImageForTileCode(tileCode, fileName){
	worldImages[tileCode] = document.createElement("img");
	beginLoadingImage(worldImages[tileCode],fileName);
}

function loadImages(){
	var imageList = [
	{varName: playerPic, theFile: "playeridle.png"},
	{varName: playerPicPrimary, theFile: "playerprimary.png"},
	{varName: playerPicSecondary, theFile: "playersecondary.png"},
	{varName: infectedPic, theFile: "Infectedspritesheet.png"},
	{tileType: TILE_ROAD, theFile: "road.png"},
	{tileType: TILE_INFECTED, theFile: "infectedroad.png"}
	];
	
	picsToLoad = imageList.length;
	
	for(var i=0;i<imageList.length;i++){
		if(imageList[i].varName != undefined){
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		}else{
			loadImageForTileCode(imageList[i].tileType, imageList[i].theFile);
		}
	}
}