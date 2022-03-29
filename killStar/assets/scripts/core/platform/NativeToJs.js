import PlatformManger from "./PlatformManger"

//播放视频ok
cc.palyVideoOk = function(funName){
    console.log("===cc.palyVideoOk==",funName)
    setTimeout(function(){
        PlatformManger.getInstance().palyVideoOk(funName)
    },10)
}
cc.palyVideoError = function(funName){
    console.log("===cc.palyVideoError==",funName)
    setTimeout(function(){
        PlatformManger.getInstance().palyVideoError(funName)
    },10)
}
cc.resumeGame = function(){
    console.log("===cc.openAudio==")
    setTimeout(function(){
        cc.director.resume()
    },10)
}
cc.pauseGame = function(){
    console.log("===cc.closeAudio=")
    setTimeout(function(){
        cc.director.pause();
    },10)
}

cc.wxBindingOk = function(data){
    console.log("===cc.wxBindingOk==",data)
    setTimeout(function(){
        PlatformManger.getInstance().wxBindingOk(data)
    },10)
}
cc.wxBindingError = function(data){
    console.log("===cc.wxBindingError==",data)
    setTimeout(function(){
        PlatformManger.getInstance().wxBindingError(data)
    },10)
}

//返回键 监听
cc.onBackFinish = function(data){
    console.log("===cc.onBackFinish==",data)
    setTimeout(function(){
        PlatformManger.getInstance().onBackFinish(data)
    },10)
}
//设置回调
cc.onSetCallBack = function(data){
    console.log("===cc.onSetCallBack==",data)
    setTimeout(function(){
        PlatformManger.getInstance().onSetCallBack(data)
    },10)
}
//所有的页面回调
cc.allPageCallBack = function(data){
    console.log("===cc.allPageCallBack==",data)
    setTimeout(function(){
        PlatformManger.getInstance().allPageCallBack(data)
    },10)
}