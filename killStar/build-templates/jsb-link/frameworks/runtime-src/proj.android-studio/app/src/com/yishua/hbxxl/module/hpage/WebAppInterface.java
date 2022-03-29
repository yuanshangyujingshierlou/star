package com.yishua.hbxxl.module.hpage;


import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.tencent.mm.opensdk.modelbiz.SubscribeMessage;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.yishua.hbxxl.App;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.module.dialog.DialogUtil;
import com.yishua.hbxxl.share.ShareUtils;
import com.yishua.hbxxl.splash.SplashActivity;
import com.yishua.hbxxl.util.AdCacheUtil;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.ToastUtil;
import com.yishua.hbxxl.util.UserUtil;
import com.yishua.hbxxl.wxapi.WXEntryActivity;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.ResponseBody;

import java.io.IOException;
import java.util.Map;

/**
 * Created by 10340 on 2017/11/23.
 */

public class WebAppInterface {
    private static final String TAG = "WebAppInterface";
    private TaskActivity activity;
    private IWXAPI api;

    public WebAppInterface(TaskActivity c) {
        activity = c;
        api = WXAPIFactory.createWXAPI(activity, ConstantValue.APP_ID, true);
        api.registerApp(ConstantValue.APP_ID);
    }

    @JavascriptInterface
    public void tochart() {
        Util.openMarketDetail();
    }

    @JavascriptInterface
    public void rewardVideo(String adtype, String backadtype, int tasktype, int showjump) {
//        AdManager.getRewardVideo(activity, adtype, backadtype, "", "", tasktype, showjump);
        AdCacheUtil.showRv(activity, "-1");
    }

    @JavascriptInterface
    public void loglout() {
        UserUtil.logout();

        Intent intent = new Intent(Util.getContext(), SplashActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(intent);
    }

    /**
     * 1基础版本  2打开应用市场 3提现播放视频功能
     *
     * @return
     */

    @JavascriptInterface
    public int codeversion() {
        return ConstantValue.FUNCTIONVERSION;
    }

    @JavascriptInterface
    public void tomainpage() {

        Intent intent = new Intent(Util.getContext(), AppActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Util.getContext().startActivity(intent);
    }

    @JavascriptInterface
    public void closepage() {
        try {
            activity.finish();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @JavascriptInterface
    public void showToast(String toast) {
        ToastUtil.showLongToast(toast);
    }

    @JavascriptInterface
    public void showTipDialog(String tip){
        DialogUtil.showTipDialog(tip);
    }

    @JavascriptInterface
    public void webBridge(final String func, String data) {

        Map<String, String> map = (Map<String, String>) JSONObject.parse(data);

        LogUtils.e("webBridge" + map);
        String url = ConstantValue.URL_BASE + String.valueOf(map.get("url"));

        Request request = HttpClient.getPostRequest(String.valueOf(map.get("url")), map);

        HttpClient.getOkHttpClient()
                .newCall(request)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("thread = " + Thread.currentThread().getName());
                    }

                    @Override
                    public void onResponse(Call call, org.cocos2dx.okhttp3.Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();
                            if (body != null) {
                                String string = body.string();

                                ResponseBean<Object> responseBean = JSON.parseObject(string, new TypeReference<ResponseBean<Object>>() {
                                });

                                if (responseBean == null) {
                                    return;
                                }

                                if (responseBean.getCode() == 0) {
                                    Object data1 = responseBean.getData();

                                    activity.loadJs(func, JSON.toJSONString(data1));
                                } else {
                                    // 后端定义的失败
                                    String errMsg = responseBean.getMessage();
                                    ToastUtil.showLongToast(errMsg);
                                    LogUtils.e("errMsg = " + errMsg + "  code = " + responseBean.getCode());
                                }
                            }

                        }
                    }
                });
    }

    @JavascriptInterface
    public void bindPhone() {

//        Intent intent = new Intent(Util.getContext(), BindPhoneActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        Util.getContext().startActivity(intent);
    }

    @JavascriptInterface
    public void bindWeixin() {

        final com.tencent.mm.opensdk.modelmsg.SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        String instance = String.valueOf(System.currentTimeMillis());
        req.state = WXEntryActivity.BIND + instance;
        WXEntryActivity.log_instance = WXEntryActivity.BIND + instance;
        api.sendReq(req);
    }

    @JavascriptInterface
    public void bindGZH(int scene) {
        SubscribeMessage.Req req = new SubscribeMessage.Req();
        //api.registerApp("wxd3ff3fb54ca6fa59");
        req.scene = 0;
        req.templateID = "iNlP10n6rPH9m7hlOoq2t1T7uUNJqGhsIvKRE3TUaWU";
        String instance = String.valueOf(System.currentTimeMillis());
        req.reserved = WXEntryActivity.GZH + instance;
        WXEntryActivity.log_instance = WXEntryActivity.GZH + instance;
        api.sendReq(req);
    }

    @JavascriptInterface
    public void wxShare(final String shareTiele, final String shareContent, final String shareImage, final String jumpUrl, final int type) {

        ShareUtils.throughSdkShareWXFriends(activity, shareTiele, shareContent, shareImage, jumpUrl, type);

    }

    @JavascriptInterface
    public void shareConversationPic(String bmpUrl) {
        LogUtils.e("shareConversationPic" + bmpUrl);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ShareUtils.throughIntentShareWXImage(activity, bmpUrl);
            }
        });

        // new Handler(Looper.getMainLooper()).postDelayed(, 1000);


    }


    /**
     * 复制内容到剪切板里
     *
     * @param officialaccount
     */
    @JavascriptInterface
    public void copyContent(String officialaccount, String tips) {
        try {
            if (officialaccount == null) {
                return;
            }

            if (activity == null) {
                return;
            }

            ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
            // 将文本内容放到系统剪贴板里。
            cm.setText(officialaccount);

            if (TextUtils.isEmpty(tips)) {
                // MyToast.Show(activity, "已拷贝到剪切板");
            } else {
                Toast.makeText(activity, tips, Toast.LENGTH_SHORT).show();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 打开闲玩H5
     */
    @JavascriptInterface
    public void openXw() {
//        activity.startActivity(new Intent(activity, XWActivity.class));
    }
}
