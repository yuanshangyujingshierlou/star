// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GuideLabel extends cc.Component {

    @property(cc.Node)
    bg_1: cc.Node = null;
    @property(cc.Node)
    bg_2: cc.Node = null;
    
    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    init(data){
        if(data.Type == 1){
            this.bg_1.active = true;
            this.bg_2.active = false;
        }
        if(data.Type == 2){
            this.bg_1.active = false;
            this.bg_2.active = true;
        }
    }
    // update (dt) {}
}
