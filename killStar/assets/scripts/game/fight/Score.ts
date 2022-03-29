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
import FightPoolManger from "./FightPoolManger";
import GameDataManager from "../../core/Manager/GameDataManager";
import FightManger from "./FightManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Score extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:
    data:any =null;

    // onLoad () {}
    init(data){
        this.data = data;
        this.label.string = data.Score;
        this.node.scale = 1;
        this.label.node.color =data.Color
        
        this.label.node.active = false;
        if(data.Type == FightConst.Score.SmallType){ //小字
            this.label.fontSize = FightConst.Score.SmallSize;
            this.smallAni(data.MovePos)
        }
        if(data.Type == FightConst.Score.BigType){ //大字
            this.label.fontSize = FightConst.Score.BigSize;
            this.bigAni()
        }
    }
    addScoreEffect(){
        let parentNode = FightManger.getInstance().ViewFight.MapNode;
        let pos = this.data.MovePos;
        let data = {
        }
        FightPoolManger.getInstance().createScoreEffect(parentNode,pos,data)
    }
    smallAni(movePos){
        // let move = cc.moveTo(0.8,movePos).easing(cc.easeOut(3))
        // let scale = cc.scaleTo(0.8,0.5).easing(cc.easeOut(3))
        // let spawn = cc.spawn(move,scale)
        // let seq = cc.sequence(cc.delayTime(this.data.Time),cc.callFunc(()=>{this.label.node.active = true},this),spawn,cc.callFunc(()=>{
        //     FightManger.getInstance().ViewFight.nowScore += this.data.Score;
        //     FightManger.getInstance().ViewFight.setNowTargetLabel()
        //     this.addScoreEffect()
        //     FightPoolManger.getInstance().putScore(this.node)
        // },this))
        // this.node.runAction(seq)
        cc.tween(this.node)
            .delay(this.data.Time)
            .call(() =>{
                this.label.node.active = true
            })
            .to(0.8,{position:movePos,scale:0.5},{easing: 'quadOut'})
            .call(() =>{
                FightManger.getInstance().ViewFight.nowScore += this.data.Score;
                FightManger.getInstance().ViewFight.setNowTargetLabel()
                this.addScoreEffect()
                FightPoolManger.getInstance().putScore(this.node)
            })
            .start()
    }
    bigAni(){
        let movePos = cc.v2(this.node.x,this.node.y + 150)
        // let move = cc.moveTo(0.3,movePos).easing(cc.easeOut(3))
        // let scale = cc.scaleTo(0.4,0.8).easing(cc.easeOut(3))
        // let seq = cc.sequence(cc.delayTime(this.data.Time),cc.callFunc(()=>{this.label.node.active = true},this),move,scale,cc.delayTime(0.1),cc.callFunc(()=>{
        //     FightPoolManger.getInstance().putScore(this.node)
        // },this))
        // this.node.runAction(seq)
        cc.tween(this.node)
            .delay(this.data.Time)
            .call(() =>{
                this.label.node.active = true
            })
            .to(0.3,{position:movePos},{easing: 'quadOut'})
            .to(0.4,{scale:0.8},{easing: 'quadOut'})
            .delay(0.1)
            .call(() =>{
                FightPoolManger.getInstance().putScore(this.node)
            })
            .start()
    }
    start () {

    }

    // update (dt) {}
}
