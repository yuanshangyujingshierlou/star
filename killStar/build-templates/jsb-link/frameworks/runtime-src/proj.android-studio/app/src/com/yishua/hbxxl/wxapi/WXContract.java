package com.yishua.hbxxl.wxapi;


public class WXContract {

    interface View {
        void bindWxSuccess();

        void bindWxFail(String message);

        void wxLoginSuccess();

        void wxLoginFail(String message);

        void openWeixin();

        void finishActivity();
    }

    interface Presenter {

        void weixinLogin(String code);

        void weixinBind(String code);

        void sendMessage(String openId, int scene, String template_id);

        void sendMessageB(String json);
    }
}
