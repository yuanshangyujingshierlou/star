// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import turnPage from "./turnPage";
import tips from "../redPack/tipsShow";
import { RedUtil } from "../RedUtil";

@ccclass
export default class redStarBtn extends cc.Component {
    @property
    v_propTitle:string = "";

    @property
    v_propIcon:string = "";

    @property
    _callBack:any = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on("click",this.openTurnPage,this);

    }
    onDisable(){
        RedUtil._RedStarBtn = null;
        
    }
    openTurnPage():void{
        let date = new Date();
        let dateStr = date.getFullYear() + "-" +date.getMonth() + "-" +date.getDate();      
        let yesterdayhave = 0;
        let todayhave = 0;
        let todayM = cc.sys.localStorage.getItem('todayHaveNum');
        if(todayM){
            let todayArr = todayM.split(";");
            if(todayArr instanceof Array && todayArr.length>1){
                if(todayArr[0] == dateStr){
                    todayhave = Number(todayArr[1]);
                }else{
                    yesterdayhave = Number(todayArr[1]);
                    let yesterM = cc.sys.localStorage.getItem('yesterdayHaveNum');
                    if(yesterM){
                    let yesterMarr = yesterM.split(";");
                    if(yesterMarr instanceof Array && yesterMarr.length>1){
                        if(yesterMarr[0] == dateStr){
                            yesterdayhave = Number(yesterMarr[1]);
                            console.log("yesterMarr======="+yesterMarr[1]);
                        }else{
                        cc.sys.localStorage.setItem('yesterdayHaveNum',dateStr + ";" + yesterdayhave);
                        }
                    }
                    }
                    todayhave = RedUtil.getRandomNum(1,100);
                    cc.sys.localStorage.setItem('todayHaveNum',dateStr + ";" + todayhave);
                }
            }
        }else{
            todayhave = RedUtil.getRandomNum(1,100);
            cc.sys.localStorage.setItem('todayHaveNum',dateStr + ";" + todayhave);
        }  //今日产出
        let starnum = 50000 - todayhave;

        let parentNode = cc.director.getScene();
        let parmp = {
            callBack:this._callBack,
            propIcon:this.v_propIcon,
            propTitle:this.v_propTitle,
            starNum:starnum

        };
        cc.loader.loadRes("alySDK/alyprofabs/turnPage",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){                
                 parentNode.addChild(newNode);
                 //newNode.setPosition(0,0);
                 //console.log("turnPage=========")
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 RedUtil._turnPage = newNode;
                 if(parmp){
                     let cla = newNode.getComponent(turnPage);
                     cla.getParams(parmp);
                 }
            }       
     
         })
    }

    destroySelf():void{
        if(this._callBack && this._callBack.onClosed){
            //RedUtil.callBackRun(this.node,this._callBack.onClosed);
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
            if(parmp.propTitle&&parmp.propTitle!=""){
                this.v_propTitle =parmp.propTitle;
            }
            if(parmp.propIcon&&parmp.propIcon!=""){
                this.v_propIcon =parmp.propIcon;
            }
            
        }
     }

    // update (dt) {}
}
