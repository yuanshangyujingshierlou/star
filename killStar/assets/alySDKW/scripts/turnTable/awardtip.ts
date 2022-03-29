// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class awardtip extends cc.Component {

    @property(cc.Label)
    v_propStr: cc.Label = null;

    @property(cc.Button)
    v_closeBtn:cc.Button = null;

    @property(cc.Sprite)
    v_icon:cc.Sprite = null;
    
    @property(cc.Button)
    v_takeBtn:cc.Button = null;

    @property(cc.Node)
    redBg:cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.redBg = this.node.getChildByName("redBg");
         this.v_closeBtn = this.redBg.getChildByName("v_closeBtn").getComponent(cc.Button);
         this.v_takeBtn = this.redBg.getChildByName("v_takeBtn").getComponent(cc.Button);
         this.v_icon = this.redBg.getChildByName("v_icon").getComponent(cc.Sprite);
         this.v_propStr = this.redBg.getChildByName("v_propStr").getComponent(cc.Label);
     }

    start () {
         RedUtil.setScale(this.node);
         RedUtil.setAction(this.redBg,true,null);
         this.v_closeBtn.node.on("click",this.destroySelf,this);
         this.v_takeBtn.node.on("click",this.destroySelf,this);

    }

    destroySelf():void{       
        let node = this.node;
        RedUtil.setAction(this.redBg,false,function() {
            node.destroy();
        });
    }


    getParams(parmp:any):void{
        if(parmp){
            let v_icon = this.v_icon;
            if(parmp.Icon){
                cc.loader.loadRes(parmp.Icon,cc.SpriteFrame,function(err,spriteframe){
                    v_icon.spriteFrame = spriteframe;
               })
            }
            if(parmp.Text){
                this.v_propStr.string = parmp.Text;
            }
            
        }
     }

    // update (dt) {}
}
