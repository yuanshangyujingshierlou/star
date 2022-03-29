package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/**
 * 回调Cocos
 */
public class JsbResponse {
    /**
     * 无参数
     * @param func
     */
    public static void resp(String func) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("window.killStar." + func + "()");
            }
        });
    }

    public static void resp1(String func, String respData) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("window.killStar." + func + "('" + respData + "')");
            }
        });
    }

    public static void resp1(String func, int respData) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("window.killStar." + func + "(" + respData + ")");
            }
        });
    }

    public static void respRvClose(String mRvType, boolean mRewardVerify) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("window.killStar.obtainRvCallback('" + mRvType + "','" + (mRewardVerify ? "1" : "0") + "')");
            }
        });
    }
}
