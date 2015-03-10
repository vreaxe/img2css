'use strict';

var Canvas = require('canvas');
var Image = Canvas.Image
var fs = require('fs');

function Img2CSS() {
  this.src = null;
  this.id = null;
  this.width = null;
  this.height = null;
  this.blur = 0;
  this.minify = false;
};

Img2CSS.prototype.setDimensionsImage = function(objImg) {
	this.width = objImg.width;
	this.height = objImg.height;
};

Img2CSS.prototype.checkIsImage = function() {
	if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(this.src)) {
		throw new Error(this.src + ' isn\'t an image.');
	}
};

Img2CSS.prototype.checkFileExist = function() {
	if (fs.existsSync(this.src)) {
	  	this.checkIsImage();
	} else {
		throw new Error(this.src + ' doesn\'t exist');
	}
};

Img2CSS.prototype.generateCSS = function(ctx) {
	var style = '#'+this.id+'{\n\tdisplay:block;\n\twidth:1px;\n\theight:1px;\n\tbox-shadow:\n\t\t';
	for (var i = 0; i < this.width; i++) {	
		for (var j = 0; j < this.height; j++) {
			// https://codepen.io/blazeeboy/pen/bCaLE
			var data = ctx.getImageData(i, j, 1, 1).data;
			var alpha = data[3]/255;
			alpha = Math.round(alpha*100)/100;
			var x = i;
			var y = j;
			style += x+'px '+y+'px '+this.blur+'px rgba('+data[0]+','+data[1]+','+data[2]+','+alpha+'),\n\t\t';
			//
		}
	}
	style = style.replace(/,\s*$/, ";");
	style += '\n}';

	return style;
};

Img2CSS.prototype.convert = function() {
	this.checkFileExist(this.src);

	var objImg = new Image;
	objImg.src = fs.readFileSync(this.src);

	this.setDimensionsImage(objImg);

	var canvas = new Canvas(this.width, this.height);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(objImg, 0, 0);

	var style = this.generateCSS(ctx);

	if (this.minify) {
		style = style.replace(/(\n\t\t|\n\t|\n|\t)/gm," ");
	} 

	fs.writeFile('style.css', style, function (err) {
	  if (err) return console.log(err);
	  console.log('File created successfully.');
	});
};

module.exports = Img2CSS;