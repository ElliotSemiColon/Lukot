import Tile from "./tile.js";
import Resizeable from "./resizable.js";
import Bucket from "./bucket.js";
import Levels from "./levels.js";

export default class Board extends Resizeable{

    constructor(_size, _colours){
        super();
        this.size = _size;

        this.tempTiles = [];
        this.tiles = [];

        //this.fillOrigin = null;
        this.colours = _colours;

        this.storage = new Levels();
        this.bucket = new Bucket(_colours); //paint bucket

        this.level = 0;

        this.filling = false;
        this.lastFilling = false;
        this.changedTiles = [0, 0, 0];
    }

    generate(){
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

        this.tempTiles = this.tiles;
    }

    draw(ctx){ this.tiles.forEach(tile => { tile.draw(ctx); }); }

    update(mx, my){

        this.fillCheck();
        this.heldCheck(mx, my);
        if(!this.filling){this.progressionCheck();}

    }

    getClicked(mx, my){
        let index = -1;
        for(let i = 0; i < this.tiles.length; i++){ if(this.tiles[i].click(mx, my)){ index = i; } }
        return index;
    }

    startFill(){

        this.filling = true;
        this.changedTiles[2] = 2;
        this.changedTiles[1] = this.changedTiles[0] = 0;

    }

    fillCheck(){
        
        this.bucket.filling = this.filling;

        this.changedTiles[2] += ((this.changedTiles[1] - this.changedTiles[0]) - this.changedTiles[2])/10; //smoothing function
        if(this.changedTiles[2] < 0.75){this.filling = false;}
        this.changedTiles[0] = this.changedTiles[1];

    }

    heldCheck(mx, my){ 
        
        if(this.bucket.held && this.bucket.mode == 1){
            let index = this.getClicked(mx, my);
            if(index >= 0){ this.tiles[index].ID = this.bucket.ID; }
        } 

    }

    isComplete(){

        let ID = this.tiles[0].ID;

        for(let i = 1; i < this.tiles.length; i++){
            if(this.tiles[i].ID != ID){ return false; }
        }

        return true;

    }

    progressionCheck(){

        if(this.isComplete() && this.level + 1 < this.storage.levels.length && this.bucket.mode == 0){ this.progress(1); }

    }

    progress(direction){
        this.level += direction;
        this.set(this.storage.levels[this.level]);
        this.bucket.fills = this.storage.fills[this.level];
    }

    skip(direction){ //for editor mode
        if(this.bucket.mode == 1 && this.level + direction < this.storage.levels.length && this.level + direction >= 0){ this.progress(direction); }
    }

    click(mx, my){

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

    get(){ //outputs board state with RLE

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