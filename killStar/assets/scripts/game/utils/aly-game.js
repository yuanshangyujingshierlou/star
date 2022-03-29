if (cc.sys.platform == cc.sys.WECHAT_GAME) {
  (function () {
    var gameInfo = require('./aly-game-conf');
    var urlwx = 'https://aly-wx-sdk.99aly.com';
    var isNewToday = false;
    var isNew = false;
    var firstLoginTime = qq.getStorageSync('Aly_' + gameInfo.appID + 'firstLoginTime');
    var launchInfo = qq.getLaunchOptionsSync();
    var from = '其他渠道';
    var loginDays = 1;
    var userID = "";
    var noExitPoitIds = [];
    var version = "1.0.2";
    qq.aly = new Aly();
  
    function Aly() {
      //this.userID = getRandomUserID();
      
      this.appID = gameInfo.appID;
      this.aUnID = gameInfo.aUnID;
  
      switch (launchInfo.scene) {
        case 1095: {
          from = 'mp进入';
          break;
        }
        case 1037: {
          from = '其他小程序跳转进入';
          break;
        }
      }
  
      console.log("utils--version============"+version);
  
      // // 统计
      this.eventDot = function (logType, logDetail) {
        console.log(logType, logDetail);
        if(userID != ""){
           qq.request({
            url: urlwx + '/log/otherLog',
            data: JSON.stringify({
              'openId': userID,
              'gameId': gameInfo.appID,
              'logType': String(logType),
              'logDetail': String(logDetail || 1),
            }),
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: (res) => {
              console.log("logType========"+logType+"-----"+logDetail);
              console.log(res.data);
            }
          });
        }else{
          noExitPoitIds.push(logType);
          // var beforloginMessage = qq.getStorageSync('alySDkloginMessage');
          // if(beforloginMessage){
          //   var message = JSON.parse(beforloginMessage);
          //   var eventDotArr = message.eventDotArr;
          //   var str = logType + "%"+ getDateString();
          //   eventDotArr.push(str);
          //   message.eventDotArr = eventDotArr;
          //   qq.setStorageSync('alySDkloginMessage',JSON.stringify(message));
          // }else{
          //    var eventDotArr = [];
          //    var str = logType + "%"+ getDateString();
          //    eventDotArr.push(str);
          //    var message = {eventDotArr:eventDotArr};
          //    qq.setStorageSync('alySDkloginMessage',JSON.stringify(message));
          // }
        }
        
      }
  
      var d = getDateString();
      if(!firstLoginTime){
         isNew = true;
         firstLoginTime = d;
         wx.setStorageSync('Aly_' + gameInfo.appID + 'firstLoginTime', firstLoginTime);
      }
  
  
      var wxLogin = function(id){
          var datastr = JSON.stringify({
              openId: id,
              unionId: id,
              gameId: gameInfo.appID,
              sourceType: String(launchInfo.scene),
              sourceGameId: launchInfo.referrerInfo ? (launchInfo.referrerInfo.appId || '') : '',
              query: (function (queryInfo) {
                if (Object.keys(queryInfo).length !== 0) {
                  var arrPre = [];
                  var arrPost = [];
                  for (var key in queryInfo) {
                    arrPre.push(key);
                    arrPost.push(queryInfo[key]);
                  }
                  return dataConcat(arrPre, arrPost);
                } else {
                  return '';
                }
              })(launchInfo.query),
              isNew: isNew ? '1' : '0'
          });
          console.log("datastr==========="+datastr);
          qq.request({
              url: urlwx + '/log/shareSourceLog',
              data: datastr,
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: (res) => {
                console.log('统计登录日志发送成功', res.data);
                deilSaveEvent();
              }
            });
      }
      var eventDot = this.eventDot;
  
      var deilSaveEvent = function(){      
            console.log("deilSaveEvent==========="+noExitPoitIds.length);
            if(noExitPoitIds.length<=0){
              return;
            }
            var count = noExitPoitIds.length -1;
            while(count>-1){
                 var str = noExitPoitIds[count];
                 eventDot(str,"SDK保存在本地的打点");
                 noExitPoitIds.pop();
                 count -=1;
            }
      }
  
      // eventDot("10000","8888");
      // eventDot("10001","8888");
      // eventDot("10002","8888");
  
      var loginf =function(){
        qq.login({
          success(res){
            if(res.code){
                   console.log("code=============="+res.code)
                   qq.request({
                      url:"https://ad-api.99aly.com/"+"api/qlogin",
                      data:JSON.stringify({                  
                        gameId: gameInfo.appID,
                        tempCode:res.code,
                      }),
                      header: {
                        'content-type': 'application/json'
                      },
                      method: 'POST',
                      success: (res) => {
                        console.log('登录日志发送成功===========', res);
                        if(res.data.code == 0){
                          userID = res.data.openId;
                          qq.setStorageSync('Aly_' + gameInfo.appID + 'userID', res.data.openId);
                          wxLogin(res.data.openId);
                           //console.log("this.userid=========="+userID);
                        }else
                        {
                          console.log("res.data.code===="+res.data.code);
                          //loginf();
                        }
                      },
                      fail:(res) =>{
                          console.log(res);
                      }
                      
                    })           
               
            }else{
               console.log("login failed"+ret.errMsg);
            }
          }
        });
        
      }
  
         var id = qq.getStorageSync('Aly_' + gameInfo.appID + 'userID');
         if(id){          
            qq.request({
              url:"https://ad-api.99aly.com/"+"api/qopenid",
              data:JSON.stringify({                  
                openId: id,
              }),
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: (res) => {
                if(res.data.code == 0){
                   console.log('校验发送成功===11111========', res);
                   console.log('校验发送成功==userID========', userID);
                   /////////////////////////////////////
                   userID = id;
                   wxLogin(id);
                     ////////////////////////////////////////////
                }else{
                  loginf();
                }
              }
            })
          }else
          {
            loginf();
          }
  
      //校验一下userId
      
  
      this.getRandomUserID = function () {
        //console.log("ccccccccccccc");
        var id = qq.getStorageSync('Aly_' + gameInfo.appID + 'userID');
        if (id) {
              var data = {"UserId":gameInfo.appID,"OpenId":id};
              //console.log("vdata---------------"+JSON.stringify(data));
              return data;
        } else {
            var data = {"UserId":gameInfo.appID,"OpenId":userID};
            //console.log("vdata---------------"+JSON.stringify(data));
            return data;
        }
        return null;
      }
  
      //var data = this.getRandomUserID();
      //console.log("vdata---------------"+JSON.stringify(data));
      
  
      
    }
  
    function dataConcat(arr1, arr2) {
      if (arr1.length === arr2.length) {
        var dataSend = '';
        for (var i = 0; i < arr1.length; i++) {
          if (i < arr1.length - 1) {
            var linkSymbol = '&';
          } else {
            var linkSymbol = '';
          }
          dataSend += (arr1[i] + '=' + String(arr2[i]) + linkSymbol);
        }
      } else {
        console.log('拼接失败，参数长度不一致。');
      }
      return dataSend;
    }
  
    function getDateString() {
      var nowDate = new Date();
      var year = String(nowDate.getFullYear());
      var month = String(nowDate.getMonth() + 1);
      var day = String(nowDate.getDate());
      month = month.length < 2 ? '0' + month : month;
      day = day.length < 2 ? '0' + day : day;
      return year + '-' + month + '-' + day;
    }
  
   
  })();
}