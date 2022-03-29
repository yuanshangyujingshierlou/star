package com.yishua.hbxxl.share;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.yishua.hbxxl.util.LogUtils;

import java.lang.ref.WeakReference;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

public class WxShare {

    private static SendMessageToWX.Req localReq;
    private static GetResultListener localOnShareListener;

    private static boolean isAppInstalled(Context paramContext, String paramString) {
        List localList = paramContext.getPackageManager().getInstalledPackages(0);
        ArrayList localArrayList = new ArrayList();
        if (localList != null) {
            for (int i = 0; i < localList.size(); i++) {
                localArrayList.add(((PackageInfo) localList.get(i)).packageName);
            }
        }
        return localArrayList.contains(paramString);
    }

    public static void sendReq(WeakReference<Activity> weakReference, GetResultListener onShareLitener, SendMessageToWX.Req req, final String appId, final String packageName) {
        LogUtils.e("sendReq----------");

        localOnShareListener = onShareLitener;
        for (; ; ) {
            final Activity localActivity;
            String str;
            try {
                Activity activity = weakReference.get();
                localActivity = activity;
                localReq = req;
                if ((localActivity == null) || (localReq == null)) {

                    return;
                }

                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    public void run() {
                        try {
                            Bundle localBundle = new Bundle();
                            localReq.toBundle(localBundle);
                            Intent localIntent = new Intent();
                            localIntent.setClassName("com.tencent.mm", "com.tencent.mm.plugin.base.stub.WXEntryActivity");
                            localIntent.putExtras(localBundle);
                            localIntent.putExtra("_mmessage_sdkVersion", 587268097);
                            localIntent.putExtra("_mmessage_appPackage", packageName);
                            localIntent.putExtra("_mmessage_content", "weixin://sendreq?appid=" + appId);
//                                            localIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);

                            Object[] arrayOfObject = new Object[3];
                            arrayOfObject[0] = ("weixin://sendreq?appid=" + appId);
                            arrayOfObject[1] = Integer.valueOf(587268097);
                            arrayOfObject[2] = localActivity.getPackageName();
                            localIntent.putExtra("_mmessage_checksum", degest((String) arrayOfObject[0], (Integer) arrayOfObject[1], (String) arrayOfObject[2]));
                            localIntent.addFlags(268435456).addFlags(134217728);
                            if (localActivity != null) {
                                localActivity.startActivity(localIntent);
                            }
                            localOnShareListener.onSuccess("success");
//                                            MyApplication.getContext().startActivity(localIntent);

                            return;
                        } catch (Exception localException) {
                            LogUtils.e("22222");
                            LogUtils.e(Log.getStackTraceString(localException));
                            localOnShareListener.onError();
//
                        }
                    }
                }, 0);
                return;

            } catch (Exception localException) {

                LogUtils.e(Log.getStackTraceString(localException));
                localOnShareListener.onError();
                return;
            }
//
        }
    }

    /**
     * 通过rxjava进行分享
     *
     * @param weakReference
     * @param req
     * @param appId
     * @param packageName
     */
    public static void sendReq(WeakReference<Activity> weakReference, SendMessageToWX.Req req, final String appId, final String packageName) {
        LogUtils.e("sendReq----------");

//        localOnShareListener = onShareLitener;
        for (; ; ) {
            final Activity localActivity;
            String str;
            try {
                Activity activity = weakReference.get();
                localActivity = activity;
                localReq = req;
                if ((localActivity == null) || (localReq == null)) {

                    return;
                }
                LogUtils.e("开始分享");
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    public void run() {
                        try {
                            Bundle localBundle = new Bundle();
                            localReq.toBundle(localBundle);
                            Intent localIntent = new Intent();
                            localIntent.setClassName("com.tencent.mm", "com.tencent.mm.plugin.base.stub.WXEntryActivity");
                            localIntent.putExtras(localBundle);
                            localIntent.putExtra("_mmessage_sdkVersion", 587268097);
                            localIntent.putExtra("_mmessage_appPackage", packageName);
                            localIntent.putExtra("_mmessage_content", "weixin://sendreq?appid=" + appId);


                            Object[] arrayOfObject = new Object[3];
                            arrayOfObject[0] = ("weixin://sendreq?appid=" + appId);
                            arrayOfObject[1] = Integer.valueOf(587268097);
//                            arrayOfObject[2] = packageName;
                            arrayOfObject[2] = localActivity.getPackageName();
                            localIntent.putExtra("_mmessage_checksum", degest((String) arrayOfObject[0], (Integer) arrayOfObject[1], (String) arrayOfObject[2]));
                            localIntent.addFlags(268435456).addFlags(134217728);
                            if (localActivity != null) {
                                localActivity.startActivity(localIntent);
                            }
                            return;
                        } catch (Exception localException) {
                            LogUtils.e(Log.getStackTraceString(localException));
                        }
                    }
                }, 0);
                return;

            } catch (Exception localException) {
                LogUtils.e(Log.getStackTraceString(localException));

                return;
            }

        }
    }


    public static byte[] degest(String var0, int var1, String var2) {
        StringBuffer var3 = new StringBuffer();
        if (var0 != null) {
            var3.append(var0);
        }

        var3.append(var1);
        var3.append(var2);
        var3.append("mMcShCsTr");
        return sign(var3.toString().substring(1, 9).getBytes()).getBytes();
    }

    public static final String sign(byte[] var0) {
        char[] var1 = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

        try {
            MessageDigest var2;
            (var2 = MessageDigest.getInstance("MD5")).update(var0);
            int var8;
            char[] var3 = new char[(var8 = (var0 = var2.digest()).length) * 2];
            int var4 = 0;

            for (int var5 = 0; var5 < var8; ++var5) {
                byte var6 = var0[var5];
                var3[var4++] = var1[var6 >>> 4 & 15];
                var3[var4++] = var1[var6 & 15];
            }

            return new String(var3);
        } catch (Exception var7) {
            return null;
        }
    }

}
