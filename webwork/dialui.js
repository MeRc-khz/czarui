var wHeight = window.innerHeight;
var wWidth = window.innerWidth;
window.addEventListener('load', winloaded, false);

function winloaded() {
    var candiv = document.getElementById('candiv');
    var cvs = document.getElementById('canvas');
	var hCenter = (wHeight/2)-100;
	_("zipdiv").style.marginTop = hCenter + "px";
    cvs.height = wHeight;
    cvs.width = wWidth;
    //oWidth and oHeight if/else statement for mobile web browsers
    //assign width height canvas values according to screen orientation
    //user agent detection script
    //hit
    app();
}

function app() {
    var cvs = document.getElementById('canvas');
    if (!cvs || !cvs.getContext) {
        return;
    }
    var ctx = cvs.getContext("2d");
    if (!ctx) {
        return;
    }
    var arcPath = {
        x: 0,
        y: 250,
        r: 200,
        angle: 0
    };
	
    var iWidth = 64;
    var iHeight = 64;
    var help = new Image();
    var find = new Image();
    var signin = new Image();
    var sync = new Image();
    var sale = new Image();
    var iconHead = "Lawn Czar";
	var touchX = 0;
	var touchY = 0;
    var iconDir;
    var hitIt = false;
    var easeVal = false;
    var inc;
    var dec;
    var mAngle = 0;
    var old_mAngle;
    var textXy = {
        x: wWidth - 300,
        y: wHeight - 50
    };
	var clickd = {x:0, y:0};
    var mCoord = {
        x: 0,
        y: 0
    };
    var touches = [];

    var arcCenter = {
        x: arcPath.x,
        y: arcPath.y,
        r: 100,
        angle: 0
    };
    //
    var arcZero = {
        x: arcCenter.x + arcPath.r,
        y: arcCenter.y,
        r: 5,
        angle: 0
    };
    var loadCount = 0;
    var items = 4;
    var lineMoves = 0;
    var lineReup = {
        x: 0,
        y: 0
    };
    var moveIcon = false;
    var hitValue = false;
    var holdMove = false;
    var a45 = .7854;
    var y270 = arcPath.y - arcPath.r - 50;
    var y90 = arcPath.y + arcPath.r + 50;
    var x0 = arcPath.x + arcPath.r + 50;
    //adjust Speeed of dial
    var eSpeed = 0.35;

    var uLine = {
        x: wWidth,
        y: textXy.y
    };
    var theLine = {
        x: wWidth,
        y: textXy.y
    };
    var iconXy = [{
        x: 0,
        y: 0,
        r: 50,
        t: 0,
        img: help
    }, {
        x: 0,
        y: 0,
        r: 50,
        t: 1,
        img: find
    }, {
        x: 0,
        y: 0,
        r: 50,
        t: 2,
        img: signin
    }, {
        x: 0,
        y: 0,
        r: 50,
        t: 3,
        img: sale
    }, {
        x: 0,
        y: 0,
        r: 50,
        t: 4,
        img: sync
    }];
    var iconAng = [{
        a: -90
    }, {
        a: -45
    }, {
        a: 0
    }, {
        a: 45
    }, {
        a: 90
    }];
    //x:cosine(arcCenter.x(250),neg90a(-90),arcPath.r(200))

    function touchHandler(event) {
        touches = event.changedTouches;
        //alert(touches);
        var first = touches[0];
        var type = "";
        touchX = event.targetTouches[0].pageX;
        touchY = event.targetTouches[0].pageY;
        console.log("touchX" + touchX + "touchY" + touchY);
        switch (event.type) {
            case "touchstart":
                type = "mousedown";

                break;

            case "touchmove":
                type = "mousemove";
                break;

            case "touchend":
                type = "mouseup";
                break;
            default:
                return;
        }

        //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //           screenX, screenY, clientX, clientY, ctrlKey, 
        //           altKey, shiftKey, metaKey, button, relatedTarget);

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0 /*left*/ , null);

        first.target.dispatchEvent(simulatedEvent);
        //event.preventDefault();
    }

    function cosine(xVal, angVal, radVal) {
        var cosVal;
        cosVal = xVal + Math.cos(angVal) * radVal;

        return cosVal;
    }

    function sine(yVal, angVal, radVal) {
        var sineVal;
        sineVal = yVal + Math.sin(angVal) * radVal
        return sineVal;
    }


    //find the angle of three points on the canvas
    function find_angle(p0, p1, c) {
        var p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)); // p0->c (b)   
        var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2)); // p1->c (a)
        var p0p1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // p0->p1 (c)
        return Math.acos((p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c));
    }

    function eMouseMove(event) {
        mCoord.x = event.pageX;
        mCoord.y = event.pageY;
    }

    function change_angles(newAngle) {

        if (newAngle == "inc") {
            for (var i = 0; i < iconAng.length; i++) {
                iconAng[i].a += 1.75;
                iconDir = "up";
            }
        } else if (newAngle == "dec") {
            for (var i = 0; i < iconAng.length; i++) {
                iconAng[i].a -= 1.75;
                iconDir = "down";
            }
            //degrees or radian coversion is to fast
        }
    }

    function easeIcon(direction) {
        if (direction == "up") {
            for (var i = 0; i < iconAng.length; i++) {
                iconAng[i].a += eSpeed;
            }
        } else if (direction == "down") {
            for (var i = 0; i < iconAng.length; i++) {
                iconAng[i].a -= eSpeed;

            }
            //degrees or radian coversion is to fast
        }

    }

    function hitTest(mouse, circle) {

        var mX = (mouse.x > 0) ? mouse.x : touchX;
        var mY = (mouse.y > 0) ? mouse.y : touchY;
        var crX = circle.x + circle.r;
        var clX = circle.x - circle.r;
        var ctY = circle.y - circle.r;
        var cbY = circle.y + circle.r;
        hitValue = false;
        if ((mX < crX) && (mX > clX) && (mY > ctY) && (mY < cbY)) {
            hitValue = true;
        } else {
            hitValue = false;
        }
        return hitValue;
    }
	
