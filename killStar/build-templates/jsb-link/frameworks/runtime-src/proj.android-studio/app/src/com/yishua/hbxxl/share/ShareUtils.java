package com.yishua.hbxxl.share;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.download.DownloadProgressListener;
import com.yishua.hbxxl.http.download.DownloadUtil;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.ToastUtil;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.net.URL;

public class ShareUtils {
    private static String shareAppId;
    private static String shareAppPackageName;

    /**
     * 一般的分享调用这个方法就可以了
     *
     * @param shareTiele   分享的标题
     * @param shareContent 分享的内容
     * @param shareImage   分享的图片 // 暂时没用，用ic_launcher替代
     * @param jumpUrl      分享出去跳转的链接
     * @param type         分享到哪里   0对话  1 朋友圈   2 收藏
     */
    public static void throughSdkShareWXFriends(final Activity context, final String shareTiele, final String shareContent, final String shareImage, final String jumpUrl, final int type) {

        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher);

        String[] strings = ShareUtils.shareWXReadyRx(shareImage);
        if (null != strings) {
            shareAppId = strings[0];
            shareAppPackageName = strings[1];
        }

        if (!TextUtils.isEmpty(shareAppId)) {
            ShareUtils.shareWXRX(new WeakReference<Activity>(context), shareAppId, shareAppPackageName, shareTiele
                    , shareContent, jumpUrl, type, bitmap
            );
        } else {
            Intent sendIntent = new Intent();
            sendIntent.setAction(Intent.ACTION_SEND);
            sendIntent.putExtra(Intent.EXTRA_TEXT, shareTiele + "\n" + shareContent + "\n" + jumpUrl);
            sendIntent.setType("text/plain");
            if (1 == type) {
                sendIntent.setClassName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");//微信朋友圈
            } else {
                sendIntent.setClassName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");//微信朋友
            }

            //          sendIntent.setClassName("com.tencent.mobileqq", "cooperation.qqfav.widget.QfavJumpActivity");//保存到QQ收藏
            //          sendIntent.setClassName("com.tencent.mobileqq", "cooperation.qlink.QlinkShareJumpActivity");//QQ面对面快传
            //          sendIntent.setClassName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.qfileJumpActivity");//传给我的电脑
            //sendIntent.setClassName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.JumpActivity");//QQ好友或QQ群
            context.startActivity(sendIntent);
        }
    }

    /**
     * 发送图片到微信好友
     *
     * @param api    IWXAPI
     * @param bmpUrl 发送的图片地址
     */
    public static void shareConversationPic(final IWXAPI api, String bmpUrl) {

        DownloadUtil.downloadPicBitmap(bmpUrl, new DownloadUtil.DownloadPicBitmapListener() {
            @Override
            public void onLoadFailed(String errMsg) {
                // 图片下载失败
                ToastUtil.showToast("发送失败，请重试");
            }

            @Override
            public void onLoadReady(Bitmap bitmap) {
                shareConversationPic(api, bitmap);
            }
        });
    }

    private static void shareConversationPic(IWXAPI api, Bitmap bitmap) {
        WXImageObject imgObj = new WXImageObject(bitmap);

        WXMediaMessage msg = new WXMediaMessage();
//        msg.title = "title";
//        msg.description = "description";
        msg.mediaObject = imgObj;

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bitmap, 150, 150, true);
        bitmap.recycle();
        msg.thumbData = bmpToByteArray(thumbBmp, true);

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("img");
        req.message = msg;
        // 0：发送好友
        req.scene = 0;
        api.sendReq(req);
    }


