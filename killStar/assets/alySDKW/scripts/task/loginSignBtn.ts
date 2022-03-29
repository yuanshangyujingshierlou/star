// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { RedUtil } from "../RedUtil";
import loginSignWin from "./loginSignWin";

@ccclass
export default class loginSignBtn extends cc.Component {

    @property(cc.Label)
    timeStr: cc.Label = null;

    @property
    _callBack: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timeStr = this.node.getChildByName("timeStr").getComponent(cc.Label);
    }

    start () {
        this.timeStr.node.active = false;
        this.node.on("click",this.requestCount,this);
    }

    requestCount(){
        let self = this;
        RedUtil.requestLoginSignCount({
            SuccessFuc:(res)=>{
                self.selfClick(res);
            }
        });
    }

    selfClick(message){
        if(RedUtil._LoginSignWin){
            RedUtil._LoginSignWin.getComponent(loginSignWin).RefreshRed(message);
        }else{
            let parmp = {
                callBack:this._callBack,
                MessageCode:message
            }
            let parentNode = cc.director.getScene();
            RedUtil.LoadResource("alySDK/alyprofabs/loginSIgnWin",function(err,prefab){
                let newNode = cc.instantiate(prefab);
                if(newNode){                
                    parentNode.addChild(newNode);
                    RedUtil._LoginSignWin = newNode;
                    if(parmp){
                        let cla = newNode.getComponent(loginSignWin);
                        cla.getParams(parmp);
                    }
                }       
        
            })
        }
        
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

   update (dt) {
       if(RedUtil._signRedColdTime>0){
           this.timeStr.node.active = true;
           this.timeStr.string = RedUtil.getSecondString(RedUtil._signRedColdTime*1000);
           RedUtil._signRedColdTime -= dt;
       }else{
           if(this.timeStr.node.active){
              console.log("timeStr=======hid");
              this.timeStr.node.active = false;
           }
       }
   }
}
