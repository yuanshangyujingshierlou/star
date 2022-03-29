package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created by Junguo.L on 2020/4/21.
 */
public class VideoAdBean implements Serializable {
    public String adtype; // 激励视频广告类型，类似广点通是 1，百度是 2 的字段。 为 0 标识可用广告预算不足，不展示广告。
    public String backadtype; // 打底类型。为 0 标识可用广告预算不足，不展示广 告。

    public String id; // 翻倍奖励对应的原始奖励 id，翻倍加奖励回传
    public String coin; // 积分

    public int showjump; // 是否显示跳过，1：显示   0：不显示
}
