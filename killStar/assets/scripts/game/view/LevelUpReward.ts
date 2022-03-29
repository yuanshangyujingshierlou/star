import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelUpReward extends BaseView {
    @property(cc.Node)
    overBtn:cc.Node = null;

    @property(cc.Label)
    userIdLabel:cc.Label = null;    //用户id

    @property(cc.Label)
    userNameLabel:cc.Label = null;  //用户名

    @property(cc.Label)
    userLevelLabel:cc.Label = null; //用户等级

    @property(cc.Node)
    uesrHead:cc.Node = null; //用户头像
    onLoad () {
        GameJSB.getAndroidData("/userdata/gamelvlprizedata","","gamelvlprizedata"); //获取等级奖励数据
    }

    start () {

    }

    update (dt) {}


    clickOverBtn(){ //点击快速升级的提示弹窗的确定按钮
        this.overBtn.active = false;
    }

    clickLevelExplain(){    //点击升级说明按钮
        this.overBtn.active = true;
    }

    clickCloseBtn(){    //关闭升级奖励弹窗
        ViewManager.getInstance().CloseView("LevelUpReward");
        FightManger.getInstance().Status = 1;
    }

    initScrollViewContent(num:number){    //初始化滚动栏
        let mask = cc.find("body/mask",this.node);
        let node = cc.find("滑动/levelUpLabelBtn",mask);
        mask.getComponent(cc.ScrollView).content.height = node.height * (num + 1) * 1.5 + node.height / 2;
        for(let i = 0 ; i < num ; i++){
            let copyNode = cc.instantiate(node);
            copyNode.setParent(node.parent);
        }
    }

    initLevelUpRewardPopUp(obj){   //初始化升级奖励弹窗
        let slide = cc.find("body/mask/滑动",this.node);    //滑动节点
        this.userIdLabel.string = "i d:" + obj.userid;  //获取id
        this.userLevelLabel.string = "Lv." + obj.gamelvl //获取等级
        this.userNameLabel.string = obj.nickname    //获取用户昵称

        GameJSB.loadAsset(obj.headimgurl,'png').then((asset)=>{       //获取微信头像
            let uesrHeadHeight = this.uesrHead.height;
            let uesrHeadWidth = this.uesrHead.width;

            this.uesrHead.getComponent(cc.Sprite).spriteFrame = asset as cc.SpriteFrame;    //换图

            this.uesrHead.height = uesrHeadHeight;  //适应尺寸
            this.uesrHead.width = uesrHeadWidth;    //适应尺寸
        })

        cc.find("top/topBaord/ProgressBar",this.node).getComponent(cc.ProgressBar).progress = (parseFloat(obj.lvlrate)) / 100;   //升级经验进度条进度

        this.initScrollViewContent(obj.lvlprizes.length - 1);   //领奖页面长度

        for(let i = 0; i < obj.lvlprizes.length;i++){
            cc.find("tixianshu/label",slide.children[i]).getComponent(cc.Label).string = obj.lvlprizes[i].prize + "元";
            cc.find("btn/green/label",slide.children[i]).getComponent(cc.Label).string = obj.lvlprizes[i].gamelvl + "级提现";
            cc.find("btn",slide.children[i]).getComponent(cc.Button).clickEvents[0].customEventData = `${obj.lvlprizes[i].gamelvl}`;

            switch(obj.lvlprizes[i].status){
                case 0:
                    cc.find("btn/green",slide.children[i]).active = true;
                    break;

                case 1:
                    cc.find("btn/yellow",slide.children[i]).active = true;
                    break;

                case 2:
                    cc.find("btn/black",slide.children[i]).active = true;
                    break;
            }
        }
    }

    clickRewardsBtn(e,k){  //领取红包按钮
        let childName: string;
        e.target.children.forEach(child => {
            if(child.active) childName = child.name;
        });
        switch(childName){
            case "green": 
                GameJSB.getAndroidShowToast("当前等级不足，无法领取");
                break;
            case "black":
                console.log("很显然领过了")
                break;
            case "yellow":  
                let param = {
                    type:6,
                    param:parseInt(k), //传入领取奖励的等级
                }
                GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")

                cc.find("yellow",e.target).active = false;
                cc.find("black",e.target).active = true;
                break;
        }
    }
}
