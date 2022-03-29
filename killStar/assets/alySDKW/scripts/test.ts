// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import redCenter from "./RedCenter";
import { RedUtil } from "./RedUtil";


@ccclass
export default class test extends cc.Component {

    @property(cc.Button)
    redpack: cc.Button = null;

    @property(cc.Button)
    withdraw:cc.Button = null;

    @property(cc.Button)
    turnBtn:cc.Button = null;

    @property(cc.Button)
    mainprofit:cc.Button = null;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        let background = this.node.getChildByName("background");
        this.redpack = background.getChildByName("redpack").getComponent(cc.Button);
        this.withdraw = background.getChildByName("withdraw").getComponent(cc.Button);
        this.turnBtn = background.getChildByName("turnBtn").getComponent(cc.Button);
        this.mainprofit = background.getChildByName("mainprofit").getComponent(cc.Button);
        //this.mainprofit.node.active  = false;
        //this.turnBtn.node.active  = false;
     }

    start () {
        redCenter.getInstance().init(true,720,1280,"https://h5game.99aly.com/5agamewx/alywx/gameConfig/group3/data/qq/2048test.json");
        let money = redCenter.getInstance().getcurrentMoney();
        console.log("moneystr====================="+money);
        this.redpack.node.on("click",this.openRedpackFirst,this);
        this.withdraw.node.on("click",this.openRedpackFirst2,this);
        this.turnBtn.node.on("click",this.openAwardtip,this);
         this.mainprofit.node.on("click",this.openWithdrawSuccess,this);

        //显示每日分红按钮
        redCenter.getInstance().showEveryRedBtn({
            parentNode:cc.director.getScene(),   //父节点
            x:9.524,   //x坐标
            y:1181,    //y坐标
            callBack:{          //需要的回调
                onOpened:function(){    //显示按钮的回调
                    console.log("showEveryRedBtn======onOpened====");
                },
                onClosed:function(){   //删除按钮
                    console.log("showEveryRedBtn=======onClosed===");
                },
                nextOpened:function(){  //打开分红界面
                    console.log("showEveryRedBtn=======nextOpened===");
                },
                nextClose:function(){   //关闭分红界面
                    console.log("showEveryRedBtn=======nextClose===");
                },
            },
            propTitle:"alySDK/alyUI/5-wenzi03",
            propIcon:"alySDK/alyUI/6-xing"
        });

        //添加抽分红星按钮
        redCenter.getInstance().showRedStarBtn({
            parentNode:cc.director.getScene(),
            x:29.193,
            y:1017.264,
            callBack:{
                onOpened:function(){
                    console.log("showRedStarBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showRedStarBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showRedStarBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showRedStarBtn=======nextClose===");
                },
            },
            propTitle:"alySDK/alyUI/5-wenzi03",
            propIcon:"alySDK/alyUI/6-xing"
        });
        //添加提现按钮
        redCenter.getInstance().showwithdrawBtn({
            parentNode:cc.director.getScene(),
            x:450.903,
            y:600,
            callBack:{
                onOpened:function(){
                    console.log("showwithdrawBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showwithdrawBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showwithdrawBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showwithdrawBtn=======nextClose===");
                },
            }
        });
        //添加每日任务按钮
        redCenter.getInstance().showEveryWithdrawBtn({
            parentNode:cc.director.getScene(),
            x:104,
            y:807,
            callBack:{
                onOpened:function(){
                    console.log("showEveryWithdrawBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showEveryWithdrawBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showEveryWithdrawBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showEveryWithdrawBtn=======nextClose===");
                },
            }
        });
         //添加视频提现按钮
        redCenter.getInstance().showvideoWithdrawBtn({
            parentNode:cc.director.getScene(),
            x:389,
            y:387,
            callBack:{
                onOpened:function(){
                    console.log("showvideoWithdrawBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showvideoWithdrawBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showvideoWithdrawBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showvideoWithdrawBtn=======nextClose===");
                },
            }
        });

        redCenter.getInstance().showRedRainBtn({   //红包雨
            parentNode:cc.director.getScene(),
            x:100,
            y:508,
            callBack:{
                onOpened:function(){
                    console.log("showRedRainBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showRedRainBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showRedRainBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showRedRainBtn=======nextClose===");
                },
                showBoxFun:function(){   //红包雨到达一定时间后显示盒子广告（显示就加不显示就不用加）
                    console.log("showBoxFun==============");
                }
            }
        });

        ////是否弹每日签到页面(签到的另一个入口)
        redCenter.getInstance().checkOpenLoginSignWin({
            callBack:{
                nextOpened:function(){
                    console.log("showLoginSignBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showLoginSignBtn=======nextClose===");
                },
            }
        })

        //添加q签到按钮
        redCenter.getInstance().showLoginSignBtn({
            parentNode:cc.director.getScene(),
            x:171.307,
            y:337.672,
            callBack:{
                onOpened:function(){
                    console.log("showLoginSignBtn======onOpened====");
                },
                onClosed:function(){
                    console.log("showLoginSignBtn=======onClosed===");
                },
                nextOpened:function(){
                    console.log("showLoginSignBtn=======nextOpened===");
                },
                nextClose:function(){
                    console.log("showLoginSignBtn=======nextClose===");
                },
            }
        });

        //直接弹红包接口
        redCenter.getInstance().openRedpackFirst({
            callBack:{
                onOpened:function(){
                    console.log("openFirstRd==========");
                },
                onClosed:function(){
                    console.log("closefirst==========");
                }
            },
            ishaveVideo:false,
            redpackType:"1",
            activeName:"新手红包",
            isOpenSecondPage:false

        });
    }

    openWithdrawSuccess(){
        RedUtil.openWithdrawSuccess(0.2);
    }
    

    openRedpackFirst():void{
        //console.log("openreddddddddddddddddddddd");
        redCenter.getInstance().openRedpackFirst({
            callBack:{
                onOpened:function(){
                    console.log("openFirstRd==========");
                },
                onClosed:function(){
                    console.log("closefirst==========");
                },
                redpackVideoClose:function(){
                    console.log("redpackVideoClose=====1=========");
                },
                redPackGetSuccess:function(){
                    console.log("closefirst=====redPackGetSuccess=====");
                    // RedUtil.changeEveryTaskMessage(7,1);
                    // RedUtil.changeEveryTaskMessage(8,1);
                    // RedUtil.changeEveryTaskMessage(9,1);
                    // RedUtil.changeEveryTaskMessage(6,1);
                }
            },
            ishaveVideo:true,
            redpackType:"3",
            activeName:"ijnijiguiug",
            isOpenSecondPage:false,
            openEventPotnum:4,
            passNum:1


        });
    }

    openRedpackFirst2():void{
        //console.log("openreddddddddddddddddddddd");
        redCenter.getInstance().openRedpackFirst({
            callBack:{
                onOpened:function(){
                    console.log("openFirstRd=====2=====");
                },
                onClosed:function(){
                    console.log("closefirst===2=======");
                },
                redPackGetSuccess:function(){
                    console.log("openFirstRd==2===redPackGetSuccess=====");
                    // RedUtil.changeEveryTaskMessage(2,1);
                    // RedUtil.changeEveryTaskMessage(3,1);
                    // RedUtil.changeEveryTaskMessage(4,1);
                    // RedUtil.changeEveryTaskMessage(5,1);
                }
            },
            ishaveVideo:true,
            redpackType:"4",
            activeName:"ijnijiguiug",
            isOpenSecondPage:true,
            openEventPotnum:0

        });
    }
    openwithdraw():void{
        console.log("openreddddddddddddddddddddd");
        redCenter.getInstance().openwithdrawPage(cc.director.getScene(),{
            callBack:{
                onOpened:function(){
                    console.log("openwithdraw==========");
                },
                onClosed:function(){
                    console.log("openwithdraw====close======");
                }
            }
        });
    }

    openTurnPage():void{
        redCenter.getInstance().openturnPage(cc.director.getScene(),{
            callBack:{
                onOpened:function(){
                    console.log("openTurnPage==========");
                },
                onClosed:function(){
                    console.log("openTurnPage====close======");
                }
            }
        });
    }

    openmainProfit():void{
        redCenter.getInstance().openmainProfit(cc.director.getScene(),{
            callBack:{
                onOpened:function(){
                    console.log("openTurnPage==========");
                },
                onClosed:function(){
                    console.log("openTurnPage====close======");
                }
            }
        });
    }
    openAwardtip():void{
        redCenter.getInstance().openAwardTip({
            Icon:"alySDK/alyUI/fenhong",
            Text:"获得金币X3"
        })
    }

    // update (dt) {}
}
