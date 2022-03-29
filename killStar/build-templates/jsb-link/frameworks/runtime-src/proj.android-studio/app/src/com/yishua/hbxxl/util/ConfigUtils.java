package com.yishua.hbxxl.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.bean.ConfigAppIdSetBean;

/**
 * Created by Junguo.L on 2020-01-07.
 */
public class ConfigUtils {

    public static ConfigAppIdSetBean getAppIdSet() {

        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, 0);
        String appidSet = sharedPreferences.getString(SpValue.Key.CONFIG_APPIDSET, "");

//        LogUtils.e("appidSet= " + appidSet);
        if (TextUtils.isEmpty(appidSet)) {

            return new ConfigAppIdSetBean();
        }

        return JSON.parseObject(appidSet, ConfigAppIdSetBean.class);
    }

//    /**
//     * 保存应用的一些配置
//     *
//     * @param newUserGiftBean
//     */
//    public static void putAppConfig(SomeConfigBean newUserGiftBean) {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//
//        SharedPreferences.Editor edit = sp_app.edit();
//
//        int quickredicetime = newUserGiftBean.quickredicetime;
//        String quickrednum = newUserGiftBean.quickrednum;
//
//        edit.putString(SpValue.Key.CONFIG_APP_QUICK_GIFT_NUM, quickrednum);
//        edit.putInt(SpValue.Key.CONFIG_APP_QUICK_GIFT_INTERVAL, quickredicetime);
//
//        edit.apply();
//    }

//    /**
//     * 快速红包可以连续领取的个数（连续个数领取完后进入冷却时间）
//     *
//     * @return
//     */
//    public static int getAppConfigQuickGiftNum() {
//        try {
//            SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//
//            String string = sp_app.getString(SpValue.Key.CONFIG_APP_QUICK_GIFT_NUM, "");
//            if (TextUtils.isEmpty(string)) {
//                return 0;
//            }
//
//            String[] split = string.split(",");
//            int random = RandomUtil.getRandom(Util.parseInt(split[0]), Util.parseInt(split[1]));
//            LogUtils.e("快速红包随机配置次数 = " + random + "  string = " + string);
//
//            return random;
//        } catch (Exception e) {
//            //
//            LogUtils.e("getAppConfigQuickGiftNum Exception = " + e.toString());
//        }
//
//        return 4;
//    }

//    /**
//     * 快速红包奖励
//     */
//    public static void quickGiftReward() {
//        // 保存奖励的时间
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        sp_app.edit().putLong(SpValue.Key.CONFIG_APP_PROGRESS_TIME, System.currentTimeMillis()).apply();
//
//        // 保存奖励的次数
//        int quickGiftRewardCount = getQuickGiftRewardCount();
//
//        LogUtils.e("奖励快速红包  次数= " + (quickGiftRewardCount + 1));
//
//        sp_app.edit().putInt(SpValue.Key.CONFIG_APP_PROGRESS_COUNT, quickGiftRewardCount + 1).apply();
//    }
//
//    /**
//     * 连续领取的奖励次数
//     *
//     * @return
//     */
//    public static int getQuickGiftRewardCount() {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        return sp_app.getInt(SpValue.Key.CONFIG_APP_PROGRESS_COUNT, 0);
//    }
//
//    /**
//     * 进度走完一圈后，清除进度
//     */
//    public static void clearQuickGiftProgress() {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        sp_app.edit().putInt(SpValue.Key.CONFIG_APP_PROGRESS, 0).apply();
//
//        sp_app.edit().putLong(SpValue.Key.CONFIG_APP_PROGRESS_TIME, System.currentTimeMillis()).apply();
//    }
//
//    public static long getQuickGiftRewardTime() {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//
//        return sp_app.getLong(SpValue.Key.CONFIG_APP_PROGRESS_TIME, 0);
//    }
//
//    /**
//     * 快速红包冷却时长
//     *
//     * @return 单位：秒
//     */
//    public static int getAppConfigQuickGiftInterval() {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        return sp_app.getInt(SpValue.Key.CONFIG_APP_QUICK_GIFT_INTERVAL, 10);
//    }
//
//    public static void clearQuickGiftRewardCount() {
//        LogUtils.e("清空快速红包连续领取次数 ------- 之前保存次数= " + getQuickGiftRewardCount());
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        sp_app.edit().putInt(SpValue.Key.CONFIG_APP_PROGRESS_COUNT, 0).apply();
//    }
//
//    public static void putQuickGiftProgress(int progress) {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//        sp_app.edit().putInt(SpValue.Key.CONFIG_APP_PROGRESS, progress).apply();
//    }
//
//    public static int getQuickGiftProgress() {
//        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
//
//        return sp_app.getInt(SpValue.Key.CONFIG_APP_PROGRESS, 0);
//    }

    public static void setSoundEffectEnable(boolean isChecked) {
        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
        sp_app.edit().putBoolean(SpValue.Key.CONFIG_APP_SOUND_EFFECT_ENABLE, isChecked).apply();
    }

    public static boolean isSoundEffectEnable() {
        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
        return sp_app.getBoolean(SpValue.Key.CONFIG_APP_SOUND_EFFECT_ENABLE, true);
    }

    public static void setBGMEnable(boolean isChecked) {
        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
        sp_app.edit().putBoolean(SpValue.Key.CONFIG_APP_SOUND_BGM_ENABLE, isChecked).apply();
    }

    public static boolean isSoundBGMEnable() {
        SharedPreferences sp_app = Util.getContext().getSharedPreferences(SpValue.Name.SPNAME_APP, Context.MODE_PRIVATE);
        return sp_app.getBoolean(SpValue.Key.CONFIG_APP_SOUND_BGM_ENABLE, true);
    }
}
