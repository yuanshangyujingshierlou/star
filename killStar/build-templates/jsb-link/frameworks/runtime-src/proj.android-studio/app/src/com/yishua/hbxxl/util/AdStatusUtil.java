package com.yishua.hbxxl.util;

import android.util.Log;

import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.yishua.hbxxl.AdConstant;
import com.yishua.hbxxl.event.ExpressAdShowEvent;

import org.cocos2dx.javascript.JsbResponse;
import org.greenrobot.eventbus.EventBus;

public class AdStatusUtil {
    public static void onGdtExpressShow() {
        AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
        //
        expressAdShow();
    }

    public static void onGdtExpressClick() {
        AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
    }

    public static void onTTExpressShow() {
        AdActionUtil.upload(AdConstant.AD_TT_NATIVE_EXPRESS, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_NATIVE_EXPRESS);

        expressAdShow();
    }

    public static void onTTExpressClick() {
        AdActionUtil.upload(AdConstant.AD_TT_NATIVE_EXPRESS, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_NATIVE_EXPRESS);
    }

    public static void onTTRvClose(String mRvType, boolean mRewardVerify) {
        LogUtils.e("onTTRvClose --- mRvType = " + mRvType + "   mRewardVerify = " + mRewardVerify);

        if ("-1".equals(mRvType)) {
            // 本地请求的激励视频
        } else {
            JsbResponse.respRvClose(mRvType, mRewardVerify);
        }
    }

    public static void onGDTRvClose(String mRvType, boolean mRewardVerify) {
        if ("-1".equals(mRvType)) {
            // 本地请求的激励视频
        } else {
            JsbResponse.respRvClose(mRvType, mRewardVerify);
        }
    }

    public static void onGdtRvCloseError() {
        onGDTRvClose(rvType, false);
    }

    public static void onGdtRvClick() {
        AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
    }

    public static void onGdtRvShow() {
//        AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
        //  有两个回调，onShow 和 onExpose
    }

    public static void onGdtRvExpose() {
//        AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
        // 通过 onGdtReward 方法上报，需要记录播放次数
    }

    public static void onGdtRvComplete() {

    }

    public static void onTTRvShow() {
//        AdActionUtil.upload(AdConstant.AD_TT_VIDEO, true, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_VIDEO);
        // 通过onTTReward 方法上报，需要记录激励视频次数
    }

    public static void onTTRvClick() {
        AdActionUtil.upload(AdConstant.AD_TT_VIDEO, true, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_VIDEO);

    }

    public static void onTTRvComplete() {

    }

    /**
     * 模板广告展示 - 通知cocos调整弹窗位置
     */
    private static void expressAdShow() {
        EventBus.getDefault().post(new ExpressAdShowEvent());
    }

    /**
     * 广点通激励视频播放有效，在这个时候上报后台 -> 播放进度
     *
     * @param mRewardVerify
     */
    public static void onGdtReward(boolean mRewardVerify) {
        AdActionUtil.upload(AdConstant.AD_TT_VIDEO, true, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_VIDEO);
    }

    public static void onTTReward(boolean rewardVerify) {
        if (rewardVerify) {
            AdActionUtil.upload(AdConstant.AD_TT_VIDEO, true, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_TT_VIDEO);
        }
    }

    private static String rvType;

    public static void rvType(String type) {
        rvType = type;
    }
}