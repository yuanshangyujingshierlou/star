// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class everyWithdrawBtn extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property
    _callBack:any = null;

    // onLoad () {

    // }

    start () {
          this.node.on("click",this.openEveryTask,this);
          this.playAni();
          
    }

    playAni(){
        let node = this.node;
        this.schedule(function(){
            cc.tween(this.node)
            .to(0.1,{angle:-15})
            .to(0.3,{scaleX:1.5,scaleY:1.5})
            .to(0.1,{angle:15})
            .to(0.1,{angle:-15})
            .to(0.1,{angle:15})
            .to(0.1,{angle:-15})
            .to(0.1,{angle:0})
            .to(0.3,{scaleX:1,scaleY:1})
            .start();
        },1.6);
        
    }

    stopAni(){
        console.log("stopAni============");
        this.unscheduleAllCallbacks();
    }

    openEveryTask(){
        this.stopAni();
        //console.log("openEveryTask============");
        RedUtil.requestEveryTask(this._callBack);
    }

    
    destroySelf(){
        if(this._callBack && this._callBack.onClosed){
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.onOpened){
                    RedUtil.callBackRun(this.node,this._callBack.onOpened);
                }
            }           
            
        }
    }
     //update (dt) {}
}
