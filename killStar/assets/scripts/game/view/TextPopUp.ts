import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TextPopUp extends BaseView {

    @property(cc.Node)
    closeBtn:cc.Node = null;    //关闭按钮

    @property(cc.Label)
    closeLabel:cc.Label = null;    //倒计时出现按钮

    @property(cc.Label)
    showLabel:cc.Label = null; //展示的文本组件

    showText:string = "";   //展示的文本信息

    onLoad () {
        this.signRedWinInit();
        this.initShowText();
        GameJSB.getAndroidShowAd("2");
    }

    start () {

    }

    update (dt) {}

    initShowText(){
        this.showText = FightManger.getInstance().ViewFight.showText;
        console.log(this.showText)
        this.showLabel.string = this.showText;
    }

    signRedWinInit(){
        this.closeBtn.active = false;
        let i = 3;
        this.schedule(()=>{
            if(i === 0 ){
                this.closeLabel.enabled = false;
                this.closeBtn.active = true;
            }
            this.closeLabel.string = i-- + "";
        },1,3,0)
    }

    clickClose(){
        ViewManager.getInstance().CloseView("TextPopUp");
        GameJSB.getAndroidDismissAd();
    }
    
}
