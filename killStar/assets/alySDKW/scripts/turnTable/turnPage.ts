// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RedUtil } from "../RedUtil";
import awardtip from "./awardtip";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    v_shengyu: cc.Label = null;

    @property(cc.Node)
    v_running:cc.Node = null;

    @property(cc.Node)
    v_start:cc.Node = null;

    @property(cc.Node)
    v_closeBtn:cc.Node = null;

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.Sprite)
    v_propTitle:cc.Sprite = null;

    @property(cc.Sprite)
    v_propIcon:cc.Sprite = null;

    @property
    _callBack:any = null;

    @property
    freeNum:number = 1;

    @property
    stateIndex:number = 1;

    @property
    videoAd:any = null;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         console.log("onLoad===============");
         this.content = this.node.getChildByName("content");
         if(!this.v_shengyu){
             let topborder = this.content.getChildByName("topborder");
             this.v_shengyu = topborder.getChildByName("v_shengyu").getComponent(cc.Label);
         }
         if(!this.v_running){
             this.v_running = this.content.getChildByName("v_running");             
         }
         if(!this.v_propIcon){
            this.v_propIcon = this.v_running.getChildByName("v_propIcon").getComponent(cc.Sprite);
         }
         if(!this.v_propTitle){
            this.v_propTitle = this.v_running.getChildByName("v_propTitle").getComponent(cc.Sprite);
         }
         if(!this.v_start){
             this.v_start = this.content.getChildByName("v_start");
         }
         if(!this.v_closeBtn){
             this.v_closeBtn = this.content.getChildByName("v_closeBtn");
         }
         
     }

    start () {
        console.log("start===============");
        RedUtil.setScale(this.node);
        this.content.setPosition(0,0);
        
        this.v_closeBtn.on("click",this.destroySelf,this);
        this.v_start.on("click",this.luckBtnClieck,this);

        let freenum = cc.sys.localStorage.getItem('todayFreeNum');
        let date = new Date();  //'2020/6/30'
        let dateStr = date.getFullYear() + "-" +date.getMonth() + "-" +date.getDate();
        if(freenum){
            let yesArr = freenum.split(";");
            if(yesArr instanceof Array && yesArr.length>1){
               if(yesArr[0] == dateStr){
                this.freeNum = Number(yesArr[1]);
               }else{
                   cc.sys.localStorage.setItem('todayFreeNum',dateStr + ";" + this.freeNum);
               }
            }else{
                console.log("freenum--error");
            }
        }else{
            cc.sys.localStorage.setItem('todayFreeNum',dateStr + ";" + this.freeNum);
        }

        this.changeBtn(this.freeNum>0?1:2);
        RedUtil.eventDispatcher.on("videoClieck",this.getLuckyClick,this);
        if(this._callBack&&this._callBack.luckyComplete){
            RedUtil.eventDispatcher.on(RedUtil.callBackName.luckyComplete,this._callBack.luckyComplete,this);
        }
        if(RedUtil._iseventDot){
            RedUtil.extportData(3000,0); //进入转盘界面打点
        }

    }

    onDisable(){
        RedUtil.eventDispatcher.off("videoClieck");
        RedUtil.eventDispatcher.off(RedUtil.callBackName.luckyComplete);  
        RedUtil._turnPage = null;
        
    }
    destroySelf():void{
        if(!RedUtil._mainprofit){
            if(this._callBack&& this._callBack.nextClose){
                //RedUtil.callBackRun(this.node,this._callBack.nextClose);
                this._callBack.nextClose();
            }
        }
        this.node.destroy();
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(!RedUtil._mainprofit){
                    if(this._callBack && this._callBack.nextOpened){
                        RedUtil.callBackRun(this.node,this._callBack.nextOpened);
                    }
                }               
            }
            if(parmp.starNum){
                this.v_shengyu.string = "今日剩余分红星"+ parmp.starNum +"颗";
            }
            if(parmp.propTitle&&parmp.propTitle!=""){
                let v_propTitle = this.v_propTitle;
                cc.loader.loadRes(parmp.propTitle,cc.SpriteFrame,function(err,spriteframe){
                    v_propTitle.spriteFrame = spriteframe;
               })
            }
            if(parmp.propIcon&&parmp.propIcon!=""){
                let v_propIcon = this.v_propIcon;
                cc.loader.loadRes(parmp.propIcon,cc.SpriteFrame,function(err,spriteframe){
                    v_propIcon.spriteFrame = spriteframe;
               })
            }
            
        }
     }

     luckBtnClieck():void{
        if(this.stateIndex==1){
            this.getLuckyClick();
        }else{
            if(RedUtil._iseventDot){
                RedUtil.extportData(3001,0); //点击视频抽奖按钮打点
            }
            this.openVideo();
        }
    }
    getLuckyClick():void{
        console.log("getLuckyClick===========");
        RedUtil._RedquestState = 2;
        RedUtil.openQuestRedPack("","2",false,null,0);
    }

     changeBtn(index:number):void{
       let skinsrc = "alySDK/alyUI/xin-2";
       if(index == 2){
         skinsrc = "alySDK/alyUI/xin-1";
       }
       this.stateIndex = index;
       let v_start = this.v_start;
       cc.loader.loadRes(skinsrc,cc.SpriteFrame,function(err,spriteframe){
         v_start.getComponent(cc.Sprite).spriteFrame = spriteframe;
       })
     }

     startRun(index:number):void{
        console.log("start--------");
        if(this.freeNum>0){
             this.freeNum -=1;
             let date = new Date();  //'2020/6/30'
             let dateStr = date.getFullYear() + "-" +date.getMonth() + "-" +date.getDate();
             cc.sys.localStorage.setItem('todayFreeNum',dateStr + ";" + this.freeNum);
             this.changeBtn(2);
        }
        let angel = 120;  //0 分红星5分钟，1提示道具
        if(index == 1){
            angel = 60;
        }else if(index == 0){
           let date = new Date();
           let dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
           let todayStar = cc.sys.localStorage.getItem('todayRedNum');
           let xianshinum = 0;
           if(todayStar){
             let todayArr = todayStar.split(";");
             if(todayArr instanceof Array && todayArr.length>1){
                if(todayArr[0] == dateStr){
                   xianshinum = Number(todayArr[1]);
                }
             }
           }
          // console.log("xianshinum==0========"+xianshinum);
           xianshinum += 1;
           cc.sys.localStorage.setItem('todayRedNum',dateStr+";"+xianshinum.toString());
           //console.log("xianshinum=========="+xianshinum);
        }
        this.v_running.rotation = 0;

        cc.tween(this.v_running)
        .to(3.2,{angle:-(360*4+angel)})
        .call(()=>{
            console.log("rotatioon");
            if(index == 0){
                this.openAwardTip();
              }
              RedUtil.eventgetAward(index);
        })
        .start();
        
     }

     private openVideo():void{
         console.log("openVideo============");
        let aunId = "";
        //let qq = window.qq;
        let qq = window["qq"];
        if(!qq){
            return;
        }
        if(qq.aly.aUnID){
            aunId =  qq.aly.aUnID;
            console.log("qq.aly.aUnID--------"+qq.aly.aUnID);
        }
        this.videoAd = qq.createRewardedVideoAd({
            adUnitId:aunId
        });
        this.videoAd.onError((errm)=>{
            console.log("emerrrrrrr==转盘==="+JSON.stringify(errm));
            //RedUtil.opeTips(errm.toString());
        });
        this.videoAd.onLoad(function(res:any){
            console.log("onload====="+res);
        })

        // this.videoAd.show().catch(err => {
        //     this.videoAd.load().then(() => this.videoAd.show())
        // })

        this.videoAd.show().catch(err => {
            this.videoAd.load().then(()=> {
                console.log("转盘广告加载成功");       
                this.videoAd.show().then(()=>{
                    console.log("转盘广告显示成功");
                }).catch(err=>{
                    console.log("转盘广告显示失败");
                })
            }).catch(err=>{
                console.log("转盘广告加载失败");
            })
        })

        this.videoAd.onClose((statue:any)=>{
            if(statue && statue.isEnded || statue === undefined){
                this.videoAd.offClose();
                console.log("转盘广告关闭成功");    
                RedUtil.eventDispatcher.emit("videoClieck");   
                if(RedUtil._iseventDot){
                    RedUtil.extportData(3002,0);//视频抽奖成功打点 
                }    
                        
            }else{
                console.log("elseoffffffcelseccc22222ccc");
                if(RedUtil._iseventDot){
                    RedUtil.extportData(3003,0);//视频抽奖失败打点 
                } 
                this.videoAd.offClose();
            }
        });
        
    }


    openAwardTip():void{
        let parentNode = cc.director.getScene();
        let parmp = {
          Icon:"",
          Text:""
        }
         cc.loader.loadRes("alySDK/alyprofabs/awardtip",function(err,prefab){
             let newNode = cc.instantiate(prefab);
             if(newNode){                
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 if(parmp){
                     let cla = newNode.getComponent(awardtip);
                     cla.getParams(parmp);
                 }
             }       
     
         })
    }


    // update (dt) {}
}
