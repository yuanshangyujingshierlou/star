import Https from "./Https";
import Const from "../../game/Const";
import DebugHT from "../../game/DebugHT";
import GameDataManager from "../Manager/GameDataManager";
import FunUtils from "../Util/FunUtils";
import PlatformManger from "../platform/PlatformManger";

export default class SendDataHttp{
    private static instance: SendDataHttp;
    public static getInstance(): SendDataHttp
    {
        if(this.instance == null)
        {
            this.instance = new SendDataHttp();
        }
        return this.instance;
    }
    HttpUrl:string = Const.Url.HttpUrl; 
    getGameQQConfig(_callBack:any){
        var data = null;
        var url = Const.Url.QQConfigUrl;
        url = url + "?dt=" + new Date().getTime();
        Https.getInstance().get(url,_callBack,data);
    }
    /**
     * 
     * @param equipment 设备号
     * @param channel 客户来源
     * @param _callBack 
     */
    sendGetToken(equipment:any,packageName:any,channel:any,version:any,openid:any,nickname:any,headimgurl:any,unionid:any,city:any,_callBack:any){
        let url = this.HttpUrl + "getScoreToken"
        let data  = {
            equipment:equipment,
            package:packageName,
            channel:channel,
            version:version,
            openid:openid, 
            nickname: nickname,
            headimgurl: encodeURIComponent(headimgurl),
            unionid: unionid,
            city:city,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //获取用户信息
    sendGetInfo(city:any,channel:any,version:any,_callBack:any){
        let url = this.HttpUrl + "getScoreDetail?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            city:city,
            channel:channel,
            version:version,
        };
        Https.getInstance().post(url,_callBack,data);
    }

     //查询本关卡是否有红包
     sendIsHongBao(levle:number,_callBack:any){
        // happy_pre_pass
        let url = this.HttpUrl + "happy_new_pre?uid="+ GameDataManager.getInstance().userData.uid;
        let data  = {
            point:levle,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //领取红包
    sendGetMoney(levle:number,type:number,_callBack:any){
        let url = this.HttpUrl + "happyGrantBalance?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            point:levle,
            type:type,// 类型 1气泡红包 2过关红包 3 邀请红包 4 翻倍
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //获取提现列表
    sendGetDrawMoneyList(_callBack:any){
        let url = this.HttpUrl + "advanceRuleHappy?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null
        Https.getInstance().post(url,_callBack,data);
    }
    //绑定微信
    binDingWechat(openid:any,nickname:any,headimgurl:any,unionid:any,_callBack:any){
        let url = this.HttpUrl + "addWechat2?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            openid:openid, 
            nickname: nickname,
            headimgurl: encodeURIComponent(headimgurl),
            unionid: unionid,
        }
        Https.getInstance().post(url,_callBack,data);
    }
    //发送提现
    sendDrawMoney(exchange_id:number,_callBack:any){
        let url = this.HttpUrl + "advanceHappy?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            exchange_id:exchange_id,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //提现记录
    sendDrawMoneyRecordList(_callBack:any){
        let url = this.HttpUrl + "happyAdvanceList?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null
        Https.getInstance().post(url,_callBack,data);
    }
    /**
     * 过关
     * @param point 关卡
     * @param _callBack 
     */
    sendPassThrough(point:any,targetScore:any,targetAddScore:any,targetTableNum:any,targetLevel:any,nowScore:any,lastScore:any,_callBack:any){
        let url = this.HttpUrl + "happyPassThrough?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            point:point,
            targetScore:targetScore,
            targetAddScore:targetAddScore,
            targetTableNum:targetTableNum,
            targetLevel:targetLevel,
            nowScore:nowScore,
            lastScore:lastScore,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //添加道具
    sendAddProp(propType,level,_callBack:any){
        let url = this.HttpUrl + "addProp?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            prop_type:propType,
            point:level,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //使用道具  道具类型 1随机消除道具;2 换颜色道具,3刷新道具,4锤子道具;必填
    sendUseProp(propType,level,_callBack:any){
        let url = this.HttpUrl + "useProp?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            prop_type:propType,// 道具类型 
            point:level,// 
        };
        Https.getInstance().post(url,_callBack,data);
    }

    //填写邀请码
    sendAddInvite(invite_id:any,_callBack:any){
        let url = this.HttpUrl + "addInvite?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            invite_id:invite_id,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //邀请好友红包
    sendInviteRed(_callBack:any){
        let url = this.HttpUrl + "inviteRed?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null
        Https.getInstance().post(url,_callBack,data);
    }



    //绑定微信
    bindingWechat(list:any,_callBack:any){
        let url = this.HttpUrl + "addWechat?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            list:list,
        };
        Https.getInstance().post(url,_callBack,data);
    }
    //绑定微信
    bindingWechat2(openid:any,nickname:any,headimgurl:any,unionid:any,_callBack:any){
        let url = this.HttpUrl + "addWechat2?uid="+ GameDataManager.getInstance().userData.uid
        let data  = {
            openid:openid, 
            nickname: nickname, 
            headimgurl: encodeURIComponent(headimgurl),
            unionid: unionid
        }
        Https.getInstance().post(url,_callBack,data);
    }
    //领取红星 红包
    getGrantStar(_callBack:any){
        let url = this.HttpUrl + "grantStar?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data);
    }
    getMemberRedStar(_callBack:any){
        let url = this.HttpUrl + "simpleDetail?uid="+ GameDataManager.getInstance().userData.uid
        let data  = null;
        Https.getInstance().post(url,_callBack,data);
    }
    

    
    
}
