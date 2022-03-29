// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AdaptarManager from "../core/Manager/AdaptarManager";
import Https from "../core/Net/Https";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewHttpDelay extends cc.Component {

    @property(cc.Node)
    btnRetry: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("bg"))
        this.btnRetry.on('click', this.onRetry, this);
    }

    start () {

    }
    onRetry(){
        this.node.destroy()
        Https.getInstance().onRetry()
    }
    // update (dt) {}
}
