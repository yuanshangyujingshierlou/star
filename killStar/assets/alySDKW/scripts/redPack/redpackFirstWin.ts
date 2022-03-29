// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";
import redpackSecondWin from "./redpackSecondWin";

const {ccclass, property} = cc._decorator;

@ccclass
export default class redpackFirstWin extends cc.Component {

    @property
    redpackType: string = '';
    @property
    _ishaveVideo:boolean = false;
    @property
    videoAd:any = null;

    @property
    _callBack:any = null;

    @property(cc.Button)
    clieckBtn: cc.Button = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property(cc.Node)
    redBg: cc.Node = null;

    @property(cc.Label)
    tipStr: cc.Label = null;

    @property(cc.Label)
    yuanlaibig: cc.Label = null;

    @property(cc.Label)
    passStr: cc.Label = null;

    @property(cc.Label)
    passStr2: cc.Label = null;

    @property(cc.Node)
    video_tipStr:cc.Node = null;

    @property
    _isSend = false;

    @property
    _eventDotnum = 0;

    @property
    _passNum = 0;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {       
        this.redBg = this.node.getChildByName("redBg");
        this.tipStr = this.redBg.getChildByName("tipStr").getComponent(cc.Label);
        this.yuanlaibig = this.redBg.getChildByName("yuanlaibig").getComponent(cc.Label);
        this.passStr = this.redBg.getChildByName("passStr").getComponent(cc.Label);
        this.passStr2 = this.redBg.getChildByName("passStr2").getComponent(cc.Label);
        this.clieckBtn = this.redBg.getChildByName("clieckBtn").getComponent(cc.Button);
        this.closeBtn = this.redBg.getChildByName("closeBtn").getComponent(cc.Button);
        this.video_tipStr = this.redBg.getChildByName("video_tipStr");
    }

    onEnable(){
        //this.clieckBtn.node.on("click",this.openRedpackClieck,this);
        RedUtil.setScale(this.node);
        this.redBg.setPosition(0,0);
        RedUtil.setAction(this.redBg,true,null);
        this.closeBtn.node.on("click",this.clickClose,this);
        let clickHandler = new cc.Component.EventHandler();
        clickHandler.target = this.node;
        clickHandler.component = "redpackFirstWin";
        clickHandler.handler = "openRedpackClieck";
        clickHandler.customEventData = "clieck";
        this.clieckBtn.clickEvents.push(clickHandler);
    }
    update(dt){
      if(this._isSend){
          this.setChange();
      }
    }
    onDisable(){
        console.log("disable============");
        RedUtil.firstRedPage = null; 
    }
    clickClose(){
        let self = this;
        RedUtil.setAction(this.redBg,false,function() {
            self.setCall();
        });

    }
    setCall(){
        if(this._callBack && this._callBack.onClosed){
            // RedUtil.callBackRun(this.node,this._callBack.onClosed);
             this._callBack.onClosed();
         }
 
         this.node.destroy();
    }

    destroySelf():void{
        this.node.destroy();
    }

    openRedpackClieck(event:Event,customEventData:string):void{
        console.log("openRedpackClieck============="+customEventData);
        if(this._ishaveVideo){
            this.openVidio();
        }else{
            this.opensecond();
        }
    }
    
    opensecond():void{
        if(this._callBack && this._callBack.redpackVideoClose){
            RedUtil.callBackRun(this.node,this._callBack.redpackVideoClose);
        }
        RedUtil.openQuestRedPack(RedUtil._activeName,this.redpackType,false,null,this._eventDotnum);
        this.clieckBtn.node.angle = 0;
        cc.tween (this.clieckBtn.node)
        .to(0.6,{angle:-360})
        .call(()=>{
            console.log("rotatioon");
            if(RedUtil.redNect){
                this.destroySelf();
                this.openSecondredPage(cc.director.getScene(),{
                    callBack:this._callBack,
                    openEventPotnum:this._eventDotnum,
                    isOpenWithdraw:(this.redpackType == RedUtil.redPackType.newPlayer)
                });
            }else{
                RedUtil.opeTips("网络延迟，请稍等");
                this._isSend = true;
                // this.timer.clear(this,this.setChange);
                // this.timer.loop(500, this, this.setChange);
            }
            
        })
        .start();
        // let callback = cc.callFunc(function(){
        //     console.log("rotatioon");
        // },this,this);
        // let action = cc.rotateTo(1,360);
        // let sequence = cc.sequence([action,callback]);
        // this.node.runAction(sequence);  672  224

    }

    setChange():void{
        if(RedUtil.redNect){
            RedUtil.redNect = false;
            this._isSend = false;
            this.destroySelf();
            this.openSecondredPage(cc.director.getScene(),{
                callBack:this._callBack,
                openEventPotnum:this._eventDotnum,
                isOpenWithdraw:(this.redpackType == RedUtil.redPackType.newPlayer)
            });
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
                if(this._eventDotnum>0){
                    RedUtil.extportData(this._eventDotnum*1000+2,0); //过关红包领取失败
                }
            }
        });
     }

     getParams(parmp:any):void{
        if(parmp){
            this._ishaveVideo = parmp.ishaveVideo;
            if(!this._ishaveVideo){
                this.video_tipStr.active = false;
            }
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.onOpened){
                    RedUtil.callBackRun(this.node,this._callBack.onOpened);
                }
            }
            if(parmp.activeName){
                RedUtil._activeName = parmp.activeName;
            }
            if(parmp.redpackType){
                this.redpackType = parmp.redpackType;
                if(parmp.redpackType == RedUtil.redPackType.passOver){
                    this.passStr.node.active = true;
                    this.passStr2.node.active = true;
                    this.tipStr.node.active = false;
                    this.yuanlaibig.node.active = false;
                   
                }else if(parmp.redpackType == RedUtil.redPackType.newPlayer){
                    this.closeBtn.node.active = false;
                }
            }
            if(parmp.passNum){
                this._passNum = parmp.passNum;
            }

            if(this.redpackType == RedUtil.redPackType.passOver && parmp.passNum<4){
                RedUtil.extportData(4090,2);
            }else{
                if(parmp.openEventPotnum>0){
                    this._eventDotnum = parmp.openEventPotnum;
                    RedUtil.extportData(parmp.openEventPotnum*1000,2);
                }
            }
            
            
            
        }
     }

     openSecondredPage(parentNode:cc.Node,parmp:any):void{
        let scccSrc = "redpackSecondWin";
        if(this.redpackType == RedUtil.redPackType.passOver && this._passNum<4){
            scccSrc = "redpackSecondCheckWin";
        }
        cc.loader.loadRes("alySDK/alyprofabs/"+scccSrc,function(err,prefab){
           let newNode = cc.instantiate(prefab);
            if(newNode){
                parentNode.addChild(newNode);
                newNode.setPosition(parentNode.width/2,parentNode.height/2);
                if(parmp){
                    let cla = newNode.getComponent(scccSrc);
                    cla.getParams(parmp);
                }
           }       
    
        })
       }

}


