package com.yishua.hbxxl.splash;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.bean.AdConfigBean;
import com.yishua.hbxxl.http.bean.AdConfigDataBean;
import com.yishua.hbxxl.http.bean.AdIdConfigBean;
import com.yishua.hbxxl.http.bean.AdTypeBean;
import com.yishua.hbxxl.http.bean.ConfigAppIdSetBean;
import com.yishua.hbxxl.http.bean.ConfigSplashAdBean;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.SpUtil;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okhttp3.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class SplashPresenter {

    public void getAdConfig() {
        Map<String, String> params = new HashMap<>();
        params.put("param", "1");
        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.ADIDCONFIG, params);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("getAdConfig onFailure = " + e.getMessage());
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();

                            if (body != null) {
                                String string = body.string();

                                AdConfigDataBean adConfigDataBean = JSON.parseObject(string, new TypeReference<AdConfigDataBean>() {
                                });

                                if (adConfigDataBean != null && adConfigDataBean.code == 0) {
                                    AdConfigBean adConfigBean = adConfigDataBean.data;

                                    LogUtils.e("adConfigBean is null = " + (adConfigBean == null));

                                    if (adConfigBean != null) {

                                        AdIdConfigBean adidconfig = adConfigBean.adidconfig;
                                        LogUtils.e("adidconfig is null = " + (adidconfig == null));
                                        if (adidconfig != null) {
                                            SharedPreferences sp_splash = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
                                            SharedPreferences.Editor edit = sp_splash.edit();

                                            ConfigAppIdSetBean appidset = adidconfig.appidset;
                                            ConfigSplashAdBean splashAd = adidconfig.splashAd;
//                                            List<ConfigVideoAdBean> videoad = configBean.videoad;

                                            if (appidset != null) {

                                                LogUtils.e("appidSet = " + JSON.toJSONString(appidset));
                                                edit.putString(SpValue.Key.CONFIG_APPIDSET, JSON.toJSONString(appidset));
                                            }

                                            if (splashAd != null) {
                                                LogUtils.e("splashAd = " + JSON.toJSONString(splashAd));
                                                edit.putString(SpValue.Key.CONFIG_SPLASHAD, JSON.toJSONString(splashAd));
                                            }

                                            edit.apply();

                                            return;
                                        }
                                    }
                                }
                            }
                        }

                        LogUtils.e("getAdConfig onResponse error ");
                    }
                });
    }

    public void getAppConfig() {
        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.ADTYPE, null);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {

                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();
                            if (body != null) {
                                String data = body.string();

                                ResponseBean<AdTypeBean> adTypeBeanResponseBean = JSON.parseObject(data, new TypeReference<ResponseBean<AdTypeBean>>() {
                                });

                                if (adTypeBeanResponseBean != null && adTypeBeanResponseBean.getCode() == 0) {
                                    int noad = adTypeBeanResponseBean.getData().noad;

                                    SpUtil.saveNoAdConfig(noad);
                                }
                            }

                        }
                    }
                });

    }

    public int getSplashType() {
        boolean shieldAd = SpUtil.shieldAd();
        int splashAdType = 0;

        if (!shieldAd) {
            SharedPreferences sp_splash = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);


            String string = sp_splash.getString(SpValue.Key.CONFIG_SPLASHAD, "");
            if (!TextUtils.isEmpty(string)) {
                ConfigSplashAdBean configSplashAdBean = JSON.parseObject(string, ConfigSplashAdBean.class);
                if (configSplashAdBean != null) {
                    splashAdType = configSplashAdBean.adType;
                }
            }
        }

        return splashAdType;
    }
}
