// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {RedUtil} from "../RedUtil";
import redCenter from "../RedCenter";

@ccclass
export default class redpackRain extends cc.Component {

    @property(cc.Node)
    redBg: cc.Node = null;

    @property
    text: string = 'hello';

    @property
    _callBack:any = null;

    @property
    downTime:number = -1;

    @property
    cortalTime:number = 15;

    @property
    isStart:boolean = false;

    @property(cc.Sprite)
    numIcon:cc.Sprite = null;

    @property
    _isShowBox:boolean = false;

    @property
    _isOpenAppBox:boolean = true;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.redBg = this.node.getChildByName("redBg");
        this.numIcon = this.redBg.getChildByName("numIcon").getComponent(cc.Sprite);
    }

    start () {
        RedUtil.setScale(this.node);
        this.redBg.width = this.node.width;
        this.redBg.height = this.node.height;
        this.redBg.setPosition(0,0);

        if(RedUtil._iseventDot){
            RedUtil.extportData(5003,555);
        }

        this.cortalTime = 15;
        this.numIcon.node.active = true;
        this.numIcon.node.scaleX = 0.3;
        this.numIcon.node.scaleY = 0.3;
        this.numIcon.node.y = 265;
        cc.tween(this.numIcon.node)
        .to(0.1,{scaleX:1,scaleY:1,y:449})
        .start();

        let self = this;
        setTimeout(() => {
            RedUtil.LoadSpritRes("alySDK/alyUI/num2",function(err,spriteframe){
                self.numIcon.spriteFrame = spriteframe;
                setTimeout(() => {
                        RedUtil.LoadSpritRes("alySDK/alyUI/num1",function(err,spriteframe){
                            self.numIcon.spriteFrame = spriteframe;
                            setTimeout(() => {
                                RedUtil.LoadSpritRes("alySDK/alyUI/go",function(err,spriteframe){
                                    self.numIcon.spriteFrame = spriteframe;
                                    setTimeout(() => {
                                        self.numIcon.node.active = false;
                                        self.startOpenRed();
                                    }, 100);
                                })
                            }, 800);
                        })
                }, 800);
            })
        }, 800);
    }

    startOpenRed(){
       
        this.downTime = 0;
        this.showRain(0,0);
        this.showRain(0,130);
        this.showRain(0,290);
        this.showRain(50,330);

        RedUtil._currRedNum = 4;
        setTimeout(() => {
            this.isStart = true;
        }, 500);
    }

    showRain(x,y){
        let parentNode = this.redBg;
        if(RedUtil._litterRedPool.length>0)
        {
            let newNode = RedUtil._litterRedPool[RedUtil._litterRedPool.length-1];           
            parentNode.addChild(newNode);
            newNode.setPosition(x,y);
            newNode.active = true;
            RedUtil._litterRedPool.pop();
        }else{
            this.createLitter(x,y);
        }
    }

    createLitter(x,y){
        let parentNode = this.redBg;
        if(!RedUtil._litterRedPro){
            RedUtil.LoadResource("alySDK/alyprofabs/litterRedPack",function(err,prefab){
                let newNode = cc.instantiate(prefab);
                if(newNode){
                    parentNode.addChild(newNode);
                    newNode.setPosition(x,y);
                }       
        
            });
        }else{
            let newNode = cc.instantiate(RedUtil._litterRedPro);
            if(newNode){
                parentNode.addChild(newNode);
                newNode.setPosition(x,y);
            }    
        }
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.nextOpened){
                    RedUtil.callBackRun(this.node,this._callBack.nextOpened);
                }
            }                 
            
        }
    }

    destroyself(){
       // RedUtil.re
        RedUtil._isredPackRainOpen = true;
        redCenter.getInstance().openRedpackFirst({
            callBack:this._callBack,
            activeName:"红包雨",
            redpackType:"4",
            isOpenSecondPage:true,
        });
        if(RedUtil._iseventDot){
            RedUtil.extportData(5004,555);
        }
        if(RedUtil._litterRedPool.length>0){
            for (let index = 0; index < RedUtil._litterRedPool.length; index++) {
                 let  element = RedUtil._litterRedPool[index];
                 if(element){
                     element.destroy();
                 }
                
            }
            RedUtil._litterRedPool = [];
        }
        this.redBg.destroyAllChildren();
        this.node.destroy();
        this.isStart = false;
        this._isShowBox = false;
        
        RedUtil._currRedNum = 0;
        
    }

    addRedPack(){
        RedUtil._currRedNum+=1;
        this.showRain(0,0);
    }

    update (dt) {
        if(this.downTime>-1 && this.isStart){
            if(this.downTime<this.cortalTime){
                this.downTime += dt;
                if(RedUtil._currRedNum<15){
                    let count = 15 - RedUtil._currRedNum;
                    for (let index = 0; index < count; index++) {
                        this.addRedPack();
                        
                    }
                    
                 }
                if(Math.floor(this.downTime) == (this.cortalTime-2) && (!this._isShowBox)){
                    console.log("this.downTime==========="+this.downTime);
                    this._isShowBox = true;
                    this.createBoxShow();
                }               
            }else{
                this.downTime = -1;
                this.destroyself();
            }
            
        }
    }

    createBoxShow(){
        if(this._callBack && this._callBack.showBoxFun){
            this._callBack.showBoxFun();
        }

        // console.log("createBoxShow=============");
        // let qq = window["qq"];
        // if(!qq){
        //     return;
        // }
        // let aunId = "";
        // if(qq.aly.aUnID){
        //     aunId =  (qq.aly.aUnID).toString();
        //     console.log("qq.aly.aUnID--------"+qq.aly.aUnID);
        // }
        // let appbox = qq.createAppBox({
        //     adUnitld:aunId
        // })

        // appbox.show().catch(err => {
        //     appbox.load().then(()=> {
        //         console.log("盒子广告加载成功");       
        //         appbox.show().then(()=>{
        //             console.log("盒子广告显示成功");
        //         }).catch(err=>{
        //             console.log("盒子广告显示失败");
        //         })
        //     }).catch(err=>{
        //         console.log("盒子广告加载失败");
        //     })
        // })
        
    }
}
