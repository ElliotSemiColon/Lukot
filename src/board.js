import Tile from "./tile.js";
import Resizeable from "./resizable.js";
import Bucket from "./bucket.js";
import Levels from "./levels.js";
import HUD from "./hud.js";

export default class Board extends Resizeable{

    constructor(_size, _colours){
        super();
        this.size = _size;

        this.tiles = [];

        //this.fillOrigin = null;
        this.colours = _colours;

        this.storage = new Levels();
        this.bucket = new Bucket(_colours); //paint bucket

        this.level = 0;

        this.filling = false;
        this.lastFilling = false;
        this.changedTiles = [0, 0, 0];

        this.HUD = new HUD();
    }

    generate(){ //generate the board
        this.tiles = [];

        let sideLength = this.cHeight < this.cWidth ? this.cHeight : this.cWidth;
        let difference = Math.abs(this.cHeight - this.cWidth);
        let sx = this.cHeight < this.cWidth ? difference / 2 : 0;
        let sy =  this.cHeight > this.cWidth ? difference / 2 : 0;
        let x = sx, y = sy, size = sideLength / this.size;

        //console.log(height);

        for(let j = 0; j < this.size; j++){
            for(let i = 0; i < this.size; i++){
                this.tiles.push(new Tile(0, x + size/2, y + size/2, size));
                x += size;
            }
            y += size;
            x = sx;
        }

        //console.log(this.storage.savedTo[this.level]);
        if(this.storage.savedTo[this.level]){
            this.set(this.storage.saves[this.level]);
            this.bucket.fills = this.storage.fillsLeft[this.level];
        }else{
            this.set(this.storage.levels[this.level]);
            this.bucket.fills = this.storage.fills[this.level];
        }

        this.HUD.topx = sx;
        this.HUD.topy = sy;
    }

    draw(ctx){ this.tiles.forEach(tile => { tile.draw(ctx); }); } //draw the board

    update(mx, my, fps){ //update the board

        this.fillCheck(fps);
        this.heldCheck(mx, my);
        if(!this.filling){this.progressionCheck();}

    }

    reset(){

        //console.log(this.level);
        this.storage.reset(this.level);
        this.generate();

    }

    load(level){ //loads level depending on if it has a saved version or not

        if(this.storage.savedTo[level]){
            this.set(this.storage.saves[level]);
            this.bucket.fills = this.storage.fillsLeft[level];
        }else{
            this.set(this.storage.levels[level]);
            this.bucket.fills = this.storage.fills[level];
        }

    }

    getClicked(mx, my){ //return the index of the tile being clicked on
        let index = -1;
        for(let i = 0; i < this.tiles.length; i++){ if(this.tiles[i].click(mx, my)){ index = i; } }
        return index;
    }

    eyedropper(mx, my){ //pick up colour below cursor
        this.bucket.ID = this.tiles[this.getClicked(mx, my)].ID;
    }

    startFill(){ //pre-requisite for filling the screen

        this.filling = true;
        this.changedTiles[2] = 2;
        this.changedTiles[1] = this.changedTiles[0] = 0;

    }

    fillCheck(fps){ //is the screen being filled??
        
        this.bucket.filling = this.filling;

        this.changedTiles[2] += ((this.changedTiles[1] - this.changedTiles[0]) - this.changedTiles[2])/(fps/3); //smoothing function
        if(this.changedTiles[2] < 0.75){this.filling = false;}
        this.changedTiles[0] = this.changedTiles[1];

    }

    heldCheck(mx, my){ //is mouse held in editor mode?
        
        if(this.bucket.held && this.bucket.mode == 1){
            let index = this.getClicked(mx, my);
            if(index >= 0){ this.tiles[index].ID = this.bucket.ID; }
        } 

    }

    isComplete(){ //is the level complete??

        let ID = this.tiles[0].ID;

        for(let i = 1; i < this.tiles.length; i++){
            if(this.tiles[i].ID != ID){ return false; }
        }

        return true;

    }

