import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EveryDayReward extends BaseView {

    @property(cc.Label)
    watchVedioLabel:cc.Label = null;

    @property(cc.Node)
    scroolBar:cc.Node = null;

    watchVedioNum:number = 20;    //每天看视频剩余次数

    onLoad () {
        // this.initEveryDayRewards();
        GameJSB.getAndroidData("/userdata/dayprizedata","","dayprizedata"); //获取每日奖励数据
    }

    start () {

    }

    update (dt) {}

    initScrollViewContent(num:number){    //初始化滚动栏
        let mask = cc.find("body/mask",this.node);
        let node = cc.find("huadong/yj ",mask);


        mask.getComponent(cc.ScrollView).content.height = node.height * (num + 1) * 1.15 + node.height / 2;
        for(let i = 0 ; i < num ; i++){
            let copyNode = cc.instantiate(node);
            copyNode.setParent(node.parent);
        }
        
    }

    initEveryDayRewards(obj){
        // let obj = window["killStar"]['dayprizedata'];
        let huadong = cc.find("body/mask/huadong",this.node);
        cc.find("top/watchBtn/watchNum",this.node).getComponent(cc.Label).string = `(${obj.uservideolast}/${obj.dayvideonum})`;

        if(huadong.children.length !== obj.dayprizedata.length){
            this.initScrollViewContent(obj.dayprizedata.length - 1);
        }
        for(let i = 0;i < huadong.children.length; i++){
            huadong.children[i].getChildByName("showLabel").getComponent(cc.Label).string = `${obj.dayprizedata[i].money}元`;
            huadong.children[i].getChildByName("txjd").getChildByName("txjdLabel").getComponent(cc.Label).string = `${obj.dayprizedata[i].money}`;
            huadong.children[i].getChildByName("ProgressBar").getComponent(cc.ProgressBar).progress = obj.dayprizedata[i].progress / 100;
            huadong.children[i].getChildByName("ProgressBar").getChildByName("barLabel").getComponent(cc.Label).string = `${obj.dayprizedata[i].progress >= 100 ? 100 : obj.dayprizedata[i].progress}%`;
            if(obj.dayprizedata[i].cashstate == 1){
                cc.find("btn/ytx",huadong.children[i]).active = true;
                cc.find("btn/bktx",huadong.children[i]).active = false;
                cc.find("btn/tx",huadong.children[i]).active = false;
            }else if(obj.dayprizedata[i].cashstate == 0){
                if(obj.dayprizedata[i].progress >= 100){
                    cc.find("btn/ytx",huadong.children[i]).active = false;
                    cc.find("btn/bktx",huadong.children[i]).active = false;
                    cc.find("btn/tx",huadong.children[i]).active = true;
                }else if(obj.dayprizedata[i].progress < 100){
                    cc.find("btn/ytx",huadong.children[i]).active = false;
                    cc.find("btn/bktx",huadong.children[i]).active = true;
                    cc.find("btn/tx",huadong.children[i]).active = false;
                }
            }
        }

        cc.find("bottom/ProgressBar",this.node).getComponent(cc.ProgressBar).progress = window["killStar"]['UserInfo'].gamelvl / 60;
        
    }

    clickWatchVedio(){  //点击观看视频广告
        let obj = window["killStar"]['dayprizedata'];
        let num = obj.uservideolast;
        if(num > 0) GameJSB.getAndroidShowRv("每日奖励");
        //----------------------------------------------------
        // this.initEveryDayRewards();
    }

    clickRewards(e){
        let obj = window['killStar']['dayprizedata'];
        let childName: string;
        e.target.children.forEach(child => {
            if(child.active) childName = child.name;
        });
        switch(childName){
            case "bktx": 
                GameJSB.getAndroidShowToast("当前进度不足，无法领取");
                break;
            case "ytx":
                console.log("很显然领过了")
                break;
            case "tx":  
                let param = {
                    money:parseFloat(cc.find("txjd/txjdLabel",e.target.parent).getComponent(cc.Label).string)
                }
                GameJSB.getAndroidData("/userdata/dayprizecash",JSON.stringify(param),"dayprizecash");
                FightManger.getInstance().ViewFight.showText = `${param.money}元提现已到账!`
                ViewManager.getInstance().ShowView("TextPopUp");
                cc.find("tx",e.target).active = false;
                cc.find("ytx",e.target).active = true;
                cc.find("bktx",e.target).active = false;
                break;
        }
    }

    clickCloseBtn(){
        ViewManager.getInstance().CloseView("EveryDayReward")
        FightManger.getInstance().Status = 1;
    }

    
}
