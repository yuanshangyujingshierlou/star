import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";
import ViewFight from "./ViewFight";
const {ccclass, property} = cc._decorator;

@ccclass
export default class zhuanpan extends BaseView {

    @property(cc.Label)
    luckDrawNum:cc.Label = null;

    @property(cc.Node)
    flashLamp:cc.Node = null;

    targetAngle: number;

    ViewFight:ViewFight = FightManger.getInstance().ViewFight;

    socrk:boolean = true; //转盘锁

    angleStr:string = "";   //接收这次抽到了什么
    luckRewardType:number = null;   //这次奖励类型

    gettablenum:number = null; //是否新用户第一次抽奖

    
    num:number = null;
    onLoad () {
        this.num = this.ViewFight.zhuanpanNum || 30;
        this.gettablenum = window['killStar']['configs'].userfirst;
        FightManger.getInstance().Status = 1;
        window['initAngle'] = this.initAngle.bind(this);

        this.luckDrawNum.string = this.ViewFight.zhuanpanNum + "";
    }

    start () {
        // console.log(this.nextLuckRewardType)
        // console.log(this.nextAngleStr)
        this.luckRoutleLight(); //转盘炫光
    }

    update (dt) {

    }

    luckRoutleLight(){
        let light = cc.find("bg/光束",this.node);
        cc.tween(light)
        .repeatForever(
            cc.tween()
            .to(3.6, {angle: 360})
            .call(()=>light.angle = 0)
        )
        .start()

        this.lightLamp();
    }

    initAngle(angle: number){   //传入角度
        this.node.getChildByName("roulette").angle = 0;
        this.targetAngle = angle;
    }

    buildAngle(str:string){
        switch(str){
            case "少量红包":    return  -30 + Math.round(Math.random()*60);

            case "1元提现":    return  30 + Math.round(Math.random()*60);

            case "中量红包":    return  90 + Math.round(Math.random()*60);

            case "3元提现":   return  150 + Math.round(Math.random()*60);

            case "大量红包":     return  210 + Math.round(Math.random()*60);

            case "0.3元提现":     return  270 + Math.round(Math.random()*60);
        }
    }

    clickBtn(){ //提交测试包的时候要把点击事件换到这里 不然不会触发广告
        if(this.gettablenum === 1)   {
            this.clickEvents();
        }
        if(this.num > 0){
            GameJSB.getAndroidShowRv("幸运转盘抽奖");   //调用全屏广告
        }
    }

    clickEvents(){ //点击开始抽奖
            cc.find("btn",this.node).active = false  //开启锁
            this.num = this.num - 1;
            this.luckDrawNum.string = this.num + "";
            this.getLuckRoulette();

            // let roulettle = this.node.getChildByName("roulette");
            // let time = 2;

            // this.initAngle(this.buildAngle(this.angleStr||this.ViewFight.angleStr) || Math.random() * 360);

            // this.doing1(roulettle,time,360)
    }




    

    doing1(node:cc.Node,time:number,angle:number){  //由慢到快
        console.log(this.targetAngle)
        cc.tween(node)
        .to(time,{angle},{easing: t => 8*t*t})
        .call(()=>{
            node.angle = node.angle%360;
            this.doning3(node,360*time/angle/16)
        })
        .start();
    }
    doning3(node:cc.Node, t:number){    //由快到慢 渐渐停止
        let a: number = 1, b = 2*a;
        let i = 4;
        let angle = i*360 + this.targetAngle;

        /**
         * 对称轴 time = b / 2a;
         * 
         * 平均速度：DT = 360 * time / angle;
         * 
         * 变速初始速度： T = DT / b;
         * 
         * 对接速度：使得 T = t; 得：t = 360 * time / angle / b; ---> time = t * b * angle / 360;
         */

        let time = t * b * angle / 360;
        cc.tween(node)
        .to(time / a,{angle: angle / a} ,{easing: t => -a*t*t + b*t})
        .call(()=>{
            cc.find("btn",this.node).active = true; //关闭锁

            if(this.luckRewardType == 1 || this.ViewFight.luckRewardType == 1){
                FightManger.getInstance().ViewFight.hongbaoType = "幸运转盘"
                ViewManager.getInstance().ShowView("HongBaoPopup");
            }else if(this.luckRewardType == 2 || this.ViewFight.luckRewardType == 2){
                ViewManager.getInstance().ShowView("TextPopUp");
            }
        })
        .start()
    }

