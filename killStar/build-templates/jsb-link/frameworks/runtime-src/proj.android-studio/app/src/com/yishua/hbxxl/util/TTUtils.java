package com.yishua.hbxxl.util;

import com.bytedance.sdk.openadsdk.TTAdConfig;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAdSdk;
import com.umeng.analytics.MobclickAgent;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.Util;

public class TTUtils {
    private static boolean isInited = false;

    public static void init() {
        String ttAppId = AdConfigUtil.getTTAppId();

        LogUtils.e("TT init appId = " + ttAppId);

        TTAdSdk.init(Util.getContext(), new TTAdConfig.Builder()
                .appId(ttAppId)
                .appName(Util.getContext().getResources().getString(R.string.app_name))
//                .useTextureView(false) //使用TextureView控件播放视频,默认为SurfaceView,当有SurfaceView冲突的场景，可以使用TextureView
//                .titleBarTheme(TTAdConstant.TITLE_BAR_THEME_DARK)
//                .allowShowNotify(true) //是否允许sdk展示通知栏提示
//                .allowShowPageWhenScreenLock(true) //是否在锁屏场景支持展示广告落地页
                .debug(!ConstantValue.isRelease) //测试阶段打开，可以通过日志排查问题，上线时去除该调用
                .directDownloadNetworkType(TTAdConstant.NETWORK_STATE_WIFI, TTAdConstant.NETWORK_STATE_3G) //允许直接下载的网络状态集合
//                .supportMultiProcess(false) //是否支持多进程，true支持
                .build());

        isInited = true;
    }

    public static TTAdNative getTTAdNative() {
        if (!isInited) {
            init();
        }

        TTAdNative ttAdNative = null;
        try {
            ttAdNative = TTAdSdk.getAdManager().createAdNative(Util.getContext());
        } catch (Exception e) {
            //
            LogUtils.e("TT Exception = " + e.getMessage());

            MobclickAgent.reportError(Util.getContext(), "CusException TT " + e.getLocalizedMessage());
        }

        return ttAdNative;
    }
}
