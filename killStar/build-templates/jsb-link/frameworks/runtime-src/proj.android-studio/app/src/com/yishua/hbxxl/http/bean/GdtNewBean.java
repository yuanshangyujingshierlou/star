package com.yishua.hbxxl.http.bean;

import java.io.Serializable;
import java.util.List;

/**
 * Created on 2018/4/8.
 * Author：Junguo
 */

public class GdtNewBean implements Serializable {

    public List<GdtNativeBean> gdtNative;

    public List<GdtExpressBean> gdtExpress;

    public double gdtNativeRate;

    public double gdtExpressRate;
}
