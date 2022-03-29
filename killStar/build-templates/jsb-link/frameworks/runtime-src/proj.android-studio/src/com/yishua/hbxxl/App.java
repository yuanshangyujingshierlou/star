package com.yishua.hbxxl;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.qq.e.comm.managers.GDTADManager;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.yishua.hbxxl.lifecycle.LifecycleCallback;
import com.yishua.hbxxl.util.InitSdkUtil;
import com.yishua.hbxxl.util.MiitHelper;
import com.yishua.hbxxl.util.SoundEffectUtil;
import com.yishua.hbxxl.util.SpUtil;
import com.yishua.hbxxl.util.TTUtils;

public class App extends Application {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
    }

    @Override
    public void onCreate() {
        super.onCreate();

        Log.e("Tag", "app -----");

        Util.init(this);

        MiitHelper miitHelper = new MiitHelper();
        miitHelper.getDeviceIds(getApplicationContext());

        boolean splashFirst = SpUtil.isSplashFirst();
        if (!splashFirst) {
            InitSdkUtil.init();
        } else {
            /**
             * 如果项目的Manifest文件中已经配置【友盟+】的AppKey和Channel，
             * 则使用该方法初始化，同时不必再次传入AppKey和Channel两个参数
             * 初始化common库
             * 参数1:上下文，不能为空
             * 参数2:设备类型，UMConfigure.DEVICE_TYPE_PHONE为手机、UMConfigure.DEVICE_TYPE_BOX为盒子，默认为手机
             * 参数3:Push推送业务的secret,需要集成Push功能时必须传入Push的secret，否则传空
             */
            UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE, "");

            // 选择AUTO页面采集模式，统计SDK基础指标无需手动埋点可自动采集。
            // 建议在宿主App的Application.onCreate函数中调用此函数。
            MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
        }
//
        GDTADManager.getInstance().initWith(this, ConstantValue.GDT_APP_ID);

        TTUtils.init();

        SoundEffectUtil.getInstance().initSound();

        registerActivityLifecycleCallbacks(LifecycleCallback.getInstance());
    }
}
