import Resizeable from "./resizable.js";

export default class HUD extends Resizeable{

    constructor(_topx, _topy){

        super();
        this.score = 0;
        this.topx = _topx;
        this.topy = _topy;
        this.font = `50px Helvetica`;
        this.colour = "#000000";

    }

    draw(ctx){

        ctx.font = this.font;
        ctx.fillStyle = this.colour; 
        ctx.fillText(`+${this.score}`, this.topx + 7, this.topy + 47);

    }

}