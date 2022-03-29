import GameDataManager from "../Manager/GameDataManager";
import AudioManager from "../Manager/AudioManager";

export default class UserLocalData {

    constructor() {
    }
    openid : string = "";
    musicVolume: number = 0.7;   
    soundVolume: number = 0.7;
    isMusicOn: boolean = true; //声音是否开启
    registeredTime:number = 0;//注册时间
    copy(data: UserLocalData){
        if (data.openid) {
            this.openid = data.openid;
        }
        if (data.musicVolume || data.musicVolume == 0 ) {
            this.musicVolume = data.musicVolume;
        }
        if (data.soundVolume|| data.soundVolume == 0) {
            this.soundVolume = data.soundVolume;
        }
        if(data.isMusicOn == false || data.isMusicOn ){
            this.isMusicOn = data.isMusicOn;
        }
        if (data.registeredTime) {
            this.registeredTime = data.registeredTime;
        }
    }
    setOpenId(openid : string) {
        if(!this.openid){
            this.openid = openid;
            GameDataManager.getInstance().saveUserLocalData();
        }
    }
    setMusicVolume(value:number){
        this.musicVolume = value;
        GameDataManager.getInstance().saveUserLocalData()
    }
    setSoundVolume(value:number){
        this.soundVolume = value;
        GameDataManager.getInstance().saveUserLocalData()
    }
    setMusicOn(_bool:boolean){
        if(!_bool){
            this.musicVolume = 0
            this.soundVolume = 0
        }else{
            this.musicVolume = 0.7
            this.soundVolume = 0.7
        }
        AudioManager.getInstance().setMusicVolume(this.musicVolume)
        AudioManager.getInstance().setSoundVolume(this.soundVolume)
        this.isMusicOn = _bool;
        GameDataManager.getInstance().saveUserLocalData()
    }
    setRegisteredTime(registeredTime : number) {
        if(!this.registeredTime){
            this.registeredTime = registeredTime;
            GameDataManager.getInstance().saveUserLocalData();
        }
    }
}
