// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import tips from "./redPack/tipsShow";
import everyTask from "./task/everyTask";
import withdrawSuccess from "./task/withdrawSuccess";

let RedUtil = {
    _RedquestState:1,
    _currentMoney:0,
    redNect:false,
    _mainprofit:null,
    _turnPage:null,
    firstRedPage:null,
    withdrawPage:null,
    _everyTask:null,
    _withdrawBtn:null,
    _everyRed:null,
    _RedStarBtn:null,
    _everyWithdrawBtn:null,
    _videoWithdrawBtn:null,
    _redRainBtn:null,
    _loginSignBtn:null,
    _videoRedPack:null,
    _litterRedPro:null,
    _litterRedPool:[],
    _currRedNum:0,
    _everyRedTime:0,
    _activeName:"",
    _awardMoney:0,
    _videoSignNum:0,
    _isOpenSecondPage:false,
    _iseventDot:false,
    _isFirstwithdraw:false,
    _videoWithdrawMoney:-1,
    _renPackRainTime:0,
    _isredPackRainOpen:false,
    _signMoney:0,
    _signRedColdTime:-1,
    _LoginSignWin:null,
    _loginCurrNum:0,
    _setTimeLogin:5,
    _initFinsh:false,
    _currRedPackNum:0,
    _url:"https://ad-api.99aly.com/api/", //"https://ad-api.99aly.com/api/", //"http://192.168.50.117:8080/api/"
    eventDispatcher:new cc.EventTarget(),
    redPackType:{
        newPlayer:'1',
        turnPage:'2',
        passOver:'3',
        wuChutype:'4',
        InGame:'5'
    },
    callBackName :{
        onOpened: 'onOpened',
        onClosed: 'onClosed',
        luckyComplete: 'luckyComplete',
        nextOpened:'nextOpened',
        nextClose:'nextClose',
        allClose:'allClose',
        redpackVideoClose:'redpackVideoClose'
    },
    headIcons:["alySDK/alyUI/xin-6","alySDK/alyUI/xin-7","alySDK/alyUI/xin-8","alySDK/alyUI/xin-9"],
    randomName: [["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","uv","use"],["1314","520","618","11","81","101","33","55","1","2","77","00","9"]],
    randomName2: [["蝎","子","sun","花","开下","relly","emm","m","天","得","灵","la","$"],["...","?",",,","%","uu","。","、","-",";;"]],
    showData: [
        {title:"0.01元快速提现说明",content:"余额达到0.01元后方可享受提现"},
        {title:"0.03元快速提现说明",content:"1.连续签到2天，可获得提现机会\n2.今日还未签到，已连续签到0天。"},
        {title:"2元提现规则",content:"需要得到一颗永久分红星后，可享受2元提现"},
        ],
    _gameInfo:[],
    WIDTH:720,
    HEIGHT:1280,
    setScale(node):void{
       
       let designSize = cc.view.getFrameSize();
       let deviceHeight = designSize.height
       let deviceWidth = designSize.width
       let fullHeight = deviceHeight/deviceWidth * RedUtil.WIDTH;
       let fullWidth = RedUtil.WIDTH;

    //    node.width = fullWidth;
    //    node.height = fullHeight;

       let scaln = fullWidth/node.width;
       node.scaleX = scaln;
       node.scaleY = scaln;
       node.height = fullHeight/scaln;
       node.setPosition(fullWidth/2,fullHeight/2);

    },
    opeTips(tipstr:string):void{
        cc.loader.loadRes("alySDK/alyprofabs/tips",function(err,prefab){
            let newNode = cc.instantiate(prefab);
            if(newNode){
              //console.log("inssssssssssssssss");
              let parentNode = cc.director.getScene();
              newNode.setPosition(360,795);
              parentNode.addChild(newNode);
              if(tipstr){
                  let cla = newNode.getComponent(tips);
                  cla.getParams(tipstr);
              }
           }       
     
         })
    },
    openWithdrawSuccess(money):void{
        let parmp = {
            Money:money
        }
        RedUtil.LoadResource("alySDK/alyprofabs/withdrawSuccess",function(err,prefab){
            let newNode = cc.instantiate(prefab);
            if(newNode){
              console.log("openWithdrawSuccess");
              let parentNode = cc.director.getScene();
              parentNode.addChild(newNode);
              if(parmp){
                  let cla = newNode.getComponent(withdrawSuccess);
                  cla.getParams(parmp);
              }
           }       
     
         })
    },
    setAction(node,isOpen,fun){
        if(isOpen){
            cc.tween(node)
            .to(0,{scaleX:0,scaleY:0})
            .to(0.2,{scaleX:1.2,scaleY:1.2})
            .to(0.1,{scaleX:1,scaleY:1})
            .start();
        }else{
            cc.tween(node)
            .to(0.1,{scaleX:1.2,scaleY:1.2})
            .to(0.2,{scaleX:0,scaleY:0})
            .call(()=>{
                fun();
            })
            .start();
        }
        
    },
    getGameInfo():any{
        //let tmp = JSON.parse(JSON.stringify(this._gameInfo));
        let res = [];
        for (let i: number = 0; i < RedUtil._gameInfo.length; i++) {
             res.push(RedUtil._gameInfo[i]);
        }
        return res;
    },
    getGameIds():any{
        let vdata = null;
        if(cc.sys.platform ==  cc.sys.WECHAT_GAME){
            let qq = window["qq"];
            if(qq.aly){
                if (qq.hasOwnProperty('aly'))
                {
                    vdata = qq.aly.getRandomUserID();
                }
            }
        }    
        else{
            vdata = {"UserId":"1110584566","OpenId":"C4534005FB5B97DACA82B5601A063E8F"};
        }
        return vdata;
    },
    LoadResource(downUrl,succFuc):void{
        cc.loader.loadRes(downUrl,succFuc);
    },
    LoadSpritRes(downUrl,succFuc){
        cc.loader.loadRes(downUrl,cc.SpriteFrame,succFuc);
    },
    eventgetAward(index:number):void{
        RedUtil.eventDispatcher.emit(RedUtil.callBackName.luckyComplete,index);
    },
    callBackRun(node,functionC){
        if(node && functionC){
            //console.log("node======="+node.name);
            let cf = cc.callFunc(functionC,node);
            node.runAction(cf);
        }
        
    },
    getRandomNum(n:number,m:number):number{
        let num1 = Math.random()*(m-n+1);
        let num2 = Math.floor(num1);
        return num2+n;
    },
 
    getRandomNumfloat(n:number,m:number,count:number):number{
         let num1 = Math.random()*(m-n+1);
         let num2 = num1.toFixed(count);
         return Number(num2)+n;
    },
    getSecondString(alltime:number):string{
        let str = "";
        let sec = Math.floor(alltime/1000);
        let min = 0;
        let hour = 0;
        let hourM = 0;
        let minM = 0;
        if(sec>=60){
           min = Math.floor(sec/60);
           sec = sec%60;
        }
        if(min>=60){
            hour = Math.floor(min/60)
            hourM = min%60;
            if(hourM>0){
                min = Math.floor(hourM/60);
               
            }
        }
        if(hour>0){
            if(hour>9){
                str = hour.toString()+":";
            }else{
                str = "0"+hour.toString()+":";
            }
        }

        if(min>0){
            if(min>9){
                str = str + min.toString();
            }else{
                str = str +"0"+min.toString();
            }
        }else{
            str = str +"00";
        }

        if(sec>0){
            if(sec>9){
                str = str +":" + sec.toString();
            }else{
                str = str +":" +"0"+sec.toString();
            }
        }else{
            str = str +":00";
        }

        return str;
    },

    openQuestRedPack(activeName:string,redpackType:string,isOpenSecondPage:boolean,callback:any,openEventPotnum:number):void{    //红包请求
        return;
        let fiveminState = 0;
        if(redpackType == RedUtil.redPackType.turnPage){
            if(RedUtil._everyRedTime>0){
                fiveminState = 1;
            }
        }
    
        let vdata = RedUtil.getGameIds();
        //console.log("data================================="+vdata);

        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qqredpacket";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
            console.log("xmlhttp.err========="+xmlhttp.statusText);
        }
        xmlhttp.onload = () =>{
            console.log("xmlhttp.onload======="+xmlhttp.status);
        }
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                console.log("res=======1=========="+JSON.stringify(res));
                console.log("typeOf====2============="+typeof(res));
                if(res.code == 0)
                {
                    if(res.redpacktype==RedUtil.redPackType.turnPage){
                        RedUtil.eventDispatcher.emit("redPackQuestStar",res);
                    
                    }else{
                        let Message = {
                           callBack:callback,
                           redpackType:redpackType
                        }
                        RedUtil.eventDispatcher.emit("redpackQuestfinsh",res,Message,isOpenSecondPage,openEventPotnum);
                    }                           
                }
            }
        }

        let data = JSON.stringify({
        "openId": vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803",
        "gameId": vdata.UserId,//"1109169237",// Gamefig.appID,
        "activeName ": activeName,
        "redpackType": redpackType,
        "FiveMinState": fiveminState   //0 没有倒计时  1有倒计时在走
        });

        console.log("data==========="+data);

        xmlhttp.send(data);
                
                
     
        

    },

    requestReduceRedPack(money:number):void{
        let vdata = RedUtil.getGameIds();
        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"reduceredpacket";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
        }
        xmlhttp.onload = () =>{
        }

        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                if(res.code == 0)
                    {
                        if(res.total_money){
                            cc.sys.localStorage.setItem('MoneyNum',res.total_money.toString());
                            RedUtil.eventDispatcher.emit("changeWithdrawBtnMoney",res.total_money/100);   
                        }          
                    }
            }
        }

        xmlhttp.send(JSON.stringify({
            "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
            "openid":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
            "totalMoney":money
        }));          
            

    },

    awardRedpack(money:number,mydata:any):void{  //提现
        RedUtil._awardMoney = money;
        let vdata = this.getGameIds();
        // console.log("data===========awardRedpack======================"+vdata);

        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qqred";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
        }
        xmlhttp.onload = () =>{
        }

        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                if(mydata && mydata.SuccessFuc){
                    mydata.SuccessFuc(res);
                }                
                
            }
        }

        xmlhttp.send(JSON.stringify({
            "qqAppid":vdata.UserId,//"1109169237",  vdata.UserId,
            "re_Openid":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
            "Total_amount":money
        }));     
        //xhr.once(Laya.Event.COMPLETE, this, mydata.callBack);           
        
    },
    awardMoney(money:number,mydata:any):void{ 

        RedUtil._awardMoney = money;
        let vdata = this.getGameIds();
        // console.log("data===========awardRedpack======================"+vdata);

        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qqmedalred";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
        }
        xmlhttp.onload = () =>{
        }

        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                if(mydata && mydata.SuccessFuc){
                    mydata.SuccessFuc(res);
                }
                
                //console.log("withdrawfinsh==============");
                if(RedUtil.withdrawPage){
                    RedUtil.eventDispatcher.emit("withdrawfinsh",res);     
                }                           
                
            }
        }

        xmlhttp.send(JSON.stringify({
            "qqAppid":vdata.UserId,//"1109169237",  vdata.UserId,
            "re_Openid":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
            "Total_amount":money
        }));     
        //xhr.once(Laya.Event.COMPLETE, this, mydata.callBack);           
        
    },
    everyRedTimeOver(money:number):void{   //分红倒计时结束添加余额
        let vdata = RedUtil.getGameIds();

        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qqminredpacket";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
        }
        xmlhttp.onload = () =>{

        }

        xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            if(res.code == 0)
                {
                    if(res.total_money){
                        cc.sys.localStorage.setItem('MoneyNum',res.total_money.toString());
                        //changeWithdrawBtnMoney
                        RedUtil.eventDispatcher.emit("changeWithdrawBtnMoney",res.total_money/100);   
                        //this.changeWithdrawBtnMoney(res.total_money/100);
                    }          
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        "fiveMinMoney":money,
        "fiveMinState": 0
    }));          
               
       
   },

   requestMoney():void{
        let vdata = RedUtil.getGameIds();
        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qtotalmoney";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
        }
        xmlhttp.onload = () =>{
        }

        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                if(res.code == 0)
                    {
                    if(res.total_money){
                        cc.sys.localStorage.setItem('MoneyNum',res.total_money.toString());
                        RedUtil.eventDispatcher.emit("changeWithdrawBtnMoney",res.total_money/100);   
                    }          
                    }
            }
        }

        xmlhttp.send(JSON.stringify({
            "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
            "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        }));          
            

  },

  requestCount(callBack:any):void{
        let vdata = RedUtil.getGameIds();
        let xmlhttp = new XMLHttpRequest();
        let url = RedUtil._url+"qcountcashout";
        xmlhttp.setRequestHeader('content-type', 'application/json');
        xmlhttp.open("POST",url,true);
        xmlhttp.onerror =() =>{
            console.log("requestCounterr========="+xmlhttp.statusText);
        }
        xmlhttp.onload = () =>{
            console.log("requestCount======="+xmlhttp.status);
        }

        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
                let res = JSON.parse(xmlhttp.responseText);
                console.log("res======requestCount=========="+JSON.stringify(res));
                if(res.code == 0)
                    {
                        if(res.cash_out != undefined){
                            RedUtil.eventDispatcher.emit("openWithdrawPage",res.cash_out,callBack);   
                        }          
                    }
            }
        }

        xmlhttp.send(JSON.stringify({
            "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
            "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        }));          
                
  },
  requestCountData(myData:any):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"qcountcashout";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestCountData=err========"+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestCountData======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestCountData=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    if(res.cash_out != undefined){
                        if(myData && myData.SuccessFuc){
                            myData.SuccessFuc(res.cash_out);
                        }                       
                    }          
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    }));          
            
},
  taskrequestCount(mydata:any):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"qcountcashout";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestCounterr========="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestCount======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestCount=========="+JSON.stringify(res));
            if(res.code == 0)
                {   
                    mydata.SuccessFuc(res.cash_out);       
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    }));          
            
},
  requestInitTask():void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"inittask";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestInitTask=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestInitTask======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestCount=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    console.log("初始化任务成功");
                    RedUtil._initFinsh = true;
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    }));
  },
  requestEveryTask(callBack:any):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"taskmedal";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestEveryTask=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestEveryTask======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestCount=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    RedUtil.eventDispatcher.emit("openEveryTask",callBack,res);
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    })); 
  },


  changeEveryTaskMessage(taskId:number,count:number):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"taskadd";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("changeEveryTaskMessage=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("changeEveryTaskMessage======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======changeEveryTaskMessage=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    console.log("changeEveryTaskMessage==success");              
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        "taskId":taskId,
        "addNum":count
    })); 
  },

  requestVideoRedCount():void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"taskprogress";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        // console.log("requestVideoRedCount=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        // console.log("requestVideoRedCount======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestVideoRedCount=========="+JSON.stringify(res));
            if(res.code == 0 && RedUtil._videoWithdrawBtn)
                {
                   RedUtil._videoWithdrawBtn.getComponent("videoWithdrawBtn").openVideoRedPack(res);
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        "taskId": 10000
    })); 
  },
