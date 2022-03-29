package com.yishua.hbxxl;

public interface AdConstant {
    String EVENT_SHOW_AD = "show_ad";

    String EVENT_DISMISS_AD = "dismiss_ad";

    String AD_TYPE_EXPRESS_GDT = "1";
    String AD_TYPE_EXPRESS_TT = "2";

    String AD_TYPE_RV_GDT = "202";
    String AD_TYPE_RV_TT = "201";

    // 广告上报的 adType
    String AD_GDT_VIDEO = "gdtVideo";
    String AD_GDT_SPLASH = "gdtSplash";
    String AD_GDT_NATIVE_EXPRESS = "gdtExpress";

    String AD_TT_VIDEO = "ttVideo";
    String AD_TT_SPLASH = "ttSplash";
    String AD_TT_NATIVE = "ttNative";
    String AD_TT_NATIVE_EXPRESS = "ttExpress";

    int AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS = 1;
    int AD_CLIENT_CONFIG_ID_GDT_VIDEO = 202;

    int AD_CLIENT_CONFIG_ID_TT_NATIVE_EXPRESS = 2;
    int AD_CLIENT_CONFIG_ID_TT_VIDEO = 201;
}
