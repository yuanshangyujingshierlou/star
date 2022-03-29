

import ItemBlock from "./ItemBlock";
import FightManger from "./FightManger";
import FightConst from "./FightConst";
import FightPoolManger from "./FightPoolManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InColor extends cc.Component {

    @property(cc.Sprite)
    itemSprite: cc.Sprite[] = [];
    // LIFE-CYCLE CALLBACKS:
    posX = [-127.5,-42.5,42.5,127.50]
    itemBlock:ItemBlock = null;
    onLoad () {
        this.itemSprite[0].node.on('click', this.onItem1, this);
        this.itemSprite[1].node.on('click', this.onItem2, this);
        this.itemSprite[2].node.on('click', this.onItem3, this);
        this.itemSprite[3].node.on('click', this.onItem4, this);
        this.itemSprite[4].node.on('click', this.onItem5, this);
        this.itemSprite[5].node.on('click', this.onItem5, this);
        this.itemSprite[6].node.on('click', this.onItem5, this);
        this.itemSprite[7].node.on('click', this.onItem5, this);
    }
    init(data){
        this.setItemSprite(data.ItemBlock)
    }
    setNodePosition(itemBlock:ItemBlock){
        let x = itemBlock.node.x
        let y = itemBlock.node.y + 80;
        if(itemBlock.yId == 0){
            x = x + 142
        }
        if(itemBlock.yId == 1){
            x = x + 71
        }
        if(itemBlock.yId == FightConst.FightNum.rowNum - 1){
            x = x - 142
        }
        if(itemBlock.yId == FightConst.FightNum.rowNum - 2){
            x = x - 71
        }
        this.node.setPosition(x,y)
    }
    setItemSprite(itemBlock:ItemBlock){
        if(this.itemBlock){
            this.itemBlock.node.stopAllActions()
        }
        itemBlock.playHintAction();
        this.setNodePosition(itemBlock)
        this.itemBlock = itemBlock;
        let color = itemBlock.colorType;
        let posNum = 0
        for (let index = 0; index < this.itemSprite.length; index++) {
            const element = this.itemSprite[index];
            element.node.active = false;
            if( color != index + 1){
                element.node.x = this.posX[posNum]
                element.node.active = true;
                posNum++;
            }
        }
    }
    onItem1(){
        this.addInColorEffect()
        this.inColor(1)
    }
    onItem2(){
        this.addInColorEffect()
        this.inColor(2)
    }
    onItem3(){
        this.addInColorEffect()
        this.inColor(3)
    }
    onItem4(){
        this.addInColorEffect()
        this.inColor(4)
    }
    onItem5(){
        this.addInColorEffect()
        this.inColor(5)
        
    }
    onItem6(){
        this.addInColorEffect()
        this.inColor(6)
        
    }
    onItem7(){
        this.addInColorEffect()
        this.inColor(7)
        
    }
    onItem8(){
        this.addInColorEffect()
        this.inColor(8)
        
    }
    inColor(type){
        // setTimeout(() => {
        //     this.itemBlock.setInColcor(type)
        //     FightManger.getInstance().closeInColorProp(true)
        // }, 250)
        this.scheduleOnce(() => {
            this.itemBlock.setInColcor(type)
            FightManger.getInstance().closeInColorProp(true)
        },0.25);
    }
    addInColorEffect(){
        let parentNode = FightManger.getInstance().ViewFight.MapNode;
        let pos = this.itemBlock.node.getPosition()
        let data = {
        }
        FightPoolManger.getInstance().createInColorEffect(parentNode,pos,data)
    }
    start () {

    }

    // update (dt) {}
}
