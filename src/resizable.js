export default class Resizeable{

    constructor(){

        //canvas dimensions
        this.cWidth;
        this.cHeight;
        this.palette = [
            "#2D728F",
            "#3Ba8A5",
            "#F5EE9E",
            "#F49E4C",
            "#AB3428",
            "#55dd33"
        ];

    }

    resize(w, h){

        this.cWidth = w;
        this.cHeight = h;

    }

}