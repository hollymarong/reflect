var GLOBAL = {};

GLOBAL.reflect = {};

GLOBAL.reflect.setReflect = function(imgs, config, callback){

	var refH = config.refH || 40;
	var refOpacity = config.opacity || 0.5;
	var len = imgs.length;
	var canvasSupport = !!document.createElement('canvas').getContext;
	var refImgs = [];

	for (var i=0;i<len;i++){


		if(canvasSupport){
			_ref(imgs[i]);
		}else{
			_refIE(imgs[i]);
		}

	}

	function _ref(img){

		var cas = img.parentNode.getElementsByTagName("canvas")[0];
		if(!cas){
			cas = document.createElement("canvas");
			img.parentNode.appendChild(cas);
		}
		var context = cas.getContext("2d");
		var gradient;
		var reflectH = parseInt(refH);
		var reflectW = 100;

		if(window.getComputedStyle) {

			reflectW = parseInt(window.getComputedStyle(img , null)['width']);

		}

		cas.height = reflectH;
		cas.width = reflectW;
		context.drawImage(img, 0, 0, reflectW, reflectH);
		context.save();
		context.translate(0,reflectH-1);
		context.scale(1,-1);
		context.drawImage(img, 0, 0, reflectW, reflectH);
		context.restore();
        context.globalCompositeOperation = "destination-out";
		gradient = context.createLinearGradient(0, 0, 0, reflectH);
		gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - refOpacity) + ")");
		gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
		context.fillStyle = gradient;
		context.rect(0, 0, reflectW, reflectH*2);
		context.fill();

		refImgs.push(cas);

	}

	function _refIE(img){

        var reflectionHeight = Math.floor(refH);
        var reflectionWidth = img.width;
        var reflection = new Image();
        var x = 0, y = 0;
        var p = img;

        while(p){

        	x += p.offsetLeft;
        	y += p.offsetTop;
        	p = p.offsetParent;

        }

        var cssStr = 'display:block;position:absolute;top:' + (y + img.offsetHeight) + 'px;left:' + x + 'px;width:' + reflectionWidth + 'px;height:' + reflectionHeight + 'px;filter:' + 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0, xray=0, mirror=1, invert=0, opacity=1, rotation=2)progid:DXImageTransform.Microsoft.Alpha(opacity=100, style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+(reflectionHeight)+')';

        reflection.style.cssText += cssStr;
        reflection.src = img.src;
        reflection.className = "rotate";
        img.parentNode.appendChild(reflection);

        refImgs.push(reflection);

	}

	callback&&callback(refImgs);

}