//------------------------------------------------------------华丽的分割线------------------------------------------------------------
    //通过intent 分享

    /**
     * 通过intent 方式分享到微信好友（内容）
     * 这里需要说明下，经过百度查找加测试发现，如果单纯的通过intent分享内容给微信好友
     * 1.分享文字
     * 2.分享图片
     * 3.两者不能同时分享（如果可以同时的话，麻烦告诉我下谢谢了）
     */
    public static void throughIntentShareWXdesc(String share_word) {
        try {
            Intent intentFriend = new Intent();
            ComponentName compFriend = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
            intentFriend.setComponent(compFriend);
            intentFriend.setAction(Intent.ACTION_SEND);
            intentFriend.setType("image/*");
            intentFriend.putExtra(Intent.EXTRA_TEXT, share_word);
            intentFriend.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Util.getContext().startActivity(intentFriend);
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        }

    }

    /**
     * 分享图片到微信好友
     *
     * @param imageUrl 图片网络地址
     */
    public static void throughIntentShareWXImage(Activity activity, String imageUrl) {
        // 要用外部存储路径，不然分享找不到文件。
        File pigs = new File(activity.getExternalFilesDir("pigs"), "bg_pig_share.jpg");

        String saveFilePath = pigs.getAbsolutePath();

        LogUtils.e("saveFilePath = " + saveFilePath);
        DownloadUtil.progressDownload(imageUrl, saveFilePath, new DownloadProgressListener() {
            @Override
            public void onProgress(int progress) {
//                LogUtils.e("downloadImage onProgress = " + progress);
            }

            @Override
            public void onFail(String message) {
                LogUtils.e("downloadImage onFail = " + message);
                ToastUtil.showToast("发送失败，请重试");
            }

            @Override
            public void onComplete() {
                LogUtils.e("downloadImage onComplete =---");

                Uri uriByPath = Util.getUriByPath(pigs);

                throughIntentShareWXImage(activity, uriByPath, imageUrl);
            }
        });
    }

    /**
     * 通过intent 方式分享内容到微信好友
     *
     * @param imageUri
     * @param imageUrl // 备用
     */
    private static void throughIntentShareWXImage(Activity activity, Uri imageUri, String imageUrl) {

        if (imageUri == null) {
            LogUtils.e("imageUri is null------");
            // 用自己的 appid 打底
            IWXAPI api = WXAPIFactory.createWXAPI(activity, ConstantValue.APP_ID, true);
            api.registerApp(ConstantValue.APP_ID);
            shareConversationPic(api, imageUrl);
            return;
        }
        LogUtils.e("imageUri = " + imageUri.toString());

        try {
            Intent intentFriend = new Intent();
            ComponentName compFriend = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareImgUI");
            intentFriend.setComponent(compFriend);
            intentFriend.setAction(Intent.ACTION_SEND);
            intentFriend.setType("image/*");
            intentFriend.putExtra(Intent.EXTRA_STREAM, imageUri);
            intentFriend.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            activity.startActivity(Intent.createChooser(intentFriend, "分享图片"));

        } catch (Exception e) {
            LogUtils.e("image exception = " + e.getMessage());

            IWXAPI api = WXAPIFactory.createWXAPI(activity, ConstantValue.APP_ID, true);
            api.registerApp(ConstantValue.APP_ID);
            shareConversationPic(api, imageUrl);
        }

    }

    /**
     * 通过intent方式分享内容到微信朋友圈（朋友圈可以是图片加文字一起分享）
     *
     * @param shareWord
     * @param fileUri
     */
    public static void throughIntentShareWXCircle(String shareWord, Uri fileUri) {
        if (!Util.checkApkExist("com.tencent.mm")) {
            Toast.makeText(Util.getContext(), "亲，你还没安装微信", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            Intent intent = new Intent();
            ComponentName comp = new ComponentName("com.tencent.mm", "com.tencent.mm.ui.tools.ShareToTimeLineUI");
            intent.setComponent(comp);
            intent.setAction(Intent.ACTION_SEND);
            intent.setType("image/*");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.putExtra("Kdescription", shareWord);
            intent.putExtra(Intent.EXTRA_STREAM, fileUri);
            Util.getContext().startActivity(intent);
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        }


    }

    /**
     * 通过intent分享到QQ空间 ，这里需要先安装qq空间才能分享，注意：不是qq是qq空间
     *
     * @param desc
     * @param fileUri
     */
    public static void throughIntentShareQQZONE(String desc, String fileUri) {
        try {
            if (fileUri != null) {
                Intent intentQZ = new Intent();
                ComponentName componentFirendQZ = new ComponentName("com.qzone", "com.qzonex.module.operation.ui.QZonePublishMoodActivity");
                intentQZ.setComponent(componentFirendQZ);
                intentQZ.setAction(Intent.ACTION_SEND);
                intentQZ.setType("text/*");
                intentQZ.putExtra(Intent.EXTRA_TEXT, desc);
//                intentQZ.putExtra(Intent.EXTRA_STREAM, fileUri);
                intentQZ.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                Util.getContext().startActivity(intentQZ);
            }
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        }
    }

    /**
     * 通过intent 分享内容到QQ
     *
     * @param desc
     */
    public static void throughIntentShareQQDesc(String desc) {
        try {
            Intent intent = new Intent();
            ComponentName componentFirend = new ComponentName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.JumpActivity");
            intent.setComponent(componentFirend);
            intent.setAction(Intent.ACTION_SEND);
            intent.setType("text/*");
            intent.putExtra(Intent.EXTRA_TEXT, desc);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Util.getContext().startActivity(intent);
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        }
    }

    /**
     * 通过intent 分享内容到QQ
     *
     * @param fileUri
     */
    public static void throughIntentShareQQImage(String fileUri) {
        try {
            if (fileUri != null) {
                Intent intent = new Intent();
                ComponentName componentFirend = new ComponentName("com.tencent.mobileqq", "com.tencent.mobileqq.activity.JumpActivity");
                intent.setComponent(componentFirend);
                intent.setAction(Intent.ACTION_SEND);
                intent.setType("image/*");
                intent.putExtra(Intent.EXTRA_STREAM, fileUri);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                Util.getContext().startActivity(intent);
            }
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        }
    }
//------------------------------------------------------------华丽的分割线------------------------------------------------------------

    /**
     * 通过qq浏览器分享，具体的分享内容都是后端那里写的
     *
     * @param ucShareUrl 这个url 是跳转到后端写的一个界面，从这个界面再分享到微信或qq
     *                   当通过这种方式分享到微信好友时，点击返回是返回到浏览器而不是自己的应用
     *                   其实分享的内容什么的都是后端写好的android只是打开浏览器，并跳转到指定的一个页面
     *                   如果想更好的体验，就需要在这个界面加上个按钮通过点击这个按钮再返回自己的应用
     *                   这时就需要定义个scheme
     *                   目前这种方式只能分享到 qq好友，微信好友，微信朋友圈
     */
    public static void throughQQBShareWxCircle(String ucShareUrl) {
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        Uri content_url = Uri.parse(ucShareUrl + "&type=weixinFriend");
        intent.setData(content_url);
        intent.setClassName(Constant.WEIXINAPPPACKAGEQQBROWSER, "com.tencent.mtt.MainActivity");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        Util.getContext().startActivity(intent);
    }


//------------------------------------------------------------华丽的分割线------------------------------------------------------------

    /**
     * 通过回调来实现
     *
     * @param MyApplicationId 来源id
     * @param packageName     来源包名
     * @param shareTitle      分享标题
     * @param shareContent    分享内容
     * @param shareUrl        分享链接
     * @param type            分享方式 0 好友 1 朋友圈 2 收藏
     * @param shareBitmap     分享图片
     */
    public static void shareWX(WeakReference<Activity> weakReference, String MyApplicationId, String packageName, String shareTitle, String shareContent, String shareUrl, int type, Bitmap shareBitmap, GetResultListener onShareLitener) {
        LogUtils.e("shareWX_______");
        Bitmap localBitmap2 = Bitmap.createScaledBitmap(shareBitmap, 150, 150, true);
        if (shareBitmap != null) {
            shareBitmap.recycle();
            shareBitmap = null;
        }
        //通过原始的微信sdk来组装参数
        WXWebpageObject localWXWebpageObject = new WXWebpageObject();
        localWXWebpageObject.webpageUrl = shareUrl;
        WXMediaMessage localWXMediaMessage = new WXMediaMessage(localWXWebpageObject);
        localWXMediaMessage.title = shareTitle;
        localWXMediaMessage.description = shareContent;
        localWXMediaMessage.thumbData = (bmpToByteArray(localBitmap2, true));
        SendMessageToWX.Req localReq = new SendMessageToWX.Req();
        localReq.transaction = System.currentTimeMillis() + "";
        localReq.message = localWXMediaMessage;
        localReq.scene = type;
        //在分享的时候不调用sdk中原有的分享代码，改调用自己的，这里需要注意不要使用新的jar包，里面有的方法已经取消了，就用项目里的
        WxShare.sendReq(weakReference, onShareLitener, localReq, MyApplicationId, packageName);
    }

    /**
     * 做分享前的准备，判断当前有哪个应用能进行分享 （使用回调方式）
     *
     * @param weakReference
     * @param shareTitle
     * @param share_word
     * @param shareUrl
     * @param type
     * @param bitmap
     */
    public static void shareWXReady(WeakReference<Activity> weakReference, String shareTitle, String share_word, String shareUrl, int type, Bitmap bitmap, GetResultListener onShareLitener) {
        try {
            if (Util.checkApkExist(Constant.WEIXINAPPPACKGEYINGYONGBAO)) {
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPYINGYONGBAO, Constant.WEIXINAPPPACKGEYINGYONGBAO, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener
                );
            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEQQ)) {
                LogUtils.e("安装了QQ");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYQQ, Constant.WEIXINAPPPACKAGEQQ, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener
                );
            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEUC)) {
                LogUtils.e("安装了uc");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYUC, Constant.WEIXINAPPPACKAGEUC, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener);
            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEQQBROWSER)) {
                LogUtils.e("安装了qqBrowser");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYQQBROWSER, Constant.WEIXINAPPPACKAGEQQBROWSER, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener);
            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGENEWSTODAY)) {
                LogUtils.e("安装了今日头条");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYNEWSTODAY, Constant.WEIXINAPPPACKAGENEWSTODAY, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener);

            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEBAIDU)) {
                LogUtils.e("安装了百度");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYBAIDU, Constant.WEIXINAPPPACKAGEBAIDU, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener);
            } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGESINA)) {
                LogUtils.e("安装了sina");
                ShareUtils.shareWX(weakReference, Constant.WEIXINAPPKEYSINA, Constant.WEIXINAPPPACKAGESINA, shareTitle
                        , share_word, shareUrl, type, bitmap, onShareLitener);
            } else {
                LogUtils.e("没有其他的");
//                onShareLitener.onError();
                return;
            }
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
//            onShareLitener.onError();
        }
    }

    /**
     * 通过rxjava重构分享部分的代码，这里是简写，在真实项目中，可能根据需求的不同要嵌套好几层回调，所以改成rxjava来写
     *
     * @param weakReference
     * @param MyApplicationId
     * @param packageName
     * @param shareTitle
     * @param shareContent
     * @param shareUrl
     * @param type
     * @param shareBitmap
     */
    public static void shareWXRX(WeakReference<Activity> weakReference, String MyApplicationId, String packageName, String shareTitle, String shareContent, String shareUrl, int type, Bitmap shareBitmap) {
        Bitmap localBitmap2 = Bitmap.createScaledBitmap(shareBitmap, 150, 150, true);
        if (shareBitmap != null) {
            shareBitmap.recycle();
            shareBitmap = null;
        }

        //拼接参数还是用原生的sdk来弄
        WXWebpageObject localWXWebpageObject = new WXWebpageObject();
        localWXWebpageObject.webpageUrl = shareUrl;
        WXMediaMessage localWXMediaMessage = new WXMediaMessage(localWXWebpageObject);
        localWXMediaMessage.title = shareTitle;
        localWXMediaMessage.description = shareContent;
        localWXMediaMessage.thumbData = (bmpToByteArray(localBitmap2, true));
        SendMessageToWX.Req localReq = new SendMessageToWX.Req();
        localReq.transaction = System.currentTimeMillis() + "";
        localReq.message = localWXMediaMessage;
        localReq.scene = type;
        //在分享的时候不调用sdk中原有的分享代码，改调用自己的，这里需要注意不要使用新的jar包，里面有的方法已经取消了，就用我这项目里的
        WxShare.sendReq(weakReference, localReq, MyApplicationId, packageName);
    }

    /**
     * 根据手机上安装的软件返回具体的包名和MyApplicationID，这里面其实能做很多处理，
     *
     * @param shareImage
     * @return
     */
    public static String[] shareWXReadyRx(String shareImage) {
        String[] strings = new String[3];

        if (Util.checkApkExist(Constant.WEIXINAPPPACKGEYINGYONGBAO)) {
            // LogUtils.e("安装了应用宝");
            strings[0] = Constant.WEIXINAPPYINGYONGBAO;
            strings[1] = Constant.WEIXINAPPPACKGEYINGYONGBAO;
            strings[2] = shareImage;
            return strings;

        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEQQ)) {
            LogUtils.e("安装了QQ");
            strings[0] = Constant.WEIXINAPPKEYQQ;
            strings[1] = Constant.WEIXINAPPPACKAGEQQ;
            strings[2] = shareImage;
            return strings;

        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEUC)) {
            LogUtils.e("安装了uc");
            strings[0] = Constant.WEIXINAPPKEYUC;
            strings[1] = Constant.WEIXINAPPPACKAGEUC;
            strings[2] = shareImage;
            return strings;

        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEQQBROWSER)) {
            strings[0] = Constant.WEIXINAPPKEYQQBROWSER;
            strings[1] = Constant.WEIXINAPPPACKAGEQQBROWSER;
            strings[2] = shareImage;
            LogUtils.e("安装了qqBrowser");
            return strings;

        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGENEWSTODAY)) {
            strings[0] = Constant.WEIXINAPPKEYNEWSTODAY;
            strings[1] = Constant.WEIXINAPPPACKAGENEWSTODAY;
            strings[2] = shareImage;
            LogUtils.e("安装了今日头条");
            return strings;

        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGEBAIDU)) {
            strings[0] = Constant.WEIXINAPPKEYBAIDU;
            strings[1] = Constant.WEIXINAPPPACKAGEBAIDU;
            strings[2] = shareImage;
            LogUtils.e("安装了百度");
            return strings;
        } else if (Util.checkApkExist(Constant.WEIXINAPPPACKAGESINA)) {
            strings[0] = Constant.WEIXINAPPKEYSINA;
            strings[1] = Constant.WEIXINAPPPACKAGESINA;
            strings[2] = shareImage;
            LogUtils.e("安装了sina");
            return strings;
        }
        return null;
    }

    /**
     * @param shareImage
     * @return
     */
    public static Bitmap getHttpBitmap(String shareImage) {
        URL pictureUrl = null;
        InputStream in = null;
        Bitmap bitmap = null;
        try {
            pictureUrl = new URL(shareImage);
            in = pictureUrl.openStream();
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.RGB_565;
            options.inPurgeable = true;
            options.inSampleSize = 2;
            SoftReference<Bitmap> bitmapSoftReference = new SoftReference<>(BitmapFactory.decodeStream(in, null, options));
            bitmap = bitmapSoftReference.get();
        } catch (Exception e) {
            LogUtils.e(Log.getStackTraceString(e));
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e) {
                LogUtils.e(Log.getStackTraceString(e));
            }
        }
        return bitmap;
    }


    /**
     * 跳转官方安装网址
     */
    public static void toInstallWebView(String url) {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_VIEW);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setData(Uri.parse(url));
        Util.getContext().startActivity(intent);
    }

    public static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, output);
        if (needRecycle) {
            bmp.recycle();
        }

        byte[] result = output.toByteArray();
        LogUtils.e("result___长度" + result.length);
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
