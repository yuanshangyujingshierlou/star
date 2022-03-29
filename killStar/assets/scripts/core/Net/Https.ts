import FunUtils from "../Util/FunUtils";
import GameDataManager from "../Manager/GameDataManager";
import Md5Api from "../Util/Md5Api";
import MainSceneManager from "../../game/scenes/MainSceneManager";

export default class Https {
    private  retryCallBack = null;
    private static instance: Https;
    public static getInstance(): Https
    {
        if(this.instance == null)
        {
            this.instance = new Https();
        }
        return this.instance;
    }
    joinParams(dataInfo:any) {
        if (typeof dataInfo === 'object') {
            if (dataInfo === null) {
                return;
            } else if (Array.isArray(dataInfo)) {
                return JSON.stringify(dataInfo);
            } else {
                var keys = Object.keys(dataInfo);
                var params = keys.map((key, index) => {
                    return key + '=' + dataInfo[key] + (index === keys.length - 1 ? '': '&');
                });
                return params.join('');        
            }
        } else {
            return dataInfo + '';
        }
    }
    get(url:string,callback:any,dataInfo:any) {
        if (dataInfo) {
            var connecter = '?';
            if (url[url.length - 1] === '&') {
                connecter = '';
            } else if (url.indexOf('?') >0) {
                connecter = '&';
            }
            var params = this.joinParams(dataInfo);
            params.length > 0 && (url += connecter + params); 
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5 * 1000;
        xhr.ontimeout = () => {
            cc.log('[tydf.https] get: request time out.');
            FunUtils.showTip('连接超时,请检查网络!');
            callback && callback.fail && callback.fail("连接超时,请检查网络!");
        };
        xhr.onreadystatechange = () => {
            // if(xhr.status == 200){
                xhr.status == 200 && xhr.readyState === 4 && callback && callback.success && callback.success(xhr.responseText);
            // }else{
            //     FunUtils.showTip("连接异常：" + status)
            // }
        };
        console.log("==url=",url)
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");  
        xhr.send();
    }
    /**
     * 
     * @param url 
     * @param callback 
     * @param dataInfo 
     */
    post(url:string,callback:any,dataInfo:any) {
        console.log("post=="+url)
        console.log("post=dataInfo="+JSON.stringify(dataInfo))
        this.retryCallBack = null;
        this.retryCallBack = ()=>{
            this.post(url,callback,dataInfo)
        }
        let sign = null;
        if(GameDataManager.getInstance().userData.loginToken){
            let json = JSON.stringify(dataInfo)
            let token:string = GameDataManager.getInstance().userData.loginToken
            let liu = token.substring(0,6)
            let shi = token.substring(0,10)
            let add = liu + shi
            let md5_1 = Md5Api.getInstance().md5(add)
            let add_2 = md5_1;
            if(dataInfo){
                add_2 = json + md5_1;
            }
            sign = Md5Api.getInstance().md5(add_2)
        }else{
            let json = JSON.stringify(dataInfo)
            sign = Md5Api.getInstance().md5(json)
        }
        var xhr = cc.loader.getXMLHttpRequest();
        // xhr.timeout = 5 * 1000;
        // xhr.ontimeout = () => {
        //     console.log('htKN: request time out.');
        //     FunUtils.showTip('连接超时,请检查网络!');
        //     callback && callback.fail && callback.fail("连接超时,请检查网络!");
        //     FunUtils.httpDelay()
        // };
        var outTime = false;//是否超时
        var timer = setTimeout(function(){
            outTime = true;
            xhr.abort();//请求中止
            FunUtils.showTip('连接超时,请检查网络!');
            callback && callback.fail && callback.fail("连接超时,请检查网络!");
            FunUtils.httpDelay()
        },10*1000);
        xhr.timeout = 10 * 1000;
        xhr.onreadystatechange = () => {
            if(xhr.status == 200 &&  xhr.readyState === 4 ){
                let responseText = xhr.responseText;
                if(outTime) return;//请求已经超时，忽略中止请求
                clearTimeout(timer);//取消等待的超时
                callback && callback.success && callback.success(responseText); 
            }
        };
        xhr.open('POST', encodeURI(url), true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8"');
        // xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        if(GameDataManager.getInstance().userData.loginToken){
            xhr.setRequestHeader('Authorization', 'Bearer ' + GameDataManager.getInstance().userData.loginToken);
            xhr.setRequestHeader('sign',sign);
        }else{
            xhr.setRequestHeader('sign',sign);
        }
        xhr.send(JSON.stringify(dataInfo));
    }

    //重试
    onRetry(){
        if(this.retryCallBack){
            MainSceneManager.getInstance().MainScene.showLoading()
            this.retryCallBack();
        }
    }
}
