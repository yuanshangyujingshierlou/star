import AdaptarManager from "../../core/Manager/AdaptarManager";
import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";
import GoldPig from "./GoldPig";
const {ccclass, property} = cc._decorator;

@ccclass
export default class HongBaoPopup extends BaseView {

    @property(cc.Label)
    popRedBagNum:cc.Label = null;


    isRedBagPop:boolean = false;
    i:number = 3;//倒计时
    a = null;
    onLoad () {
        this.node.active = true;
        this.selfAdaption();
    }

    start () {
    }

    update (dt) {}

    selfAdaption(){
        // let isChang = AdaptarManager.getInstance().isChangPing();
        // if(isChang){
        //     let gg = this.node.getChildByName("guanggao")
        //     let redBag = this.node.getChildByName("redBag")

        //     this.node.height = cc.view.getFrameSize().height * 2;
        //     this.node.getChildByName("background").height = this.node.height;

        //     redBag.setPosition(gg.x,gg.y , + gg.height / 2 + redBag.height / 2);
        // }
        cc.find("redBag/bg/label",this.node).getComponent(cc.Label).string = `${FightManger.getInstance().ViewFight.luckRewardLabel}`;  //初始化红包数值
        cc.find("redBag/title/label",this.node).getComponent(cc.Label).string = `${FightManger.getInstance().ViewFight.rewardname}`;    //初始化红包文案
        if(FightManger.getInstance().ViewFight.hongbaoType == "新手红包"){
            cc.find("redBag/btnParent/btn2",this.node).active = false;
            cc.find("redBag/btnParent/btn3",this.node).active = true;
            GameJSB.getAndroidShowAd("2");
        }else{
            cc.find("redBag/btnParent/btn2",this.node).active = true;
            cc.find("redBag/btnParent/btn3",this.node).active = false;
            this.counTime();
            GameJSB.getAndroidShowAd("1");
        }
    }

    counTime(){
        this.i--;
        this.a = setInterval(()=>{
            this.callback();
            cc.find("redBag/btnParent/btn2/()/timeCount",this.node).getComponent(cc.Label).string = `${this.i}`
            this.i--;
        },1000)
    }

    callback(){
        if(this.i < 0){
            this.i = 0;
            cc.find("redBag/btnParent/btn2",this.node).active = false;
            cc.find("redBag/btnParent/btn",this.node).active = true;
            clearInterval(this.a)
        }
    }

    clickObtain(){ 
        switch(FightManger.getInstance().ViewFight.hongbaoType){
            case "幸运红包":
                GameJSB.getAndroidDismissAd();
                break;

            case "倒计时红包":

                GameJSB.getAndroidData("/userReward/getvideodata","","getvideodata");    //领取完红包 重置倒计时红包进度和显示
                GameJSB.getAndroidDismissAd();
                break;

            case "过关红包":
                GameJSB.getAndroidDismissAd();
                FightManger.getInstance().nextLevel();
                break;

            case "升级奖励":
                GameJSB.getAndroidDismissAd();
                break;

            case "幸运转盘":
                cc.find("hongbaoHome/label",FightManger.getInstance().ViewFight.ViewTop).getComponent(cc.Label).string = window['killStar']['rewards'].userinteger + "" ;  //显示领完此次红包后红包总数
                cc.find("dongtaiIcon/pig",FightManger.getInstance().ViewFight.ViewTop).getComponent(GoldPig).aniAction(window['killStar']['rewards'].todaysave); //显示当天红包存钱罐总数 toast
                GameJSB.getAndroidDismissAd();
                break;
            
            case "新手红包":
                FightManger.getInstance().nextLevel();
                GameJSB.getAndroidWithdrawPage();//调用安卓提现页面
                GameJSB.getAndroidData("/register/getUserInfo","","UserInfo");
                GameJSB.getAndroidDismissAd();
                break;
        }


        this.node.active = false;
        FightManger.getInstance().loadRedBagAni();

        setTimeout(()=>{
            ViewManager.getInstance().CloseView("HongBaoPopup");
        },500)
    }
}
