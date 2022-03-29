package org.cocos2dx.javascript;

import android.text.TextUtils;

import com.alibaba.fastjson.JSONObject;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.event.CCEvent;
import com.yishua.hbxxl.http.HttpParamUtil;
import com.yishua.hbxxl.http.RsaJiami;
import com.yishua.hbxxl.http.RsaPhone;
import com.yishua.hbxxl.util.ConfigUtils;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.MiitHelper;
import com.yishua.hbxxl.util.ToastUtil;
import com.yishua.hbxxl.util.UserUtil;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.FormBody;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okhttp3.ResponseBody;
import org.greenrobot.eventbus.EventBus;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

public class JSB {
    /**
     * Cocos 调用展示原生广告
     *
     * @param type 弹窗的类型，比如加积分弹窗：1
     */
    public static void showAd(String type) {
        LogUtils.e("showAd type = " + type);
        EventBus.getDefault().post(new CCEvent(1, type));
    }

    /**
     * Cocos 调用展示激励视频
     *
     * @param type 类型（比如视频红包：1）
     *             // @param param 参数，激励视频关闭后传回cocos，用于后续操作，没有可以传空
     */
    public static void showRv(String type) {
        LogUtils.e("showRv type = " + type);
        EventBus.getDefault().post(new CCEvent(2, type));
    }

    public static void showToast(String toast) {
        ToastUtil.showToast(toast);
    }

    /**
     * 打开提现页面
     */
    public static void withdrawPage() {
        LogUtils.e("withdrawPage ");
        EventBus.getDefault().post(new CCEvent(3, ""));
    }

    /**
     * cocos 关闭弹窗，通知Android隐藏展示的广告
     */
    public static void dismissAd() {
        LogUtils.e("dismissAd");
        EventBus.getDefault().post(new CCEvent(4, ""));
    }

    /**
     * cocos 点击了头像，展示弹窗
     */
    public static void showUserInfo() {
        EventBus.getDefault().post(new CCEvent(5, ""));
        LogUtils.e("showUserInfo");

//        Cocos2dxHelper.runOnGLThread(new Runnable() {
//            @Override
//            public void run() {
//                Cocos2dxJavascriptJavaBridge.evalString("window.killStar.obtainRvCallback('1','1')");
//            }
//        });
    }

    public static int isBGMEnable() {
        return ConfigUtils.isSoundBGMEnable() ? 1 : 0;
    }

    public static int isSoundEffectEnable() {
        return ConfigUtils.isSoundEffectEnable() ? 1 : 0;
    }

    public static void httpRequest(String url, String param, String type) {

        LogUtils.e("httpRequest url =" + url + "  param = " + param + "   func = " + type);

        FormBody.Builder formBodyBuilder = getFormBodyBuilder(type);

        if (!TextUtils.isEmpty(param)) {
            Map<String, Object> pMap = (Map<String, Object>) JSONObject.parse(param);

            Set<String> keys = pMap.keySet();
            for (String key : keys
            ) {
                Object value = pMap.get(key);

                LogUtils.e("key = " + key + "  value =" + value);
                if (value != null && !TextUtils.isEmpty(value.toString())) {
                    formBodyBuilder.add(key, value.toString());
                }
            }
        }

        FormBody formBody = formBodyBuilder.build();

        Request request = new Request.Builder()
                .url(ConstantValue.URL_BASE + url)
                .post(formBody)
                .build();

        OkHttpClient build = new OkHttpClient.Builder().build();
        Call call = build.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                LogUtils.e("onFailure = " + e.getMessage());
                responseToCC("");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
//                LogUtils.e("onResponse ------");

                if (response != null && response.isSuccessful()) {

                    ResponseBody body = response.body();
                    if (body != null) {
                        String respData = body.string();
//                        LogUtils.e("onResponse ------ " + respData);
                        responseToCC(respData);
                        return;
                    }
                }

                // 接口错误
                responseToCC("");
            }
        });
    }

    private static void responseToCC(String respData) {
        LogUtils.e("responseToCC data = " + respData);

        JsbResponse.resp1("obtainHttpData", respData);
    }

    /**
     * 公共参数
     *
     * @param type
     * @return
     */
    private static FormBody.Builder getFormBodyBuilder(String type) {
        String nonce = HttpParamUtil.getNonce();
        String timeStamp = HttpParamUtil.getTimeStamp();
        String jiami = "";
        try {
            jiami = RsaJiami.jiami(timeStamp, UserUtil.getUserId() + "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        String signature = HttpParamUtil.getSign(nonce, timeStamp, ConstantValue.SECURE_KEY_SERVER);

        return new FormBody.Builder()
                .add("nonce", nonce)
                .add("token", jiami)
                .add("signature", signature)
                .add("versionCode", Util.getVersionCode())
                .add("channel", HttpParamUtil.getChannel())
                //.addEncoded("imei", HttpParamUtil.getImei())
                .add("d", RsaPhone.jiami(HttpParamUtil.getImei()))
                //.addEncoded("androidId", HttpParamUtil.getAndroidId())
                .add("g", RsaPhone.jiami(HttpParamUtil.getAndroidId()))
                .addEncoded("oaid", MiitHelper.oaid)
                .add("adcodeversion", HttpParamUtil.getAdCodeVersion()) // 第一版无广告固定传""空字符串
                .add("hassdk", HttpParamUtil.pluginSdk())
                .add("functionversion", ConstantValue.FUNCTIONVERSION + "") //1 邀请和邀请码功能
                .add("vest", HttpParamUtil.getVestType()) //1 马甲包
                .add("h", RsaPhone.jiami(HttpParamUtil.getDeviceBrand()))
                .add("cctype", type);
    }
}
