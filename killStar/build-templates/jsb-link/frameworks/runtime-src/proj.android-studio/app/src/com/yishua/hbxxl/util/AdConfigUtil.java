package com.yishua.hbxxl.util;

import android.text.TextUtils;

import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.http.bean.ConfigAppIdSetBean;
import com.yishua.hbxxl.http.bean.ConfigCommonBean;
import com.yishua.hbxxl.http.bean.GdtExpressBean;

import java.util.List;

/**
 * Created by Junguo.L on 2020-01-13.
 * <p>
 * 广告的配置信息：appId，posId
 */
public class AdConfigUtil {
    public static String getTTAppId() {
        String appid = "";
        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();

            List<ConfigCommonBean> tt = appIdSet.tt;

            if (null != tt && tt.size() > 0) {

                double random = Math.random();
                double maxRate = 0;

                for (int i = 0; i < tt.size(); i++) {

                    ConfigCommonBean configTTAdBean = tt.get(i);
                    if (configTTAdBean != null) {
                        double rate = configTTAdBean.rate;
                        maxRate += rate;
                        if (random < maxRate) {
                            appid = configTTAdBean.appid;
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            //
        }

        LogUtils.e("TT App Id = " + appid);

        return TextUtils.isEmpty(appid) ? ConstantValue.TT_APP_ID : appid;
    }

    public static String getTTNativePosId() {
        String ttFeedPosId = "";
        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();
            List<ConfigCommonBean> tt = appIdSet.tt;

            if (tt != null && tt.size() > 0) {
                double random = Math.random();
                double maxRate = 0;

                for (int i = 0; i < tt.size(); i++) {

                    ConfigCommonBean configTTAdBean = tt.get(i);
                    if (configTTAdBean != null) {
                        double rate = configTTAdBean.rate;
                        maxRate += rate;
                        if (random < maxRate) {
                            ttFeedPosId = configTTAdBean.posid;
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            //
        }
        LogUtils.e("TT Native PosId = " + ttFeedPosId);

        return TextUtils.isEmpty(ttFeedPosId) ? ConstantValue.TT_POS_ID_NATIVE : ttFeedPosId;
    }

    public static String getTTVideoPosId() {
        String ttVideoId = "";
        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();
            List<ConfigCommonBean> ttvideo = appIdSet.ttvideo;

            if (ttvideo != null && ttvideo.size() > 0) {
                double random = Math.random();
                double maxRate = 0;

                for (int i = 0; i < ttvideo.size(); i++) {

                    ConfigCommonBean configTTVideoAdBean = ttvideo.get(i);
                    if (configTTVideoAdBean != null) {
                        double rate = configTTVideoAdBean.rate;
                        maxRate += rate;
                        if (random < maxRate) {
                            ttVideoId = configTTVideoAdBean.posid;
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            //
        }
        LogUtils.e("TT RewardView posId = " + ttVideoId);

        return TextUtils.isEmpty(ttVideoId) ? ConstantValue.TT_POS_ID_REWARD : ttVideoId;
    }

    public static String getGdtNativeExpressPosId() {
        String gdtExpressId = "";

        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();

            List<GdtExpressBean> gdtExpress = appIdSet.gdtNew.gdtExpress;

            if (gdtExpress != null && gdtExpress.size() > 0) {
                double random = Math.random();
                double maxRate = 0;

                for (int i = 0; i < gdtExpress.size(); i++) {

                    GdtExpressBean gdtExpressBean = gdtExpress.get(i);

                    if (gdtExpressBean != null) {
                        double rate = gdtExpressBean.rate;
                        maxRate += rate;
                        if (random < maxRate) {
                            gdtExpressId = gdtExpressBean.NativeExpressPosID;
                            break;
                        }
                    }
                }
            }

        } catch (Exception e) {
            //
        }

        LogUtils.e("Gdt Express PosId = " + gdtExpressId);

        if (TextUtils.isEmpty(gdtExpressId)) {
            gdtExpressId = ConstantValue.GDT_POS_ID_NATIVE;
        }

        return gdtExpressId;
    }

    public static String getGdtVideoPosId() {
        String gdtVideoPos = "";

        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();
            List<ConfigCommonBean> gdtVideo = appIdSet.gdtVideo;

            if (gdtVideo != null && gdtVideo.size() > 0) {
                double random = Math.random();
                double maxRate = 0;

                for (int i = 0; i < gdtVideo.size(); i++) {

                    ConfigCommonBean configGdtVideoAdBean = gdtVideo.get(i);
                    if (configGdtVideoAdBean != null) {
                        double rate = configGdtVideoAdBean.rate;
                        maxRate += rate;
                        if (random < maxRate) {
                            gdtVideoPos = configGdtVideoAdBean.posid;
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            //
        }

        LogUtils.e("GdtVideo PosId = " + gdtVideoPos);
        if (TextUtils.isEmpty(gdtVideoPos)) {
            gdtVideoPos = ConstantValue.GDT_POS_ID_REWARD;
        }

        return gdtVideoPos;
    }

    public static String getGdtAppId() {
        String appid = "";
        try {
            ConfigAppIdSetBean appIdSet = ConfigUtils.getAppIdSet();

            GdtExpressBean gdtExpressBean = appIdSet.gdtNew.gdtExpress.get(0);
            appid = gdtExpressBean.APPID;
        } catch (Exception e) {
            //
        }

        LogUtils.e("gdtAppId = " + appid);

        return TextUtils.isEmpty(appid) ? ConstantValue.GDT_APP_ID : appid;
    }
}
