// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class litterRedPack extends cc.Component {

    @property(cc.Button)
    clickBtn: cc.Button = null;

    @property(dragonBones.ArmatureDisplay)
    dronBone: dragonBones.ArmatureDisplay = null;


    @property
    clickNum:number = 0;

    @property
    mayclickNum:number = 0;

    @property
    _minX:number = 0;

    @property
    _maxX:number = 0;

    @property
    _minY:number = 0;

    @property
    _maxY:number = 0;

    @property
    roadlength:number = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dronBone = this.node.getChildByName("playani").getComponent(dragonBones.ArmatureDisplay);
        this.dronBone.addEventListener(dragonBones.EventObject.COMPLETE,this.hideSelf,this);
        this.clickBtn = this.node.getChildByName("clickBtn").getComponent(cc.Button);
        this.clickBtn.node.on("click",this.clickSelf,this);
        this.node.getChildByName("playani").active = false;
        
    }

    onEnable(){
       this.playAni();
       this.clickNum = RedUtil.getRandomNum(1,2);
       this.mayclickNum = 0;
       this.roadlength = RedUtil.getRandomNum(3,4.5);
       //console.log("clickNum========="+this.clickNum);
       let parent = this.node.parent;
       let pwidth = parent.width;
       let pheith = parent.height;
       this._minX = -(pwidth*0.5-10-this.node.width*0.5);  //最左
       this._maxX = (pwidth*0.5-10-this.node.width*0.5);  //z最右

       this._minY = (pheith*0.5+280); //最上方
       this._maxY = -(pheith*0.5-10-this.node.height*0.5); //最下方

       let len = Math.floor((pwidth-20)/(this.node.width));

       let rodnum = RedUtil.getRandomNum(0,len)
       let posx = this._minX+(this.node.width)*rodnum;
       if(posx>this._maxX){
           posx = this._maxX;
       }

       this.node.setPosition(posx,this._minY);
       this.clickBtn.node.active = true;

       
    }

    start () {
        //this.playAni();
    }

    playAni(){
        let node = this.node;
        cc.tween(this.node)
        .to(0.1,{angle:-15})
        .start();

        this.schedule(function(){
            cc.tween(this.node)
            .to(0.3,{angle:15})
            .to(0.3,{angle:-15})
            .to(0.3,{angle:15})
            .to(0.3,{angle:-15})
            .start();
        },1.2);
        
    }

    stopAni(){
        this.unscheduleAllCallbacks();
    }

    clickSelf(){
        this.mayclickNum +=1;
        //console.log("clickSelf========="+this.mayclickNum);
        if(this.mayclickNum>=this.clickNum){
            this.clickBtn.node.active = false;
            this.node.getChildByName("playani").active = true;
            this.dronBone.playAnimation("Sprite",1);
        }
        
    }
    
    hideSelf(){
      this.mayclickNum = 0;
      this.node.parent.removeChild(this.node);
      this.node.active = false;
      if(this.node){
        RedUtil._litterRedPool.push(this.node);
        RedUtil._currRedNum -=1;
      }

      this.node.getChildByName("playani").active = false;
      
      //this.node.destroy();
      //console.log("hideSelf")
    }

    onDisable(){
       this.stopAni();
    }

    update (dt) {
        if(this.node.y <= this._maxY){
            this.hideSelf();
        }else{
            this.node.y -= this.roadlength;
        }
    }
}
