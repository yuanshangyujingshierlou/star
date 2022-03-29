// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MainScene from "./MainScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainSceneManager{

    private static instance: MainSceneManager = null;
    public static getInstance(): MainSceneManager {
		if (MainSceneManager.instance == null) {
			MainSceneManager.instance = new MainSceneManager();
		}
		return MainSceneManager.instance;
    }
    MainScene:MainScene = null;
    init(mainScene:MainScene){
        this.MainScene = mainScene;
    }
    
    // update (dt) {}
}
