package com.yishua.hbxxl.splash;

import android.Manifest;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTAdSdk;
import com.bytedance.sdk.openadsdk.TTSplashAd;
import com.qq.e.ads.splash.SplashAD;
import com.qq.e.ads.splash.SplashADListener;
import com.qq.e.comm.util.AdError;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.yishua.hbxxl.AdConstant;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.SpValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.bean.AdConfigBean;
import com.yishua.hbxxl.http.bean.AdConfigDataBean;
import com.yishua.hbxxl.http.bean.AdIdConfigBean;
import com.yishua.hbxxl.http.bean.ConfigAppIdSetBean;
import com.yishua.hbxxl.http.bean.ConfigSplashAdBean;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.http.bean.ShieldConfigBean;
import com.yishua.hbxxl.module.dialog.PolicyDialogFragment;
import com.yishua.hbxxl.module.hpage.HpageUtil;
import com.yishua.hbxxl.util.AdActionUtil;
import com.yishua.hbxxl.util.InitSdkUtil;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.SpUtil;
import com.yishua.hbxxl.util.ToastUtil;
import com.yishua.hbxxl.util.UserUtil;
import com.yishua.hbxxl.wxapi.WXEntryActivity;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okhttp3.ResponseBody;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SplashActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String SKIP_TEXT = "???????????? %d";

    private FrameLayout fl_tt_container;
    private FrameLayout fl_gdt_container;
    private TextView skipView;

    private boolean gdtAdCanJump = false;
    private boolean showGdtAd; // ?????????????????????
    private boolean splashAdError = false; // ????????????????????????
    private boolean splashFirst;
    private ViewGroup cl_login;
    private View check;
    private View view_checked;
    private TextView tv_policy;
    private TextView tv_privacy_policy;
    private ViewGroup cl_policy_container;
    private LinearLayout ll_check_toast;
    private boolean isChecked = true;
    private SplashPresenter splashPresenter;

    private String province = "";
    private String city = "";
    private String cityCode = "";
    private String adCode = "";
    private int splashAdType = 0;
    private int splashBackendType = 0;
    private View login_icon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_splash);

        cl_login = findViewById(R.id.cl_login);
        login_icon = findViewById(R.id.login_icon);

        check = findViewById(R.id.check);
        view_checked = findViewById(R.id.view_checked);

        tv_policy = findViewById(R.id.tv_policy);
        tv_privacy_policy = findViewById(R.id.tv_privacy_policy);

        cl_policy_container = findViewById(R.id.cl_policy_container);
        ll_check_toast = findViewById(R.id.ll_check_toast);

        fl_tt_container = findViewById(R.id.fl_tt_container);
        fl_gdt_container = findViewById(R.id.fl_gdt_container);

        skipView = (TextView) findViewById(R.id.skip_view);

        init(getIntent());

        initListener();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        init(intent);
    }

    private void init(Intent intent) {
        splashPresenter = new SplashPresenter();
        splashFirst = SpUtil.isSplashFirst();

        if (splashFirst) {
            // ???????????????
            showPolicyDialog();
        } else {

            boolean login = UserUtil.isLogin();
            if (login) {
                cl_login.setVisibility(View.GONE);

                // ??????????????????????????????
                initData();
            } else {
                showLogin();

                splashPresenter.getAdConfig();
            }
        }
    }

    private void getLocationData() {

    }

    private void showPolicyDialog() {
        PolicyDialogFragment instance = PolicyDialogFragment.getInstance();
        instance.show(getSupportFragmentManager(), "");
        instance.setOnDialogClickListener(new PolicyDialogFragment.DialogClickListener() {
            @Override
            public void dismiss() {
                SpUtil.putSplashFirst(false);

                // ???????????????
                checkBasicPermission();

                // ???????????????????????????APPID??????????????????
                initSdk();
            }
        });
    }

    private void initSdk() {
        Map<String, String> params = new HashMap<>();
        params.put("param", "1");
        Request postRequest = HttpClient.getPostRequest(ConstantValue.URL_BASE + Api.ADIDCONFIG, params);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("getAdConfig onFailure = " + e.getMessage());
                        InitSdkUtil.init();
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();

                            if (body != null) {
                                String string = body.string();

                                AdConfigDataBean adConfigDataBean = JSON.parseObject(string, new TypeReference<AdConfigDataBean>() {
                                });

                                if (adConfigDataBean != null && adConfigDataBean.code == 0) {
                                    AdConfigBean adConfigBean = adConfigDataBean.data;

                                    LogUtils.e("adConfigBean is null = " + (adConfigBean == null));

                                    if (adConfigBean != null) {

                                        AdIdConfigBean adidconfig = adConfigBean.adidconfig;
                                        LogUtils.e("adidconfig is null = " + (adidconfig == null));
                                        if (adidconfig != null) {
                                            SharedPreferences sp_splash = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
                                            SharedPreferences.Editor edit = sp_splash.edit();

                                            ConfigAppIdSetBean appidset = adidconfig.appidset;
                                            ConfigSplashAdBean splashAd = adidconfig.splashAd;
//                                            List<ConfigVideoAdBean> videoad = configBean.videoad;

                                            if (appidset != null) {

                                                LogUtils.e("appidSet = " + JSON.toJSONString(appidset));
                                                edit.putString(SpValue.Key.CONFIG_APPIDSET, JSON.toJSONString(appidset));
                                            }

                                            if (splashAd != null) {
                                                LogUtils.e("splashAd = " + JSON.toJSONString(splashAd));
                                                edit.putString(SpValue.Key.CONFIG_SPLASHAD, JSON.toJSONString(splashAd));
                                            }

                                            edit.apply();

                                        }
                                    }
                                }
                            }
                        }

                        InitSdkUtil.init();
                    }
                });

        /**
         * ???????????????Manifest??????????????????????????????+??????AppKey???Channel???
         * ??????????????????????????????????????????????????????AppKey???Channel????????????
         * ?????????common???
         * ??????1:????????????????????????
         * ??????2:???????????????UMConfigure.DEVICE_TYPE_PHONE????????????UMConfigure.DEVICE_TYPE_BOX???????????????????????????
         * ??????3:Push???????????????secret,????????????Push?????????????????????Push???secret???????????????
         */
        UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE, "");

        // ??????AUTO???????????????????????????SDK????????????????????????????????????????????????
        // ???????????????App???Application.onCreate???????????????????????????
        MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.AUTO);
    }

    private void showLogin() {
        cl_login.setVisibility(View.VISIBLE);
        getLocationData();

        // ??????????????????????????????????????????????????????????????????????????????
        splashPresenter.getAppConfig();
    }

    private void initData() {
        // ?????????????????????????????????????????????
        // ????????????????????????????????????id????????????????????????
        splashPresenter.getAdConfig();

        // ????????????
//        AdCacheUtil.cacheAd();

        // ????????????
        AMapLocationClient aMapLocationClient = new AMapLocationClient(getApplicationContext());

        AMapLocationClientOption option = new AMapLocationClientOption();
        option.setOnceLocation(true);
        option.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);

        aMapLocationClient.setLocationOption(option);

        aMapLocationClient.setLocationListener(new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                if (aMapLocation != null) {
                    if (aMapLocation.getErrorCode() == 0) {
                        //??????????????????amapLocation?????????????????????

                        // https://lbs.amap.com/api/android-location-sdk/guide/android-location/getlocation
                        int locationType = aMapLocation.getLocationType();//??????????????????????????????????????????????????????????????????????????????
                        double latitude = aMapLocation.getLatitude();//????????????
                        double longitude = aMapLocation.getLongitude();//????????????
                        float accuracy = aMapLocation.getAccuracy();//??????????????????
                        String address = aMapLocation.getAddress();//???????????????option?????????isNeedAddress???false??????????????????????????????????????????????????????????????????GPS??????????????????????????????
                        String country = aMapLocation.getCountry();//????????????
                        //?????????
                        province = aMapLocation.getProvince();
                        //????????????
                        city = aMapLocation.getCity();
                        String district = aMapLocation.getDistrict();//????????????
                        String street = aMapLocation.getStreet();//????????????
                        String streetNum = aMapLocation.getStreetNum();//?????????????????????
                        //????????????
                        cityCode = aMapLocation.getCityCode();
                        //????????????
                        adCode = aMapLocation.getAdCode();
                        String aoiName = aMapLocation.getAoiName();//????????????????????????AOI??????
                        String buildingId = aMapLocation.getBuildingId();//????????????????????????????????????Id
                        String floor = aMapLocation.getFloor();//?????????????????????????????????

                        int gpsAccuracyStatus = aMapLocation.getGpsAccuracyStatus();//??????GPS???????????????
                        //??????????????????
                        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        Date date = new Date(aMapLocation.getTime());
                        df.format(date);

                        LogUtils.e("AmapLocation " +
                                "\nlocationType = " + locationType +
                                "\nlatitude = " + latitude +
                                "\nlongitude = " + longitude +
                                "\naccuracy = " + accuracy +
                                "\naddress = " + address +
                                "\ncountry = " + country +
                                "\nprovince = " + province +
                                "\ncity = " + city +
                                "\ndistrict = " + district +
                                "\nstreet = " + street +
                                "\nstreetNum = " + streetNum +
                                "\ncityCode = " + cityCode +
                                "\nadCode = " + adCode +
                                "\naoiName = " + aoiName +
                                "\nbuildingId = " + buildingId +
                                "\nfloor = " + floor +
                                "\ngpsAccuracyStatus = " + gpsAccuracyStatus +
                                "\ndata = " + date.toString());

                    } else {
                        //???????????????????????????ErrCode????????????????????????????????????????????????errInfo???????????????????????????????????????
                        LogUtils.e("AmapError  location Error, ErrCode:"
                                + aMapLocation.getErrorCode() + ", errInfo:"
                                + aMapLocation.getErrorInfo());
                    }
                }

                // ????????????????????????
                getShieldConfig();
            }
        });

        //???????????????????????????????????????stop????????????start???????????????????????????
        aMapLocationClient.stopLocation();
        aMapLocationClient.startLocation();
    }

    private void getShieldConfig() {
        Map<String, String> params = new HashMap<>();
        params.put("province", province);
        params.put("city", city);
        params.put("cityCode", cityCode);
        params.put("adCode", adCode);

        Request postRequest = HttpClient.getPostRequest(Api.SHIELDCONFIG, params);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("getShieldConfig error :" + e.getMessage());

                        // ??????????????????,???????????????????????????
                        if (SpUtil.isSplashShield()) {
                            gotoGame();
                        } else {
                            showSplashAd();
                        }
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();
                            if (body != null) {
                                String string = body.string();

                                ResponseBean<ShieldConfigBean> shieldConfigBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<ShieldConfigBean>>() {
                                });

                                if (shieldConfigBeanResponseBean != null && shieldConfigBeanResponseBean.getCode() == 0) {
                                    int splashshield = shieldConfigBeanResponseBean.getData().splashshield;

                                    int netshield = shieldConfigBeanResponseBean.getData().netshield;
                                    LogUtils.e("shield Config splash = " + splashshield + "  net = " + netshield);
                                    SpUtil.setShieldConfig(netshield, splashshield);

                                    if (splashshield != 1) {
                                        // ?????????????????????
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                showSplashAd();
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                        }

                        // ??????????????????,???????????????????????????
                        if (SpUtil.isSplashShield()) {
                            gotoGame();
                        } else {
                            showSplashAd();
                        }
                    }
                });
    }



    private void showSplashAd() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //
                SharedPreferences sp_splash = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);


                String string = sp_splash.getString(SpValue.Key.CONFIG_SPLASHAD, "");
                if (!TextUtils.isEmpty(string)) {
                    ConfigSplashAdBean configSplashAdBean = JSON.parseObject(string, ConfigSplashAdBean.class);
                    if (configSplashAdBean != null) {
                        splashAdType = configSplashAdBean.adType;
                        splashBackendType = configSplashAdBean.backendAdType;
                    }
                }

                LogUtils.e("splashType = " + splashAdType + "    splashBackendType = " + splashBackendType);

                showSplashAdByType();
            }
        });
    }


    private void showSplashAdByType() {
        if (splashAdType == 1) {
            SharedPreferences sp_splash = Util.getContext().getSharedPreferences(SpValue.Name.SP_NAME_SPLASH, Context.MODE_PRIVATE);
            String string = sp_splash.getString(SpValue.Key.CONFIG_SPLASHAD, "");

            // ?????????
            String gdtSplashPosId = ConstantValue.GDT_POS_ID_SPLASH;
            String gdtId = ConstantValue.GDT_APP_ID;
            if (!TextUtils.isEmpty(string)) {
                ConfigSplashAdBean configSplashAdBean = JSON.parseObject(string, ConfigSplashAdBean.class);
                if (configSplashAdBean != null) {
                    gdtSplashPosId = configSplashAdBean.gdtPostion;
                    gdtId = configSplashAdBean.gdtId;
                }
            }

            LogUtils.e("Gdt Splash PosId = " + gdtSplashPosId);

            if (TextUtils.isEmpty(gdtSplashPosId)) {
                // ????????????
                backendSplashAd();
            } else {
                getGdtSplash(gdtSplashPosId);
            }
        } else if (splashAdType == 2) {
            // ????????????
            getTTSplash();
        } else {
            backendSplashAd();
        }
    }

    private void backendSplashAd() {
        if (splashBackendType > 0) {
            splashAdType = splashBackendType;
            splashBackendType = 0;
            showSplashAdByType();
        } else {
            gotoGame();
        }
    }

    private void getTTSplash() {
        AdSlot adSlot = new AdSlot.Builder()
                .setCodeId(ConstantValue.TT_POS_ID_SPLASH)
                .setSupportDeepLink(true)
                .setImageAcceptedSize(1080, 1920)
                .build();
        TTAdNative adNative = TTAdSdk.getAdManager().createAdNative(Util.getContext());
        adNative.loadSplashAd(adSlot, new TTAdNative.SplashAdListener() {
            @Override
            public void onError(int i, String s) {
                LogUtils.e("tt splash onError i = " + i + "  s = " + s);
                backendSplashAd();
            }

            @Override
            public void onTimeout() {
                LogUtils.e("tt splash onTimeout");
                backendSplashAd();
            }

            @Override
            public void onSplashAdLoad(TTSplashAd ttSplashAd) {
                LogUtils.e("tt splash onSplashAdLoad---");

                if (ttSplashAd != null) {
                    View splashView = ttSplashAd.getSplashView();
                    fl_tt_container.setVisibility(View.VISIBLE);

                    fl_tt_container.removeAllViews();
                    fl_tt_container.addView(splashView);

                    ttSplashAd.setSplashInteractionListener(new TTSplashAd.AdInteractionListener() {
                        @Override
                        public void onAdClicked(View view, int i) {
                            AdActionUtil.upload(AdConstant.AD_TT_SPLASH, ttSplashAd.getInteractionType() == TTAdConstant.INTERACTION_TYPE_DOWNLOAD, "click", 0, 0);
                            LogUtils.e("TT Splash  onAdClicked -----");
                        }

                        @Override
                        public void onAdShow(View view, int i) {
                            AdActionUtil.upload(AdConstant.AD_TT_SPLASH, ttSplashAd.getInteractionType() == TTAdConstant.INTERACTION_TYPE_DOWNLOAD, "exp", 0, 0);
                            LogUtils.e("TT Splash  onAdShow -----");
                        }

                        @Override
                        public void onAdSkip() {
                            LogUtils.e("TT Splash  onAdSkip -----");
//                            EventBus.getDefault().post(new SplashAdCloseEvent(2));
                            gotoGame();
                        }

                        @Override
                        public void onAdTimeOver() {
                            LogUtils.e("TT Splash onAdTimeOver ------");
//                            EventBus.getDefault().post(new SplashAdCloseEvent(2));
                            gotoGame();
                        }
                    });
                } else {
                    backendSplashAd();
                }
            }
        }, 2000);
    }

    private void getGdtSplash(String posId) {
        fl_gdt_container.setVisibility(View.VISIBLE);
        skipView.setVisibility(View.VISIBLE);

        //
        SplashAD splashAD = new SplashAD(this, skipView, posId, new SplashADListener() {
            @Override
            public void onADDismissed() {
                LogUtils.e("gdtSplash splash onADDismissed");
                gdtAdNext();
            }

            @Override
            public void onNoAD(AdError adError) {
                LogUtils.e("gdtSplash GDT  onNOAD -- " + adError.getErrorMsg() + "   errCode = " + adError.getErrorCode());

                backendSplashAd();
            }

            @Override
            public void onADPresent() {
                AdActionUtil.upload(AdConstant.AD_GDT_SPLASH, false, "exp", 0, 0);

                LogUtils.e("gdtSplash onAdPresenter");
//                skipView.setVisibility(View.VISIBLE);
            }

            @Override
            public void onADClicked() {
                LogUtils.e("gdtSplash onADClicked ---");
                AdActionUtil.upload(AdConstant.AD_GDT_SPLASH, false, "click", 0, 0);
            }

            @Override
            public void onADTick(long l) {
                LogUtils.e("gdtSplash onAdTick l = " + l);
                skipView.setText(String.format(SKIP_TEXT, Math.round(l / 1000f)));
            }

            @Override
            public void onADExposure() {
                LogUtils.e("gdtSplash onAdExposure ---");

            }

            @Override
            public void onADLoaded(long l) {
                LogUtils.e("gdtSplash onAdLoaded --- = " + l);
            }
        }, 2000);
        splashAD.fetchAndShowIn(fl_gdt_container);
    }

    private void gdtAdNext() {
        LogUtils.e("next canJump = " + gdtAdCanJump);

        if (gdtAdCanJump) {
            gotoGame();
        } else {
            gdtAdCanJump = true;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (gdtAdCanJump) {
            gdtAdNext();
        }
        gdtAdCanJump = true;
    }

    @Override
    protected void onPause() {
        super.onPause();
        gdtAdCanJump = false;
    }

    private void initListener() {
        login_icon.setOnClickListener(this);

        float scale = 0.9f;
        long duration = 100;

        login_icon.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        v.animate().scaleX(scale).scaleY(scale).setDuration(duration).start();
                        break;
                    case MotionEvent.ACTION_UP:
                    case MotionEvent.ACTION_CANCEL:
                        v.animate().scaleX(1).scaleY(1).setDuration(duration).start();
                        break;
                    default:
                        break;
                }
                return v.onTouchEvent(event);
            }
        });

        check.setOnClickListener(this);
        tv_policy.setOnClickListener(this);
        tv_privacy_policy.setOnClickListener(this);
    }

    private void checkBasicPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            checkAndRequestPermission();
        } else {
            // ???????????????????????????
//            gotoLoginActivity();
            showLogin();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void checkAndRequestPermission() {
        List<String> lackedPermission = new ArrayList<String>();
        if (!(checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED)) {
            lackedPermission.add(Manifest.permission.READ_PHONE_STATE);
        }

        if (!(checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED)) {
            lackedPermission.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }

        int accessFineLocation = checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION);
        int accessCoarseLocation = checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION);
        if (accessCoarseLocation != PackageManager.PERMISSION_GRANTED || accessFineLocation != PackageManager.PERMISSION_GRANTED) {

            if (accessFineLocation != PackageManager.PERMISSION_GRANTED) {
                lackedPermission.add(Manifest.permission.ACCESS_FINE_LOCATION);
            }
            if (accessCoarseLocation != PackageManager.PERMISSION_GRANTED) {
                lackedPermission.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
        }

        if (lackedPermission.size() != 0) {
            // ??????????????????????????????onRequestPermissionsResult???????????????????????????????????????????????????????????????SDK?????????????????????SDK???
            String[] requestPermissions = new String[lackedPermission.size()];
            lackedPermission.toArray(requestPermissions);
            requestPermissions(requestPermissions, 1024);
        } else {
            // ?????????????????????
//            gotoLoginActivity();
            showLogin();
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.check:
                check();
                break;
            case R.id.login_icon:
                if (isChecked) {
                    wxLogin();
                } else {
                    showCheckToast();
                }
                break;

            case R.id.tv_policy:
                HpageUtil.jumpFunction(this, ConstantValue.USER_AGREEMENT,"????????????");
                break;
            case R.id.tv_privacy_policy:
                HpageUtil.jumpFunction(this, ConstantValue.PRIVACY_POLICY,"????????????");
                break;
        }
    }

    private void showCheckToast() {
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.anim_policy);
        animation.setRepeatMode(Animation.REVERSE);
        animation.setRepeatCount(2);
        animation.setDuration(100);

        animation.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) {

            }

            @Override
            public void onAnimationEnd(Animation animation) {
                showToastView();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {

            }
        });

        cl_policy_container.startAnimation(animation);
    }

    private void showToastView() {
        AnimatorSet animatorSet = new AnimatorSet();

        ObjectAnimator scaleX1 = ObjectAnimator.ofFloat(ll_check_toast, "scaleX", 0.8f, 1);
        scaleX1.setDuration(80);

        ObjectAnimator scaleY1 = ObjectAnimator.ofFloat(ll_check_toast, "scaleY", 0.8f, 1);
        scaleY1.setDuration(80);

        animatorSet.play(scaleX1).with(scaleY1);
        animatorSet.start();
        ll_check_toast.setVisibility(View.VISIBLE);

        ll_check_toast.postDelayed(new Runnable() {
            @Override
            public void run() {
                ll_check_toast.setVisibility(View.INVISIBLE);
            }
        }, 3000);
    }

    private void wxLogin() {
        if (!Util.checkApkExist("com.tencent.mm")) {
            ToastUtil.showToast("???????????????????????????????????????????????????");
        } else {
            IWXAPI wxapi = WXAPIFactory.createWXAPI(this, ConstantValue.APP_ID);
            wxapi.registerApp(ConstantValue.APP_ID);

            // ????????????
            final com.tencent.mm.opensdk.modelmsg.SendAuth.Req req = new SendAuth.Req();
            req.scope = "snsapi_userinfo"; // ???????????????????????????????????????????????????????????? snsapi_userinfo
            String instance = String.valueOf(System.currentTimeMillis());

            // state???????????????????????????????????????????????????????????????????????????????????????????????????????????? csrf ???????????????????????????????????????
            // ?????????????????????????????????????????????????????????????????? session ????????????
            req.state = WXEntryActivity.LOGIN + instance;
            WXEntryActivity.log_instance = WXEntryActivity.LOGIN + instance;
            wxapi.sendReq(req);
        }
    }

    private void check() {
        view_checked.setVisibility(isChecked ? View.GONE : View.VISIBLE);
        isChecked = !isChecked;

        if (isChecked) {
            ll_check_toast.setVisibility(View.INVISIBLE);
        }
    }


    public void gotoGame() {
        new Handler(Looper.getMainLooper())
                .postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // ?????????Game
                        Intent intent = new Intent(SplashActivity.this, AppActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        SplashActivity.this.finish();
                    }
                }, 500);
    }

    /**
     * ???????????????????????????????????????????????????????????????????????????????????????????????????App????????????????????????????????????
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_HOME) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