    lightLamp(){    //灯
        this.schedule(()=>{
            this.flashLamp.getChildByName("2").active = !this.flashLamp.getChildByName("2").active;
        },0.2)
    }

    getLuckRoulette(){
        let param = {   //幸运转盘奖励
            type:3,
        }
        GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")
    //------------------------------------------------------------------------------------------------
        let param2 = {
            code:0,
            cctype:"rewards",
            message:"成功！",
            data:{
                saveintegral:0,
                rewardname:"幸运转盘",
                yesdaysave:"474",
                todaysave:81,
                plusintegral:500,
                type:3,
                prizetype:1,
                lasetablenum:25,
                userinteger:19999,
                prizenum:'0.30',
            }
        }
        // GameJSB.obtainHttpData(JSON.stringify(param2));
    }

    clickClose(){
        GameJSB.getAndroidData("/config/configs","","configs");
        ViewManager.getInstance().CloseView("zhuanpan");    //退出转盘界面
    }
}
/**
 *                 ⡖⠒⠒⠤⢄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⡼⠀⠀⠀⠀ ⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢶⣲⡴⣗⣲⡦⢤⡏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠉⠉⠓⠛⠿⢷⣶⣦⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⠀⠀⢰⠇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡴⠊⠉⠳⡄⠀⢀⣀⣀⡀⠀⣸⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠃⠀⠰⠆⣿⡞⠉⠀⠀⠉⠲⡏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⢧⡀⣀⡴⠛⡇⠀⠈⠃⠀⠀⡗⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣱⠃⡴⠙⠢⠤⣀⠤⡾⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡇⣇⡼⠁⠀⠀⠀⠀⢰⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣸⢠⣉⣀⡴⠙⠀⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠈⠁⠀⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠃⠀⠀⠀⠀⠀⠀⠀⡼⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⠤⠚⣶⡀⢠⠄⡰⠃⣠⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣠⠔⣋⣷⣠⡞⠀⠉⠙⠛⠋⢩⡀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀
⠀⡏⢴⠋⠁⠀⣸          ⣹⢦⣶⡛⠳⣄⠀⠀⠀⠀⠀
⠀⠙⣌⠳⣄⠀⡇⠀⠀在拉屎⠀  ⡏⠀⠀⠈⠳⡌⣦⠀⠀⠀⠀
⠀⠀⠈⢳⣈⣻⡇⠀⠀⠀⠀⠀⠀⢰⣇⣀⡠⠴⢊⡡⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠳⢿⡇⠀⠀⠀⠀⠀⠀⢸⣻⣶⡶⠊⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⠟⠙⠓⠒⠒⠒⠒⢾⡛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⠏⠀⣸⠏⠉⠉⠳⣄⠀⠙⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡰⠃⠀⡴⠃ 💩⠀⠀⠈⢦⡀⠈⠳⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣸⠳⣤⠎⠀💩💩⠀    ⠙⢄⡤⢯⡀⠀⠀⠀⠀⠀⠀
⠀⠐⡇⠸⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀    ⠹⡆⢳⠀⠀⠀⠀⠀⠀
⠀⠀⠹⡄⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⣇⠸⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠹⡄⢳⡀⠀⠀ ⠀⠀⠀ ⠀⠀    ⢹⡀⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢹⡤⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⢀⣷⠚⣆⠀⠀⠀⠀
⠀⠀⠀⡠⠊⠉⠉⢹⡀⠀⠀⠀⠀⠀⠀    ⢸⡎⠉⠀⠙⢦⡀⠀
⠀⠀⠾⠤⠤⠶⠒⠊⠀⠀⠀⠀ ⠀      ⠉⠙⠒⠲⠤⠽
 */