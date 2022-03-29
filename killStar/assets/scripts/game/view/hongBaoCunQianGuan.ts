import BaseView from "../../core/View/BaseView";
import ViewManager from "../../core/Manager/ViewManager"
import FightManger from "../fight/FightManger";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import { GameJSB } from "../GameJSB";

const {ccclass, property} = cc._decorator;

@ccclass
export default class hongBaoCunQianGuan extends BaseView {

    @property(cc.Label)
    showTextLabel:cc.Label = null;

    @property(cc.SpriteFrame)
    spriteList:Array<cc.SpriteFrame> = [];

    onLoad () {
        this.initHBCQG();
    }

    start () {

    }

    update (dt) {}

    initHBCQG(){    //初始化红包存钱罐的ui
        let userInfo = window['killStar']['UserInfo'];
        // let userInfo = obj;
        let boo = userInfo.yesdaysave == 0 ? false : true;

        if(boo){    //说明昨天的红包还没领取
            cc.find("showYesterday",this.node).getComponent(cc.Sprite).spriteFrame = this.spriteList[1];
            cc.find("showYesterday/label",this.node).getComponent(cc.Label).string = userInfo.yesdaysave + "";//显示昨天红包数量
        }else{
            cc.find("showYesterday",this.node).getComponent(cc.Sprite).spriteFrame = this.spriteList[0];
            cc.find("showYesterday/label",this.node).getComponent(cc.Label).string = FightManger.getInstance().ViewFight.todayText + "";//显示今天红包数量
        }

        this.node.getChildByName("label").getChildByName("nowLabel").active = boo;
        this.node.getChildByName("label").getChildByName("lastLabel").active = !boo;
        this.node.getChildByName("clickBtn").getChildByName("now").active = boo;
        this.node.getChildByName("clickBtn").getChildByName("last").active = !boo;
    }

    clickLingQu(){
        if(this.node.getChildByName("clickBtn").children[1].active){

            let pamrm = {
                type:1,
            }
            GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(pamrm),"rewards");//领取昨日存钱罐
            cc.find("clickBtn/last",this.node).active = true;
            cc.find("clickBtn/now",this.node).active = false;
            cc.find("showYesterday",this.node).getComponent(cc.Sprite).spriteFrame = this.spriteList[0];
            this.hongbaoLight();
        }else{
            GameJSB.getAndroidShowToast("请明日再来领取");
        }
    }

    clickClose(){
        ViewManager.getInstance().CloseView("hongBaoCunQianGuan");
        FightManger.getInstance().Status = 1;
    }


    hongbaoLight(){ //领取动画
        let cont = 0;
        let hongbaoHome = cc.find("hongbaoHome",FightManger.getInstance().ViewFight.ViewTop);
        let fullHeight = AdaptarManager.getInstance().fullHeight;
        


        let time = setInterval(() => {
            if(cont == 6)   clearInterval(time);
            this.node.getChildByName("hongbaoAni").children[cont].active = true;
            cc.tween(this.node.getChildByName("hongbaoAni").children[cont])
            .to(0.7,{x:hongbaoHome.x ,y:hongbaoHome.y + Math.abs(this.node.getChildByName("hongbaoAni").y) + Math.abs(FightManger.getInstance().ViewFight.ViewTop.y), opacity:87})
            .start();
            cont++;
        }, 110);


        setTimeout(()=>{
            FightManger.getInstance().Status = 1;
            ViewManager.getInstance().CloseView("hongBaoCunQianGuan");
        },1050)
    }
}
