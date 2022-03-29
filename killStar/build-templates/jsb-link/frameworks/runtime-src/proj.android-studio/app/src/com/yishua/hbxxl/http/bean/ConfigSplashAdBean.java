package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created on 2018/3/28.
 * Author：Junguo
 */

public class ConfigSplashAdBean implements Serializable {

    public String gdtPostion;
    public String gdtId;
    public int adType;//1表示广点通，2表示头条
    public int backendAdType; // 开屏打底

    public String ttAppId;
    public String ttPosId;

    public String sdkKey;
    public String adviewId;
}
