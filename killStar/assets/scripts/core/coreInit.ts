import { ConfigManager } from "./Manager/ConfigManager";
import GameDataManager from "./Manager/GameDataManager";
import AdaptarManager from "./Manager/AdaptarManager";
import AudioManager from "./Manager/AudioManager";
import DebugHT from "../game/DebugHT";
import PlatformManger from "./platform/PlatformManger";

export class coreInit {
    private static instance: coreInit;
    public static getInstance(): coreInit
    {
        if(this.instance == null)
        {
            this.instance = new coreInit();
        }
        return this.instance;
    }
    load(){
        //加载所有的data
        GameDataManager.getInstance().loadAllData()
        //初始化平台
        PlatformManger.getInstance().initPlatform()
        //屏幕适配初始化 (竖屏)
        AdaptarManager.getInstance().initVertical() 
        //初始化音乐
        AudioManager.getInstance().init()
        //加载所有的json
        // ConfigManager.getInstance().loadAllConfig(()=>{
            
        // })
        cc.debug.setDisplayStats(DebugHT.isDebug)
        if(DebugHT.isDebug){
            DebugHT.Test()
        }
    }
}
