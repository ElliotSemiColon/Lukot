import Resizeable from "./resizable.js";

export default class Tile extends Resizeable{

    constructor(_ID, _x, _y, _size){

        super();
        this.ID = _ID;
        //this.reference = [_i, _j];
        //this.colour = `rgba(${Math.sin((_ID)) * 127 + 127},${Math.sin((_ID) + Math.PI/1.5) * 127 + 127},${Math.sin((_ID) + Math.PI/0.75) * 127 + 127})`;
        this.x = _x;
        this.y = _y;
        this.size = _size + 1; //px width

    }

    // getColour(){
    //     return `rgba(${Math.sin((this.ID)) * 127 + 127},${Math.sin((this.ID) + Math.PI/1.5) * 127 + 127},${Math.sin((this.ID) + Math.PI/0.75) * 127 + 127})`;
    // }

    draw(ctx){
        ctx.fillStyle = this.palette[this.ID]; //this.getColour(this.ID);
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }

    click(mx, my){

        if(mx > this.x - this.size/2 && mx < this.x + this.size/2 && my > this.y - this.size/2 && my < this.y + this.size/2){
            //this.ID++;
            //console.log(this.reference);
            //return this.reference;
            return true;
        }
        return false;

    }

}