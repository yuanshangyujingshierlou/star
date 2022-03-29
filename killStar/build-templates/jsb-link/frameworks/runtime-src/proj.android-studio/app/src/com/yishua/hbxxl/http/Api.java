package com.yishua.hbxxl.http;

public interface Api {
    String ADIDCONFIG = "/config/adidconfig"; // 广告位 id 配置

    String ALIPAYGETSTR = "/register/getLoninStr";
    String WEIXIN_GZH = "/weixin/sendMessage";
    String BINDWX = "/weixin/bindWeixin"; // 绑定微信
    String WXLOGIN = "/weixin/login"; // 微信登录

    String ADTYPE = "/userReward/getAdType"; // 返回广告类型,返回是否屏蔽开屏广告

    String SHIELDCONFIG = "/config/shieldconfig"; // 广告屏蔽及网赚元素屏蔽

    String CACHEADTYPE = "/config/cacheadtype"; // 广告缓存配置

    String ADACTIONUPLOAD = "/adserver/adRecord"; // 广告曝光点击上报地址

    String AUTO_UPDATE = "/version/autoUpdate"; // 首页提示更新
}
