// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import tips from "../redPack/tipsShow";
import { RedUtil } from "../RedUtil";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    v_title: cc.Label = null;

    @property(cc.Label)
    v_content: cc.Label = null;

    @property(cc.Button)
    v_closeBtn:cc.Button = null;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         let v_backg = this.node.getChildByName("v_backg");
         this.v_title = v_backg.getChildByName("v_title").getComponent(cc.Label);
         this.v_content = v_backg.getChildByName("v_content").getComponent(cc.Label);
         this.v_closeBtn = this.node.getChildByName("v_closeBtn").getComponent(cc.Button);

         //this.v
     }

    start () {
        RedUtil.setScale(this.node);
        this.v_closeBtn.node.on("click",this.destroySelf,this);
    }

    destroySelf():void{
        this.node.destroy();
    }

    getParams(parmp:any):void{
        if(parmp){        
            if(parmp.title&&parmp.title!=""){
                this.v_title.string = parmp.title;
            }
            if(parmp.content&&parmp.content!=""){
                this.v_content.string = parmp.content;
            }
            
        }
     }



    // update (dt) {}
}
