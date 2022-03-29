// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { RedUtil } from "../RedUtil";
import redCenter from "../RedCenter";

@ccclass
export default class redpackSecondCheckWin extends cc.Component {

    @property(cc.Button)
    closeBtn:cc.Button=null;

    @property(cc.Label)
    v_money:cc.Label=null;

    @property(cc.Node)
    v_yuan:cc.Node=null;

    @property(cc.Node)
    redbg:cc.Node=null;

    @property(cc.Node)
    bgPar:cc.Node=null;

    @property(cc.Node)
    background:cc.Node = null;

    @property(cc.Label)
    allmoney:cc.Label = null;

    @property 
    money:number=0;

    @property
    _callBack:any = null;

    @property(cc.Node)
    seeBtn:cc.Node = null;

    @property
    videoAd:any = null;

    @property
    _seeVideo:boolean =false;

    @property
    _eventDotnum:number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.background = this.node.getChildByName("background");
        this.bgPar = this.node.getChildByName("bgPar");
        this.redbg = this.bgPar.getChildByName("redbg");
        this.closeBtn = this.redbg.getChildByName("closeBtn").getComponent(cc.Button);
        this.v_money = this.redbg.getChildByName("v_money").getComponent(cc.Label);
        this.v_yuan = this.redbg.getChildByName("v_yuan");
        this.allmoney = this.redbg.getChildByName("setPP").getChildByName("allmoney").getComponent(cc.Label);
        this.seeBtn = this.redbg.getChildByName("seeBtn");

        this.money = RedUtil._currentMoney;
        this.v_money.string = "￥"+(this.money/100).toString();
    }

    start () {
        RedUtil.setScale(this.node);
        this.background.width = this.node.width;
        
        let mwidth = this.v_money.node.width;
        let nwidth = this.v_yuan.width;
        let allw = mwidth+nwidth+8;
        let leftOff = (this.redbg.width - allw)/2;
        this.v_money.node.x = leftOff+mwidth/2;
        this.v_yuan.x = leftOff+mwidth+nwidth/2+8;

        let monstr = cc.sys.localStorage.getItem('MoneyNum');
        if(monstr){
            let currmoney = (Number(monstr)-this.money)/100;
            redCenter.getInstance().changeWithdrawBtnMoney(currmoney);

            this.allmoney.string = "余额："+ currmoney;
        }

        this.closeBtn.node.on("click",this.closeSelf,this);
        this.seeBtn.on("click",this.openVidio,this);


    }

    closeSelf(){
        console.log("closeSelf===========");
        if(!this._seeVideo){
            RedUtil.requestReduceRedPack(RedUtil._currentMoney);
         }
        RedUtil.extportData(4092,0); //关闭过关红包
        RedUtil._currentMoney = 0;
        RedUtil._currRedPackNum = 0;
        let self  = this;
        RedUtil.setAction(this.bgPar,false,function() {
            self.setCall();
        })
    }

    destroySelf():void{
        // if(!this._seeVideo){
        //    RedUtil.requestReduceRedPack(RedUtil._currentMoney);
        // }
        RedUtil._currentMoney = 0;
        RedUtil._currRedPackNum = 0;
        let self  = this;
        RedUtil.setAction(this.bgPar,false,function() {
            self.setCall();
        })

    }

    setCall(){
        if(this._callBack && this._callBack.onClosed){
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    openVidio():void{
        console.log("openVideo=============");
        let self = this;
        let aunId = "";
        let qq = window["qq"];
        if(!qq){
           console.log("openVideo====qq======null===");
           return;
        }
        if(qq.aly.aUnID){
            aunId =  qq.aly.aUnID;
            console.log("qq.aly.aUnID--红包------"+qq.aly.aUnID);
        }
        this.videoAd = qq.createRewardedVideoAd({
            adUnitId:aunId
        });
        this.videoAd.onError((errm:any)=>{
            //console.log("emerrrrrrr====="+errm);
            console.log("emerrrrrrr==红包==="+JSON.stringify(errm));
            RedUtil.opeTips(errm);
        });
        this.videoAd.onLoad(function(res:any){
            console.log("onload===红包=="+res);
        })
        this.videoAd.show().catch(err => {
            this.videoAd.load().then(()=> {
                console.log("红包广告加载成功");      
                this.videoAd.show().then(()=>{
                    console.log("红包广告显示成功");
                }).catch(err=>{
                    console.log("红包广告显示失败");
                })
            }).catch(err=>{
                console.log("红包广告加载失败");
            })
        })
        

        this.videoAd.onClose((statue:any)=>{
            if(statue && statue.isEnded || statue === undefined){
                self.videoAd.offClose();
                self.opensecond();                   
                console.log("红包广告关闭成功==============");
            }else{
                self.videoAd.offClose();
                // if(this._eventDotnum>0){
                //     RedUtil.extportData(this._eventDotnum*1000+2,0); //过关红包领取失败
                // }
            }
        });
     }

     opensecond(){
        RedUtil.extportData(4091,0); //过关红包领取成功
        this._seeVideo = true;
        if(this._callBack && this._callBack.redpackVideoClose){
            RedUtil.callBackRun(this.node,this._callBack.redpackVideoClose);
        }
        if(this._callBack && this._callBack.redPackGetSuccess){
            RedUtil.callBackRun(this.node,this._callBack.redPackGetSuccess);
        } 
        let monstr = cc.sys.localStorage.getItem('MoneyNum');
        if(monstr){
            let currmoney = Number(monstr)/100;
            redCenter.getInstance().changeWithdrawBtnMoney(currmoney);
        }
        this.destroySelf();
        RedUtil.opeTips("已存入余额，请到余额查看");
     }


     getParams(parmp:any):void{
        console.log("pppppppppppppppppppp");
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;             
                  
            }
            if(parmp.openEventPotnum){
                this._eventDotnum = parmp.openEventPotnum;
            }
            
        }
     }
    // update (dt) {}
}