function hitBox(mouse, box) {
var mX = (mouse.x > 0) ? mouse.x : touchX;
        var mY = (mouse.y > 0) ? mouse.y : touchY;
        //var mX = mouse.x;
        //var mY = mouse.y;
        var boxX = box.x;
        var boxlX = box.x + 100;
        var boxtY = box.y - 50;
        var boxbY = box.y;
        hitLink = false;
        if ((mX < boxlX) && (mX > boxX) && (mY > boxtY) && (mY < boxbY)) {
            hitLink = true;
        } else {
            hitLink = false;
        }
        return hitLink;
    }
	
    function drawLine(p1, p2) {

        var lSpeed = 25;
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        lineMoves = distance / lSpeed;
        var xUnits = (p2.x - p1.x) / lineMoves;
        var yUnits = (p2.y - p1.y) / lineMoves;
        var lUpdate = {
            x: xUnits,
            y: yUnits
        };
        return lUpdate;

    }

    function itemsLoaded(event) {
        loadCount++;
    }

    function init() {

        if (loadCount < items) {
            //help = new Image();
            help.onload = itemsLoaded;
            help.src = "/images/help.png";

            //find = new Image();
            find.onload = itemsLoaded;
            find.src = "find.png";


            //signin = new Image();
            signin.onload = itemsLoaded;
            signin.src = "signin.png";

            //sale = new Image();
            sale.onload = itemsLoaded;
            sale.src = "sale.png";

            //sync = new Image();
            sync.onload = itemsLoaded;
            sync.src = "sync.png";
        }
    }
    /////BEGIN THE DRAW FUNCTION HEEERRRREEE????/////////
    function draw() {
	if(loadCount < 5){
        init();
		}

        function eClicked(evt) {
            clickd.x = evt.pageX;
            clickd.y = evt.pageY;
            if (hitBox(clickd, textXy)) {
                switch (iconHead) {
                    case "Signin":
                        _("canvas").style.display = "none";
                        _("signlog").style.display = "block";
                        _("lucidlay").style.display = "block";
                        break;
                    case "Help":
                        break;
                    case "Route":
					routeWay();
					_("canvas").style.display = "none";
                        break;
                    case "Sales":
                        break;
                    case "Sync":
                        break;
					case "Logout":
					window.location="scripts/logout.php";
                        break;	
                    default:
                        _("signlog").style.display = "block";
                        _("lucidlay").style.display = "block";
						_("canvas").style.display = "none";
                        break;
                }

            } else {

                lineMoves = 0;
                theLine = {
                    x: wWidth,
                    y: textXy.y
                };
                lineReup = {
                    x: 0,
                    y: 0
                };

            }
            if (evt.type == "mousedown") {
                holdMove = true;
            }
        }

        function eClacked(evt) {
            if (evt.type == "mouseup") {
                holdMove = false;
                for (var i = 0; i < iconAng.length; i++) {
                    iconAng[i].a += 0;
                }

            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //calculate the 45 and 90 degree angles based on mCoord xy being == to 0 degrees. scratch that
        if (holdMove == true) {
		if (mAngle != old_mAngle) {
            //if (holdMove == true) {
                if (mAngle < old_mAngle) {

                    for (var i = 0; i < iconXy.length; i++) {
					
hitBox(mCoord, iconXy[i]);
                        //hitTest(mCoord, iconXy[i]);
if (hitLink == true){
                        //if (hitValue == true) {
                            change_angles('dec');
                            break;
                        } else {
                            moveIcon = true;
                        }
                    }

                } else {

                    for (var i = 0; i < iconXy.length; i++) {
hitBox	(mCoord, iconXy[i]);				
                       //hitTest(mCoord, iconXy[i]);
if(hitLink == true){
                        //if (hitValue == true) {
                            change_angles('inc');
                            break;
                        } else {
                            moveIcon = true;
                        }
                    }

                }
				hitLink = false;
                //hitValue = false;
                old_mAngle = mAngle;

            }
        }

        ///ease into zero position//////////////////////////
        if (moveIcon == true) {

            for (var i = 0; i < iconXy.length; i++) {
			//hitIt = hitBox(iconXy[i], arcZero);
                hitIt = hitTest(iconXy[i], arcZero);
                //console.log("this is being hit");

                if (hitIt == false) {
                    easeIcon(iconDir);
                    //make easeIcon return a value of iconXy 
                    // number 0 - 5, use a switch statement to popup text info for icon an activate lawnCzar logo

                } else {
                    switch (iconXy[i].t) {
                        case 0:
                            //var uLine = {x: wWidth, y: arcZero.y};
                            //var theLine={x:wWidth, y: arcZero.y};
                            iconHead = "Help";
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
                            break;
                        case 1:
                            iconHead = "Route";
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
                            break;
                        case 2:
						if(member_is_ok === true){
						iconHead = "Logout";
					
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
						}else{
                            iconHead = "Signin";
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
							}
                            break;
                        case 3:
                            iconHead = "Sales";
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
                            break;
                        case 4:
                            iconHead = "Sync";
                            if (theLine.x > arcZero.x) {
                                lineReup = drawLine(uLine, textXy);
                            }
                            break;

                    }

                    //text variale can be iconXy[i].txt or number for case statement
                    moveIcon = false;
                    break;

                }

            }

        }

        // /// Paths and there properties  center dot /// //
        // ctx.fillStyle = "#FF0000";
        // ctx.beginPath();
        // ctx.arc(arcCenter.x, arcCenter.y, arcCenter.r, 0, Math.PI * 2, true);
        // ctx.fill();
        // ctx.closePath();

        //point at zero angle radius on arc
        //ctx.fillStyle = "#000000";
        //ctx.beginPath();
        // ctx.arc(arcZero.x, arcZero.y, arcZero.r, 0, Math.PI * 2, true);
        //ctx.fill();
        // ctx.closePath();

        if (mCoord.y > y270 && mCoord.y < arcPath.y && mCoord.x <= x0) {
            mAngle = -(find_angle(mCoord, arcZero, arcPath));
        } else if (mCoord.y > arcPath.y && mCoord.y < y90 && mCoord.x <= x0) {
            mAngle = find_angle(mCoord, arcZero, arcPath);
        }

        var pOnArc = {
            x: cosine(arcCenter.x, mAngle, arcPath.r),
            y: sine(arcCenter.y, mAngle, arcPath.r)
        };

        for (var i = 0; i < iconXy.length; i++) {
            iconXy[i].x = cosine(arcCenter.x, iconAng[i].a * Math.PI / 180, arcPath.r);
            iconXy[i].y = sine(arcCenter.y, iconAng[i].a * Math.PI / 180, arcPath.r);
        }
        for (var i = 0; i < iconXy.length; i++) {
            //alert(iconXy[i].img);
            ctx.save();
            ctx.drawImage(iconXy[i].img, iconXy[i].x - 0.5 * iWidth, iconXy[i].y - 0.5 * iHeight, iWidth, iHeight);
            ctx.restore();
        }
        //draw circle around icons
        //  for (var i = 0; i < iconXy.length; i++) {
        //      ctx.strokeStyle = "#000000";
        // //     ctx.beginPath();
        //      ctx.arc(iconXy[i].x, iconXy[i].y, 50, 0, Math.PI * 2, true);
        //      ctx.stroke();
        //      ctx.closePath();
        //  }
        ////////????????Draw LINE under icon heading????????////////////		
        if (theLine.x > textXy.x) {
            lineMoves--;
            theLine.x += lineReup.x;
            theLine.y += lineReup.y;
        } else {
            lineMoves = 0;
        }
	
        ctx.strokeStyle = "#FF7400";
        ctx.strokeWidth = 20;
        ctx.beginPath();
        ctx.moveTo(wWidth, wHeight - 50);
        ctx.lineTo(theLine.x, theLine.y);
        ctx.stroke();
        ctx.closePath();

        ctx.font = "50px serif";
        ctx.fillStyle = "#FF7400";
        ctx.fillText(iconHead, textXy.x, textXy.y);

        cvs.addEventListener('mousemove', eMouseMove, false);
        cvs.addEventListener('mousedown', eClicked, false);
        cvs.addEventListener('mouseup', eClacked, false);
        cvs.addEventListener("touchstart", touchHandler, true);
        cvs.addEventListener("touchmove", touchHandler, true);
        cvs.addEventListener("touchend", touchHandler, true);
        cvs.addEventListener("touchcancel", touchHandler, true);

    }
    FRAME_RATE = 30;
    var intervalTime = 1000 / FRAME_RATE;
    setInterval(draw, intervalTime);
}