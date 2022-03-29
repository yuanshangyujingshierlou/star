// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {RedUtil} from "../RedUtil";

@ccclass
export default class everyTask extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.ScrollView)
    listView:cc.ScrollView = null;

    @property(cc.Button)
    v_backBtn:cc.Button = null;

    @property(cc.ProgressBar)
    v_myProgre:cc.ProgressBar = null;

    @property(cc.Label)
    v_myNum:cc.Label = null;

    @property(cc.Button)
    v_tixianBtn:cc.Button = null;

    @property(cc.Node)
    v_tixianBtnsp:cc.Node = null;

    @property
    _callBack:any = null;

    @property 
    _messageCode:any = null;

    @property
    _canWithdrawNow:boolean = false;

    @property
    _goCom:number = 0;

    @property
    _canget:number = 1;

    @property
    _isfinsh:number = 2;

    @property
    _gameInfo:Array<any> = [];

    @property
    onPrefab:any = null;

    @property
    onPrefab2:any = null;

    @property
    _withdrawIndex:number = -1;

    @property
    cliclTime:number = -1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.background = this.node.getChildByName("background");
        this.listView = this.background.getChildByName("listView").getComponent(cc.ScrollView);
        this.v_backBtn = this.listView.content.getChildByName("topDi").getChildByName("v_backBtn").getComponent(cc.Button);
        if(!this.v_myProgre){
            this.v_myProgre = this.listView.content.getChildByName("topContentDi").getChildByName("v_myProgre").getComponent(cc.ProgressBar);
        }
        this.v_myNum = this.listView.content.getChildByName("topContentDi").getChildByName("v_myNum").getComponent(cc.Label);
        this.v_tixianBtn = this.listView.content.getChildByName("topContentDi").getChildByName("v_tixianBtn").getComponent(cc.Button);
        this.v_tixianBtnsp = this.listView.content.getChildByName("topContentDi").getChildByName("v_tixianBtnsp");
    }

    start () {
        RedUtil.setScale(this.node);
        this.background.width = this.node.width;
        this.background.height = this.node.height;
        this.listView.node.height = this.node.height - 30;
        this.listView.node.width = this.node.width;

        let view = this.listView.node.getChildByName("view");
        view.width = this.node.width;
        view.height = this.node.height - 30;

        this.v_backBtn.node.on("click",this.closeClick,this);
        this.v_tixianBtn.node.on("click",this.openWithdraw,this);
        RedUtil.eventDispatcher.on("withdrawNowFinsh",this.withdrawNowFinsh);
        this.schedule(function(){
            cc.tween(this.v_tixianBtnsp)
            .to(0.6,{scaleX:1.2,scaleY:1.2})
            .to(0.6,{scaleX:1,scaleY:1})
            .start()
        },1.2)


        if(RedUtil._iseventDot){
            RedUtil.extportData(9000,555);
        }

    }

    refreshMessage(messCode,callBack){
        console.log("refreshMessage============");
        this._messageCode = messCode;
        this.init();
    }

    init(){
        console.log("init==============");
        this._gameInfo = [];
        let sourceGameInfo = RedUtil.getGameInfo();
        //console.log("sourceGameInfo=========="+sourceGameInfo.length);
        if(sourceGameInfo.length<=0){
            console.log("JSON is error");
            return;        //0 去完成  1领取  2已领
        }
        if(this._messageCode){
            if(this._messageCode.medal>0){
               if(this._messageCode.medal>=20){
                   this._canWithdrawNow = true;
                   this.v_myNum.string = "我的勋章数：20/20";
                  // console.log("this._messageCode.medal=============="+this._messageCode.medal);
                   this.v_myProgre.progress = 1;
               }else{
                  this.v_myNum.string = "我的勋章数："+this._messageCode.medal+"/20";
                  //console.log("this._messageCode.medal====2=========="+this._messageCode.medal);
                  this.v_myProgre.progress = this._messageCode.medal/20;
               }
            }
        }
        for (let index = 0; index < sourceGameInfo.length; index++) {
             let element = sourceGameInfo[index];
             element.state = 0;    
             element.currLength = 0;

             if(this._messageCode &&this._messageCode.tasklist.length>0){
                for (let j = 0; j < this._messageCode.tasklist.length; j++) {
                    let messlist = this._messageCode.tasklist[j];
                    if(element.taskId == messlist.TaskId){
                        element.currLength = messlist.Count;
                        element.state = messlist.State;
                    }
                }
             }

             if(element.currLength>=element.allLength && element.state != this._isfinsh){
                 element.state = this._canget;
                 //console.log("element.currLength========"+element.currLength);
             }
             this._gameInfo.push(element);
        }
        this.changeList();
        //console.log("this._gameInfo.length========"+this._gameInfo.length);
        console.log("init------2");
    }

    changeList(){
        for (let index = 0; index < this._gameInfo.length; index++) {   
             let child = this.listView.content.getChildByName("taskItemlist"+index);        
             this.listView.content.removeChild(child);
        }
        this.sortItem();
        let self = this;
        
        
        let showList = function(err,obj){
            self.onPrefab2 = obj;
            //console.log("this._gameInfo.length========"+self._gameInfo.length);
            let length = self._gameInfo.length;
            let offey = -485;
            let allHeight = 0;
            for (let index = 0; index < length; index++) {
                    let ele = self._gameInfo[index];
                    let item = null;
                    if(ele.allLength>0){
                        item = cc.instantiate(self.onPrefab2);
                    }else{
                        item = cc.instantiate(self.onPrefab);
                    }
                    item.y = offey+10;
                    offey -= (item.height +10);
                    allHeight += (item.height +10);
                    item.x = self.listView.content.width/2;
                    item.name = "taskItemlist"+index;
                    self.listView.content.addChild(item); 
                    let v_title = item.getChildByName("v_title").getComponent(cc.Label);
                    v_title.string = ele.title;
                    let v_downTitle = item.getChildByName("v_downTitle").getComponent(cc.Label);
                    v_downTitle.string = ele.litter_title; 
                    let v_xunNum = item.getChildByName("v_xunNum").getComponent(cc.Label);
                    v_xunNum.string = "+" + ele.medal.toString();
                    let xunzhang = item.getChildByName("xunzhang");
                    let v_complete = item.getChildByName("v_complete").getComponent(cc.Button);               
                    if(ele.allLength>0){
                        let gray = item.getChildByName("gray");
                        let v_pro = item.getChildByName("v_pro").getComponent(cc.ProgressBar);
                        let jinduNum = item.getChildByName("jinduNum").getComponent(cc.Label);
                        if(ele.state == self._isfinsh){
                            gray.active = true;
                            v_pro.active = false;
                            jinduNum.color =  new cc.Color(226,226,226);//"#e2e2e2";
                            jinduNum.string = ele.allLength.toString() + "/" +ele.allLength.toString();
                        }else{
                            let curr = ele.currLength;
                            if(curr>ele.allLength){
                                curr = ele.allLength;
                            }
                            let lne = curr/ele.allLength;
                            v_pro.progress = lne;
                            jinduNum.string = curr.toString() + "/" +ele.allLength.toString();
                        }
                    }
                    if(ele.state == self._isfinsh){
                        cc.loader.loadRes("alySDK/alyUI/haveget",cc.SpriteFrame,function(err,spriteframe){
                            let sprt = v_complete.node.getComponent(cc.Sprite);
                            sprt.spriteFrame = spriteframe;
                       })
                        v_complete.node.y = -80;
                        v_xunNum.node.active = false;
                        xunzhang.active = false;
                    }else if(ele.state == self._canget){
                    // v_complete.skin = "alySDK/taskUI/get.png";
                        console.log("get===0====");
                        cc.loader.loadRes("alySDK/alyUI/get",cc.SpriteFrame,function(err,spriteframe){
                            console.log("get====1===");
                            let sprt = v_complete.node.getComponent(cc.Sprite);
                            sprt.spriteFrame = spriteframe;
                        })
                    }
                    if(ele.state != self._isfinsh){
                        v_complete.node.on("click",function(){
                            self.litterBtnClieck(index.toString());
                        },self);
                        // let clickHandler = new cc.Component.EventHandler();
                        // clickHandler.target = this.node;
                        // clickHandler.component = "everyTask";
                        // clickHandler.handler = "litterBtnClieck";
                        // clickHandler.customEventData = index.toString();
                        // v_complete.clickEvents.push(clickHandler);
                    }
                    
            }
            self.listView.content.height = 480+allHeight;
        }

        RedUtil.LoadResource("alySDK/alyprofabs/taskIteml",function(err,prafb){
            if(prafb){
              self.onPrefab = prafb;
              RedUtil.LoadResource("alySDK/alyprofabs/taskLoItem",showList);
            }
         })
        
    }


    litterBtnClieck(clickIndex:string){
        console.log("index==============="+clickIndex);
        let index = Number(clickIndex);
        let ele = this._gameInfo[index];
        this._withdrawIndex = index;
        if(ele.state == this._canget){
            RedUtil.getAwardTask(ele.taskId,ele.medal);
            console.log("ele.medal====="+ele.medal)
        }else if(ele.state == this._goCom){
             if(ele.isOpenWithdraw){
                 this.btnwithdraw();
             }else{
                 this.closeClick();
             }
        }
    }

    openWithdraw(){     
        if(this._canWithdrawNow){
            if(this.cliclTime>0){
                RedUtil.opeTips("操作太频繁了");
                return;
            }
            else{
                this.cliclTime = 2;
            }
             //直接提现
             let self = this;
             let money = 10;
             RedUtil.awardMoney(money,{
               SuccessFuc:function(mess:any){
                   console.log("everyTasd withdraw compelet----------"+JSON.stringify(mess));
                   if(mess.code == 0){
                       //RedUtil.opeTips("提现成功");
                       RedUtil.openWithdrawSuccess(money/100);
                       console.log("直接提现=========="+money);
                       self.withdrawNowFinsh();
                   }else{
                       RedUtil.opeTips("提现失败");
                   }  
               }
             })
        }else{
            RedUtil.opeTips("勋章不足");
        }
        
    }

    btnwithdraw(){
        RedUtil.requestCount({});
        RedUtil._isFirstwithdraw = true;
     }


    closeClick(){
        console.log("closeClick======");
        if(this._callBack && this._callBack.nextClose){
            this._callBack.nextClose();
        }
        RedUtil.eventDispatcher.off("withdrawNowFinsh");
        RedUtil._everyTask = null;
        this.node.destroy();
    }
    //直接提现成功
    withdrawNowFinsh(){
        console.log("withdrawNowFinsh==========");
        this._canWithdrawNow = false;
        this.v_myNum.string = "我的勋章数：0/20";
        this.v_myProgre.progress = 0;
    }

    //领取成功
    changeOneItem(taskId){
        let exitId = 0;
         if(this._gameInfo[this._withdrawIndex].taskId == taskId){
             exitId = this._gameInfo[this._withdrawIndex].id;
         }else{
            for (let index = 0; index < this._gameInfo.length; index++) {
                let element = this._gameInfo[index];
                if(element.taskId == taskId){
                    exitId = this._gameInfo[index].id;
                }
            }
         }
         if(exitId>0 && RedUtil._iseventDot){
             RedUtil.extportData(exitId,55);
         }

        RedUtil.requestEveryTask(this._callBack);

     }
    //首次提现成功
    withdrawFinsh(){
        RedUtil._isFirstwithdraw = false;
        if(this._withdrawIndex>-1){
            let curr = this._gameInfo[this._withdrawIndex].currLength;
            this._gameInfo[this._withdrawIndex].currLength = curr+1;
            if(this._gameInfo[this._withdrawIndex].currLength>=this._gameInfo[this._withdrawIndex].allLength && this._gameInfo[this._withdrawIndex].state != this._isfinsh){
                this._gameInfo[this._withdrawIndex].state = this._canget;
            }
        }
        this.changeList();
     }

    sortItem(){
        let lingqu = [];
        let daiwancheng = [];
        let yiwangcheng = [];
        for (let index = 0; index < this._gameInfo.length; index++) {
            let element = this._gameInfo[index];
            if(element.state == this._canget){
                lingqu.push(element);
            }else if(element.state == this._isfinsh){
                yiwangcheng.push(element);
            }else{
                daiwancheng.push(element);
            }
        }

        //this._gameInfo = [];
        let count = 0;
        for(let i= 0;i<lingqu.length;i++){
           this._gameInfo[i] = lingqu[i];
           count++;
        }
        
        for(let i= 0;i<daiwancheng.length;i++){
           this._gameInfo[count] = daiwancheng[i];
           count++;
        }      
        for(let i= 0;i<yiwangcheng.length;i++){
           this._gameInfo[count] = yiwangcheng[i];
           count++;
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
            if(parmp.messageCode){
                this._messageCode = parmp.messageCode;
            }                      
            
        }
        setTimeout(() => {
            this.init();
            let self = this;
            RedUtil.taskrequestCount({SuccessFuc:function(count:number){
                if(count>0){          
                    let taskId = -1;
                    if(self._gameInfo[0].isOpenWithdraw && self._gameInfo[0].state != self._isfinsh){
                        //console.log("self._gameInfo[0].state============="+self._gameInfo[0].state);
                        self._gameInfo[0].state = self._canget;
                        taskId = self._gameInfo[0].taskId;
                        self._gameInfo[0].currLength = self._gameInfo[0].allLength;
                    }else{
                        for (let index = 0; index < self._gameInfo.length; index++) {
                            let element = self._gameInfo[index];
                            if(element.isOpenWithdraw && self._gameInfo[index].state != self._isfinsh){
                                self._gameInfo[index].state = self._canget;
                                self._gameInfo[index].currLength = self._gameInfo[index].allLength;
                                taskId = self._gameInfo[index].taskId;
                            }
                        }
                    }
                    if(taskId>-1){
                        RedUtil.changeEveryTaskMessage(taskId,1);
                        self.changeList();
                    }
                    
                }
            }});
        }, 300);
        //this.init();
    }

     update (dt) {
          if(this.cliclTime>0){
              this.cliclTime -= dt;
          }
     }
}
