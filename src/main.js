import Board from "./board.js";
import HUD from "./hud.js";

var canvas = document.getElementById("canvas"); 
var ctx = canvas.getContext("2d"); 

//listeners
window.addEventListener('resize', resizeCanvas, false);

window.addEventListener('keydown', event => {
    switch(event.keyCode){
        case 39: //right
            board.bucket.increment(1);
            return;
        case 37: //left
            board.bucket.increment(-1);
            return;
        case 38: //up
            board.bucket.mode = 1;
            board.bucket.fills = board.storage.fills[board.level];
            return;
        case 40: //down
            board.bucket.mode = 0;
            return;
        case 79: // 'o' key (output board)
            board.get();
            return;
        case 89: // 'p' key
            board.skip(1);
            return;
        case 84: // 'i' key
            board.skip(-1);
            return;
        case 82: //'r' key (reset)
            if(!(board.filling || showControls)){ board.reset(); }
            return;
        case 32:
            showControls = false;
            return;
        default:
            return;
    }
});

document.onmousemove = move;
document.onmousedown = click;
document.onmouseup = release;
//document.onmouseup = release;

let size = 19, colours = 6, mx = 0, my = 0;

let board = new Board(size, colours);

function move(event)
{
    mx = event.clientX;
    my = event.clientY;
    board.bucket.x = event.clientX + board.bucket.size;
    board.bucket.y = event.clientY + board.bucket.size;
}

function click(event){

    if(!showControls && event.button == 0){
        // board.tiles.forEach(tile => { tile.clickCheck(event.clientX, event.clientY); });
        board.click(event.clientX, event.clientY);
        board.bucket.click();
        frameID = 0;
        board.bucket.held = true;
    }

    if(event.button == 1){ board.eyedropper(event.clientX, event.clientY); }
}

function release(event){ //for editor

    if(!showControls){ board.bucket.held = false; }

}

resizeCanvas();

board.bucket.fills = board.storage.fills[0];

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    board.resize(canvas.width, canvas.height);
    board.tiles.forEach(tile =>{ tile.resize(canvas.width, canvas.height); });
}

board.generate();

function game(){

    board.bucket.update();
    board.update(mx, my, fps);
    //if(board){board.update();}

    //board.tiles.forEach(tile => { tile.draw(ctx); });
    board.draw(ctx);
    board.HUD.draw(ctx);
    board.bucket.draw(ctx);

}

function controls(){

    let size = 50;
    ctx.font = `${size}px Helvetica`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Welcome to Lukot; clear the patterns to clear levels!", canvas.width/2 - size * 12.1, canvas.height/2 - size * 4.5);
    ctx.fillStyle = "#222222";
    ctx.fillText("Change levels: T/Y", canvas.width/2 - size * 12.1, canvas.height/2 - size * 3);
    ctx.fillText("Select fill colour: middle-mouse over desired colour", canvas.width/2 - size * 12.1, canvas.height/2 - size * 1.5);
    ctx.fillText("Fill an area: left click/right click", canvas.width/2 - size * 12.1, canvas.height/2);
    ctx.fillText("Retry level: R (tip: you can use R to reset complete levels)", canvas.width/2 - size * 12.1, canvas.height/2 + size * 1.5);
    ctx.fillText("Start game: spacebar", canvas.width/2 - size * 12.1, canvas.height/2 + size * 3);

}

let frameID = 0, lastTime = 0, fps = 0, showControls = true;

function mainLoop(timestamp){

    fps = 1000/(timestamp - lastTime);
    lastTime = timestamp;

    ctx.fillStyle = "#666666";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(showControls){ controls(); }
    else{ game(); }

    frameID++;

    requestAnimationFrame(mainLoop);
}

mainLoop();