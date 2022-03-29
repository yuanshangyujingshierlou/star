// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightPoolManger from "./FightPoolManger";
import AudioManager from "../../core/Manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TextEffect extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Animation)
    ani: cc.Animation = null;
    @property(cc.ParticleSystem)
    ParticleSystem_1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    ParticleSystem_2: cc.ParticleSystem = null;
    @property(cc.SpriteFrame)
    spriteFrameTable:cc.SpriteFrame[] = [];

    onLoad () {
        
    }
    init(data){
        this.node.active = false;
        this.loadSprite(data.Type)
        // setTimeout(() => {
        //     if(data.Type == 1){
        //         AudioManager.getInstance().playSound("good")
        //     }else if(data.Type == 2){
        //         AudioManager.getInstance().playSound("greate")
        //     }else{
        //         AudioManager.getInstance().playSound("perfect")
        //     }
            
        //     this.node.active = true;
        //     this.ParticleSystem_1.resetSystem();
        //     this.ParticleSystem_2.resetSystem();
        //     this.ani.play("effect_text")
        //     this.setSprite(data);
        // }, 300)
        this.scheduleOnce(() => {
            if(data.Type == 1){
                AudioManager.getInstance().playSound("good")
            }else if(data.Type == 2){
                AudioManager.getInstance().playSound("greate")
            }else{
                AudioManager.getInstance().playSound("perfect")
            }
            
            this.node.active = true;
            this.ParticleSystem_1.resetSystem();
            this.ParticleSystem_2.resetSystem();
            this.ani.play("effect_text")
            this.setSprite(data);
        },0.3);
    }
    setSprite(data){
        this.sprite.node.scale = 0;
        this.sprite.node.opacity = 255;
        this.sprite.node.setPosition(0,0);
        // let scale = cc.scaleTo(0.3,1).easing(cc.easeBackOut())
        // let move = cc.moveTo(0.3,cc.v2(this.sprite.node.x,this.sprite.node.y + 200)) 
        // let opacity = cc.fadeOut(0.3)
        // let spew = cc.spawn(move,opacity);
        // let seq = cc.sequence(scale,spew,cc.callFunc(()=>{
        //     FightPoolManger.getInstance().putTextEffect(this.node);
        // },this))
        // this.sprite.node.runAction(seq)
        cc.tween(this.sprite.node)
            .to(0.5,{scale:1})
            .to(0.5,{position:cc.v2(this.sprite.node.x,this.sprite.node.y + 200),opacity:0})
            .call(() =>{
                FightPoolManger.getInstance().putTextEffect(this.node);
            })
            .start()
    }
    loadSprite(Type){
        // sprite.node.active = false;
        this.sprite.spriteFrame = this.spriteFrameTable[Type-1]
        
        // let self = this;
        // cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
        //     if(err){
        //         return;
        //     }
        //     sprite.spriteFrame = spriteFrame;
        //     // sprite.node.active = true;
        // });
    }
    start () {

    }

    // update (dt) {}
}
