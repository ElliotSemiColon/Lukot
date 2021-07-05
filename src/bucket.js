import Resizeable from "./resizable.js";

export default class Bucket extends Resizeable{

    constructor(_colours){

        super();
        this.x;
        this.y;
        this.colours = _colours;
        this.ID = 0;

        this.size = 75;
        
        this.centreSize = [this.size/1.55, 0]; //value, temp smoothed value
        this.whiteSize = [this.size, 0]; //value, temp smoothed value

        this.filling;
        this.fills;

        this.mode = 0; //0 is floodfill mode, 1 is editor mode
        this.held = false;
    }

    // getColour(){
    //     return `rgba(${Math.sin((this.ID)) * 127 + 127},${Math.sin((this.ID) + Math.PI/1.5) * 127 + 127},${Math.sin((this.ID) + Math.PI/0.75) * 127 + 127})`;
    // }

    draw(ctx){
        
        // ctx.fillStyle = "#000000";
        // ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
        if(this.mode == 0){ ctx.fillStyle = "#ffffff"; }
        if(this.mode == 1){ ctx.fillStyle = "#000000"; }
        //if(this.fills == 0){ ctx.fillStyle = "#dddddd"; }

        ctx.fillRect(this.x - this.size, this.y - this.size, this.whiteSize[1], this.whiteSize[1]);

        ctx.beginPath();
        ctx.arc(this.x + this.whiteSize[1] - this.size, this.y + this.whiteSize[1] - this.size, this.whiteSize[1], 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = this.palette[this.ID];
        ctx.beginPath();
        ctx.arc(this.x + this.whiteSize[1] - this.size, this.y + this.whiteSize[1] - this.size, this.centreSize[1], 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = `${this.whiteSize[1]}px Helvetica`;
        ctx.fillStyle = "#000000";
        if(this.mode == 0){ ctx.fillText(`${this.fills}`, this.x + this.whiteSize[1] - this.size * 1.28, this.y + this.whiteSize[1] * 1.32 - this.size); } 

    }
    
    update(){

        if(this.filling){ this.centreSize[0] = 0 }
        else if(this.fills > 0){ this.centreSize[0] = this.size/1.55; }

        this.whiteSize[1] += (this.whiteSize[0] - this.whiteSize[1])/5;
        this.centreSize[1] += (this.centreSize[0] - this.centreSize[1])/5;

    }

    increment(val){
        let temp = this.ID;
        temp += val;
        this.ID = (temp + this.colours) % this.colours;
    }

    click(){
        this.whiteSize[1] /= 1.25;
        this.centreSize[1] /= 1.25
    }

}