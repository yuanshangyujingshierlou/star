/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.event.CCEvent;
import com.yishua.hbxxl.event.ExpressAdShowEvent;
import com.yishua.hbxxl.event.LogoutEvent;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.bean.AutoUpdateBean;
import com.yishua.hbxxl.http.bean.ExpressAdBean;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.http.download.DownloadProgressListener;
import com.yishua.hbxxl.http.download.DownloadUtil;
import com.yishua.hbxxl.module.dialog.SettingDialogFragment;
import com.yishua.hbxxl.module.hpage.HpageUtil;
import com.yishua.hbxxl.splash.SplashActivity;
import com.yishua.hbxxl.util.AdCacheUtil;
import com.yishua.hbxxl.util.AdStatusUtil;
import com.yishua.hbxxl.util.InstallUtil;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.ToastUtil;
import com.yishua.hbxxl.util.UserUtil;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;

public class AppActivity extends Cocos2dxActivity {

    private RelativeLayout relativeLayout;
    private ImageView imageView;
    private TextView tvCancel;
    private TextView tvUpdate;
    private ProgressBar pb_progress;
    private TextView tv_progress;
    private TextView tv_cancel_pb;
    private AlertDialog alertDialog;
    private String fileSavePath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);

        EventBus.getDefault().register(this);

        // 缓存广告（信息流 & 激励视频）
        AdCacheUtil.cacheAd(this);
        LogUtils.e("AppActivity onCreate");

        autoUpdate();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);
        LogUtils.e("AppActivity onCreateView");
        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        LogUtils.e("AppActivity onResume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        LogUtils.e("AppActivity onPause");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        LogUtils.e("AppActivity onDestroy");
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

        EventBus.getDefault().unregister(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        LogUtils.e("AppActivity onActivityResult");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
        LogUtils.e("AppActivity onNewIntent");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
        LogUtils.e("AppActivity onRestart");
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
        LogUtils.e("AppActivity onStop");
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
        LogUtils.e("AppActivity onBackPressed");
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
        LogUtils.e("AppActivity onConfigurationChanged");
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
        LogUtils.e("AppActivity onRestoreInstanceState");
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
        LogUtils.e("AppActivity onSaveInstanceState");
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
        LogUtils.e("AppActivity onStart");
        addAdButton();
    }

    private void autoUpdate() {
        Request postRequest = HttpClient.getPostRequest(Api.AUTO_UPDATE, null);
        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("autoUpdate onFailure = " + e.getMessage());
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response.isSuccessful() && response.body() != null) {
                            String string = response.body().string();

                            ResponseBean<AutoUpdateBean> autoUpdateBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<AutoUpdateBean>>() {
                            });

                            if (autoUpdateBeanResponseBean != null && autoUpdateBeanResponseBean.getCode() == 0) {
                                AutoUpdateBean autoUpdateBean = autoUpdateBeanResponseBean.getData();

                                if (autoUpdateBean != null) {
                                    int resultcode = autoUpdateBean.resultcode;
                                    if (resultcode == 1) {
                                        // 有更新
                                        int isForce = autoUpdateBean.isForce;

                                        if (isForce == 1) {
                                            //
                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    showAutoUpdateDialog(autoUpdateBean);
                                                }
                                            });
                                        } else {
                                            // 普通更新，每天提醒一次
                                            SharedPreferences sp_config = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
                                            long checkUpdateHour = sp_config.getLong("checkUpdateHour", 0);
                                            long checkUpdateMillTime = sp_config.getLong("checkUpdateMillTime", 0);

                                            long currentTimeMillis = System.currentTimeMillis();//打开的时间
                                            //判断是不是今天第一次打开，
                                            Calendar calendar = Calendar.getInstance();
                                            int hour = calendar.get(Calendar.HOUR_OF_DAY);
                                            int minute = calendar.get(Calendar.MINUTE);

                                            LogUtils.e("checkUpdateHour = " + checkUpdateHour + "        current hour = " + hour);

                                            if (hour > checkUpdateHour && currentTimeMillis - checkUpdateMillTime > 24 * 60 * 60 * 1000) {
                                                //检查更新
                                                SharedPreferences.Editor edit = sp_config.edit();
                                                edit.putLong("checkUpdateHour", hour);
                                                edit.putLong("checkUpdateMillTime", currentTimeMillis);
                                                edit.apply();
//
                                                runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        showAutoUpdateDialog(autoUpdateBean);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
    }

    private void showAutoUpdateDialog(AutoUpdateBean autoUpdateBean) {
        String updateContent = autoUpdateBean.updateContent;
        String versionName = autoUpdateBean.versionName;
        int isForce = autoUpdateBean.isForce;
        String apkUrl = autoUpdateBean.url;

        AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.dialog_transparent);
        View view = View.inflate(this, R.layout.update_layout, null);
        builder.setView(view);
        builder.setCancelable(false);

        TextView tv_version = view.findViewById(R.id.tv_version);
        TextView tv_content = view.findViewById(R.id.tv_content);
//        LinearLayout ll_force_update = view.findViewById(R.id.ll_force_update);
//
//        TextView tv_force_update = view.findViewById(R.id.tv_force_update);
        tvCancel = view.findViewById(R.id.tv_cancel);
        tvUpdate = view.findViewById(R.id.tv_update);
//        LinearLayout ll_update = view.findViewById(R.id.ll_update);

        tv_version.setText("v" + versionName);
        tv_content.setText(updateContent.replaceAll("###", "\n"));

        pb_progress = view.findViewById(R.id.pb_progress);
        tv_progress = view.findViewById(R.id.tv_progress);
        tv_cancel_pb = view.findViewById(R.id.tv_cancel_pb);
        tv_progress.setEnabled(false);

        if (isForce == 0) {
            //普通更新

        } else if (isForce == 1) {
            // 强制更新
            tvCancel.setVisibility(View.GONE);
        }

        alertDialog = builder.create();

        tv_cancel_pb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LogUtils.e("tvcancelpb ----- dismiss -----");
                alertDialog.dismiss();
            }
        });

        tvCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                alertDialog.dismiss();
            }
        });

        tvUpdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                if (isForce != 1) {
//                    alertDialog.dismiss();
//                }

                LogUtils.e("downloadApk ------");
//                downloadApk(activity, apkUrl, isForce);
                downloadUpdateApk(apkUrl, isForce);
            }
        });

        tv_progress.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LogUtils.e("install apk ------");
                InstallUtil.installApk(fileSavePath);
            }
        });

        alertDialog.show();
        alertDialog.getWindow().setLayout(Util.dp2px(300), Util.dp2px(450));
    }

    private void downloadUpdateApk(String apkUrl, int isForce) {
        tvCancel.setVisibility(View.GONE);
        tvUpdate.setVisibility(View.GONE);

        pb_progress.setVisibility(View.VISIBLE);
        tv_progress.setVisibility(View.VISIBLE);

        if (isForce == 0) {
            tv_cancel_pb.setVisibility(View.VISIBLE);
        }

        String fileName = apkUrl.substring(apkUrl.lastIndexOf("/") + 1, apkUrl.length());//获取文件名称
        if (!fileName.endsWith(".apk")) {
            fileName = fileName + ".apk";
        }
        fileSavePath = Util.getExternalFilePath("Download", fileName);

        DownloadUtil.progressDownload(apkUrl, fileSavePath, new DownloadProgressListener() {
            @Override
            public void onProgress(int progress) {
                LogUtils.e("download Apk onProgress = " + progress);

                if (alertDialog != null && alertDialog.isShowing()) {
                    pb_progress.setProgress(progress);
                    tv_progress.setText("下载中" + progress + "%");
                }

                if (progress == 100) {
                    if (alertDialog != null && alertDialog.isShowing()) {
                        tv_progress.setText("立即安装");
                        tv_progress.setEnabled(true);
                    }
                }
            }

            @Override
            public void onFail(String message) {
                LogUtils.e("downloadApk onFail  " + message + "   thread = " + Thread.currentThread().getName());
                new Handler(Looper.getMainLooper())
                        .post(new Runnable() {
                            @Override
                            public void run() {
                                if (alertDialog != null && alertDialog.isShowing()) {
                                    ToastUtil.showToast("下载失败，请重试");

                                    tvCancel.setVisibility(View.VISIBLE);
                                    tvUpdate.setVisibility(View.VISIBLE);

                                    pb_progress.setVisibility(View.GONE);
                                    tv_progress.setVisibility(View.GONE);

                                    if (isForce == 0) {
                                        tv_cancel_pb.setVisibility(View.GONE);
                                    }
                                }
                            }
                        });
            }

            @Override
            public void onComplete() {
                LogUtils.e("downloadApk onComplete fileExit = " + new File(fileSavePath).exists());

                InstallUtil.installApk(fileSavePath);
            }
        });
    }

    private void addAdButton() {
//        Button showButton = new Button(this);
//        showButton.setText("Show");
//
//        showButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
////                showAd();
//
////                Cocos2dxHelper.runOnGLThread(new Runnable() {
////                    @Override
////                    public void run() {
//////                        LogUtils.e(" evalString = window.killStar.obtainRvCallback('1,1')");
//////                        obtainRvCallback
//////                        Cocos2dxJavascriptJavaBridge.evalString("window.killStar.obtainRvCallback('1','1')");
////
//////                        Cocos2dxJavascriptJavaBridge.evalString("window.killStar.obtainHttpData('111')");
////                    }
////                });
//
////                DownloadUtil.downloadPicBitmap("http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg", new DownloadUtil.DownloadPicBitmapListener() {
//////                DownloadUtil.downloadPicBitmap("https://thirdwx.qlogo.cn/mmopen/vi_32/pibUDa0drYAS0XtuBWsM6mtmmnWduVczQkK5TrKFUYv9TJ4HN4zXiaPGQ3dMaK23y9J7EJ56dQkHnHibhAE6KfOJw/132", new DownloadUtil.DownloadPicBitmapListener() {
////                    @Override
////                    public void onLoadFailed(String errMsg) {
////                        LogUtils.e("bitmap onLoadFailed " + errMsg);
////                    }
////
////                    @Override
////                    public void onLoadReady(Bitmap bitmap) {
////
////                        LogUtils.e("bitmap onLoadReady --- width = " + bitmap.getWidth());
////                        imageView.setVisibility(View.VISIBLE);
////                        imageView.setImageBitmap(bitmap);
////
////                    }
////                });
//
////                String fileSavePath = Util.getExternalFilePath("Download", "aaaaa.apk");
////
////                DownloadUtil.progressDownload("http://qiniu.clicknewskb.com/hbyzc-invite105.apk", fileSavePath, new DownloadProgressListener() {
////                    @Override
////                    public void onProgress(int progress) {
////                        LogUtils.e("download Apk onProgress = " + progress);
////                    }
////
////                    @Override
////                    public void onFail(String message) {
////                        LogUtils.e("downloadApk onFail  " + message + "   thread = " + Thread.currentThread().getName());
////
////                    }
////
////                    @Override
////                    public void onComplete() {
////                        LogUtils.e("downloadApk onComplete fileExit = " + new File(fileSavePath).exists());
////                    }
////                });
//            }
//        });
//
//        Button dismissButton = new Button(this);
//        dismissButton.setText("Dismiss");
//        dismissButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                dismissAd();
//            }
//        });

        imageView = new ImageView(this);
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        imageView.setVisibility(View.INVISIBLE);

        FrameLayout frameLayout = (FrameLayout) this.findViewById(Window.ID_ANDROID_CONTENT);

//        FrameLayout.LayoutParams showButtonParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.START);
//        frameLayout.addView(showButton, showButtonParams);
//
//        FrameLayout.LayoutParams dismissButtonParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.END);
//        frameLayout.addView(dismissButton, dismissButtonParams);

        relativeLayout = new RelativeLayout(this);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM);
        relativeLayout.setVisibility(View.GONE);
        relativeLayout.setBackgroundColor(getResources().getColor(R.color.white));

        frameLayout.addView(relativeLayout, layoutParams);

        FrameLayout.LayoutParams ivParam = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT, Gravity.CENTER);
        frameLayout.addView(imageView, ivParam);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(CCEvent event) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                int type = event.type;
                String param = event.param;
                LogUtils.e("ccEvent type = " + type + "    param = " + param);

                if (type == 1) {
                    // param 1：延迟广告   2：不需要延迟
                    AdCacheUtil.showExpressAd(param, relativeLayout);
                } else if (type == 2) {
                    // 激励视频
                    AdCacheUtil.showRv(AppActivity.this, param);
                    AdStatusUtil.rvType(param);
                } else if (type == 4) {
                    dismissAd();
                } else if (type == 5) {
                    // 展示用户弹窗
                    SettingDialogFragment settingDialogFragment = new SettingDialogFragment();
                    settingDialogFragment.show(getFragmentManager(), "");
                } else if (type == 3) {
                    // 提现
                    HpageUtil.jumpTask(AppActivity.this, ConstantValue.WITHDRAW);
                }
            }
        });
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(LogoutEvent event) {
        // 退出登录
        UserUtil.logout();

        Intent intent = new Intent(this, SplashActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);

        //todo AppActivity finish会报错，诡异的报错
//        finish();
    }

    private void dismissAd() {

        LogUtils.e("dismissAd ----- dismiss = " + (relativeLayout != null && relativeLayout.getVisibility() == View.VISIBLE));
//        if (relativeLayout != null && relativeLayout.getVisibility() == View.VISIBLE) {
        if (relativeLayout != null) {
            relativeLayout.removeAllViews();
            relativeLayout.setVisibility(View.GONE);
        }

        // 取消正在倒计时准备展示的广告
        AdCacheUtil.dismissExpress();
    }

    private long mExitTime;

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //判断用户是否点击了“返回键”
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            //与上次点击返回键时刻作差
            if ((System.currentTimeMillis() - mExitTime) > 2000) {
                //大于2000ms则认为是误操作，使用Toast进行提示
                Toast.makeText(this, "再按一次退出", Toast.LENGTH_SHORT).show();
                //并记录下本次点击“返回键”的时刻，以便下次进行判断
                mExitTime = System.currentTimeMillis();
            } else {
                //小于2000ms则认为是用户确实希望退出程序-调用System.exit()方法进行退出
                // System.exit(0);
                this.finish();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(ExpressAdShowEvent event) {
        String size = "";
        // 信息流广告展示，通知cocos
        if (relativeLayout != null && relativeLayout.getVisibility() == View.VISIBLE) {
            int width = relativeLayout.getWidth();
            int height = relativeLayout.getHeight();

            // 当前屏幕尺寸
            WindowManager mWindowManager = (WindowManager) this.getSystemService(Context.WINDOW_SERVICE);
            DisplayMetrics metrics = new DisplayMetrics();
            mWindowManager.getDefaultDisplay().getMetrics(metrics);
            int screenWidth = metrics.widthPixels;//获取到的是px，像素，绝对像素，需要转化为dpi
            int screenHeight = metrics.heightPixels;

            ExpressAdBean expressAdBean = new ExpressAdBean(screenWidth, screenHeight, width, height);

            size = JSON.toJSONString(expressAdBean);
        }

        LogUtils.e("size = " + size);

        JsbResponse.resp1("obtainAdCallback", size);
    }
}
