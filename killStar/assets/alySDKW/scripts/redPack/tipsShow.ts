// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class tips extends cc.Component {

    @property(cc.Label)
    text: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         if(!this.text){
             this.text = this.node.getChildByName("text").getComponent(cc.Label);
         }
     }

    start () {
       //this.runMove();
    }

    runMove():void{
        cc.tween (this.node)
        .to(0.5,{y:680})
        .to(0.5,{y:795})
        .call(()=>{
            //console.log("move===========");
           this.destroySelf();
        })
        .start();
    }
    destroySelf():void{
        this.node.destroy();
    }


    getParams(tipStr:string):void{
       if(tipStr!=""){
           if(this.text){
               this.text.string = tipStr;
           }
           this.runMove();
       }
    }


    // update (dt) {}
}
