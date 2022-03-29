package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created by Junguo.L on 2020/4/14.
 */
public class LoginBean implements Serializable {

    public boolean isNewUser; // true 新用户;false 不是新用户

    public int userId; // 用户的 userId

    public int integral; // 登录后，新用户有的金币(新用户)

    public int luck; // 登录后，新用户送的福气值(新用户)

    public int openidstatus; // 1：已经绑定微信; 0：还没有绑定微信，非新用户会有(手机号登录会有)

    public int mobilestatus; // 1，已经绑定手机;0 还没有绑定手机 (微信登录会有)

    public String headimgurl; // 当已经绑定微信时有

    public String nickname; //
}