//视频提现
  requestVideoRedWithdraw():void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"qqvideocashout";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestVideoRedCount=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestVideoRedCount======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            console.log("xmlhttp.responseText======requestVideoRedCount=========="+xmlhttp.responseText);
            console.log("xmlhttp.responseText======typeof=========="+typeof(xmlhttp.responseText));
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestVideoRedCount=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                   RedUtil._videoWithdrawMoney = res.money
                //    RedUtil.openWithdrawSuccess(res.money/100);
                //    if(RedUtil._videoRedPack){
                //     RedUtil._videoRedPack.getComponent("videoRedPack").withdrawFinsh();
                //    }
                   
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "qqAppid":vdata.UserId,//"1109169237",  vdata.UserId,
        "re_Openid":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    })); 
  },

  getAwardTask(taskId:number,count:number):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"getmedal";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("getAwardTask=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("getAwardTask======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======getAwardTask=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    if(RedUtil._everyTask){
                        RedUtil._everyTask.getComponent(everyTask).changeOneItem(taskId);
                    }              
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        "taskId":taskId,
        "state":2
    })); 
  },

  requestRedRainCount():void{
    console.log("requestRedRainCount============");
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"taskprogress";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestRedRainCount=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestRedRainCount======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestRedRainCount=========="+JSON.stringify(res));
            if(res.code == 0 && RedUtil._redRainBtn)
                {
                   RedUtil._redRainBtn.getComponent("redRainBtn").setMessage(res);
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "gameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "openId":vdata.OpenId,//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
        "taskId": 10001
    })); 
  },
  //签到请求
  requestLoginSignCount(mydata:any):void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"signinnum";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestLoginSignCount=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestLoginSignCount======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestLoginSignCount=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                    if(mydata && mydata.SuccessFuc){
                        mydata.SuccessFuc(res);
                    }                    
                   
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "GameId":vdata.UserId,//"1109169237",  vdata.UserId,
        "OpenId":vdata.OpenId//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    })); 
  },
  //签到提现
  requestLoginSignWithdraw():void{
    let vdata = RedUtil.getGameIds();
    let xmlhttp = new XMLHttpRequest();
    let url = RedUtil._url+"qqsignintoday";
    xmlhttp.setRequestHeader('content-type', 'application/json');
    xmlhttp.open("POST",url,true);
    xmlhttp.onerror =() =>{
        console.log("requestLoginSignWithdraw=====err===="+xmlhttp.statusText);
    }
    xmlhttp.onload = () =>{
        console.log("requestLoginSignWithdraw======="+xmlhttp.status);
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && (xmlhttp.status >= 200 && xmlhttp.status < 400)){
            console.log("init=requestLoginSignWithdraw=========="+xmlhttp.responseText);
            let res = JSON.parse(xmlhttp.responseText);
            console.log("res======requestLoginSignWithdraw=========="+JSON.stringify(res));
            if(res.code == 0)
                {
                   RedUtil._signMoney = res.money;
                   if(RedUtil._LoginSignWin){
                      RedUtil._LoginSignWin.getComponent("loginSignWin").withdrawSucc();
                   }                   
                }
        }
    }

    xmlhttp.send(JSON.stringify({
        "qqAppid":vdata.UserId,//"1109169237",  vdata.UserId,
        "re_Openid":vdata.OpenId//"3A80DA7B66A95F0791260A99DEC12803", // this._openId
    })); 
  },

  getIsInitOpen(){
    if(RedUtil._LoginSignWin){
        return false;
    }
    if(RedUtil.firstRedPage){
        return false;
    }
    return true;
  },

  extportData(logId:number,logDitl:number):void{
    if(cc.sys.platform ==  cc.sys.WECHAT_GAME){
        let qq = window["qq"];
        if(qq.aly){
            if (qq.hasOwnProperty('aly'))
            {
                qq.aly.eventDot(logId.toString(),logDitl.toString());
            }
        }
    }  
    
   }


}

// export{RedUtil}