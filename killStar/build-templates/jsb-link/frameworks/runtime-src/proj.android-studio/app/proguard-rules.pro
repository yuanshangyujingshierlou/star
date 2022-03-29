# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in E:\developSoftware\Android\SDK/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Proguard Cocos2d-x-lite for release
-keep public class org.cocos2dx.** { *; }
-dontwarn org.cocos2dx.**

# Proguard Apache HTTP for release
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.**

# Proguard okhttp for release
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

-keep class okio.** { *; }
-dontwarn okio.**

# Proguard Android Webivew for release. you can comment if you are not using a webview
-keep public class android.net.http.SslError
-keep public class android.webkit.WebViewClient

-dontwarn android.webkit.WebView
-dontwarn android.net.http.SslError
-dontwarn android.webkit.WebViewClient

# keep anysdk for release. you can comment if you are not using anysdk
-keep public class com.anysdk.** { *; }
-dontwarn com.anysdk.**


# 高德
-keep class com.amap.api.location.**{*;}
-keep class com.amap.api.fence.**{*;}
-keep class com.loc.**{*;}
-keep class com.autonavi.aps.amapapi.model.**{*;}
#

#oaid
-keep class com.bun.miitmdid.core.** {*;}
#oaid 新 1.0.25
-keep class com.bun.miitmdid.core.** {*;}
-keep class XI.CA.XI.**{*;}
-keep class XI.K0.XI.**{*;}
-keep class XI.XI.K0.**{*;}
-keep class XI.xo.XI.XI.**{*;}
-keep class com.asus.msa.SupplementaryDID.**{*;}
-keep class com.asus.msa.sdid.**{*;}
-keep class com.bun.lib.**{*;}
-keep class com.bun.miitmdid.**{*;}
-keep class com.huawei.hms.ads.identifier.**{*;}
-keep class com.samsung.android.deviceidservice.**{*;}
-keep class com.zui.opendeviceidlibrary.**{*;}
-keep class org.json.**{*;}
-keep public class com.netease.nis.sdkwrapper.Utils {public <methods>;}
#oaid
#oaid

# 头条
-keep class com.bytedance.sdk.openadsdk.** { *; }
-keep public interface com.bytedance.sdk.openadsdk.downloadnew.** {*;}
-keep class com.pgl.sys.ces.** {*;}
-keep class com.bytedance.embed_dr.** {*;}
-keep class com.bytedance.embedapplog.** {*;}
# 头条

###################################################################################################################
# gdt 混淆，先根据官方提供的来吧，其中有很多没用到的就先不管了
-dontwarn com.androidquery.**
-keep class com.androidquery.** { *;}

-dontwarn tv.danmaku.**
-keep class tv.danmaku.** { *;}

-dontwarn androidx.**

# 如果使用了tbs版本的sdk需要进行以下配置
-keep class com.tencent.smtt.** { *; }
-dontwarn dalvik.**
-dontwarn com.tencent.smtt.**

# 如果使用了微信OpenSDK，需要添加如下配置
-keep class com.tencent.mm.opensdk.** {
    *;
}

-keep class com.tencent.wxop.** {
    *;
}

-keep class com.tencent.mm.sdk.** {
    *;
}

# 如果接入了Bugly，需要添加如下配置
-dontwarn com.tencent.bugly.**
-keep public class com.tencent.bugly.**{*;}

# Google IMA
-keep class com.google.obf.** { *; }
-keep interface com.google.obf.** { *; }

-keep class com.google.ads.interactivemedia.** { *; }
-keep interface com.google.ads.interactivemedia.** { *; }
-dontwarn com.google.ads.interactivemedia.**

# 穿山甲
-keep class com.bytedance.sdk.openadsdk.** { *; }
-keep class com.androidquery.callback.** {*;}
-keep public interface com.bytedance.sdk.openadsdk.downloadnew.** {*;}
-keep class com.ss.sys.ces.* {*;}
-dontwarn com.ss.android.socialbase.downloader.**
-dontwarn com.ss.android.crash.log.**

# 百度
-keep class com.baidu.mobads.*.** { *; }
-keep class com.baidu.mobad.*.** { *; }

# MTG
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.mintegral.** {*; }
-keep interface com.mintegral.** {*; }
-keep class android.support.v4.** { *; }
-dontwarn com.mintegral.**
-keep class **.R$* { public static final int mintegral*; }
-keep class com.alphab.** {*; }
-keep interface com.alphab.** {*; }

# 快手
-keep class org.chromium.** {*;}
-keep class org.chromium.** { *; }
-keep class aegon.chrome.** { *; }
-keep class com.kwai.**{ *; }
-dontwarn com.kwai.**
-dontwarn com.kwad.**
-dontwarn com.ksad.**
-dontwarn aegon.chrome.**

# qapm 平台
-keep class com.tencent.qapmsdk.**{*;}
-dontwarn com.tencent.qapmsdk.**
-dontnote com.tencent.qapmsdk.**

-ignorewarnings
# gdt
###################################################################################################################

#友盟
-keep class com.umeng.** {*;}

-keepclassmembers class * {
   public <init> (org.json.JSONObject);
}

-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keep public class com.yishua.hbxxl.R$*{
public static final int *;
}
#友盟

#glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
#glide

# 微信
-keep class com.tencent.mm.opensdk.** {
    *;
}

-keep class com.tencent.wxop.** {
    *;
}

-keep class com.tencent.mm.sdk.** {
    *;
}
# 微信

#EventBus
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# And if you use AsyncExecutor:
-keepclassmembers class * extends org.greenrobot.eventbus.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}
#EventBus

# fastjson
-dontwarn com.alibaba.fastjson.**
-keep class com.alibaba.fastjson.**{*;}
-keepattributes Signature
-keepclassmembers class * implements java.io.Serializable { *; }
# fastjson