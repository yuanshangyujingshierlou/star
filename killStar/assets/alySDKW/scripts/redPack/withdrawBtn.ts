// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import withdrawalPage from "./withdrawalPage";
import { RedUtil } from "../RedUtil";

@ccclass
export default class withdrawBtn extends cc.Component {

    @property(cc.Label)
    v_money: cc.Label = null;

    @property(cc.Button)
    clickBtn: cc.Button = null;

    @property
    _callBack:any = null;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.v_money = this.node.getChildByName("v_money").getComponent(cc.Label);
         //this.clickBtn = this.node.getChildByName("clickBtn").getComponent(cc.Button);
     }
     onEnable(){
         RedUtil.eventDispatcher.on("openWithdrawPage",this.openWithdrawPage,this.node);
     }

    start () {

        this.node.on("click",this.requestCount,this);
        let moneySrc = "0";
        let money = cc.sys.localStorage.getItem('MoneyNum');
        if(money){
            moneySrc = (Number(money)/100).toString();
            console.log("read current money is=========================="+money);
            //console.log("money============2=============="+typeof(money));
        }

        this.v_money.string = moneySrc+"元"

        setTimeout(() => {
            RedUtil.requestMoney();
        }, 500);

        
        //this.schedule(this.btnactionRun,1.2);

    }
    onDisable(){
        RedUtil._withdrawBtn = null;
        
    }

    btnactionRun(){
        //this.clickBtn.node.
        cc.tween (this.clickBtn.node)
        .to(0.6,{scaleX:1.3,scaleY:1.3})
        .to(0.6,{scaleX:1,scaleY:1})
        .start();
    }

    requestCount():void{
        RedUtil.requestCount(this._callBack);
    }

    openWithdrawPage(cash_out:number,callBack:any):void{
        let parentNode = cc.director.getScene();
        let parmp = {
            callBack:callBack,
            cash_out:cash_out
        };
        RedUtil.LoadResource("alySDK/alyprofabs/withdraw",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){  
                 RedUtil.withdrawPage = newNode;         
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 if(parmp){
                     let cla = newNode.getComponent(withdrawalPage);
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
            
        }
     }

    changeMoney(money:number):void{
        this.v_money.string = money.toString()+"元";
     }


    // update (dt) {}
}
