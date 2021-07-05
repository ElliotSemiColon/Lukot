import Tile from "./tile.js";
import Resizeable from "./resizable.js";
import Bucket from "./bucket.js";

export default class Board extends Resizeable{

    constructor(_size, _colours){
        super();
        this.size = _size;

        this.tempTiles = [];
        this.tiles = [];

        //this.fillOrigin = null;
        this.colours = _colours;
        this.bucket = new Bucket(_colours); //paint bucket

        this.filling = false;
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
                this.tiles.push(new Tile(Math.floor(Math.random() * this.colours), x + size/2, y + size/2, size, i, j));
                x += size;
            }
            y += size;
            x = sx;
        }

        this.tempTiles = this.tiles;
    }

    fillcheck(){

        this.bucket.filling = this.filling;

        this.changedTiles[2] += ((this.changedTiles[1] - this.changedTiles[0]) - this.changedTiles[2])/10; //smoothing function
        if(this.changedTiles[2] < 1){this.filling = false;}
        this.changedTiles[0] = this.changedTiles[1];

    }

    draw(ctx){ this.tiles.forEach(tile => { tile.draw(ctx); }); }
    
    click(mx, my){

        let index = -1, ID, bID;

        if(!this.filling){

            for(let i = 0; i < this.tiles.length; i++){ if(this.tiles[i].click(mx, my)){ index = i; } }

            if(index >= 0){ 
                ID = this.tiles[index].ID; //initial colour of filled square

                if(ID != this.bucket.ID){

                    this.startFill();

                    this.tiles[index].ID = this.bucket.ID;
                    bID = this.bucket.ID;
                    this.fill(ID, bID, index);
                }
            }
        }
    }

    startFill(){

        this.filling = true;
        this.changedTiles[2] = 2;
        this.changedTiles[1] = this.changedTiles[0] = 0;

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

}