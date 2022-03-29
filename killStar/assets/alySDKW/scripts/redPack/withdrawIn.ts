// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class withdrawIn extends cc.Component {

    @property(cc.Node)
    closeBtn: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         if(!this.closeBtn){
            let background = this.node.getChildByName("background");
            this.closeBtn = background.getChildByName("closeBtn");
         }
         
     }

    start () {
        RedUtil.setScale(this.node);
        let background = this.node.getChildByName("background");
        background.width = this.node.width;
        background.height = this.node.height;
        background.setPosition(-this.node.width*0.5,this.node.height*0.5);
        console.log("this.node.width*0.5============"+this.node.width*0.5);
        console.log("this.node.height*0.5============"+this.node.height*0.5);
        if(this.closeBtn){
           this.closeBtn.on("click",this.destroySelf,this);
        }
    }

    destroySelf():void{
        this.node.destroy();
    }

    // update (dt) {}
}
