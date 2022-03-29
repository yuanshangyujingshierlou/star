package com.yishua.hbxxl.http;


import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.util.MiitHelper;
import com.yishua.hbxxl.util.UserUtil;

import org.cocos2dx.okhttp3.FormBody;
import org.cocos2dx.okhttp3.Interceptor;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.RequestBody;
import org.cocos2dx.okhttp3.Response;

import java.io.IOException;

/**
 * Created by Junguo.L on 2019-12-28.
 */
public class HttpParamInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();

        if ("POST".equals(request.method())) {
            RequestBody body = request.body();
            if (body instanceof FormBody) {

                FormBody.Builder newFormBodyBuilder = new FormBody.Builder();

                // 将原来参数取出添加到新的构造器
                for (int i = 0; i < ((FormBody) body).size(); i++) {
                    String name = ((FormBody) body).encodedName(i);
                    String value = ((FormBody) body).encodedValue(i);

                    newFormBodyBuilder.addEncoded(name, value);
                }

                String nonce = HttpParamUtil.getNonce();
                String timeStamp = HttpParamUtil.getTimeStamp();
                String jiami = "0";
                try {
                    jiami = RsaJiami.jiami(timeStamp, UserUtil.getUserId() + "");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                String signature = HttpParamUtil.getSign(nonce, timeStamp, ConstantValue.SECURE_KEY_SERVER);
                FormBody newFormBody = newFormBodyBuilder
                        .addEncoded("nonce", nonce)
                        .addEncoded("token", jiami)
                        .addEncoded("signature", signature)
                        .addEncoded("versionCode", Util.getVersionCode())
                        .addEncoded("channel", HttpParamUtil.getChannel())
                        //.addEncoded("imei", HttpParamUtil.getImei())
                        .addEncoded("d", RsaPhone.jiami(HttpParamUtil.getImei()))
                        //.addEncoded("androidId", HttpParamUtil.getAndroidId())
                        .addEncoded("g", RsaPhone.jiami(HttpParamUtil.getAndroidId()))
                        .addEncoded("oaid", MiitHelper.oaid)
                        .addEncoded("adcodeversion", HttpParamUtil.getAdCodeVersion()) // 第一版无广告固定传""空字符串
                        .addEncoded("hassdk", HttpParamUtil.pluginSdk())
                        .addEncoded("functionversion", ConstantValue.FUNCTIONVERSION + "") //1 邀请和邀请码功能
                        .addEncoded("vest", HttpParamUtil.getVestType()) //1 马甲包
                        .addEncoded("h", RsaPhone.jiami(HttpParamUtil.getDeviceBrand()))
                        .build();

                // 接口会发生返回失败
                // addHeader：https://www.jianshu.com/p/dea2ffb1c3b1
                request = request.newBuilder().post(newFormBody).addHeader("Connection", "close").build();
            }
        }

        return chain.proceed(request);
    }
}
