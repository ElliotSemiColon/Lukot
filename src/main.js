import Board from "./board.js";

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
        case 80: // 'p' key
            board.skip(1);
            return;
        case 73: // 'i' key
            board.skip(-1);
            return;
        case 82: //'r' key (reset)
            if(!board.filling){ board.generate(); }
            return;
        default:
            return;
    }
});

document.onmousemove = move;
document.onmousedown = click;
document.onmouseup = release;
document.onwheel = increment;
//document.onmouseup = release;

let size = 19, colours = 5, mx = 0, my = 0;

let board = new Board(size, colours);

function move(event)
{
    mx = event.clientX;
    my = event.clientY;
    board.bucket.x = event.clientX + board.bucket.size;
    board.bucket.y = event.clientY + board.bucket.size;
}

function increment(event){ board.bucket.increment(event.deltaY/Math.abs(event.deltaY)); }

function click(event){

    // board.tiles.forEach(tile => { tile.clickCheck(event.clientX, event.clientY); });
    board.click(event.clientX, event.clientY);
    board.bucket.click();
    frameID = 0;
    board.bucket.held = true;

}

function release(event){

    board.bucket.held = false;

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

let frameID = 0, lastTime = 0, fps = 0;

function mainLoop(timestamp){

    fps = 1000/(timestamp - lastTime);
    lastTime = timestamp;

    ctx.fillStyle = "#666666";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    board.bucket.update();
    board.update(mx, my, fps);
    //if(board){board.update();}

    //board.tiles.forEach(tile => { tile.draw(ctx); });
    board.draw(ctx);
    board.HUD.draw(ctx);
    board.bucket.draw(ctx);

    frameID++;

    requestAnimationFrame(mainLoop);
}

mainLoop();