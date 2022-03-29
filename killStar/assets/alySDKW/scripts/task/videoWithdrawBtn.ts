// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { RedUtil } from "../RedUtil";
import redCenter from "../RedCenter";
import videoRedPack from "./videoRedPack";

@ccclass
export default class videoWithdrawBtn extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    _callBack:any = null;

    @property
    _isColdTime:number = 0;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on("click",this.selfClick,this);
    }

    destroySelf(){
        if(this._callBack && this._callBack.onClosed){
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    selfClick(){
        if(this._isColdTime<=0){
            RedUtil.requestVideoRedCount();
            this._isColdTime = 2;
        }
    }

    openVideoRedPack(mess){
        let parmp = {
            callBack:this._callBack,
            messageCode:mess
        }
        RedUtil.LoadResource("alySDK/alyprofabs/videoRedPack",function (err,prefab) {
            let newNode = cc.instantiate(prefab);
            let parentNode = cc.director.getScene();
            console.log("openEveryTask===============");
            if(newNode){  
                RedUtil._videoRedPack = newNode;              
                parentNode.addChild(newNode);
                if(parmp){
                    let cla = newNode.getComponent(videoRedPack);
                    cla.getParams(parmp);
                }
            }     
        })
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

    update (dt) {
        if(this._isColdTime>0){
            this._isColdTime-=dt;
        }
    }
}
