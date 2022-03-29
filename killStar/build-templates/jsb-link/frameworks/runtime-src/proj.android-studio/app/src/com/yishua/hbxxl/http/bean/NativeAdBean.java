package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created by Junguo.L on 2020/4/21.
 */
public class NativeAdBean implements Serializable {
    public String adtype; // 类似于原来的“1”代表广点通，“2”代表百度这个字 段。为 0 标识可用广告预算不足，不展示广告。
    public String backadtype; // 配置广告没拉到，用这个打底。也是具体的广告类 型。为 0 标识可用广告预算不足，不展示广告。

    public int delaytime; // 毫秒（2000），广告展示延迟时长，前端判断使用
}
