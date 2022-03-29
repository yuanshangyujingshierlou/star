package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created by Junguo.L on 2020/8/5.
 */
public class AdTypeBean implements Serializable {
    public VideoAdBean videoAd;

    public NativeAdBean nativeAd;

    public int noad; // 1：屏蔽广告  0：不屏蔽 ，只用于开屏
}
