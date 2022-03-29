package com.yishua.hbxxl.http.bean;

import java.io.Serializable;

/**
 * Created by Junguo.L on 2020-01-15.
 */
public class AutoUpdateBean implements Serializable {
    public int resultcode; // 0无更新，1有更新

    public int isForce; // 1强制跟新，0非强制更新

    public String url; // 更新包下载地址

    public String updateContent; // 更新内容（###代表换行，同点点新闻）

    public String versionName;
}
