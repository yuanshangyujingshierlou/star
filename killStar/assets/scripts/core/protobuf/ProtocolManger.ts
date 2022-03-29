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
export default class ProtocolManger {
    static WebSocket = {
        // MSG_HEART_BEAT:"MSG_HEART_BEAT", //心跳
        // TCP_ONOPEN:"TCP_ONOPEN",//第一次长连接
        // HEART_BEAT:0,//心跳
        // ACCEPT_LOGIN:1,//登录
        // ADD_ROOM:2,//加入房间
        // TI_REN:3,//踢人
        // // SEE_ROOM:4,//看看
        // LOGIN_OUT:4,//离开别人家
        // Exit_OUT:6,//退出登录
    }
    static LocalPro = {
        BackFinish:"BackFinish",//返回完成
        // ModifyName:"ModifyName",//修改名字
        // AddFeed:"AddFeed",//添加饲料
        // AddEggExp:"AddEggExp",//加经验
    }
  
}
