function colorRect(topLeftX,topLeftY,boxWidth, boxHeight,fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight,fillColor);
}

function drawImageCenteredWithRotation(useImage, posX,posY, angle){
	var useImage = playerImage;
	canvasContext.save();
	canvasContext.translate(posX,posY);
	canvasContext.rotate(angle);
	canvasContext.drawImage(useImage, -useImage.width/2, -useImage.height/2);
	canvasContext.restore();
}

function colorText(showWords, textX,textY, fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX,textY);
}