    progressionCheck(){ //can i progress??

        if(this.isComplete() && this.level + 1 < this.storage.levels.length && this.bucket.mode == 0){ 
            this.storage.completed(this.level);
            this.generate();
            setTimeout(() => { this.progress(1, true); }, 1000); 
        }

    }

    progress(direction, bonus){ // move the player along to the next/last level
        this.level += direction;
        this.HUD.level = this.level;
        
        if(bonus){ this.HUD.score += this.bucket.fills; }

        this.load(this.level);
    }

    skip(direction){ //for editor mode
        if(/*this.bucket.mode == 1 && */this.level + direction < this.storage.levels.length && this.level + direction >= 0){ this.progress(direction, false); }
    }

    click(mx, my){ // interact with tile in fill mode

        let index = -1, ID, bID;

        if(!this.filling && this.bucket.mode == 0 && this.bucket.fills > 0){

            index = this.getClicked(mx, my);

            if(index >= 0){ 
                ID = this.tiles[index].ID; //initial colour of filled square

                if(ID != this.bucket.ID){

                    this.startFill();
                    this.bucket.fills--;

                    this.tiles[index].ID = this.bucket.ID;
                    bID = this.bucket.ID;
                    this.fill(ID, bID, index);
                }
            }
        }
    }

    fill(ID, bID, index){ //recursive floodfill        

        let flag = false;
        this.changedTiles[1]++;

        // right, down, left, up
        let r = (index + 1 < this.tiles.length) && ((index + 1) % this.size != 0) ? this.tiles[index + 1].ID : null;
        let d = index + this.size < this.tiles.length ? this.tiles[index + this.size].ID : null;
        let l = (index - 1 >= 0) && (index % this.size != 0) ? this.tiles[index - 1].ID : null; //ternary to check if the position is valid in the array
        let u = index - this.size >= 0 ? this.tiles[index - this.size].ID : null;  //ternary to...

        if(r == ID){
            this.tiles[index + 1].ID = bID;
            //this.fill(ID, index + 1);
            setTimeout(() => { this.fill(ID, bID, index + 1) }, 50);
            flag = true;
        }

        if(d == ID){
            this.tiles[index + this.size].ID = bID;
            //this.fill(ID, index + this.size);
            setTimeout(() => { this.fill(ID, bID, index + this.size) }, 50);
            flag = true;
        }

        if(l == ID){
            this.tiles[index - 1].ID = bID;
            //this.fill(ID, index - 1);
            setTimeout(() => { this.fill(ID, bID, index - 1) }, 50);
            flag = true;
        }

        if(u == ID){
            this.tiles[index - this.size].ID = bID;
            //this.fill(ID, index - this.size);
            setTimeout(() => { this.fill(ID, bID, index - this.size) }, 50);
            flag = true;
        }

        if(flag){
            return;
        }
    }

    get(){ //outputs board state with RLE for level creation in editor mode

        let IDs = [], initial = this.tiles[0].ID, tally = 0;

        for(let i = 0; i < this.tiles.length; i++){

            let tileID = this.tiles[i].ID;

            if(tileID != initial){ 
                IDs.push(`${initial}x${tally}`);
                tally = 1;
                initial = tileID; 
            }else{
                tally++;
            }
        }

        IDs.push(`${initial}x${tally}`);

        console.log(IDs);

    }

    set(input){ //reads encoded list and sets state of board

        //console.log(`board being set to ${input}`);

        let cursor = 0, ID, count;
        let rgxBlock = /([0-9]+)x([0-9]+)/, match;

        input.forEach(run =>{ //for every run of the same tile

            match = run.match(rgxBlock);
            ID = match[1];
            count = match[2];

            for(let i = 0; i < count; i++){
                this.tiles[cursor].ID = ID;
                cursor++;
            }

        });

    }

}