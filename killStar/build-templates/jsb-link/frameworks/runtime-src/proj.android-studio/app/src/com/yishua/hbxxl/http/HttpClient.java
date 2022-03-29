package com.yishua.hbxxl.http;

import com.yishua.hbxxl.ConstantValue;

import org.cocos2dx.okhttp3.FormBody;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

public class HttpClient {
    private volatile static OkHttpClient okHttpClient;

    public static OkHttpClient getOkHttpClient() {

        if (okHttpClient == null) {

            synchronized (HttpClient.class) {
                if (okHttpClient == null) {
                    okHttpClient = new OkHttpClient.Builder()
                            .addInterceptor(new HttpParamInterceptor())
                            .addInterceptor(new SessionInterceptor())
                            .connectTimeout(20, TimeUnit.SECONDS)
                            .readTimeout(20, TimeUnit.SECONDS)
                            .build();
                }
            }
        }

        return okHttpClient;
    }

    private HttpClient() {
    }

    private static FormBody getPostForm(Map<String, String> params) {
        FormBody.Builder builder = new FormBody.Builder();
        if (params != null && !params.isEmpty()) {
            Set<String> keys = params.keySet();
            for (String key : keys
            ) {
                String value = params.get(key);
                if (value == null) {
                    value = "";
                }
                builder.add(key, value);
            }
        }
        return builder.build();
    }

    public static Request getPostRequest(String url, Map<String, String> params) {
        if (!url.contains(ConstantValue.URL_BASE)) {
            url = ConstantValue.URL_BASE + url;
        }

        FormBody postForm = getPostForm(params);

        return new Request.Builder()
                .url(url)
                .post(postForm)
                .build();
    }

}
