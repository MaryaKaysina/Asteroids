var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var i, j, ship, timer;
var aster = [];
var fire = [];
var expl = [];
// var ship = {x : 300, y : 300};

/* Resource loading */ 
var asterimg = new Image();
asterimg.src = '../img/astero.png';

var shieldimg = new Image();
shieldimg.src = '../img/shield.png';

var fonimg = new Image();
fonimg.src = '../img/fon.png';

var shipimg = new Image();
shipimg.src = '../img/ship01.png';

var fireimg = new Image();
fireimg.src = '../img/fire.png';

var explimg = new Image();
explimg.src = '../img/expl222.png';

/* Start */
fonimg.onload = function () {
    init();
    game();
};

/* Browser compatibility */
var requestAnimFrame = (function(){
    return window.requestAnimationFrame     ||
    window.webkitRequestAnimationFrame      ||
    window.mozRequestAnimationFrame         ||
    window.oRequestAnimationFrame           ||
    window.msRequestAnimationFrame          ||
    function(callback) {
        window.setTimeout(callback, 1000 / 20);
    };
})();

/* Initial settings */
function init() {
    canvas.addEventListener("mousemove",  function(event) {	
    ship.x=event.offsetX-25;
    ship.y=event.offsetY-13;
    });
    
    timer = 0;
    ship={x:300,y:300,animx:0,animy:0};	
}

/* Main game round */
function game() {
    update();
    render();
    requestAnimFrame(game);
}

function update() {

    timer++;

    if (timer % 10 == 0) {
        /* x,y - coordinates, dx,dy - coordinate change rate */
        aster.push({
            angle:0,
            dxangle:Math.random()*0.2-0.1,
            del:0,
            x:Math.random()*550,
            y:-50,
            dx:Math.random()*2-1,
            dy:Math.random()*2+1
        });
        
    }

    /* Shot */
    if (timer % 10 == 0) {
        fire.push({x : ship.x + 10, y : ship.y, dx : 0, dy : -5.2});
        fire.push({x : ship.x + 10, y : ship.y, dx : 0.5, dy : -5});
        fire.push({x : ship.x + 10, y : ship.y, dx : -0.5, dy : -5});
    }

    /* Motion asteroids */
    for (i in aster) {
        /* Fisics */
        aster[i].x += aster[i].dx;
        aster[i].y += aster[i].dy;
        aster[i].angle=aster[i].angle+aster[i].dxangle;

        /* Borders */
        if (aster[i].x >= 550 || aster[i].x < 0) aster[i].dx=-aster[i].dx;
        if (aster[i].y >= 600) aster.splice(i, 1);

        /* Collision */
        for (j in fire) {
            if (Math.abs(aster[i].x+25 - fire[j].x - 15) < 50 && Math.abs(aster[i].y - fire[j].y) < 25) {

                expl.push({x : aster[i].x - 25, y : aster[i].y - 25, animx : 0, animy : 0});

                aster[i].del = 1;
                fire.splice(j, 1); break;
            }
        }
        if (aster[i].del == 1) aster.splice(i, 1);
    }

    /* Motion fire */
    for (i in fire) {
        fire[i].x += fire[i].dx;
        fire[i].y += fire[i].dy;

        if (fire[i].y < -30) fire.splice(i, 1);
    }

    /* Fire animation */
    for (i in expl) {
        expl[i].animx += 0.5;
        if (expl[i].animx > 7) {expl[i].animy++; expl[i].animx = 0;}
        if (expl[i].animx > 7)
        expl.splice(i, 1);
    }

    /* Shield animation */
    ship.animx=ship.animx+1;
	if (ship.animx>4) {ship.animy++; ship.animx=0;}
	if (ship.animy>3) {
	ship.animx=0; ship.animy=0;
	}
}

function render() {
    context.clearRect(0, 0, 600, 600);
    context.drawImage(fonimg, 0, 0, 600, 600);
    context.drawImage(shipimg, ship.x, ship.y);
    for (i in fire) {
        context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
    }
    context.drawImage(shieldimg, 192 * Math.floor(ship.animx), 192 * Math.floor(ship.animy), 192, 192, ship.x - 25, ship.y - 25, 100,  100);
    for (i in aster) {
        //context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50);
        context.save();
		context.translate(aster[i].x + 25, aster[i].y + 25);
		context.rotate(aster[i].angle);
		context.drawImage(asterimg, -25, -25, 50, 50);
		context.restore();
    }
    for (i in expl) {
        context.drawImage(explimg, 128 * Math.floor(expl[i].animx), 128 * Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);
    }
}

