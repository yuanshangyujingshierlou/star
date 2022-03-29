// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {RedUtil} from "../RedUtil";

@ccclass
export default class videoRedPack extends cc.Component {

    @property
    _callBack:any = null;

    @property(cc.Button)
    clieckBtn: cc.Button = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property(cc.Node)
    redBg: cc.Node = null;

    @property(cc.Label)
    videoNum:cc.Label = null;

    @property(cc.ProgressBar)
    videoProgro:cc.ProgressBar = null;

    @property
    videoAd:any = null;

    @property
    _isVideoFinshState:number = 0;

    @property
    _currentlength:number = 0;

    @property
    _alllength:number = 10;

    @property 
    _messageCode:any = null;

    @property
    _goCom:number = 0;

    @property
    _canget:number = 1;

    @property
    _isfinsh:number = 2;

    @property
    _isSend:boolean = false;

    @property
    _coolTime:number = 0;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.redBg = this.node.getChildByName("redBg");
        this.clieckBtn = this.redBg.getChildByName("clieckBtn").getComponent(cc.Button);
        this.closeBtn = this.redBg.getChildByName("closeBtn").getComponent(cc.Button);
        this.videoNum = this.redBg.getChildByName("videoNum").getComponent(cc.Label);
        this.videoProgro = this.redBg.getChildByName("videoProgro").getComponent(cc.ProgressBar);
    }

    start () {
        RedUtil.setScale(this.node);
        this.redBg.setPosition(0,0);
        RedUtil.setAction(this.redBg,true,null);

        this.closeBtn.node.on("click",this.clickClose,this);
        
        this.clieckBtn.node.on("click",this.clickBtnClick,this);


        this.videoProgro.progress = 0;

        if(RedUtil._iseventDot){
            RedUtil.extportData(5005,555);
        }
    }

    clickClose(){
        let self = this;
        RedUtil.setAction(this.redBg,false,function() {
            self.setCall();
        });

    }

    setCall(){
        if(this._callBack && this._callBack.nextClose){
             this._callBack.nextClose();
         }
         RedUtil._videoRedPack = null;
         this.node.destroy();
    }

    init(){
        if(this._messageCode){
            if(this._messageCode.Count>0){
                this.videoProgro.progress = this._messageCode.Count/this._alllength;
                this._isVideoFinshState = this._messageCode.State;

                this._currentlength = this._messageCode.Count;
                //console.log("this._currentlength========="+this._currentlength);
                this.videoNum.string = "再观看" + (this._alllength -this._messageCode.Count)+"次广告即可提现";
            }
        }
    }

    clickBtnClick(){
        //console.log("clickBtnClick===="+this._isVideoFinshState);
        if(this._isVideoFinshState == this._isfinsh){
            RedUtil.opeTips("每日只能提现一次！");
        }else if(this._isVideoFinshState == this._canget){
            if(this._coolTime>0){
                RedUtil.opeTips("操作太频繁了");
                return;

            }
            this._coolTime = 2;
            this.requestWithdraw();
        }
        else{
            this.openVidio();
        }
    }

    requestWithdraw(){
        RedUtil.requestVideoRedWithdraw();
        //this._isSend = true;
        this.clieckBtn.node.angle = 0;
        cc.tween (this.clieckBtn.node)
        .to(0.6,{angle:-360})
        .call(()=>{
            console.log("rotatioon");
            if(RedUtil._videoWithdrawMoney>-1){
                RedUtil.openWithdrawSuccess(RedUtil._videoWithdrawMoney/100);
                RedUtil._videoWithdrawMoney = -1;
                this._isSend = false;
                if(RedUtil._iseventDot){
                    RedUtil.extportData(5006,555);
                }
            }else{
                //RedUtil.opeTips("网络延迟，请稍等");
                this._isSend = true;
            }
            
        })
        .start();
    }

    setChange(){
        if(RedUtil._videoWithdrawMoney>-1){
            RedUtil.openWithdrawSuccess(RedUtil._videoWithdrawMoney/100);
            RedUtil._videoWithdrawMoney = -1;
            this._isSend = false;
            if(RedUtil._iseventDot){
                RedUtil.extportData(5006,555);
            }
        }
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
            console.log("emerrrrrrr==提现红包==="+JSON.stringify(errm));
            RedUtil.opeTips("广告没有准备好，请稍候再试");
        });
        this.videoAd.onLoad(function(res:any){
            console.log("onload===红包=="+res);
        })
        this.videoAd.show().catch(err => {
            this.videoAd.load().then(()=> {
                console.log("提现红包广告加载成功");      
                this.videoAd.show().then(()=>{
                    console.log("提现红包广告显示成功");
                }).catch(err=>{
                    console.log("提现红包广告显示失败");
                })
            }).catch(err=>{
                console.log("提现红包广告加载失败");
            })
        })
        

        this.videoAd.onClose((statue:any)=>{
            if(statue && statue.isEnded || statue === undefined){
                self.videoAd.offClose();                
                console.log("提现红包广告关闭成功==============");
                RedUtil.changeEveryTaskMessage(10000,1);
                if(self._currentlength<self._alllength){
                    self._currentlength += 1;
                    self.videoProgro.progress = self._currentlength/self._alllength;
                    self.videoNum.string = "再观看" + (self._alllength - self._currentlength)+"次广告即可提现";
                    if(self._currentlength>= self._alllength){
                        self._isVideoFinshState = self._canget;
                    }
                }
                
            }else{
                self.videoAd.offClose();
            }
        });
     }

     withdrawFinsh(){
         this._isVideoFinshState = this._isfinsh;
     }

     getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.nextOpened){
                    RedUtil.callBackRun(this.node,this._callBack.nextOpened);
                }
            }
            if(parmp.messageCode){
                this._messageCode = parmp.messageCode;
            }

            setTimeout(() => {
                this.init();
            }, 300);
            
        }
     }

     update (dt) {
         if(this._isSend){
             this.setChange();
         }
         if(this._coolTime>0){
            this._coolTime -= dt;
         }
     }
}
