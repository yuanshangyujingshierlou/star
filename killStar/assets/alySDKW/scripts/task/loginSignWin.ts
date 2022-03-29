// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import litterRedPack from "./litterRedPack";
import tips from "../redPack/tipsShow";
import { RedUtil } from "../RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class loginSignWin extends cc.Component {

    @property(cc.Node)
    backbg: cc.Node = null;

    @property(cc.Node)
    redBg:cc.Node = null;

    @property(cc.ScrollView)
    topScroll:cc.ScrollView = null;

    @property(cc.Button)
    closeBtn:cc.Button = null;

    @property
    litterRedPacks:Array<cc.Node> =[];

    @property
    text: string = 'hello';

    @property
    _callBack:any = null;

    @property
    daycount:number = 0;

    @property
    redCount:number = 0;

    @property(cc.Label)
    _currTimeLabel:cc.Label = null;

    @property
    _canGetRed:boolean = false;

    @property
    _moneyStrs:Array<number> = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.backbg = this.node.getChildByName("backbg");
        this.redBg = this.node.getChildByName("redBg");
        this.topScroll = this.redBg.getChildByName("topScroll").getComponent(cc.ScrollView);
        this.closeBtn = this.redBg.getChildByName("closeBtn").getComponent(cc.Button);
        for (let index = 0; index < 3; index++) {
                let litterPack = this.redBg.getChildByName("litterPak"+index)
                if(litterPack){
                    this.litterRedPacks.push(litterPack);
                }
            
        }

    }
    start () {
        RedUtil.setScale(this.node);
        this.closeBtn.node.on("click",this.destroySelf,this);
        this._canGetRed = false;
        RedUtil._setTimeLogin = 5;

        RedUtil.setAction(this.redBg,true,null);

        if(RedUtil._iseventDot){
            RedUtil.extportData(4003,555);
        }
        // this.showtoplist();
        // this.showRedState();
    }

    showtoplist(){
        console.log("this.daycount========"+this.daycount);
        let chickBtn = this.topScroll.content.getChildByName("clickBtn0");
        chickBtn.on("click",function(){
            this.dayClick(0);
        },this);
        if(chickBtn){
            for (let index = 1; index < 14; index++) {
                 //205
                 let newNode = cc.instantiate(chickBtn);
                 newNode.name = "clickBtn"+index;
                 newNode.setPosition(205*index,-23);
                 this.topScroll.content.addChild(newNode);
                 let daystr = newNode.getChildByName("daystr").getComponent(cc.Label);
                 daystr.string = "第"+(index+1)+"天";

                 if(this.daycount != index){
                     RedUtil.LoadSpritRes("alySDK/alyUI/noCheck",function(err,spriteframe){
                         newNode.getComponent(cc.Sprite).spriteFrame = spriteframe;
                         newNode.y = -6.5;
                         daystr.node.y = -44;
                     })
                 }

                 newNode.on("click",function(){
                    this.dayClick(index);
                },this);
                
            }
        }
        if(this.daycount != 0){
            RedUtil.LoadSpritRes("alySDK/alyUI/noCheck",function(err,spriteframe){
                chickBtn.getComponent(cc.Sprite).spriteFrame = spriteframe;
                chickBtn.y = -6.5;
                let daystr = chickBtn.getChildByName("daystr");
                daystr.y = -44;
            })
        }

        this.topScroll.content.width = 13*205+176;

        if(this.daycount>2){
            this.topScroll.content.x = -295 - this.daycount*205;
        }

    }

    dayClick(index:number){
       if(index < this.daycount){
           RedUtil.opeTips("已超过领取范围");
       }else if(index>this.daycount){
           RedUtil.opeTips("第"+(index+1)+"解锁");
       }
    }

    showRedState(){
        console.log("this.redCount============"+this.redCount);
        for (let index = 0; index < 4; index++) {
            let redPac = this.redBg.getChildByName("litterPak"+index);
            redPac.on("click",function(){
                   this.redPackClick(index);
            },this);
            if(index == this.redCount){
                let bottomText = redPac.getChildByName("bottomText").getComponent(cc.Label);
                bottomText.string = "可打开";
                bottomText.node.color = new cc.Color(156,199,130); 
                this._currTimeLabel = bottomText;
            }else if(index < this.redCount){
                let bottomText = redPac.getChildByName("bottomText").getComponent(cc.Label);
                bottomText.string = "已领取";
                bottomText.node.color = new cc.Color(134,116,90);
                let moneystr = redPac.getChildByName("moneystr").getComponent(cc.Label);
                if(this._moneyStrs[index]){
                    moneystr.string = this._moneyStrs[index]/100+"元";
                }

            }
            
        }
    }

    redPackClick(index:number){
        //console.log("index=========="+index);
        if(index == this.redCount){
            if(RedUtil._signRedColdTime<=0){
             this.openSignRed();
            }
            else{
               RedUtil.opeTips("倒计时结束再来领取！");
            }
         }
    }

    openSignRed(){
        let parentNode = cc.director.getScene();
        RedUtil.LoadResource("alySDK/alyprofabs/signRedWin",function(err,prefab){
            let newNode = cc.instantiate(prefab);
            if(newNode){                
                parentNode.addChild(newNode);
            }  
        });
    }

    withdrawSucc(){
        let self = this;
        RedUtil.requestLoginSignCount({
            SuccessFuc:(mess)=>{
                self.RefreshRed(mess);
            }
            
        });
    }
    init(message){
        this.redCount = message.TodayNum;
        this.daycount = message.SignNum;
        RedUtil._loginCurrNum = this.redCount;
        let data = message.data;
        this._moneyStrs = [];
        if(data.FirstNum){
            this._moneyStrs.push(data.FirstNum);
        }

        if(data.SecondNum){
            this._moneyStrs.push(data.SecondNum);
        }

        if(data.ThirdNum){
            this._moneyStrs.push(data.ThirdNum);
        }

        if(data.FourthNum){
            this._moneyStrs.push(data.FourthNum);
        }
        this.showtoplist();
        this.showRedState();
    }
    //提现成功刷新
    RefreshRed(message){
        console.log("RefreshRed==============");
        let expId = 4000+(this.daycount+1)*10+this.redCount;
        if(RedUtil._iseventDot){
            RedUtil.extportData(expId,555);
        }

        this.redCount = message.TodayNum;
        this.daycount = message.SignNum;
        RedUtil._loginCurrNum = this.redCount;
        let data = message.data;  //SignNum
        this._moneyStrs = [];
        if(data.FirstNum){
            this._moneyStrs.push(data.FirstNum);
        }

        if(data.SecondNum){
            this._moneyStrs.push(data.SecondNum);
        }

        if(data.ThirdNum){
            this._moneyStrs.push(data.ThirdNum);
        }

        if(data.FourthNum){
            this._moneyStrs.push(data.FourthNum);
        }
      
        this.showRedState();
    }

    destroySelf(){
        let self = this;
        RedUtil.setAction(this.redBg,false,function(){
            self.setCall();
        });
        
    }

    setCall(){
        RedUtil._LoginSignWin = null;
        if(this._callBack && this._callBack.nextClose){
            if(RedUtil.getIsInitOpen()){
                this._callBack.nextClose();
            }           
        }
        
        this.node.destroy();
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.nextOpened){
                    RedUtil.callBackRun(this.node,this._callBack.nextOpened);
                }
            }
            if(parmp.activeName){
                RedUtil._activeName = parmp.activeName;
            }
            if(parmp.MessageCode){
                setTimeout(() => {
                    this.init(parmp.MessageCode);
                }, 200);
            }
            
        }
     }

     update (dt) {
         if(RedUtil._signRedColdTime>0){
            if(this._currTimeLabel){
                this._currTimeLabel.string = RedUtil.getSecondString(RedUtil._signRedColdTime*1000);
            }           
         }else{            
            if(this._currTimeLabel && this.redCount<4){
                if(this._currTimeLabel.string != "可打开"){
                    this._currTimeLabel.string = "可打开";
                    
                }                
            }
         }
     }
}
