import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../../game/fight/FightManger"
import { GameJSB } from "../GameJSB";
const {ccclass, property} = cc._decorator;

@ccclass
export default class signRedWin extends BaseView {

    @property(cc.Node)
    closeBtn:cc.Node = null;    //关闭按钮

    @property(cc.Label)
    closeLabel:cc.Label = null;    //倒计时出现按钮

    @property(cc.Label)
    hongbaoLabel:cc.Label = null;

    onLoad () {
        this.closeBtn.active = false;
        this.initLabel();
        if(FightManger.getInstance().ViewFight.hongbaoType !== "新手红包"){
            this.signRedWinInit()
        }
    }

    start () {

    }

    update (dt) {

    }

    initLabel(){
        switch(FightManger.getInstance().ViewFight.hongbaoType){
            case "幸运红包":
                this.hongbaoLabel.string = "限时红包"
                if(FightManger.getInstance().Status == 1){
                    FightManger.getInstance().Status = 2;
                }
                break;

            case "倒计时红包":
                this.hongbaoLabel.string = "消除辛苦了！\n我们给您送了一个红包，祝您事事如意~"
                if(FightManger.getInstance().Status == 1){
                    FightManger.getInstance().Status = 2;
                }
                break;

            case "新手红包":
                this.hongbaoLabel.string = "新手红包"
                if(FightManger.getInstance().Status == 1){
                    FightManger.getInstance().Status = 2;
                }
                break;
        }
    }

    signRedWinInit(){
        let i = 3;
        this.schedule(()=>{
            if(i === 0 ){
                this.closeLabel.enabled = false;
                this.closeBtn.active = true;
            }
            this.closeLabel.string = i-- + "";
        },1,3,0)
    }

    clickCloseBtn(){
        console.log("点击前游戏状态",FightManger.getInstance().Status)
        if(FightManger.getInstance().Status == 3){
            FightManger.getInstance().nextLevel();
            ViewManager.getInstance().CloseView("signRedWin");
        }else if(FightManger.getInstance().Status == 2)
        {
            FightManger.getInstance().Status = 1;
            ViewManager.getInstance().CloseView("signRedWin");
        }else if(FightManger.getInstance().Status != 5)
        {
            ViewManager.getInstance().CloseView("signRedWin");
        }
        console.log("点击后游戏状态",FightManger.getInstance().Status)
    }

    openRedBag(){
        switch(FightManger.getInstance().ViewFight.hongbaoType){
            case "幸运红包":
                if(FightManger.getInstance().Status == 2){
                    FightManger.getInstance().Status = 1;
                }
                GameJSB.getAndroidShowRv("幸运红包");
                break;

            case "倒计时红包":
                if(FightManger.getInstance().Status == 2){
                    FightManger.getInstance().Status = 1;
                }
                GameJSB.getAndroidShowRv("倒计时红包");
                break;

            case "过关红包":
                GameJSB.getAndroidShowRv("过关红包");
                break;    

            case "新手红包":
               let param = {
                    type:7
                }
                GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards");
                ViewManager.getInstance().CloseView("signRedWin");
                break;
        }
    }
}
