import ViewManager from "../../core/Manager/ViewManager";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";


const {ccclass, property} = cc._decorator;

@ccclass
export default class gift extends cc.Component {

    @property(cc.Label)
    timeLabel:cc.Label = null;

    countDownHongBao = null; 
    timeCD:number = null;
    onLoad () {
        // if(cc.find("ViewTop/dongtaiIcon/gift/giftOpen",FightManger.getInstance().ViewFight.node).active){
        FightManger.getInstance().ViewFight.node.getComponent("ViewFight").activeState(cc.find("ViewTop/dongtaiIcon/gift/giftClose",FightManger.getInstance().ViewFight.node))
        FightManger.getInstance().ViewFight.node.getComponent("ViewFight").activeState(cc.find("ViewTop/dongtaiIcon/gift/giftOpen",FightManger.getInstance().ViewFight.node))
        // }
    }

    start () {
    }

    update (dt) {
        
    }


    obtainTime(num:number){
        this.timeCD = num / 1000;
        clearInterval(this.countDownHongBao);
        
        this.countDown();
    }

    countDown(){//倒计时
        let ViewFight = this.node.parent.parent.parent;
        this.timeLabel.node.active = true;
        if(!this.timeCD) return
        this.countDownHongBao = setInterval(() => {
            if(this.timeCD > 0 ){
                let minutes = Math.floor(this.timeCD / 60);
                let seconds = Math.floor(this.timeCD % 60);
                if(seconds == 0){
                    this.timeLabel.string = "0" + minutes + "：" + " " + "00";
                }else if(seconds < 10 ){
                    this.timeLabel.string = "0" + minutes + "：" + " " + "0" + seconds;
                }else{
                    this.timeLabel.string = "0" + minutes + "：" + " " + seconds;
                }
                this.timeCD = this.timeCD - 1;
            }else{
                this.timeCD = null;
                this.timeLabel.node.active = false
                clearInterval(this.countDownHongBao);
                cc.find("ViewTop/dongtaiIcon/gift/giftOpen",ViewFight).active = true;
                cc.find("ViewTop/dongtaiIcon/gift/giftClose",ViewFight).active = false;
                ViewFight.getComponent("ViewFight").activeState(cc.find("ViewTop/dongtaiIcon/gift/giftOpen",ViewFight))
                
            }
        },1000)
    }

    clickTimeHongBao(){
        if(this.node.getChildByName("giftOpen").active){
            FightManger.getInstance().ViewFight.hongbaoType = "倒计时红包";
            ViewManager.getInstance().ShowView("signRedWin")
        }else{
            GameJSB.getAndroidShowToast("请倒计时结束后继续领红包");
        }
    }
}
