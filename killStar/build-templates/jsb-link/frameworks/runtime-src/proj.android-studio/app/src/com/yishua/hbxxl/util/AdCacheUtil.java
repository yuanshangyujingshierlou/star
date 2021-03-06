package com.yishua.hbxxl.util;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.bytedance.sdk.openadsdk.AdSlot;
import com.bytedance.sdk.openadsdk.TTAdConstant;
import com.bytedance.sdk.openadsdk.TTAdDislike;
import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTNativeExpressAd;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.qq.e.ads.nativ.ADSize;
import com.qq.e.ads.nativ.NativeExpressAD;
import com.qq.e.ads.nativ.NativeExpressADView;
import com.qq.e.ads.rewardvideo.ServerSideVerificationOptions;
import com.qq.e.ads.rewardvideo2.ExpressRewardVideoAD;
import com.qq.e.ads.rewardvideo2.ExpressRewardVideoAdListener;
import com.qq.e.comm.util.AdError;
import com.qq.e.comm.util.VideoAdValidity;
import com.yishua.hbxxl.AdConstant;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.event.CCEvent;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;
import com.yishua.hbxxl.http.bean.AdTypeBean;
import com.yishua.hbxxl.http.bean.CacheAdTypeBean;
import com.yishua.hbxxl.http.bean.ResponseBean;
import com.yishua.hbxxl.http.bean.VideoAdBean;
import com.yishua.hbxxl.lifecycle.LifecycleCallback;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okhttp3.ResponseBody;
import org.greenrobot.eventbus.EventBus;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AdCacheUtil {
    private static List<TTNativeExpressAd> ttNativeExpressAdList = new ArrayList<>();
    private static List<NativeExpressADView> gdtNativeExpressList = new ArrayList<>();
    private static ExpressRewardVideoAD expressRewardVideoAD;
    private static TTRewardVideoAd ttRv;
    private static TTAdNative mTTAdNative;
    private static WeakReference<Activity> reference;
    private static boolean mRewardVerify; // ??????????????????????????????

    private static AdTypeBean adTypeBean;
    private static String mRvType; //

    private static NativeExpressADView mGdtExpressAd;
    private static TTNativeExpressAd mTTExpressAd;
    private static boolean mShowJump;

    public static void cacheAd(Activity activity) {
        //????????????activity????????????
        reference = new WeakReference<>(activity);

        // ??????????????????
        Request postRequest = HttpClient.getPostRequest(Api.CACHEADTYPE, null);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        // 2s?????????
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();
                            if (body != null) {
                                String string = body.string();

                                ResponseBean<CacheAdTypeBean> cacheAdTypeBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<CacheAdTypeBean>>() {
                                });

                                if (cacheAdTypeBeanResponseBean != null && cacheAdTypeBeanResponseBean.getCode() == 0) {
                                    CacheAdTypeBean data = cacheAdTypeBeanResponseBean.getData();

                                    List<String> cacheadtype = data.cacheadtype;

                                    for (String adType : cacheadtype
                                    ) {
                                        cacheAd(adType);
                                    }
                                }
                            }
                        }
                    }
                });

        cacheAdType();
    }

    /**
     * ??????????????????????????????????????????Android?????????????????????????????????
     */
    private static void cacheAdType() {
        Request postRequest = HttpClient.getPostRequest(Api.ADTYPE, null);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        //
                        LogUtils.e("cacheAdType fail = " + e.getMessage());
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (response != null && response.isSuccessful()) {
                            ResponseBody body = response.body();
                            if (body != null) {
                                String string = body.string();

                                ResponseBean<AdTypeBean> cacheAdTypeBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<AdTypeBean>>() {
                                });

                                if (cacheAdTypeBeanResponseBean != null && cacheAdTypeBeanResponseBean.getCode() == 0) {
                                    adTypeBean = cacheAdTypeBeanResponseBean.getData();
                                }
                            }
                        }
                    }
                });
    }

    private static void cacheAd(String adType) {
        LogUtils.e("init cacheAd type = " + adType);

        if ("1".equals(adType)) {
            // gdt
            cacheGdt();
        } else if ("2".equals(adType)) {
            // ??????
            cacheTTExpress();
        } else if ("201".equals(adType)) {
            // ??????????????????
            cacheTTRV();
        } else if ("202".equals(adType)) {
            // ?????????????????????
            cacheGdtRv();
        }
    }

    private static boolean ttRvCaching;

    private static void cacheTTRV() {
        if (ttRvCaching) {
            return;
        }
        try {
            if (mTTAdNative == null) {
                mTTAdNative = TTUtils.getTTAdNative();

                if (mTTAdNative == null) {
                    return;
                }
            }
            String ttVideoPosId = AdConfigUtil.getTTVideoPosId();
            LogUtils.e("tt rewardVideo posId = " + ttVideoPosId);

            //step4:????????????????????????AdSlot,??????????????????????????????
            AdSlot adSlot = new AdSlot.Builder()
                    .setCodeId(ttVideoPosId) // ?????????id
                    .setSupportDeepLink(true)
                    .setImageAcceptedSize(1080, 1920)
//                    .setRewardName(id) //????????????????????????id????????????
//                    .setRewardAmount(Util.parseInt(coin))  //???????????????
                    .setUserID("")//??????id,????????????
                    // .setMediaExtra("media_extra") //?????????????????????
                    .setOrientation(TTAdConstant.VERTICAL) //?????????????????????????????????????????????TTAdConstant.HORIZONTAL ??? TTAdConstant.VERTICAL
                    .build();

            ttRvCaching = true;
            mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
                @Override
                public void onError(int i, String s) {
                    LogUtils.e("TT Video onError  i = " + i + "   s = " + s);
                    ttRvCaching = false;
                }

                // ????????????????????????????????????????????????url?????????????????????????????????????????????????????????????????????????????????????????????????????????
                @Override
                public void onRewardVideoAdLoad(TTRewardVideoAd ttRewardVideoAd) {
                    LogUtils.e("TT Video  onRewardVideoAdLoad ------");
                    ttRvCaching = false;
                    ttRv = ttRewardVideoAd;
                    ttRv.setRewardAdInteractionListener(new TTRewardVideoAd.RewardAdInteractionListener() {

                        @Override
                        public void onAdShow() {
                            LogUtils.e("TT Rv onAdShow-----");
                            AdStatusUtil.onTTRvShow();

                            if (mShowJump) {
                                LifecycleCallback.getInstance().showRvJumpView();
                            }
                        }

                        @Override
                        public void onAdVideoBarClick() {
                            LogUtils.e("TT Rv onAdVideoBarClick-----");
                            AdStatusUtil.onTTRvClick();
                        }

                        @Override
                        public void onAdClose() {
                            LogUtils.e("TT Rv onAdClose-----");

                            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);

                            // ???????????????
                            cacheTTRV();
                            cacheAdType();
                        }

                        //????????????????????????
                        @Override
                        public void onVideoComplete() {
                            LogUtils.e("TT Rv onVideoComplete-----");
                            AdStatusUtil.onTTRvComplete();

                            if (mShowJump) {
                                LifecycleCallback.getInstance().dismissRvJumpView();
                            }
                        }

                        @Override
                        public void onVideoError() {
                            LogUtils.e("TT Rv onVideoError-----");

                            cacheAdType();
                        }

                        //?????????????????????????????????????????????rewardVerify??????????????????rewardAmount??????????????????rewardName???????????????
                        @Override
                        public void onRewardVerify(boolean rewardVerify, int rewardAmount, String rewardName, int errorCode, String errorMsg) {
                            LogUtils.e("TT Rv onRewardVerify----- rewardVerify = " + rewardVerify);
                            mRewardVerify = rewardVerify;
                            AdStatusUtil.onTTReward(rewardVerify);
                        }

                        @Override
                        public void onSkippedVideo() {
                            LogUtils.e("TT Rv onSkippedVideo-----");
                        }
                    });
                }

                // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                @Override
                public void onRewardVideoCached() {
                    LogUtils.e("TT Video onRewardVideoCached -------");
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
            ttRvCaching = false;
        }
    }

    private static boolean gdtRvCaching; // ??????Cache

    public static void cacheGdtRv() {
        if (gdtRvCaching) {
            return;
        }

        String gdtVideoPosId = AdConfigUtil.getGdtVideoPosId();

        Activity activity = reference.get();
        if (activity == null || activity.isFinishing()) {
            return;
        }

        gdtRvCaching = true;
        expressRewardVideoAD = new ExpressRewardVideoAD(activity, gdtVideoPosId, new ExpressRewardVideoAdListener() {
            @Override
            public void onAdLoaded() {
                LogUtils.e("gdt ???????????? onAdLoaded ----");
                // ?????????????????????????????????????????????
                gdtRvCaching = false;
            }

            @Override
            public void onVideoCached() {
                LogUtils.e("gdt ???????????? onVideoCached ----");
            }

            @Override
            public void onShow() {
//                EventBus.getDefault().post(new RewardVideoEvent(1, mShowJump));
                AdStatusUtil.onGdtRvShow();

                if (mShowJump) {
                    LifecycleCallback.getInstance().showRvJumpView();
                }
            }

            @Override
            public void onExpose() {
//                AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
                LogUtils.e("gdt ???????????? onExpose ----");
                AdStatusUtil.onGdtRvExpose();
            }

            @Override
            public void onReward(Map<String, Object> map) {
                Object o = map.get(ServerSideVerificationOptions.TRANS_ID); // ?????????????????????????????? ID
                LogUtils.e("gdt ???????????? onReward ---- = " + o);
                mRewardVerify = true;
                AdStatusUtil.onGdtReward(mRewardVerify);
            }

            @Override
            public void onClick() {
//                AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
                LogUtils.e("gdt ???????????? onClick ----");
                AdStatusUtil.onGdtRvClick();
            }

            @Override
            public void onVideoComplete() {
                LogUtils.e("gdt ???????????? onVideoComplete ----");
//                EventBus.getDefault().post(new RewardVideoEvent(2, mShowJump));
                AdStatusUtil.onGdtRvComplete();
                if (mShowJump) {
                    LifecycleCallback.getInstance().dismissRvJumpView();
                }
            }

            @Override
            public void onClose() {
                LogUtils.e("gdt ???????????? onClose ----");
                AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                // ???????????????
                expressRewardVideoAD.loadAD();
                cacheAdType();
            }

            @Override
            public void onError(AdError adError) {
                LogUtils.e("gdt ???????????? onError ---- " + adError.getErrorMsg() + "   errCode = " + adError.getErrorCode());
                gdtRvCaching = false;

                cacheAdType();
            }
        });
        expressRewardVideoAD.loadAD();
    }

    private static void cacheTTExpress() {
        // ??????????????????
        String ttNativePosId = AdConfigUtil.getTTNativePosId();

        LogUtils.e("tt nativePosId = " + ttNativePosId);

        DisplayMetrics displayMetrics =
                Util.getContext().getResources().getDisplayMetrics();
        int expressViewWidth = DensityUtil.px2dip(Util.getContext(), displayMetrics.widthPixels) - 40; // ??????padding

//            float expressViewWidth = 350;
        float expressViewHeight = 0; // ?????????????????????0,?????????????????????
        //step2:??????TTAdNative?????????createAdNative(Context context) banner??????context????????????Activity??????
        final TTAdNative adNative = TTUtils.getTTAdNative();
        if (adNative != null) {
            //step4:????????????????????????AdSlot,??????????????????????????????
            AdSlot adSlot = new AdSlot.Builder()
                    .setCodeId(ttNativePosId) // ?????????id
                    .setSupportDeepLink(true)
                    .setAdCount(1) //?????????????????????1???3???
                    .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) // ??????????????????view???size,?????? dp
                    .build();
            adNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
                @Override
                public void onError(int i, String s) {
                    LogUtils.e("TT ExpressNativeAd  onError i = " + i + "   s = " + s);
                }

                @Override
                public void onNativeExpressAdLoad(List<TTNativeExpressAd> list) {
                    LogUtils.e("TT ExpressNativeAd onSuccess = " + list.size());

                    if (list.size() > 0) {
                        TTNativeExpressAd ttNativeExpressAd = list.get(0);
                        if (ttNativeExpressAdList == null) {
                            ttNativeExpressAdList = new ArrayList<>();
                        }
                        ttNativeExpressAdList.add(ttNativeExpressAd);
                    }
                }
            });
        }
    }

    private static void cacheGdt() {
        ADSize adSize = new ADSize(ADSize.FULL_WIDTH, ADSize.AUTO_HEIGHT);
        String gdtNativeExpressPosId = AdConfigUtil.getGdtNativeExpressPosId();

        Activity activity = reference.get();
        if (activity == null || activity.isFinishing()) {
            return;
        }

        NativeExpressAD nativeExpressAD = new NativeExpressAD(activity, adSize, gdtNativeExpressPosId, new NativeExpressAD.NativeExpressADListener() {
            @Override
            public void onADLoaded(List<NativeExpressADView> list) {
                LogUtils.e("GDT Native Express  onAdLoad list = " + list.size());

                if (list.size() > 0) {
                    NativeExpressADView nativeExpressADView = list.get(0);
                    if (gdtNativeExpressList == null) {
                        gdtNativeExpressList = new ArrayList<>();
                    }

                    gdtNativeExpressList.add(nativeExpressADView);
                }
            }

            @Override
            public void onRenderFail(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onRenderFail");
            }

            @Override
            public void onRenderSuccess(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onRenderSuccess");
            }

            @Override
            public void onADExposure(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onADExposure");
//                AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
                AdStatusUtil.onGdtExpressShow();
            }

            @Override
            public void onADClicked(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onADClicked");
//                AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
                AdStatusUtil.onGdtExpressClick();
            }

            @Override
            public void onADClosed(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onADClosed");

            }

            @Override
            public void onADLeftApplication(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onADLeftApplication");
            }

            @Override
            public void onADOpenOverlay(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express   onADOpenOverlay");
            }

            @Override
            public void onADCloseOverlay(NativeExpressADView nativeExpressADView) {
                LogUtils.e("GDT Native Express  onADCloseOverlay");
            }

            @Override
            public void onNoAD(AdError adError) {
                LogUtils.e("GDT Native Express onNoAD adError = " + adError.getErrorMsg() + "   code =" + adError.getErrorCode());
            }
        });
        nativeExpressAD.loadAD(1);
    }

    private static Handler mHandler;

    private static Handler getMainHandler() {
        if (mHandler == null) {
            mHandler = new Handler(Looper.getMainLooper());
        }

        return mHandler;
    }

    /**
     * dismissExpressAd
     */
    public static void dismissExpress() {
        getMainHandler().removeCallbacksAndMessages(null);

        // ??????????????????
        if (mTTExpressAd != null) {
            mTTExpressAd.destroy();
            mTTExpressAd = null;

            // ????????????
            cacheTTExpress();
        }

        if (mGdtExpressAd != null) {
            mGdtExpressAd.destroy();
            mGdtExpressAd = null;

            // ????????????
            cacheGdt();
        }
    }

    /**
     * ???????????????
     *
     * @param type 1???????????????????????????    ???????????????????????????
     */
    public static void showExpressAd(String type, ViewGroup adContainer) {
        if (adTypeBean != null && adTypeBean.nativeAd != null) {
            LogUtils.e("show Express adtype ????????? ---- ");
            // ?????????????????????
            if ("1".equals(type)) {
                // ????????????????????????
                int delaytime = adTypeBean.nativeAd.delaytime;

                getMainHandler().removeCallbacksAndMessages(null);

                getMainHandler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // ????????????
                        showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                    }
                }, delaytime);
            } else {
                // ??????????????????
                showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
            }
        } else {
            LogUtils.e("show Express ??????????????????------ ");
            // ???????????????????????????????????????????????????????????????????????????????????????????????????
            Request postRequest = HttpClient.getPostRequest(Api.ADTYPE, null);

            HttpClient.getOkHttpClient()
                    .newCall(postRequest)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            //
                            LogUtils.e("cacheAdType fail = " + e.getMessage());
                            ToastUtil.showDebugToast("??????????????????");
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            if (response != null && response.isSuccessful()) {
                                ResponseBody body = response.body();
                                if (body != null) {
                                    String string = body.string();

                                    ResponseBean<AdTypeBean> cacheAdTypeBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<AdTypeBean>>() {
                                    });

                                    if (cacheAdTypeBeanResponseBean != null && cacheAdTypeBeanResponseBean.getCode() == 0) {
                                        adTypeBean = cacheAdTypeBeanResponseBean.getData();

//                                        showExpressAd(type, adContainer);

                                        if (adTypeBean != null && adTypeBean.nativeAd != null) {
                                            if ("1".equals(type)) {
                                                // ????????????????????????
                                                int delaytime = adTypeBean.nativeAd.delaytime;

                                                getMainHandler().removeCallbacksAndMessages(null);

                                                getMainHandler().postDelayed(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        // ????????????
                                                        showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                                                    }
                                                }, delaytime);
                                            } else {
                                                // ??????????????????
                                                showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                                            }
                                        } else {
                                            LogUtils.e("??????????????????????????????????????????");
//                                            ToastUtil.showDebugToast("??????????????????");
                                        }

                                    }
                                }
                            }
                        }
                    });
        }
    }

    /**
     * ?????????????????????
     * <br/>
     * ??????????????????<br/>
     * ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     *
     * @param adType     ??????
     * @param backAdType ??????????????????
     */
    private static void showExpressAd(String adType, String backAdType, ViewGroup adContainer) {
        LogUtils.e("showExpressAd adType = " + adType + "   backAdType = " + backAdType);

        if (!TextUtils.isEmpty(adType) && !TextUtils.isEmpty(backAdType)) {
            // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            cacheAdType();
        }

        if (AdConstant.AD_TYPE_EXPRESS_GDT.equals(adType)) {
            //
            if (gdtNativeExpressList != null && gdtNativeExpressList.size() > 0) {
                // ???????????????????????????
                showGdtExpress(gdtNativeExpressList.remove(0), adContainer);
            } else {
                if (!TextUtils.isEmpty(backAdType)) {
                    showExpressAd(backAdType, "", adContainer);
                } else {
                    // ????????????????????????
                    showInstantAd(adType, adContainer);
                }
            }
        } else if (AdConstant.AD_TYPE_EXPRESS_TT.equals(adType)) {
            //
            if (ttNativeExpressAdList != null && ttNativeExpressAdList.size() > 0) {
                //
                showTTExpress(ttNativeExpressAdList.remove(0), adContainer);
            } else {
                if (!TextUtils.isEmpty(backAdType)) {
                    showExpressAd(backAdType, "", adContainer);
                } else {
                    showInstantAd(adType, adContainer);
                }
            }
        }
    }

    /**
     * ??????????????????
     *
     * @param adType
     */
    private static void showInstantAd(String adType, ViewGroup adContainer) {
        if (AdConstant.AD_TYPE_EXPRESS_GDT.equals(adType)) {
            //
            ADSize adSize = new ADSize(ADSize.FULL_WIDTH, ADSize.AUTO_HEIGHT);
            String gdtNativeExpressPosId = AdConfigUtil.getGdtNativeExpressPosId();

            Activity activity = reference.get();
            if (activity == null || activity.isFinishing()) {
                return;
            }

            NativeExpressAD nativeExpressAD = new NativeExpressAD(activity, adSize, gdtNativeExpressPosId, new NativeExpressAD.NativeExpressADListener() {
                @Override
                public void onADLoaded(List<NativeExpressADView> list) {
                    LogUtils.e("GDT Native Express  onAdLoad list = " + list.size());

                    if (list.size() > 0) {
                        NativeExpressADView nativeExpressADView = list.get(0);
                        showGdtExpress(nativeExpressADView, adContainer);
                    }
                }

                @Override
                public void onRenderFail(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onRenderFail");
                }

                @Override
                public void onRenderSuccess(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onRenderSuccess");
                    int measuredWidth = nativeExpressADView.getMeasuredWidth();
                    int width = nativeExpressADView.getWidth();

                }

                @Override
                public void onADExposure(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onADExposure");
//                AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "exp", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
                    AdStatusUtil.onGdtExpressShow();
                }

                @Override
                public void onADClicked(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onADClicked");
//                AdActionUtil.upload(AdConstant.AD_GDT_NATIVE_EXPRESS, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_NATIVE_EXPRESS);
                    AdStatusUtil.onGdtExpressClick();
                }

                @Override
                public void onADClosed(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onADClosed");

                }

                @Override
                public void onADLeftApplication(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onADLeftApplication");
                }

                @Override
                public void onADOpenOverlay(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express   onADOpenOverlay");
                }

                @Override
                public void onADCloseOverlay(NativeExpressADView nativeExpressADView) {
                    LogUtils.e("GDT Native Express  onADCloseOverlay");
                }

                @Override
                public void onNoAD(AdError adError) {
                    LogUtils.e("GDT Native Express onNoAD adError = " + adError.getErrorMsg() + "   code =" + adError.getErrorCode());

                    ToastUtil.showDebugToast("??????????????????????????????");
                }
            });
            nativeExpressAD.loadAD(1);
        } else if (AdConstant.AD_TYPE_EXPRESS_TT.equals(adType)) {
            //
            // ??????????????????
            String ttNativePosId = AdConfigUtil.getTTNativePosId();

            LogUtils.e("tt nativePosId = " + ttNativePosId);

            DisplayMetrics displayMetrics =
                    Util.getContext().getResources().getDisplayMetrics();
            int expressViewWidth = DensityUtil.px2dip(Util.getContext(), displayMetrics.widthPixels) - 40; // ??????padding

//            float expressViewWidth = 350;
            float expressViewHeight = 0; // ?????????????????????0,?????????????????????
            //step2:??????TTAdNative?????????createAdNative(Context context) banner??????context????????????Activity??????
            final TTAdNative adNative = TTUtils.getTTAdNative();
            if (adNative != null) {
                //step4:????????????????????????AdSlot,??????????????????????????????
                AdSlot adSlot = new AdSlot.Builder()
                        .setCodeId(ttNativePosId) // ?????????id
                        .setSupportDeepLink(true)
                        .setAdCount(1) //?????????????????????1???3???
                        .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) // ??????????????????view???size,?????? dp
                        .build();
                adNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
                    @Override
                    public void onError(int i, String s) {
                        LogUtils.e("TT ExpressNativeAd  onError i = " + i + "   s = " + s);
                        ToastUtil.showDebugToast("??????????????????????????????");
                    }

                    @Override
                    public void onNativeExpressAdLoad(List<TTNativeExpressAd> list) {
                        LogUtils.e("TT ExpressNativeAd onSuccess = " + list.size());

                        if (list.size() > 0) {
                            TTNativeExpressAd ttNativeExpressAd = list.get(0);

                            showTTExpress(ttNativeExpressAd, adContainer);
                        }
                    }
                });
            }
        }
    }


    private static void showTTExpress(TTNativeExpressAd ttNativeExpressAd, ViewGroup adContainer) {
        mTTExpressAd = ttNativeExpressAd;

        ttNativeExpressAd.setExpressInteractionListener(new TTNativeExpressAd.ExpressAdInteractionListener() {
            @Override
            public void onAdClicked(View view, int i) {
                AdStatusUtil.onTTExpressClick();
            }

            @Override
            public void onAdShow(View view, int i) {
                int width1 = view.getWidth();
                int height1 = view.getHeight();
                int measuredWidth = view.getMeasuredWidth();
                int measuredHeight = view.getMeasuredHeight();

                int width2 = adContainer.getWidth();
                int height2 = adContainer.getHeight();
                int measuredWidth1 = adContainer.getMeasuredWidth();
                int measuredHeight1 = adContainer.getMeasuredHeight();

                LogUtils.e("tt express onAdShow width = " + width1 + "  height = " + height1 + "  measure width = " + measuredWidth + "  htight = " + measuredHeight);
                LogUtils.e("container width = " + width2 + "   height = " + height2 + "   measure width = " + measuredWidth1 + "   height = " + measuredHeight1);

                //
//                JsbResponse.adShow(height2);
                AdStatusUtil.onTTExpressShow();
            }

            @Override
            public void onRenderFail(View view, String s, int i) {

            }

            @Override
            public void onRenderSuccess(View view, float v, float v1) {
                adContainer.setVisibility(View.VISIBLE);
                //
                adContainer.removeAllViews();

                adContainer.addView(view);
            }
        });

        ttNativeExpressAd.setDislikeCallback(reference.get(), new TTAdDislike.DislikeInteractionCallback() {
            @Override
            public void onShow() {

            }

            @Override
            public void onSelected(int i, String s, boolean b) {
                EventBus.getDefault().post(new CCEvent(4, ""));
            }

            @Override
            public void onCancel() {

            }
        });

        ttNativeExpressAd.render();
    }

    private static void showGdtExpress(NativeExpressADView gdtExpressAd, ViewGroup adContainer) {
        mGdtExpressAd = gdtExpressAd;

        adContainer.setVisibility(View.VISIBLE);

        adContainer.removeAllViews();
        adContainer.addView(gdtExpressAd);

        gdtExpressAd.render();
    }

    public static void showRv(Activity activity, String type) {
        mRvType = type;
        reference = new WeakReference<>(activity);
        mRewardVerify = false;
        mShowJump = false;

        if (adTypeBean != null && adTypeBean.videoAd != null) {
            VideoAdBean videoAd = adTypeBean.videoAd;
            String adtype = videoAd.adtype;
            String backadtype = videoAd.backadtype;

            showRv(type, adtype, backadtype, videoAd.showjump);
        } else {
            // ???????????????????????????
            // ???????????????????????????????????????????????????????????????????????????????????????????????????
            Request postRequest = HttpClient.getPostRequest(Api.ADTYPE, null);

            HttpClient.getOkHttpClient()
                    .newCall(postRequest)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            //
                            LogUtils.e("cacheAdType fail = " + e.getMessage());
                            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
                            ToastUtil.showDebugToast("??????????????????");
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            if (response != null && response.isSuccessful()) {
                                ResponseBody body = response.body();
                                if (body != null) {
                                    String string = body.string();

                                    ResponseBean<AdTypeBean> cacheAdTypeBeanResponseBean = JSON.parseObject(string, new TypeReference<ResponseBean<AdTypeBean>>() {
                                    });

                                    if (cacheAdTypeBeanResponseBean != null && cacheAdTypeBeanResponseBean.getCode() == 0) {
                                        adTypeBean = cacheAdTypeBeanResponseBean.getData();

                                        if (adTypeBean != null && adTypeBean.videoAd != null) {
                                            getMainHandler()
                                                    .post(new Runnable() {
                                                        @Override
                                                        public void run() {
                                                            showRv(type, adTypeBean.videoAd.adtype, adTypeBean.videoAd.backadtype, adTypeBean.videoAd.showjump);
                                                        }
                                                    });

                                            return;
                                        } else {
                                            //
                                            LogUtils.e("??????????????????????????????????????????????????????");
                                        }


                                    }
                                }
                            }

                            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
                            ToastUtil.showDebugToast("??????????????????");
                        }
                    });
        }
    }

    private static void showRv(String type, String adtype, String backadtype, int showjump) {

        mShowJump = showjump == 1;

        if (AdConstant.AD_TYPE_RV_GDT.equals(adtype)) {
            if (expressRewardVideoAD != null) {
                // ??????????????????2????????????????????????????????????????????????
                VideoAdValidity validity = expressRewardVideoAD.checkValidity();
                LogUtils.e("gdt rv validity = " + validity.getMessage());
                if (validity == VideoAdValidity.SHOWED || validity == VideoAdValidity.OVERDUE) {
                    if (!TextUtils.isEmpty(backadtype)) {
                        showRv(type, backadtype, "", showjump);
                    } else {
                        //
                        AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                        ToastUtil.showDebugToast("??????????????????");
                    }
                    // ???????????????
                    LogUtils.e("gdt rv error ------");

                    cacheGdtRv();
                } else {
                    // ???????????????
                    expressRewardVideoAD.showAD(reference.get());
                }
            } else {
                // ????????????????????????
                if (!TextUtils.isEmpty(backadtype)) {
                    showRv(type, backadtype, "", showjump);
                } else {
                    //
                    AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                    ToastUtil.showDebugToast("??????????????????");
                }

                cacheGdtRv();
            }
        } else if (AdConstant.AD_TYPE_RV_TT.equals(adtype)) {
            if (ttRv != null) {
                ttRv.showRewardVideoAd(reference.get());
            } else {
                if (!TextUtils.isEmpty(backadtype)) {
                    showRv(type, backadtype, "", showjump);
                } else {
                    AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
                    ToastUtil.showDebugToast("??????????????????");
                }

                cacheTTRV();
            }
        } else {
            // ????????????????????????
            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
            ToastUtil.showDebugToast("????????????????????????");
        }
    }
}
