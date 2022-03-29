// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightConst from "./FightConst";
import FightManger from "./FightManger";
import FunUtils from "../../core/Util/FunUtils";
import GameDataManager from "../../core/Manager/GameDataManager";
import FightPoolManger from "./FightPoolManger";
import Guide, { GuideIds } from "../Guide";
import AudioManager from "../../core/Manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemBlock extends cc.Component {

    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    colorSprieFrame: cc.SpriteFrame[] = [];
    
    status:number = 0 ;  //状态 0 为一般 1为可触发点击 2为已经消失
    itemType:number = 0; //类型 0 为没有道具 1为双倍倍数 2为炸弹
    colorType:number = 0;   //颜色类型 
    isSingle:boolean = false;//是否是单一的 
    isPushMapData:boolean = false;//是否增加到MapData
    xId:number = 0;
    yId:number = 0;
    Data:any = null;
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.node.active = false;
    }
    start () {

    }
    init(data){
        this.Data = data;
        this.colorType = data.ColorType;
        this.setXYId(data.XId,data.YId)
        this.status = FightConst.ItemBlockStatus.Normal;
        this.itemType = 0;
        this.node.angle = 0;
        if(this.colorType == 0){
            // this.node.scaleX = 0;
            // this.node.scaleY = 0;
            this.status = FightConst.ItemBlockStatus.Dissolve;
            FightPoolManger.getInstance().putItemBlock(this.node)
            FightManger.getInstance().Map[data.XId][data.YId] = null;
            return;
        }
        this.node.active = true;
        this.loadSprite(this.colorType)
        // this.loadSprite("res/fight/test_"+this.colorType,this.bgSprite)
        this.playStartAction()
        this.node.setScale(1,1)
    }

    initItemType(){
        this.isPushMapData = false;
    }
    onTouchStart(touch:cc.Touch) {
        // console.log("==,this.colorType===",this.colorType)
        // console.log("==,FightManger.getInstance().Status===",FightManger.getInstance().Status)
        // console.log("this.isSingle",this.isSingle)
        //换色状态

        if(FightManger.getInstance().Status == FightConst.GameStatus.IncolorStatus ){
            if(FightManger.getInstance().inColor){
                FightManger.getInstance().inColor.setItemSprite(this)
            }
            return;
        }
        if(FightManger.getInstance().Status == FightConst.GameStatus.BombStatus ){
            FightManger.getInstance().bombCheckBlock(this.xId,this.yId)
            return;
        }
        //锤子状态
        if(FightManger.getInstance().Status == FightConst.GameStatus.HammerStatus){
            FightManger.getInstance().checkTouchBlock(this.xId,this.yId)
            return;
        }
        if(FightManger.getInstance().Status != FightConst.GameStatus.StartGame || this.status != FightConst.ItemBlockStatus.YesTouch){
            return;
        }
        if(this.isSingle && this.status == FightConst.ItemBlockStatus.YesTouch){
            // console.log("==单独的一个方块==")
            // let action1 = cc.scaleTo(0.1, 1.1, 0.9);
            // let action2 = cc.scaleTo(0.3, 1).easing(cc.easeBackOut());
            // let action = cc.sequence(action1, action2);
            // this.node.runAction(action)
            cc.tween(this.node)
                .to(0.1,{scaleX:1.1,scaleY:0.9})
                .to(0.3,{scale:1}, {easing: 'backOut'})
                .start()
            return;
        }
        // console.log("==单独的2个方块==",this.status)
        // console.log("==单独的2个方块==",this.Data.FightManger.status)
        if(!this.isSingle && this.status == FightConst.ItemBlockStatus.YesTouch && FightManger.getInstance().Status == FightConst.GameStatus.StartGame){
            Guide.getInstance().closwGuid(GuideIds.gamePrompt)
            Guide.getInstance().closwGuid(GuideIds.hongBaoPrompt)
            FightManger.getInstance().checkTouchBlock(this.xId,this.yId)
        }

    }
    //设置ID
    setXYId(xId,yId){
        this.xId = xId;
        this.yId = yId;
        GameDataManager.getInstance().userData.setMap(xId,yId,this.colorType,false)
    }
    setDataPos(x,y){
        this.Data.Pos.x = x;
        this.Data.Pos.y = y;
    }
    setInColcor(colorType){
        this.colorType = colorType;
        GameDataManager.getInstance().userData.setMap(this.xId,this.yId,this.colorType,false)
        this.loadSprite(this.colorType)
    }
    loadSprite(colorType){
        this.bgSprite.spriteFrame = this.colorSprieFrame[colorType - 1]
        // sprite.node.active = false;
        // let self = this;
        // cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
        //     if(err){
        //         return;
        //     }
        //     sprite.spriteFrame = spriteFrame;
        //     sprite.node.active = true;
        // });
    }
    playStartAction() {
        let posy = this.node.y - this.Data.Pos.y
        // let action = cc.moveTo(posy/2500,this.Data.Pos.x,this.Data.Pos.y)
        // let action1 = cc.scaleTo(0,1,1)//解决中间scale 变为0的可能(有几率会变 难道是是他的bug)
        // let spawn = cc.spawn(action,action1)
        // let seq = cc.sequence(spawn, cc.callFunc(() => {
        //     this.playStartSound()
        //     this.node.scaleX = 1;
        //     this.node.scaleY = 1;
        //     this.status = FightConst.ItemBlockStatus.YesTouch;
        // }, this))
        this.status = FightConst.ItemBlockStatus.YesTouch;
        let  tween = cc.tween(this.node)
                    .to(posy/2500, { position: cc.v3(this.Data.Pos.x,this.Data.Pos.y), scale: 1 })
                    .call(() => {
                        this.playStartSound()
                        this.node.setScale(1,1)
                        this.status = FightConst.ItemBlockStatus.YesTouch;
                    })
        // 如果有延迟时间就用延迟时间
        if (this.Data.StartTime) {
            let time = FunUtils.getRandom(this.Data.StartTime, this.Data.StartTime + 50)
            this.scheduleOnce(()=>{
                // this.node.runAction(seq)
                tween.start()
            },time/1000.0)
        }
    }
    playStartSound(){
        if(this.yId == 0 && this.xId == 9){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 8){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 7){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 6){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 5){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 4){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 3){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 2){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 1){
            AudioManager.getInstance().playSound("landing")
        }
        if(this.yId == 0 && this.xId == 0){
            AudioManager.getInstance().playSound("landing")
        }
    }
    // playStartAction() {
    //     this.node.scaleX = 0
    //     this.node.scaleY = 0
    //     let action = cc.scaleTo(0.8, 1, 1).easing(cc.easeBackOut())
    //     let seq = cc.sequence(action, cc.callFunc(() => {
    //         this.status = FightConst.ItemBlockStatus.YesTouch;
    //     }, this))
    //     // 如果有延迟时间就用延迟时间
    //     if (this.Data.StartTime) {
    //         this.scheduleOnce(()=>{
    //             this.node.runAction(seq)
    //         },this.Data.StartTime/1000.0)
    //     } else {
    //       this.node.runAction(seq)
    //     }
    //   }
    //播放死亡动画
    playDieAction(time,callback?:any,score?:number) {
        let self = this;
        GameDataManager.getInstance().userData.setMap(this.xId,this.yId,0,false)
        this.node.stopAllActions()
        this.status = FightConst.ItemBlockStatus.Dissolve;
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        // let action = null;
        // let seq = null;
        // let seq1 = cc.sequence(cc.delayTime(time), cc.callFunc(() => {
        //     AudioManager.getInstance().playSound("pop_star")
        //     FightManger.getInstance().addParticleBlock(this.node.x,this.node.y,this.colorType);
        //     action = cc.scaleTo( FightConst.FightNum.dissolveAnimationSpeed,0, 0)
        //     seq = cc.sequence(action, cc.callFunc(() => {
        //         if(callback){
        //             callback()
        //         }
        //     }, this))
        //     this.node.runAction(seq)
        // }, this))
        // this.node.runAction(seq1)
        cc.tween(this.node)
            .delay(time)
            .call(() => {
                AudioManager.getInstance().playSound("pop_star")
                FightManger.getInstance().addParticleBlock(this.node.x,this.node.y,this.colorType);
                cc.tween(this.node)
                    .to(FightConst.FightNum.dissolveAnimationSpeed,{scale:0})
                    .call(() => {
                        if(callback){
                            callback()
                        }
                    })
                    .start()
            })
            .start()

    }

    //处理下落数据
    playFallData(data){
        GameDataManager.getInstance().userData.setMap(this.xId,this.yId,0,false)
        if(data) {
            this.setXYId(data.x,data.y)
        }
    }
    // updatePlayFall(){

    // }
    //下落动画
    playFallAction(y, data,soundNum) { //下降了几个格子
        this.status = FightConst.ItemBlockStatus.Normal;
        GameDataManager.getInstance().userData.setMap(this.xId,this.yId,0,false)
        if(data) {
            this.setXYId(data.x,data.y)
        }
        cc.tween(this.node)
            // .by(0.13, { position:cc.v2( 0, FightConst.FightNum.itemBlockWidth/2)},{easing: 'bounceOut'})//,easing:'bounceOut'
            .by(0.03, { position:cc.v3( 0, FightConst.FightNum.itemBlockWidth/2)})//,easing:'bounceOut'
            // .by(0.17, { position : cc.v2(0, -y * FightConst.FightNum.itemBlockWidth  - FightConst.FightNum.itemBlockWidth/2)},{easing: 'bounceOut'})//,easing:'bounceOut'
            .by(0.05, { position : cc.v3(0, -y * FightConst.FightNum.itemBlockWidth  - FightConst.FightNum.itemBlockWidth/2)})//,easing:'bounceOut'
            .call(()=>{
                this.status = FightConst.ItemBlockStatus.YesTouch;
                if(soundNum == 1){
                    AudioManager.getInstance().playSound("landing")
                }
                this.setDataPos(this.node.x,this.node.y)
                
            })
            .start()
            // tween.clone
            // .start()
    }
    //左移 动画
    playLeftMoveAction(x,data,time) { //左移了几个格子
        this.status = FightConst.ItemBlockStatus.Normal;
        GameDataManager.getInstance().userData.setMap(this.xId,this.yId,0,false)
        if (data) {
            this.setXYId(data.x,data.y)
        }
        // let action = cc.moveBy(0.15, -x * (FightConst.FightNum.itemBlockWidth),0).easing(cc.easeBounceOut())
        // let seq = cc.sequence(cc.delayTime(time),action, cc.callFunc(() => {
        //     this.setDataPos(this.node.x,this.node.y)
        //     this.status = FightConst.ItemBlockStatus.YesTouch;
        // }, this))
        // this.node.runAction(seq)
        cc.tween(this.node)
            .delay(time)
            .by(0.05,{position:cc.v3(-x * (FightConst.FightNum.itemBlockWidth),0)},{easing: 'bounceOut'})
            .call(() => {
                this.status = FightConst.ItemBlockStatus.YesTouch;
                this.setDataPos(this.node.x,this.node.y)
            })
            .start()
    }
    //提示
    playHintAction() { //
        // let action1 = cc.scaleTo(FightConst.FightNum.hintAnimationSpeed,0.90)
        // let action2 = cc.scaleTo(FightConst.FightNum.hintAnimationSpeed,1)
        // let action3 = cc.scaleTo(FightConst.FightNum.hintAnimationSpeed,0.90)
        // let action4 = cc.scaleTo(FightConst.FightNum.hintAnimationSpeed,1)
        // let seq = cc.repeatForever(cc.sequence(cc.delayTime(0),action1,action2,action3,action4))
        // this.node.runAction(seq)
        let tween = cc.tween()
            .delay(0)
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:0.95})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:1})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:0.95})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:1})
        tween.clone(this.node).repeatForever().start()
    }
    // update (dt) {
    //     this.updatePlayFall()
    // }
}
