package com.yishua.hbxxl.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.bean.LoginBean;

public class UserUtil {
    public static int getUserId() {
        SharedPreferences sp_userId = Util.getContext().getSharedPreferences(SpValue.Name.USER_ID, Context.MODE_PRIVATE);
        return sp_userId.getInt(SpValue.Key.KEY_USERID, 0);
    }

    public static boolean isLogin() {
        return getUserId() > 0;
    }

    public static void saveUserInfo(LoginBean loginBean) {
        String headimgurl = loginBean.headimgurl;
        int integral = loginBean.integral;
        boolean isNewUser = loginBean.isNewUser;
        int openidstatus = loginBean.openidstatus;
        int mobilestatus = loginBean.mobilestatus;

        String nickname = loginBean.nickname;

        int userId = loginBean.userId;
        putUserId(userId);

        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);

        SharedPreferences.Editor edit = sp_login.edit();

        edit.putString(SpValue.Key.SP_KEY_NICKNAME, nickname);

        edit.putString(SpValue.Key.SP_KEY_HEAD_URL, headimgurl);

        putNewUser(isNewUser);

        if (!TextUtils.isEmpty(headimgurl) || !TextUtils.isEmpty(nickname)) {
            // 有昵称和头像表示是微信登录，已经绑定微信
            edit.putInt(SpValue.Key.SP_KEY_STATUS, 1);
        } else {
            // 手机登录，根据openidstatus字段判断是否绑定微信
            edit.putInt(SpValue.Key.SP_KEY_STATUS, openidstatus);
        }
        edit.putInt(SpValue.Key.SP_KEY_USERID, userId);

        edit.apply();
    }

    private static void putUserId(int userId) {
        SharedPreferences sp_userId = Util.getContext().getSharedPreferences(SpValue.Name.USER_ID, Context.MODE_PRIVATE);
        sp_userId.edit().putInt(SpValue.Key.KEY_USERID, userId).apply();
    }

    public static String getNickname() {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);

        return sp_login.getString(SpValue.Key.SP_KEY_NICKNAME, "");
    }

    public static boolean isNewUser() {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);

        return sp_login.getBoolean(SpValue.Key.SP_KEY_NEWUSER, false);
    }

    public static void putNewUser(boolean isNewUser) {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        sp_login.edit().putBoolean(SpValue.Key.SP_KEY_NEWUSER, isNewUser).apply();
    }

    public static void setUserNickname(String nickname) {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        sp_login.edit().putString(SpValue.Key.SP_KEY_NICKNAME, nickname).apply();
    }

    public static void setUserHeaderImg(String headimgurl) {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        sp_login.edit().putString(SpValue.Key.SP_KEY_HEAD_URL, headimgurl).apply();
    }

    public static String getHeadImgUrl() {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        return sp_login.getString(SpValue.Key.SP_KEY_HEAD_URL, "");
    }

    public static void logout() {
        putUserId(0);
    }

    /**
     * 是否绑定微信
     *
     * @return
     */
    public static boolean isBindWx() {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        return sp_login.getInt(SpValue.Key.SP_KEY_STATUS, 0) == 1;
    }

    public static void bindWx(String nickname, String headimgurl) {
        SharedPreferences sp_login = Util.getContext().getSharedPreferences(UserUtil.getUserId() + SpValue.Name.SP_LOGIN_DATA, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = sp_login.edit();
        edit.putString(SpValue.Key.SP_KEY_NICKNAME, nickname);
        edit.putString(SpValue.Key.SP_KEY_HEAD_URL, headimgurl);
        edit.putInt(SpValue.Key.SP_KEY_STATUS, 1);
        edit.apply();
    }
}
