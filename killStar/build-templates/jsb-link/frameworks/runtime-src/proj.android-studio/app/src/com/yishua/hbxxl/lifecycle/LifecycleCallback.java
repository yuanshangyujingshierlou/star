package com.yishua.hbxxl.lifecycle;

import android.app.Activity;
import android.app.Application;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AlertDialog;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;


import com.yishua.hbxxl.R;
import com.yishua.hbxxl.util.AdCacheUtil;
import com.yishua.hbxxl.util.AdStatusUtil;
import com.yishua.hbxxl.util.LogUtils;

public class LifecycleCallback implements Application.ActivityLifecycleCallbacks {

    private static String TAG = "LifecycleCallback";

    private Activity currentActivity;

    private static LifecycleCallback instance;
    private AlertDialog alertDialog;

    public static LifecycleCallback getInstance() {

        if (instance == null) {
            synchronized (LifecycleCallback.class) {
                if (instance == null) {
                    instance = new LifecycleCallback();
                }
            }
        }

        return instance;
    }

    public Activity getCurrentActivity() {
        return currentActivity;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        currentActivity = activity;

        LogUtils.e(TAG + "  activityCreated -- " + activity.getLocalClassName());
    }

    @Override
    public void onActivityStarted(Activity activity) {

    }

    @Override
    public void onActivityResumed(Activity activity) {
        if (activity.getLocalClassName().contains("com.qq.e.ads")) {
            LogUtils.e("GDT RewardVideoActivity = " + activity.getLocalClassName());

            // gdt激励视频
            FrameLayout frameLayout = (FrameLayout) currentActivity.findViewById(Window.ID_ANDROID_CONTENT);

            int childCount = frameLayout.getChildCount();
            LogUtils.e("frameLayout childCount = " + childCount);

            if (childCount > 0) {
                View child1 = frameLayout.getChildAt(0);
                if (child1 instanceof ViewGroup) {
                    int childCount1 = ((ViewGroup) child1).getChildCount();
                    LogUtils.e("child l count = " + childCount1);

                    // child: c -- b -- f -- a
                    for (int i = 0; i < childCount1; i++) {
                        View childAt = ((ViewGroup) child1).getChildAt(i);
                        LogUtils.e("child l child ------ " + childAt.getClass().getName());

                        if (childAt.getClass().getSimpleName().equals("c")) {
                            // c
                            if (childAt instanceof ViewGroup) {
                                for (int j = 0; j < ((ViewGroup) childAt).getChildCount(); j++) {
                                    View childAt1 = ((ViewGroup) childAt).getChildAt(j);
                                    LogUtils.e("childAt1 = " + childAt1.getClass().getSimpleName());
                                    if (childAt1.getClass().getSimpleName().equals("RelativeLayout")) {
                                        //
                                        RelativeLayout closeContainer = (RelativeLayout) childAt1;

                                        for (int k = 0; k < closeContainer.getChildCount(); k++) {
                                            View childAt2 = closeContainer.getChildAt(k);
                                            LogUtils.e("childAt2 = " + childAt2.getClass().getSimpleName());

                                            if (childAt2.getClass().getSimpleName().equals("ImageView")) {

                                                int id = childAt2.getId();
                                                LogUtils.e("id id id id = " + id);
                                                if (id == 2131755011) {
                                                    // 关闭按钮
                                                    childAt2.setOnClickListener(new View.OnClickListener() {
                                                        @Override
                                                        public void onClick(View v) {
                                                            showTerminalDialog();
                                                        }
                                                    });
                                                }
                                            }
                                        }

                                        break;
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
            }
        }
    }

    private void showTerminalDialog() {
        alertDialog = new AlertDialog.Builder(currentActivity, R.style.dialog_video_jump)
                .setTitle("观看完整视频才能获得奖励")
                .setPositiveButton("继续观看", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                })
                .setNegativeButton("放弃奖励", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // 通过sdk自带的close回调判断，根据isRewardSuccess判断是否为有效激励视频
//                        EventBus.getDefault().post(new RewardVideoClose(-2, "", "", false));

                        // gdt激励视频通过这种方式关闭后不会走onClose回调，需要换成广点通激励视频
                        if (currentActivity.getLocalClassName().contains("com.qq.e.ads")) {
                            AdCacheUtil.cacheGdtRv();
                            AdStatusUtil.onGdtRvCloseError();
                        }

                        dialog.dismiss();

                        currentActivity.finish();
                    }
                })
                .create();

        alertDialog.show();
    }

    @Override
    public void onActivityPaused(Activity activity) {

    }

    @Override
    public void onActivityStopped(Activity activity) {

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

    }

    @Override
    public void onActivityDestroyed(Activity activity) {

    }

    public void showRvJumpView() {
        if (currentActivity != null && (currentActivity.getLocalClassName().contains("com.bytedance.sdk.openadsdk")
                || currentActivity.getLocalClassName().contains("com.qq.e.ads")
                || currentActivity.getLocalClassName().contains("com.kwad.sdk"))) {
            // 展示跳过按钮,延迟5s
            new Handler(Looper.getMainLooper())
                    .postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            showVideoJump();
                        }
                    }, 5000);
        }
    }

    private void showVideoJump() {
        Window window = currentActivity.getWindow();
        View decorView = window.getDecorView();
        decorView.post(new Runnable() {
            @Override
            public void run() {
                FrameLayout frameLayout = (FrameLayout) currentActivity.findViewById(Window.ID_ANDROID_CONTENT);

                LayoutInflater from = LayoutInflater.from(currentActivity);
                View inflate = from.inflate(R.layout.layout_dialog_close, null);

                inflate.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        showTerminalDialog();
                    }
                });

                FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.END);

                layoutParams.topMargin = 50;
                layoutParams.rightMargin = 50;

                inflate.setLayoutParams(layoutParams);
                frameLayout.addView(inflate);
            }
        });
    }

    public void dismissRvJumpView() {
        if (currentActivity != null && (currentActivity.getLocalClassName().contains("com.bytedance.sdk.openadsdk")
                || currentActivity.getLocalClassName().contains("com.qq.e.ads")
                || currentActivity.getLocalClassName().contains("com.kwad.sdk"))) {

            if (alertDialog != null && alertDialog.isShowing()) {
                alertDialog.dismiss();
            }

            Window window = currentActivity.getWindow();
            View decorView = window.getDecorView();
            decorView.post(new Runnable() {
                @Override
                public void run() {
                    FrameLayout frameLayout = (FrameLayout) currentActivity.findViewById(Window.ID_ANDROID_CONTENT);

                    View view = frameLayout.findViewById(R.id.tv_cus_dialog);
                    LogUtils.e("is view null == " + (view == null));

                    if (view != null) {
                        frameLayout.removeView(view);
                    }
                }
            });
        }
    }
}
