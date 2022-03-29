package com.yishua.hbxxl.wxapi;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.HttpParamUtil;
import com.yishua.hbxxl.http.bean.LoginBean;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.http.bean.WxBindBean;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.ToastUtil;
import com.yishua.hbxxl.util.UserUtil;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okhttp3.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by 10340 on 2018/1/25.
 */

public class WXPresenter implements WXContract.Presenter {
    private WXContract.View view;

    public WXPresenter(WXContract.View view) {
        this.view = view;
    }


    @Override
    public void sendMessageB(String json) {

        Request request = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.WEIXIN_GZH + "?" + json, null);

        HttpClient.getOkHttpClient()
                .newCall(request)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("thread = " + Thread.currentThread().getName());
                        ToastUtil.showToast("网络错误");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();

                            if (body != null) {
                                ResponseBean responseBean = JSON.parseObject(body.string(), ResponseBean.class);

                                if (responseBean.getCode() == 0) {
                                    // 成功
                                    // 成功
                                    ToastUtil.showToast("发送成功！");
                                    view.openWeixin();
                                    view.finishActivity();
                                } else {
                                    // 后端定义的失败
                                    ToastUtil.showToast(responseBean.getMessage());
                                }

                                return;
                            }
                        }

                        // 网络失败，
                        ToastUtil.showToast("网络错误");
                    }
                });
    }


    @Override
    public void sendMessage(String openId, int scene, String template_id) {

        Map<String, String> params = new HashMap<>();
        params.put("openid", openId);
        params.put("scene", scene + "");
        params.put("template_id", template_id);

        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.WEIXIN_GZH, params);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("thread = " + Thread.currentThread().getName());
                        ToastUtil.showToast("网络错误");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful()) {
                            ResponseBody responseBody = response.body();

                            if (responseBody != null) {
                                String string = responseBody.string();

                                ResponseBean responseBean = JSON.parseObject(string, ResponseBean.class);

                                if (responseBean != null && responseBean.getCode() == 0) {
                                    // 成功
                                    ToastUtil.showToast("发送成功！");
                                    view.openWeixin();
                                    view.finishActivity();
                                } else {
                                    // 后端定义的失败
                                    ToastUtil.showToast(responseBean.getMessage());
                                }

                                return;
                            }
                        }

                        ToastUtil.showToast("网络错误");
                    }
                });
    }


    @Override
    public void weixinBind(String code) {

        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.BINDWX, null);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("thread = " + Thread.currentThread().getName());
                        ToastUtil.showToast("网络错误");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();

                            if (body != null) {

                                String data = body.string();

                                ResponseBean<WxBindBean> wxBindBeanResponseBean = JSON.parseObject(data, new TypeReference<ResponseBean<WxBindBean>>() {
                                });

                                if (wxBindBeanResponseBean != null) {
                                    if (wxBindBeanResponseBean.getCode() == 0) {
                                        UserUtil.bindWx(wxBindBeanResponseBean.getData().nickname, wxBindBeanResponseBean.getData().headimgurl);
                                        // 没有微信绑定了，都是默认微信登录的
//                                        EventBus.getDefault().post(new BindwxEvent());
                                    } else {
                                        // 后端定义的失败
                                        view.bindWxFail(wxBindBeanResponseBean.getMessage());
                                    }

                                    return;
                                }
                            }
                        }

                        ToastUtil.showToast("网络错误");
                    }
                });
    }


    @Override
    public void weixinLogin(String code) {

        Map<String, String> params = new HashMap<>();

        params.put("code", code);
        params.put("model", HttpParamUtil.getModel());
        params.put("hardware", Util.getDeviceInfo(Util.getContext(), 13));
        params.put("userAgent", HttpParamUtil.getUserAgent());
        params.put("totalRam", HttpParamUtil.getTotalRam(Util.getContext()));
        params.put("totalRom", HttpParamUtil.getTotalRom());
        params.put("mac", HttpParamUtil.getMacAddress());
        params.put("imsi", HttpParamUtil.getImsi());
        params.put("manufacturer", Util.getDeviceInfo(Util.getContext(), 10));
        params.put("board", Util.getDeviceInfo(Util.getContext(), 11));
        params.put("device", Util.getDeviceInfo(Util.getContext(), 12));
        params.put("deviceName", HttpParamUtil.getDeviceName());

        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.WXLOGIN, params);
        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        ToastUtil.showToast("网络错误");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {

                        LogUtils.e("onResponse thread = " + Thread.currentThread().getName());

                        if (response != null && response.isSuccessful()) {
                            ResponseBody responseBody = response.body();
                            if (responseBody != null) {
                                String data = responseBody.string();

                                ResponseBean<LoginBean> loginBeanResponseBean = JSON.parseObject(data, new TypeReference<ResponseBean<LoginBean>>() {
                                });

                                if (loginBeanResponseBean != null) {
                                    if (loginBeanResponseBean.getCode() == 0) {
                                        // 成功
                                        UserUtil.saveUserInfo(loginBeanResponseBean.getData());

                                        view.wxLoginSuccess();
                                    } else {
                                        // 后端定义的失败
                                        view.wxLoginFail(loginBeanResponseBean.getMessage());
                                    }

                                    return;
                                }
                            }
                        }

                        ToastUtil.showToast("网络错误");
                    }
                });
    }
}
