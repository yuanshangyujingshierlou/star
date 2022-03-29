// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import redpackRain  from "./redpackRain";
import {RedUtil} from "../RedUtil";

@ccclass
export default class redRainBtn extends cc.Component {

    @property(cc.Label)
    freeNum: cc.Label = null;

    @property(cc.Label)
    timeCount: cc.Label = null;

    @property
    _callBack: any = null;

    @property
    _freecount:number = 3;

    @property
    videoAd:any = null;




    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.freeNum = this.node.getChildByName("freeNum").getComponent(cc.Label);
        this.timeCount = this.node.getChildByName("timeCount").getComponent(cc.Label);
    }

    start () {
       this.timeCount.node.active = false;
       this.node.on("click",this.selfClick,this);

       setTimeout(() => {
         RedUtil.requestRedRainCount();
       }, 500);
       
       
    }

    selfClick(){
       console.log("selfClick---------"+this._freecount);
       if(this._freecount>0){
           if(RedUtil._renPackRainTime<=0){
              this.openVidio();
              
           }
       }else{
           RedUtil.opeTips("今日次数已达上限，明天在来试试！")
           //this.setRedVideo();
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
            console.log("emerrrrrrr==红包雨==="+JSON.stringify(errm));
            RedUtil.opeTips("广告没有准备好，请稍候再试");
        });
        this.videoAd.onLoad(function(res:any){
            console.log("onload===红包雨=="+res);
        })
        this.videoAd.show().catch(err => {
            this.videoAd.load().then(()=> {
                console.log("红包雨广告加载成功");      
                this.videoAd.show().then(()=>{
                    console.log("红包雨广告显示成功");
                }).catch(err=>{
                    console.log("红包雨广告显示失败");
                })
            }).catch(err=>{
                console.log("红包雨广告加载失败");
            })
        })
        

        this.videoAd.onClose((statue:any)=>{
            if(statue && statue.isEnded || statue === undefined){
                self.videoAd.offClose();     
                self.setRedVideo();           
                console.log("红包雨广告关闭成功==============");
                
            }else{
                self.videoAd.offClose();
            }
        });
     }

    setRedVideo(){
        RedUtil._renPackRainTime  = 3*60;
        this.openRedRain();
        this.timeCount.node.active = true;
        RedUtil.changeEveryTaskMessage(10001,1);
        this._freecount -= 1;
        this.freeNum.string = "今日免费"+this._freecount + "次";
    }

    openRedRain(){
        this.addPoolitem();
        let parmp = {
            callBack:this._callBack,
        }
        let parentNode = cc.director.getScene();
        RedUtil.LoadResource("alySDK/alyprofabs/redpackRain",function(err,prefab){
        let newNode = cc.instantiate(prefab);
            if(newNode){                
                parentNode.addChild(newNode);
                //RedUtil._RedStarBtn = newNode;
                if(parmp){
                    let cla = newNode.getComponent(redpackRain);
                    cla.getParams(parmp);
                }
            }       
    
        })
    }

    destroySelf(){
        if(this._callBack && this._callBack.onClosed){
            this._callBack.onClosed();
        }
        this.node.destroy();
    }

    addPoolitem(){
        if(RedUtil._litterRedPool.length<=0){
            for (let index = 0; index < 15; index++) {
                if(!RedUtil._litterRedPro){
                    RedUtil.LoadResource("alySDK/alyprofabs/litterRedPack",function(err,prefab){
                        let newNode = cc.instantiate(prefab);
                        if(newNode){
                            newNode.active = false;
                            RedUtil._litterRedPool.push(newNode)
                        }       
                
                    });
                }else{
                    let newNode = cc.instantiate(RedUtil._litterRedPro);
                    if(newNode){
                        newNode.active = false;
                        RedUtil._litterRedPool.push(newNode)
                    }    
                }
                
            }
            
        }
    }


    setMessage(messCode){
        if(messCode){
            this._freecount = 3-messCode.Count;
            this.freeNum.string = "今日免费"+this._freecount + "次";
        }

    }
    
    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.onOpened){
                    RedUtil.callBackRun(this.node,this._callBack.onOpened);
                }
            }         
            
        }
    }

    update (dt) {
        if(RedUtil._renPackRainTime>0){
            RedUtil._renPackRainTime -= dt;
            this.timeCount.string = RedUtil.getSecondString(RedUtil._renPackRainTime*1000);
        }else{
            this.timeCount.node.active = false;
        }

    }
}
