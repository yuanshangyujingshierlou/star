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
    private static boolean mRewardVerify; // 激励视频播放是否有效

    private static AdTypeBean adTypeBean;
    private static String mRvType; //

    private static NativeExpressADView mGdtExpressAd;
    private static TTNativeExpressAd mTTExpressAd;
    private static boolean mShowJump;

    public static void cacheAd(Activity activity) {
        //这里传入activity的上下文
        reference = new WeakReference<>(activity);

        // 请求缓存配置
        Request postRequest = HttpClient.getPostRequest(Api.CACHEADTYPE, null);

        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        // 2s后重试
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
     * 缓存广告类型，每次展示广告由Android判断延迟时间和广告类型
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
            // 头条
            cacheTTExpress();
        } else if ("201".equals(adType)) {
            // 头条激励视频
            cacheTTRV();
        } else if ("202".equals(adType)) {
            // 广点通激励视频
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

            //step4:创建广告请求参数AdSlot,具体参数含义参考文档
            AdSlot adSlot = new AdSlot.Builder()
                    .setCodeId(ttVideoPosId) // 广告位id
                    .setSupportDeepLink(true)
                    .setImageAcceptedSize(1080, 1920)
//                    .setRewardName(id) //奖励的名称，作为id传递过去
//                    .setRewardAmount(Util.parseInt(coin))  //奖励的数量
                    .setUserID("")//用户id,必传参数
                    // .setMediaExtra("media_extra") //附加参数，可选
                    .setOrientation(TTAdConstant.VERTICAL) //必填参数，期望视频的播放方向：TTAdConstant.HORIZONTAL 或 TTAdConstant.VERTICAL
                    .build();

            ttRvCaching = true;
            mTTAdNative.loadRewardVideoAd(adSlot, new TTAdNative.RewardVideoAdListener() {
                @Override
                public void onError(int i, String s) {
                    LogUtils.e("TT Video onError  i = " + i + "   s = " + s);
                    ttRvCaching = false;
                }

                // 视频广告的素材加载完毕，比如视频url等，在此回调后，可以播放在线视频，网络不好可能出现加载缓冲，影响体验。
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

                            // 再缓存一条
                            cacheTTRV();
                            cacheAdType();
                        }

                        //视频播放完成回调
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

                        //视频播放完成后，奖励验证回调，rewardVerify：是否有效，rewardAmount：奖励梳理，rewardName：奖励名称
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

                // 视频广告加载后，视频资源缓存到本地的回调，在此回调后，播放本地视频，流畅不阻塞。
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

    private static boolean gdtRvCaching; // 正在Cache

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
                LogUtils.e("gdt 激励视频 onAdLoaded ----");
                // 缓存激励视频，在需要的时候展示
                gdtRvCaching = false;
            }

            @Override
            public void onVideoCached() {
                LogUtils.e("gdt 激励视频 onVideoCached ----");
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
                LogUtils.e("gdt 激励视频 onExpose ----");
                AdStatusUtil.onGdtRvExpose();
            }

            @Override
            public void onReward(Map<String, Object> map) {
                Object o = map.get(ServerSideVerificationOptions.TRANS_ID); // 获取服务端验证的唯一 ID
                LogUtils.e("gdt 激励视频 onReward ---- = " + o);
                mRewardVerify = true;
                AdStatusUtil.onGdtReward(mRewardVerify);
            }

            @Override
            public void onClick() {
//                AdActionUtil.upload(AdConstant.AD_GDT_VIDEO, false, "click", 0, AdConstant.AD_CLIENT_CONFIG_ID_GDT_VIDEO);
                LogUtils.e("gdt 激励视频 onClick ----");
                AdStatusUtil.onGdtRvClick();
            }

            @Override
            public void onVideoComplete() {
                LogUtils.e("gdt 激励视频 onVideoComplete ----");
//                EventBus.getDefault().post(new RewardVideoEvent(2, mShowJump));
                AdStatusUtil.onGdtRvComplete();
                if (mShowJump) {
                    LifecycleCallback.getInstance().dismissRvJumpView();
                }
            }

            @Override
            public void onClose() {
                LogUtils.e("gdt 激励视频 onClose ----");
                AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                // 再缓存一条
                expressRewardVideoAD.loadAD();
                cacheAdType();
            }

            @Override
            public void onError(AdError adError) {
                LogUtils.e("gdt 激励视频 onError ---- " + adError.getErrorMsg() + "   errCode = " + adError.getErrorCode());
                gdtRvCaching = false;

                cacheAdType();
            }
        });
        expressRewardVideoAD.loadAD();
    }

    private static void cacheTTExpress() {
        // 头条模板广告
        String ttNativePosId = AdConfigUtil.getTTNativePosId();

        LogUtils.e("tt nativePosId = " + ttNativePosId);

        DisplayMetrics displayMetrics =
                Util.getContext().getResources().getDisplayMetrics();
        int expressViewWidth = DensityUtil.px2dip(Util.getContext(), displayMetrics.widthPixels) - 40; // 减去padding

//            float expressViewWidth = 350;
        float expressViewHeight = 0; // 如果高度设置为0,则高度会自适应
        //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
        final TTAdNative adNative = TTUtils.getTTAdNative();
        if (adNative != null) {
            //step4:创建广告请求参数AdSlot,具体参数含义参考文档
            AdSlot adSlot = new AdSlot.Builder()
                    .setCodeId(ttNativePosId) // 广告位id
                    .setSupportDeepLink(true)
                    .setAdCount(1) //请求广告数量为1到3条
                    .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) // 期望模板广告view的size,单位 dp
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

        // 销毁当前广告
        if (mTTExpressAd != null) {
            mTTExpressAd.destroy();
            mTTExpressAd = null;

            // 继续缓存
            cacheTTExpress();
        }

        if (mGdtExpressAd != null) {
            mGdtExpressAd.destroy();
            mGdtExpressAd = null;

            // 继续缓存
            cacheGdt();
        }
    }

    /**
     * 信息流广告
     *
     * @param type 1：需要延迟展示广告    其他：实时展示广告
     */
    public static void showExpressAd(String type, ViewGroup adContainer) {
        if (adTypeBean != null && adTypeBean.nativeAd != null) {
            LogUtils.e("show Express adtype 有缓存 ---- ");
            // 有广告配置缓存
            if ("1".equals(type)) {
                // 需要延迟展示广告
                int delaytime = adTypeBean.nativeAd.delaytime;

                getMainHandler().removeCallbacksAndMessages(null);

                getMainHandler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // 展示广告
                        showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                    }
                }, delaytime);
            } else {
                // 实时展示广告
                showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
            }
        } else {
            LogUtils.e("show Express 请求广告类型------ ");
            // 先去请求配置，再根据配置展示广告（这种情况会很少，一般都会先缓存）
            Request postRequest = HttpClient.getPostRequest(Api.ADTYPE, null);

            HttpClient.getOkHttpClient()
                    .newCall(postRequest)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            //
                            LogUtils.e("cacheAdType fail = " + e.getMessage());
                            ToastUtil.showDebugToast("广告加载失败");
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
                                                // 需要延迟展示广告
                                                int delaytime = adTypeBean.nativeAd.delaytime;

                                                getMainHandler().removeCallbacksAndMessages(null);

                                                getMainHandler().postDelayed(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        // 展示广告
                                                        showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                                                    }
                                                }, delaytime);
                                            } else {
                                                // 实时展示广告
                                                showExpressAd(adTypeBean.nativeAd.adtype, adTypeBean.nativeAd.backadtype, adContainer);
                                            }
                                        } else {
                                            LogUtils.e("没有广告预算或者属于屏蔽广告");
//                                            ToastUtil.showDebugToast("广告加载失败");
                                        }

                                    }
                                }
                            }
                        }
                    });
        }
    }

    /**
     * 真正的展示广告
     * <br/>
     * 广告展示逻辑<br/>
     * 从对应缓存列表中拉取展示。无缓存广告则用打底广告展示，打底广告无缓存时，实时请求打底广告
     *
     * @param adType     广告
     * @param backAdType 打底广告类型
     */
    private static void showExpressAd(String adType, String backAdType, ViewGroup adContainer) {
        LogUtils.e("showExpressAd adType = " + adType + "   backAdType = " + backAdType);

        if (!TextUtils.isEmpty(adType) && !TextUtils.isEmpty(backAdType)) {
            // 重新缓存广告配置（因为可能遇到使用打底广告的原因，只在第一次缓存广告类型）
            cacheAdType();
        }

        if (AdConstant.AD_TYPE_EXPRESS_GDT.equals(adType)) {
            //
            if (gdtNativeExpressList != null && gdtNativeExpressList.size() > 0) {
                // 有广点通缓存的广告
                showGdtExpress(gdtNativeExpressList.remove(0), adContainer);
            } else {
                if (!TextUtils.isEmpty(backAdType)) {
                    showExpressAd(backAdType, "", adContainer);
                } else {
                    // 实时请求打底广告
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
     * 实时请求广告
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

                    ToastUtil.showDebugToast("实时打底广告加载失败");
                }
            });
            nativeExpressAD.loadAD(1);
        } else if (AdConstant.AD_TYPE_EXPRESS_TT.equals(adType)) {
            //
            // 头条模板广告
            String ttNativePosId = AdConfigUtil.getTTNativePosId();

            LogUtils.e("tt nativePosId = " + ttNativePosId);

            DisplayMetrics displayMetrics =
                    Util.getContext().getResources().getDisplayMetrics();
            int expressViewWidth = DensityUtil.px2dip(Util.getContext(), displayMetrics.widthPixels) - 40; // 减去padding

//            float expressViewWidth = 350;
            float expressViewHeight = 0; // 如果高度设置为0,则高度会自适应
            //step2:创建TTAdNative对象，createAdNative(Context context) banner广告context需要传入Activity对象
            final TTAdNative adNative = TTUtils.getTTAdNative();
            if (adNative != null) {
                //step4:创建广告请求参数AdSlot,具体参数含义参考文档
                AdSlot adSlot = new AdSlot.Builder()
                        .setCodeId(ttNativePosId) // 广告位id
                        .setSupportDeepLink(true)
                        .setAdCount(1) //请求广告数量为1到3条
                        .setExpressViewAcceptedSize(expressViewWidth, expressViewHeight) // 期望模板广告view的size,单位 dp
                        .build();
                adNative.loadNativeExpressAd(adSlot, new TTAdNative.NativeExpressAdListener() {
                    @Override
                    public void onError(int i, String s) {
                        LogUtils.e("TT ExpressNativeAd  onError i = " + i + "   s = " + s);
                        ToastUtil.showDebugToast("实时打底广告加载失败");
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
            // 没有换成的广告配置
            // 先去请求配置，再根据配置展示广告（这种情况会很少，一般都会先缓存）
            Request postRequest = HttpClient.getPostRequest(Api.ADTYPE, null);

            HttpClient.getOkHttpClient()
                    .newCall(postRequest)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            //
                            LogUtils.e("cacheAdType fail = " + e.getMessage());
                            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
                            ToastUtil.showDebugToast("没有激励视频");
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
                                            LogUtils.e("获取激励视频类型失败，或者屏蔽了广告");
                                        }


                                    }
                                }
                            }

                            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
                            ToastUtil.showDebugToast("没有激励视频");
                        }
                    });
        }
    }

    private static void showRv(String type, String adtype, String backadtype, int showjump) {

        mShowJump = showjump == 1;

        if (AdConstant.AD_TYPE_RV_GDT.equals(adtype)) {
            if (expressRewardVideoAD != null) {
                // 广告展示检查2：是否过期、是否展示过、是否缓存
                VideoAdValidity validity = expressRewardVideoAD.checkValidity();
                LogUtils.e("gdt rv validity = " + validity.getMessage());
                if (validity == VideoAdValidity.SHOWED || validity == VideoAdValidity.OVERDUE) {
                    if (!TextUtils.isEmpty(backadtype)) {
                        showRv(type, backadtype, "", showjump);
                    } else {
                        //
                        AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                        ToastUtil.showDebugToast("没有激励视频");
                    }
                    // 无效的广告
                    LogUtils.e("gdt rv error ------");

                    cacheGdtRv();
                } else {
                    // 有效的广告
                    expressRewardVideoAD.showAD(reference.get());
                }
            } else {
                // 没有激励视频缓存
                if (!TextUtils.isEmpty(backadtype)) {
                    showRv(type, backadtype, "", showjump);
                } else {
                    //
                    AdStatusUtil.onGDTRvClose(mRvType, mRewardVerify);
                    ToastUtil.showDebugToast("没有激励视频");
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
                    ToastUtil.showDebugToast("没有激励视频");
                }

                cacheTTRV();
            }
        } else {
            // 没有配置激励视频
            AdStatusUtil.onTTRvClose(mRvType, mRewardVerify);
            ToastUtil.showDebugToast("没有配置激励视频");
        }
    }
}
