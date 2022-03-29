// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class redpackSecondWin extends cc.Component {

    @property(cc.Button)
    closeBtn:cc.Button=null;

    @property(cc.Label)
    v_money:cc.Label=null;

    @property(cc.Node)
    v_yuan:cc.Node=null;

    @property(cc.Node)
    redbg:cc.Node=null;

    @property(cc.Node)
    bgPar:cc.Node=null;

    @property(cc.Node)
    background_down:cc.Node = null;

    @property(cc.Node)
    moveTo:cc.Node = null;

    @property(cc.Node)
    goWithdrawBtn:cc.Node = null;

    @property 
    money:number=0;

    @property
    _callBack:any = null;

    @property
    _isOpenWithdraw:boolean = false;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.bgPar = this.node.getChildByName("bgPar");
        this.redbg = this.bgPar.getChildByName("redbg");
        this.closeBtn = this.redbg.getChildByName("closeBtn").getComponent(cc.Button);
        this.v_money = this.redbg.getChildByName("v_money").getComponent(cc.Label);
        this.v_yuan = this.redbg.getChildByName("v_yuan");
        this.money = RedUtil._currentMoney;
        this.v_money.string = (this.money/100).toString();

        this.background_down = this.node.getChildByName("background_down");
        this.moveTo = this.background_down.getChildByName("moveTo");
        this.goWithdrawBtn = this.background_down.getChildByName("goWithdrawBtn");

     }

    start () {
        RedUtil.setScale(this.node);
        
        let mwidth = this.v_money.node.width;
        let nwidth = this.v_yuan.width;
        let allw = mwidth+nwidth+8;
        let leftOff = (this.redbg.width - allw)/2;
        this.v_money.node.x = leftOff+mwidth/2;
        this.v_yuan.x = leftOff+mwidth+nwidth/2+8;

        let ctime = this.getDateString();
        let moneyData = cc.sys.localStorage.getItem('MoneyRecord');
        if(moneyData){
            let record = JSON.parse(moneyData);
            let recordName = record.recordName;
            let MoneyTime = record.MoneyTime;
            let MoneyValue = record.MoneyValue;
            recordName.push(RedUtil._activeName);
            MoneyTime.push(ctime);
            MoneyValue.push(RedUtil._currentMoney.toString());
            record = {recordName:recordName,MoneyTime:MoneyTime,MoneyValue:MoneyValue};
            cc.sys.localStorage.setItem('MoneyRecord',JSON.stringify(record));
            
        }else{            
            let recordName = [];
            let MoneyTime = [];
            let MoneyValue = [];
            recordName.push(RedUtil._activeName);
            MoneyTime.push(ctime);
            MoneyValue.push(RedUtil._currentMoney.toString());
            let record = {recordName:recordName,MoneyTime:MoneyTime,MoneyValue:MoneyValue};
            cc.sys.localStorage.setItem('MoneyRecord',JSON.stringify(record));
        }
        

        RedUtil.setAction(this.bgPar,true,null);

        
    }
    onEnable(){
        //this.closeBtn.node.on("click",this.destroySelf,this);
        let clickHandler = new cc.Component.EventHandler();
        clickHandler.target = this.node;
        clickHandler.component = "redpackSecondWin";
        clickHandler.handler = "destroySelf";
        clickHandler.customEventData = "clieck";
        this.closeBtn.clickEvents.push(clickHandler);

        this.goWithdrawBtn.on("click",this.openWithdraw,this);
    }
    onDisable(){
        RedUtil._isOpenSecondPage = false;
        RedUtil._currentMoney = 0;
    }

    destroySelf(event:Event,customEventData:string):void{
        let self  = this;
        RedUtil.setAction(this.bgPar,false,function() {
            self.setCall();
        })

    }

    setCall(){
        if(RedUtil._isOpenSecondPage){
            RedUtil._isOpenSecondPage = false;
        }
        if(this._callBack && this._callBack.onClosed){
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    startMove(){
        this.schedule(function(){
            cc.tween(this.moveTo)
            .to(0.2,{x:167.152,y:-227})
            .to(0.2,{x:184.356,y:-209.8})
            .start();
        },0.4);
    }

    openWithdraw(){
       this.node.destroy();
       RedUtil.requestCount({
         nextClose:this._callBack.onClosed
       })
    }

    getParams(parmp:any):void{
        console.log("pppppppppppppppppppp");
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;     
                if(RedUtil._isOpenSecondPage){
                    if(!RedUtil._isredPackRainOpen){
                        if(this._callBack && this._callBack.onOpened){
                            RedUtil.callBackRun(this.node,this._callBack.onOpened);
                        }
                    }                  
                } 
                if(this._callBack && this._callBack.redPackGetSuccess){
                    RedUtil.callBackRun(this.node,this._callBack.redPackGetSuccess);
                }        
                  
            }
            if(parmp.isOpenWithdraw){
                this._isOpenWithdraw = parmp.isOpenWithdraw;
                cc.sys.localStorage.setItem("FirstOpenRedPack","true");
                this.background_down.active = true;
                this.startMove();
            }
            
        }
     }

    // update (dt) {}

    getDateString():string {
        var nowDate = new Date();
        var year = String(nowDate.getFullYear());
        var month = String(nowDate.getMonth() + 1);
        var day = String(nowDate.getDate());
        month = month.length < 2 ? '0' + month : month;
        day = day.length < 2 ? '0' + day : day;
        var hour = nowDate.getHours();
        var hourstr = hour < 10 ? ('0' + hour) : hour.toString();
        var min = nowDate.getMinutes();
        var minstr = min < 10 ? ('0' + min) : min.toString();
        var sec = nowDate.getSeconds();
        var secstr = sec < 10 ? ('0' + sec) : sec.toString();
        return year + '-' + month + '-' + day + ' ' + hourstr + ':'+ minstr +':'+ secstr;
      }
}


