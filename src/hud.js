import Resizeable from "./resizable.js";

export default class HUD extends Resizeable{

    constructor(_topx, _topy){

        super();
        this.score = 0;
        this.topx = _topx;
        this.topy = _topy;
        this.font = `50px Helvetica`;
        this.colour = "#FFFFFF";
        this.level = 0;

    }

    draw(ctx){

        ctx.fillStyle = "#00000033";
        ctx.fillRect(this.topx, this.topy, 400, 125);

        ctx.font = this.font;
        ctx.fillStyle = this.colour; 
        ctx.fillText(`+${this.score} skill points`, this.topx + 15, this.topy + 50);
        ctx.fillText(`level ${this.level + 1}`, this.topx + 15, this.topy + 105);

    }

}