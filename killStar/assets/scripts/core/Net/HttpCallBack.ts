import SendDataHttp from "./SendDataHttp";
import FunUtils from "../Util/FunUtils";
import GameDataManager from "../Manager/GameDataManager";
import PlatformManger from "../platform/PlatformManger";
import Const from "../../game/Const";
import MainSceneManager from "../../game/scenes/MainSceneManager";
import ViewManager from "../Manager/ViewManager";
import FightConst from "../../game/fight/FightConst";
import FightManger from "../../game/fight/FightManger";
import DebugHT from "../../game/DebugHT";


export default class HttpCallBack{
    private static instance: HttpCallBack;
    public static getInstance(): HttpCallBack
    {
        if(this.instance == null)
        {
            this.instance = new HttpCallBack();
        }
        return this.instance;
    }
    getGameQQConfig(callBack?:any){
        SendDataHttp.getInstance().getGameQQConfig({
            success:function(responseText){
                let responseData = JSON.parse(responseText)
                let data = responseData[DebugHT.USE_VERSION_QQ];
                console.log("====data===",data)
                if(data.isOpenTouch){
                    GameDataManager.getInstance().kaiGuan.isOpenTouch = data.isOpenTouch > 0;
                }
                if(data.isOpenRedPackage){
                    GameDataManager.getInstance().kaiGuan.isOpenRedPackage = data.isOpenRedPackage > 0;
                }
                FightConst.VideoPropNum = data.videoPropNum;//视频道具数
                GameDataManager.getInstance().kaiGuan.bannerRefreshTime = data.bannerRefreshTime;
                if(callBack){
                    callBack();
                }
            }.bind(this),
            fail:function(str){
                
            }.bind(this),
        })
    }   
}