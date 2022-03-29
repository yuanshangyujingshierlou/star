import LoaderManager from "./LoaderManager";
import ConfigLevel from "../JsonConfig/ConfigLevel";


export  class ConfigManager{
    private static instance: ConfigManager;
    private curLoadedCount: number = 0;
    public static getInstance(): ConfigManager
    {
        if(this.instance == null)
        {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }
    sd_path:string = "json/"
    sd_path_level: string = "level";  //所有的icon

    config_level : ConfigLevel = null;
    
    callback:Function = null;

    public loadAllConfig(callback?: Function): void {
        this.callback = callback;
        let arrPath = [
            this.sd_path + this.sd_path_level,
            ]
        // cc.loader.loadResArray(arrPath, cc.JsonAsset, this.onLoaded.bind(this));
        LoaderManager.getInstance().loadResArr(arrPath,this.onLoaded.bind(this))
    }
    public onLoaded(assets:cc.JsonAsset[])
    {
        this.config_level = new ConfigLevel();
        for (let index = 0; index < assets.length; index++) {
            const json = assets[index];
            if(json.name == this.sd_path_level){
                this.config_level.load(json)
            }
        }
        if (this.callback) {
            this.callback();
        }
    }
}
