import SendDataHttp from "../core/Net/SendDataHttp";
import Const from "./Const";
import GameDataManager from "../core/Manager/GameDataManager";

export default class DebugHT  {
    
    static USE_VERSION_QQ = "version2";//version2  version1
    static VERSION = "1.0.0";
    static Package = "com.htkj.find";
    public static isDebug : boolean = false;//true 测试模式 false 不是测试模式
    static Test(){
        SendDataHttp.getInstance().HttpUrl = Const.Url.HttpUrlTest;
        // GameDataManager.getInstance().userData.propBomb = 10;
        // GameDataManager.getInstance().userData.propHammer = 10;
        // GameDataManager.getInstance().userData.propRefrsh = 10;
        // GameDataManager.getInstance().userData.propIncolor= 10;
    }
}
