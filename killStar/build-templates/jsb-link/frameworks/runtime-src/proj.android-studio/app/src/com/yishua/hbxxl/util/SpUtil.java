package com.yishua.hbxxl.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;

/**
 * Created by Junguo.L on 2020/4/13.
 */
public class SpUtil {

    /**
     * 是否第一次打开
     *
     * @return
     */
    public static boolean isSplashFirst() {
        SharedPreferences guide_pref = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        return guide_pref.getBoolean(SpValue.Key.SPLASH_FIRST, true);
    }

    /**
     * @param isFirst
     */
    public static void putSplashFirst(boolean isFirst) {
        SharedPreferences guide_pref = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        guide_pref.edit().putBoolean(SpValue.Key.SPLASH_FIRST, isFirst).apply();
    }

    public static void putNewUserPrize(int prize) {
        SharedPreferences guide_pref = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SETTING, Context.MODE_PRIVATE);
        guide_pref.edit().putInt(SpValue.Key.SP_KEY_NEW_USER_PRIZE, prize).apply();
    }

    public static int getNewUserPrize() {
        SharedPreferences guide_pref = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SETTING, Context.MODE_PRIVATE);
        return guide_pref.getInt(SpValue.Key.SP_KEY_NEW_USER_PRIZE, 2888);
    }

    public static void saveNoAdConfig(int noad) {
        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);

        sharedPreferences.edit().putInt(SpValue.Key.NOAD, noad).apply();
    }

    /**
     * 是否屏蔽广告
     *
     * @return true:屏蔽
     */
    public static boolean shieldAd() {
        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        int anInt = sharedPreferences.getInt(SpValue.Key.NOAD, 0);
        return anInt == 1;
    }

    public static void setShieldConfig(int netshield, int splashshield) {
        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        sharedPreferences.edit()
                .putInt(SpValue.Key.NETSHIELD, netshield)
                .putInt(SpValue.Key.SPLASHSHIELD, splashshield)
                .apply();
    }

    public static boolean isSplashShield() {
        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        return sharedPreferences.getInt(SpValue.Key.SPLASHSHIELD, 0) == 1;
    }

    /**
     * 是否屏蔽网赚元素
     * @return true：屏蔽
     */
    public static boolean isNetShield() {
        SharedPreferences sharedPreferences = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
        return sharedPreferences.getInt(SpValue.Key.NETSHIELD, 0) == 1;
    }
}
