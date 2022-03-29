// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {RedUtil} from "../RedUtil";

@ccclass
export default class NewClass extends cc.Component {

    @property (cc.ScrollView)
    v_intrdList:cc.ScrollView = null;

    @property (cc.Button)
    closeBtn:cc.Button = null;


    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         if(!this.v_intrdList || !this.closeBtn){
            let background = this.node.getChildByName("background");
            this.closeBtn = background.getChildByName("closeBtn").getComponent(cc.Button);
            this.v_intrdList = background.getChildByName("v_intrdList").getComponent(cc.ScrollView);
         }
     }

    start () {
         RedUtil.setScale(this.node);
         //1100 144
         let background = this.node.getChildByName("background");
         background.width = this.node.width;
         background.height = this.node.height;
         background.setPosition(-this.node.width*0.5,this.node.height*0.5);
         console.log("node--222222-");
         this.v_intrdList.node.height = this.node.height - 181;
         let view = this.v_intrdList.node.getChildByName("view");
         view.height = this.node.height - 181;
         this.v_intrdList.content.setPosition(0,0);
         this.v_intrdList.node.setPosition((this.node.width - this.v_intrdList.node.width)*0.5,-145);



         this.closeBtn.node.on("click",this.destroySelf,this);
         let record = cc.sys.localStorage.getItem('MoneyRecord');
         if(record){ 
             let recordO = JSON.parse(record)
             let name = recordO.recordName;
             let time = recordO.MoneyTime;
             let money = recordO.MoneyValue;
             this._setList(name,time,money);
         }
    }

    _setList(arr:Array<string>,arr2:Array<string>,arr3:Array<number>):void{  
   // _setList():void{    
        console.log("arr.length==========================================="+arr.length);         
       // let dataArr = [];
        let content = this.v_intrdList.content;
        content.height = 80*arr.length;
        for(let i=0;i<arr.length;i++){
           //dataArr.push({aName:{text:arr[i]},aTime:{text:arr2[i]},money:{text:"+"+arr3[i]/100}});
           cc.loader.loadRes("alySDK/alyprofabs/moneyLIst_item",function(err,prefab){
            let newNode = cc.instantiate(prefab);
            //console.log("_setList=============");
             if(newNode){
                 newNode.setPosition(0,-80*i);
                 content.addChild(newNode);
                 let aName = newNode.getChildByName("aName").getComponent(cc.Label);
                 aName.string = arr[i];
                 let aTime = newNode.getChildByName("aTime").getComponent(cc.Label);
                 aTime.string = arr2[i];
                 let money = newNode.getChildByName("money").getComponent(cc.Label);
                 money.string = "+"+ Number(arr3[i])/100;
              }       
     
           })
        }
    }

    destroySelf():void{
        this.node.destroy();
    }

    // update (dt) {}
}
