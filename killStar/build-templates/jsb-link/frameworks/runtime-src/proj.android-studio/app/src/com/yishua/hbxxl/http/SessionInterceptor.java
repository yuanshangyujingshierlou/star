package com.yishua.hbxxl.http;

import android.text.TextUtils;

import org.cocos2dx.okhttp3.Interceptor;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;

import java.io.IOException;

/**
 * 拦截返回数据判断session是否失效
 * 添加公共参数
 */
public class SessionInterceptor implements Interceptor {

    @Override
    public Response intercept(Interceptor.Chain chain) throws IOException {

        Request request = chain.request();

        // 请求定制
        Request.Builder requestBuilder = request.newBuilder();

        String userAgent = HttpParamUtil.getUserAgent();

        // 重新构建请求,添加请求头
        if (!TextUtils.isEmpty(userAgent)) {
            request = requestBuilder.removeHeader("User-Agent").addHeader("User-Agent", userAgent)
                    .addHeader("ua", userAgent).addHeader("UA", userAgent).build();
        }

//        String s = request.url().toString();
//        LogUtils.e("url = " + s);

        return chain.proceed(request);
    }
}