// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";
import mainProfitPage from "./mainProfitPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class everyRedBtn extends cc.Component {

    @property(cc.Label)
    v_money: cc.Label = null;

    @property(cc.Label)
    v_changetime: cc.Label = null;

    @property
    _callBack:any = null;

    @property
    v_propTitle:string = "";

    @property
    v_propIcon:string = "";

    @property
    currTime:number = 0;

    @property
    currMonty:number = 0;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.v_money = this.node.getChildByName("v_money").getComponent(cc.Label);
         this.v_changetime = this.node.getChildByName("v_changetime").getComponent(cc.Label);
     }

    start () {
       this.node.on("click",this.openmainProfit,this);
       this.setdefaulttext();
    }
    onDisable(){
       
       RedUtil._everyRed = null;
    }

    destroySelf():void{
        if(this._callBack && this._callBack.onClosed){
            //RedUtil.callBackRun(this.node,this._callBack.onClosed);
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    setdefaulttext():void{
        let date = new Date();
        let dateStr = date.getFullYear() + "-" +date.getMonth() + "-" +date.getDate();
        let yesEveryNum = RedUtil.getRandomNumfloat(220,230,2);
         let yesEvery = cc.sys.localStorage.getItem('yesterdayEvery');
         if(yesEvery){
             let yesArr = yesEvery.split(";");
             if(yesArr instanceof Array && yesArr.length>1){
                if(yesArr[0] == dateStr){
                 yesEveryNum = Number(yesArr[1]);
                }else{
                    cc.sys.localStorage.setItem('yesterdayEvery',dateStr + ";" + yesEveryNum);
                }
             }else{
                 console.log("yesterdayEvery--error");
             }
         }else{
             cc.sys.localStorage.setItem('yesterdayEvery',dateStr + ";" + yesEveryNum);
         }   //昨日
         this.v_money.string = yesEveryNum + "元"
         this.v_changetime.string = "每日分红"
     }


     public changeTime(time:number,money:number,totalmoney:number):void{
        if(time>0){
            let timec = time;
            this.currTime = timec;
            RedUtil._everyRedTime = timec;
            let count = Math.floor(timec/500);
            let inNum = 0;
            let cmoney = money;
            this.currMonty = 0;
            let lastMoney = money;
            let singm = cmoney/count;
            let v_money = this.v_money;
            let v_changetime = this.v_changetime;
            this.schedule(function(){
                if(inNum<count){
                    inNum++;
                    this.currMonty+=singm;
                    v_money.string = this.currMonty.toFixed(4)+"元";
                    this.currTime -= 500;
                    //console.log("this.currTime======="+this.currTime);
                    v_changetime.string = RedUtil.getSecondString(this.currTime);
                }else{
                    let currM = cc.sys.localStorage.getItem('MoneyNum');
                    console.log("currentMOney============="+money);
                    RedUtil.everyRedTimeOver(money*100); //告诉服务端余额增加了

                    RedUtil._everyRedTime = 0;
                    this.currTime = 0;
                    this.currMonty = 0;
                    v_money.string = lastMoney.toString()+"元";
                    v_changetime.string = "每日分红";
                    this.unscheduleAllCallbacks();
                    this.setdefaulttext();
 
                }
            },0.5);
            
        }
     }


    openmainProfit():void{
        let parentNode = cc.director.getScene();
        let parmp = {
            callBack:this._callBack,
            propTitle:this.v_propTitle,
            propIcon:this.v_propIcon
        }
        cc.loader.loadRes("alySDK/alyprofabs/mainprofit",function(err,prefab){
           let newNode = cc.instantiate(prefab);
            if(newNode){                
                parentNode.addChild(newNode);
                newNode.setPosition(parentNode.width/2,parentNode.height/2);
                RedUtil._mainprofit = newNode;
                if(parmp){
                    let cla = newNode.getComponent(mainProfitPage);
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
            if(parmp.propTitle&&parmp.propTitle!=""){
                this.v_propTitle = parmp.propTitle;

            }
            if(parmp.propIcon&&parmp.propIcon!=""){
                this.v_propIcon = parmp.propIcon;
            }
            
        }
     }


    // update (dt) {}
}
