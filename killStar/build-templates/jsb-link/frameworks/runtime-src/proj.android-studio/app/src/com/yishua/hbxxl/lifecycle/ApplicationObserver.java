package com.yishua.hbxxl.lifecycle;

import android.arch.lifecycle.Lifecycle;
import android.arch.lifecycle.LifecycleObserver;
import android.arch.lifecycle.OnLifecycleEvent;


import com.yishua.hbxxl.util.LogUtils;

import org.greenrobot.eventbus.EventBus;


/**
 * Created by Junguo.L on 2020/4/16.
 */
public class ApplicationObserver implements LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    void onForeground() {
        LogUtils.e("onForeground");

//        EventBus.getDefault().post(new AppStatusEvent(1));
//
//        AudioUtil.getInstance().enable(true);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    void onBackground() {
        LogUtils.e("onBackground");

//        EventBus.getDefault().post(new AppStatusEvent(2));
//
//        // 上传游戏数据
//        ConfigRepository.getInstance().uploadPigData();
//
//        AudioUtil.getInstance().enable(false);
    }
}
