// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import tips from "../redPack/tipsShow";
import { RedUtil } from "../RedUtil";
import turnPage from "./turnPage";
import intrducePage from "./intrducePage";
import myStarPage from "./myStarPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    v_backBtn: cc.Button = null;

    @property(cc.Button)
    v_guanggaoBtn:cc.Button = null;

    @property(cc.Label)
    v_yearstoday:cc.Label = null;

    @property(cc.Label)
    v_history:cc.Label = null;

    @property(cc.Button)
    v_fenhongBtn:cc.Button = null;

    @property(cc.Label)
    v_everyred:cc.Label = null;

    @property(cc.Button)
    v_myRedBtn:cc.Button = null;

    @property(cc.Label)
    v_todayNum:cc.Label = null;
    
    @property(cc.Label)
    v_willNum:cc.Label = null;

    @property(cc.Label)
    v_alltake:cc.Label = null;

    @property(cc.Node)
    v_listBg:cc.Node = null;

    @property(cc.Node)
    background:cc.Node = null;
    
    @property(cc.Node)
    v_listScrollbg:cc.Node = null;

    @property(cc.Button)
    v_selectRedBtn:cc.Button = null;

    @property(cc.ScrollView)
    listView:cc.ScrollView = null;

    @property(cc.ScrollView)
    v_list:cc.ScrollView = null;

    @property(cc.Node)
    bottomBorder:cc.Node = null;

    @property
    _callBack:any = null;

    @property
    v_propTitle:string = "";

    @property
    v_propIcon:string = "";


    @property
    surplusNum:number = 0;

    @property
    yesterdayHaveNum:number = 0;

    @property
    isHaveListsave:boolean = false;

    @property
    isoverCreate:boolean = false;
    


    @property
    itemList:Array<number> = [];

    @property
    itemListName:Array<string> = [];

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         
         this.background = this.node.getChildByName("background");
         //RedUtil.setScale(background);
         if(!this.listView){
             this.listView = this.background.getChildByName("listView").getComponent(cc.ScrollView);
         }
         if(!this.v_backBtn || !this.v_guanggaoBtn ||!this.v_yearstoday||!this.v_history || !this.v_fenhongBtn ||!this.v_everyred ||!this.v_myRedBtn||
            !this.v_todayNum||!this.v_willNum ||!this.v_alltake ||!this.v_listBg||!this.v_listScrollbg){           
            //let listView = background.getChildByName("listView").getComponent(cc.ScrollView);
            let content = this.listView.content;
            let topDi = content.getChildByName("topDi");
            this.v_backBtn = topDi.getChildByName("v_backBtn").getComponent(cc.Button);
            let topContentDi = content.getChildByName("topContentDi");
            this.v_guanggaoBtn = topContentDi.getChildByName("tiphor").getChildByName("v_guanggaoBtn").getComponent(cc.Button);
            this.v_yearstoday = topContentDi.getChildByName("yearstodayP").getChildByName("v_yearstoday").getComponent(cc.Label);
            this.v_history = topContentDi.getChildByName("historyP").getChildByName("v_history").getComponent(cc.Label);
            let middContent = content.getChildByName("middContent");           
            this.v_fenhongBtn = middContent.getChildByName("tiphor").getChildByName("v_fenhongBtn").getComponent(cc.Button);
            let redbg = middContent.getChildByName("redbg");
            this.v_everyred = redbg.getChildByName("v_everyred").getComponent(cc.Label);
            this.v_myRedBtn = redbg.getChildByName("v_myRedBtn").getComponent(cc.Button);
            this.v_todayNum = middContent.getChildByName("leftNode").getChildByName("v_todayNum").getComponent(cc.Label);
            this.v_willNum = middContent.getChildByName("centertNode").getChildByName("v_willNum").getComponent(cc.Label);
            this.v_alltake = middContent.getChildByName("rightNode").getChildByName("v_alltake").getComponent(cc.Label);

            this.v_listBg = content.getChildByName("v_listBg");
            this.v_listScrollbg = content.getChildByName("v_listScrollbg");


        }
        this.bottomBorder = this.background.getChildByName("bottomBorder");
        if(!this.v_selectRedBtn){
            this.v_selectRedBtn = this.bottomBorder.getChildByName("v_selectRedBtn").getComponent(cc.Button);
        }
        
         
     }

    start () {
        RedUtil.setScale(this.node);
        this.background.width = this.node.width;
        this.background.height = this.node.height;
        console.log("this.node.height============"+this.node.height);
        console.log("this.node.width===y========"+this.node.width);

        console.log("this.background.x============"+this.background.x);
        console.log("this.background.y====y========"+this.background.y);
        this.listView.node.height = this.node.height - 140;
        this.listView.node.width = this.node.width;

        let view = this.listView.node.getChildByName("view");
        view.width = this.node.width;
        view.height = this.node.height - 140;
        this.listView.content.width = this.node.width;
        this.listView.content.height = view.height;
        this.listView.content.setPosition(0,0);

        this.bottomBorder.width = this.node.width;
        this.bottomBorder.y = -(this.node.height - 110);
        //116
        //this.node.setPosition(cc.winSize.width*0.5,cc.winSize.height*0.5);
        
        this.v_backBtn.node.on("click",this.destroySelf,this);
        this.v_selectRedBtn.node.on("click",this.openTurnPage,this); 
        //openintrducePage
        this.v_guanggaoBtn.node.on("click",this.openintrducePage,this);
        this.v_fenhongBtn.node.on("click",this.openintrducePage2,this);
        this.v_myRedBtn.node.on("click",this.myRedStarClick,this);   //myRedStarClick
        //openMyStarPage

        this.showInit();
       
    }
    onEnable(){
        if(RedUtil._iseventDot){
            RedUtil.extportData(2005,0); //进入分红页面
        }
    }
    
     update (dt) {
        if(this.yesterdayHaveNum>5 && this.isoverCreate && this.v_list){
            let allper = (this.yesterdayHaveNum-5)*89;
            //let danci = allper/150;
            let py = this.v_list.getContentPosition().y;
            let px = this.v_list.getContentPosition().x;
            if(py>=allper){
                this.v_list.stopAutoScroll();
                this.v_list.setContentPosition(new cc.Vec2(px,0));
            }else{
                this.v_list.setContentPosition(new cc.Vec2(px,py+3));
            }
        }
     }
    onDisable(){
        console.log("onDisable=============");
        RedUtil._mainprofit = null;
        
    }

    destroySelf():void{
        if(this._callBack && this._callBack.nextClose){
            this._callBack.nextClose();
           // RedUtil.callBackRun(this.node,this._callBack.nextClose);
        }
        this.node.destroy();
                   
    }
    showInit():void{
         //cc.sys.localStorage.clear();
         let yersterNum = RedUtil.getRandomNum(10000,99999);
         let historyNum = 0;
         let yer = cc.sys.localStorage.getItem('yesterdayMoney');
         //let date = this.date;  //'2020/6/30'
         let date = new Date(); 
         let dateStr = date.getFullYear() + "-" +date.getMonth() + "-" +date.getDate();
         if(yer){
               let yerarr = yer.split(";")
               if(yerarr instanceof Array && yerarr.length>1){
                   let yerstr = yerarr[0];
                   if(dateStr == yerstr){
                     yersterNum = Number(yerarr[1]);
                   }else{
                     let saveStr = dateStr + ";" + yersterNum;
                     cc.sys.localStorage.setItem('yesterdayMoney',saveStr);
                   }
               }else{
                   console.log("error----saveyear");
               }
         }else{
             let saveStr = dateStr + ";" + yersterNum;
             cc.sys.localStorage.setItem('yesterdayMoney',saveStr);                      
         }     //昨日收益
         let history = cc.sys.localStorage.getItem('historyMoney');
         if(history){
             let hisarr = history.split(";");
             if(hisarr instanceof Array && hisarr.length>1){
                 let hisStr = hisarr[0];
                 if(hisStr == dateStr){
                     historyNum = Number(hisarr[1]);
                 }else{
                     historyNum = Number(hisarr[1]) + Number(yersterNum); 
                     let saveStr = dateStr + ";" + historyNum;
                     cc.sys.localStorage.setItem('historyMoney',saveStr);          
                 }
             }else{
                 console.log("errrrrrrr--saveHistory");
             }
         }else{
             let saveStr = dateStr + ";" + yersterNum;
             cc.sys.localStorage.setItem('historyMoney',saveStr);
             historyNum = yersterNum;
         }   //历史收益
         this.v_yearstoday.string = yersterNum.toString();
         this.v_history.string = historyNum.toString();
         
         let yesEveryNum = RedUtil.getRandomNumfloat(220,230,2);
         let yesEvery = cc.sys.localStorage.getItem('yesterdayEvery');
         if(yesEvery){
             let yesArr = yesEvery.split(";");
             if(yesArr instanceof Array && yesArr.length>1){
                if(yesArr[0] == dateStr){
                 yesEveryNum = Number(yesArr[1]);
                }else{
                    cc.sys.localStorage.setItem('yesterdayEvery',dateStr + ";" + yesEveryNum);
                }
             }else{
                 console.log("yesterdayEvery--error");
             }
         }else{
             cc.sys.localStorage.setItem('yesterdayEvery',dateStr + ";" + yesEveryNum);
         }   //昨日人均
         this.v_everyred.string = yesEveryNum.toString();
 
         let todayhave = RedUtil.getRandomNum(1,100);
         let yesterdayhave = 0;
         let todayM = cc.sys.localStorage.getItem('todayHaveNum');
         console.log("todayM======="+todayM);
         //console.log("yesterdayhave===1===="+yesterdayhave);
         if(todayM){
              let todayArr = todayM.split(";");
              if(todayArr instanceof Array && todayArr.length>1){
                  if(todayArr[0] == dateStr){
                      todayhave = Number(todayArr[1]);
                      //console.log("todayarr======="+todayArr[1]);
                  }else{
                     yesterdayhave = Number(todayArr[1]);
                     cc.sys.localStorage.setItem('todayHaveNum',dateStr + ";" + todayhave);
                  }
              }
         }else{
             cc.sys.localStorage.setItem('todayHaveNum',dateStr + ";" + todayhave);
         }  //今日产出
         
         this.v_todayNum.string = todayhave.toString();
         this.v_willNum.string = (50000-todayhave).toString();
         this.surplusNum = 50000-todayhave;
 
         let yesterM = cc.sys.localStorage.getItem('yesterdayHaveNum');
         //console.log("yesterM==========="+yesterM);
         if(yesterM){
            let yesterMarr = yesterM.split(";");
            if(yesterMarr instanceof Array && yesterMarr.length>1){
                if(yesterMarr[0] == dateStr){
                    yesterdayhave = Number(yesterMarr[1]);
                    //console.log("yesterMarr======="+yesterMarr[1]);
                }else{
                 cc.sys.localStorage.setItem('yesterdayHaveNum',dateStr + ";" + yesterdayhave);
                }
            }
         }else{
             cc.sys.localStorage.setItem('yesterdayHaveNum',dateStr + ";" + yesterdayhave);
         }  //昨日产出
         this.yesterdayHaveNum = yesterdayhave;
 
         let haveGiveNum = yesterdayhave;
         //console.log("yesterdayhave======="+yesterdayhave);
         let gived = cc.sys.localStorage.getItem('allHaveGiveNum');
         if(gived){
               let giveArr = gived.split(";");
               if(giveArr instanceof Array && giveArr.length>1){
                   if(giveArr[0] == dateStr){
                       haveGiveNum = Number(giveArr[1]);
                      // console.log("giveArr[1]======"+giveArr[1]);
                   }else{
                     let centN = Number(giveArr[1]);
                     centN += yesterdayhave;
                     cc.sys.localStorage.setItem('allHaveGiveNum',dateStr + ";" + centN);
                   }
               }
         }else{
             cc.sys.localStorage.setItem('allHaveGiveNum',dateStr + ";" + haveGiveNum);
         }
         this.v_alltake.string = haveGiveNum.toString();
 
         this.showList();
     }

     showList():void{
        console.log("self.isHaveListsave ========"+this.isHaveListsave.toString());
        console.log("self.this.yesterdayHaveNum ========"+this.yesterdayHaveNum);
        // this.yesterdayHaveNum = 8;
        //cc.sys.localStorage.clear();
         if(this.yesterdayHaveNum>0){   
            let  yesterListdate = cc.sys.localStorage.getItem('yesterdayListdate');
            let date = new Date();
            let dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            //isHaveListsave
            if(yesterListdate && yesterListdate == dateStr){
               this.isHaveListsave = true;
            }
            this.listView.content.height = 1615;
            this.v_listScrollbg.active = true;
            this.v_listBg.active = false;
            let height =  this.yesterdayHaveNum*89;
            this.v_list = this.v_listScrollbg.getChildByName("v_list").getComponent(cc.ScrollView);
            this.v_list.content.height = height;
            this.showScrolllist(this.v_list.content);
            this.isoverCreate = true;
            
            
         }else{
             this.listView.content.height = 1140;
             this.v_listScrollbg.active = false;
             this.v_listBg.active = true;
         }
     }

     showScrolllist(parent:cc.Node):void{
        let prefab = null;
        let self = this;
        cc.loader.loadRes("alySDK/alyprofabs/profitItem",function(err,prefabb){
            console.log("profah=================");
            prefab = prefabb;
            let timearr = null;
            let nameArr = null;
            let iconNums = null;
            if(self.isHaveListsave){
                let listItem = JSON.parse(cc.sys.localStorage.getItem('yesterdayList'));
                timearr = listItem.yesterdayListTime;
                if(timearr.length == self.yesterdayHaveNum){
                    nameArr = listItem.yesterdayListName;
                    iconNums = listItem.yesterdayListIcon;
                }else{
                    self.isHaveListsave = false;
                    timearr = [];
                    for(let j=0;j<self.yesterdayHaveNum;j++){
                        let arr = [];
                        let hour = RedUtil.getRandomNum(0,23);
                        let min = RedUtil.getRandomNum(0,59);
                        let sec = RedUtil.getRandomNum(0,59);
                        arr.push(hour);
                        arr.push(min);
                        arr.push(sec);
                        timearr.push(arr);
                    }
                    self.sortTime(timearr);
                }
            }else{
                timearr = [];
                for(let j=0;j<self.yesterdayHaveNum;j++){
                    let arr = [];
                    let hour = RedUtil.getRandomNum(0,23);
                    let min = RedUtil.getRandomNum(0,59);
                    let sec = RedUtil.getRandomNum(0,59);
                    arr.push(hour);
                    arr.push(min);
                    arr.push(sec);
                    timearr.push(arr);
                }
                self.sortTime(timearr);
            }
            if(!nameArr && !iconNums){
                nameArr = [];
                iconNums = [];
            }
            for(let i=0;i<self.yesterdayHaveNum;i++){
                let item = cc.instantiate(prefab);
                parent.addChild(item);
                item.setPosition(0,-89*i);
                let randName = "";
                let index = RedUtil.getRandomNum(0,30);
                if(self.isHaveListsave){
                    randName = nameArr[i];
                    self.itemListName.push(randName);
                    let indd = self.itemList.indexOf(index);
                    if(indd == -1){
                        self.itemList.push(index);
                    }             
                }
                else{
                    let indd = self.itemList.indexOf(index);
                    if(indd>-1){
                        randName = self.itemListName[indd];
                    }else{
                        randName = self.getRandomName();
                        self.itemListName.push(randName);
                        self.itemList.push(index);
                    }
                    nameArr.push(randName);
                }
                let timeM = timearr[i];
                let randtime = self.getRandomTime(timeM[0],timeM[1],timeM[2]);
                let iconNum = 0;
                if(self.isHaveListsave){
                    iconNum = iconNums[i];
                }else{
                    let rand = RedUtil.getRandomNum(1,3);
                    if(rand != 1){
                        iconNum = RedUtil.getRandomNum(0,RedUtil.headIcons.length-1);
                    }
                    iconNums.push(iconNum);
                }
                let iconskin = RedUtil.headIcons[iconNum];
                let vHeadicon = item.getChildByName("vHeadicon").getComponent(cc.Sprite);
                let userName = item.getChildByName("userName").getComponent(cc.Label);
                let vTime = item.getChildByName("vTime").getComponent(cc.Label);
                cc.loader.loadRes(iconskin,cc.SpriteFrame,function(err,spriteframe){
                    vHeadicon.spriteFrame = spriteframe;
                })
                userName.string = randName;
                vTime.string = randtime;
            }
            if(!self.isHaveListsave){
                let date = new Date();
                let datestr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                cc.sys.localStorage.setItem('yesterdayListdate',datestr);
                let listarr = {yesterdayListTime:timearr,yesterdayListName:nameArr,yesterdayListIcon:iconNums};
                cc.sys.localStorage.setItem('yesterdayList',JSON.stringify(listarr));
            }
        });
        console.log("prefabb==========="+prefab);
        

     }


      myRedStarClick():void{
        RedUtil._RedquestState = 1;
        RedUtil.openQuestRedPack("","2",false,null,0);
    }

     private getRandomName():string{
        let ranIndex = RedUtil.getRandomNum(1,2);
        let strName = "";
        let randName = RedUtil.randomName;
        if(ranIndex == 2){
         randName = RedUtil.randomName2;
        }
        if(randName){
          let firstArr = randName[0];
          let secondArr = randName[1];
          let ranNum1 = RedUtil.getRandomNum(1,2);
         // console.log("ranNum1============"+ranNum1);
          if(ranNum1>0){
              for(let i=0;i<ranNum1;i++){
                  let rand = RedUtil.getRandomNum(0,firstArr.length-1);
                  if(firstArr[rand]){
                      strName += firstArr[rand];
                  }
              }
          }else{
             let rand = RedUtil.getRandomNum(0,firstArr.length-1);
             if(firstArr[rand]){
                 strName += firstArr[rand];
             }
          }
 
          let ranNum2 = RedUtil.getRandomNum(1,2);
          //console.log("ranNum2============"+ranNum2);
          if(ranNum2>0){
              for(let i=0;i<ranNum2;i++){
                  let rand = RedUtil.getRandomNum(0,secondArr.length-1);
                  if(secondArr[rand]){
                      strName += secondArr[rand];
                  }
              }
          }else{
             let rand = RedUtil.getRandomNum(0,secondArr.length-1);
             if(secondArr[rand]){
                 strName += secondArr[rand];
             }
          }
        }
       // console.log("strName======"+strName);
        return strName;
 
     }

     sortTime(arry:Array<any>){
        if(arry instanceof Array){
            let falag = false;
            for(let i=0;i<arry.length-1;i++){    
                    falag = falag;              
                    for(let j=arry.length-1;j>i;j--){
                      let currt = arry[j-1];
                      let next = arry[j];
                      if(currt instanceof Array && currt.length>2){                       
                          if(currt[0]<next[0]){
                              let temp = arry[j-1];
                              arry[j-1] = arry[j];
                              arry[j] = temp;
                              falag = true;
                          }else if(currt[0] == next[0]){
                              if(currt[1]<next[1]){
                                  let temp = arry[j-1];
                                  arry[j-1] = arry[j];
                                  arry[j] = temp;
                                  falag = true;
                              }else if(currt[1] == next[1]){
                                  if(currt[2] < next[2]){
                                      let temp = arry[j-1];
                                      arry[j-1] = arry[j];
                                      arry[j] = temp;
                                      falag = true;
                                  }
                              }
                          }
                      }
                    }               
            }
        }
      }
    
    
    getRandomTime(hour:number,min:number,sec:number):string{
        let timeStr1 = hour>9?hour.toString():"0"+hour.toString();
        let timeStr2 = min>9?min.toString():"0"+min.toString();
        let timeStr3 = sec>9?sec.toString():"0"+sec.toString();
        return timeStr1 + ":" + timeStr2 + ":" + timeStr3;
    }


    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
                if(this._callBack && this._callBack.nextOpened){
                    RedUtil.callBackRun(this.node,this._callBack.nextOpened);
                } 
            }
            if(parmp.propTitle&&parmp.propTitle!=""){
                this.v_propTitle = parmp.propTitle;

            }
            if(parmp.propIcon&&parmp.propIcon!=""){
                this.v_propIcon = parmp.propIcon;
            }
            
        }
     }

     openTurnPage():void{
        let parmp = {
            callBack:this._callBack,
            propTitle:this.v_propTitle,
            propIcon:this.v_propIcon,
            starNum:this.surplusNum
        }
        cc.loader.loadRes("alySDK/alyprofabs/turnPage",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){       
                 let parentNode = cc.director.getScene();   
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 RedUtil._turnPage = newNode;
                 
                 if(parmp){
                     let cla = newNode.getComponent(turnPage);
                     cla.getParams(parmp);
                 }
            }       
     
         })
    }

    openintrducePage():void{
        let parentNode = cc.director.getScene();
        cc.loader.loadRes("alySDK/alyprofabs/intrducePage",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){                
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);                
            }       
     
         })
    }

    openintrducePage2():void{
        let parentNode = cc.director.getScene();
        let parmp = {
            title:"广告收益说明",
            content:"广告收益是指该款游戏通过应用内广告\n及其它商业化方式获得的收益，全现金公\n开透明，大家共同监督。",
        };
        cc.loader.loadRes("alySDK/alyprofabs/intrducePage",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){                
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 if(parmp){
                     let cla = newNode.getComponent(intrducePage);
                     cla.getParams(parmp);
                 }
            }       
     
         })
    }

    openMyStarPage(todaymoney:number,totalmoney:number):void{
        console.log("openMyStarPage--------");
        let parentNode = cc.director.getScene();
        let xianshinum = 0;
        let longnum = 0;
        let date = new Date();
        let dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        let todayStar = cc.sys.localStorage.getItem('todayRedNum');
        if(todayStar){
            let todayArr = todayStar.split(";");
            if(todayArr instanceof Array && todayArr.length>1){
               if(todayArr[0] == dateStr){
                  xianshinum = Number(todayArr[1]);
               }
            }
        }
        let parmp = {
            propTitle:this.v_propTitle,
            propIcon:this.v_propIcon,
            xianshi:xianshinum,
            today:todaymoney,
            allNum:totalmoney,
            longNum:0,
            starNum:this.surplusNum,
            callBack:this._callBack
        };
        cc.loader.loadRes("alySDK/alyprofabs/myRedStarPgae",function(err,prefab){
           let newNode = cc.instantiate(prefab);
            if(newNode){                
                parentNode.addChild(newNode);
                //newNode.setPosition(0,0);
                newNode.setPosition(parentNode.width/2,parentNode.height/2);
                if(parmp){
                    let cla = newNode.getComponent(myStarPage);
                    cla.getParams(parmp);
                }
           }       
    
        })
       }
     

}
