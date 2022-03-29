package com.yishua.hbxxl;

import android.Manifest;
import android.app.PendingIntent;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.telephony.TelephonyManager;
import android.text.TextUtils;

import com.yishua.hbxxl.http.HttpParamUtil;
import com.yishua.hbxxl.util.InstallUtil;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.ToastUtil;

import java.io.File;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class Util {
    private static Context instance;

    public static void init(Context context) {
        instance = context;
    }

    public static Context getContext() {
        return instance;
    }

    /**
     * 设备信息
     *
     * @param context
     * @param type    1：设备唯一标识，devicesId,2：系统版本号 ，3：设备型号 Samsung,Xiaomi.，4：应用程序版本号
     *                5：手机品牌
     * @return
     */
    public static String getDeviceInfo(Context context, int type) {

        try {
            TelephonyManager telephonyManager = (TelephonyManager) context
                    .getSystemService(Context.TELEPHONY_SERVICE);
            switch (type) {
                case 1:// 设备唯一标识
                    if (ActivityCompat.checkSelfPermission(Util.getContext(), Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                        // 读取手机信息权限失败
                        return "";
                    }

                    String imei = "";
                    try {

                        imei = telephonyManager.getDeviceId();
                        if (TextUtils.isEmpty(imei)) {
                            Method method = telephonyManager.getClass().getMethod("getImei");
                            imei = (String) method.invoke(telephonyManager);
                        }


                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return imei;
                case 2:// 系统版本号
                    return android.os.Build.VERSION.RELEASE;
                case 3:// 设备型号
                    return android.os.Build.MODEL;
                case 4:// 应用程序版本号
                    return context.getPackageManager().getPackageInfo(
                            context.getPackageName(), 0).versionName;
                case 5:
                    return Build.BRAND;
                case 6:// 应用程序版本 code
                    return context.getPackageManager().getPackageInfo(
                            context.getPackageName(), 0).versionCode + "";
                case 7:
                    return Build.VERSION.SDK_INT + "";
                case 8:
                    if (ActivityCompat.checkSelfPermission(Util.getContext(), Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                        // 读取手机信息权限失败
                        return "";
                    }
                    return telephonyManager.getSubscriberId() + "";
                case 9:
                    return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
                case 10:
                    return Build.MANUFACTURER;
                case 11:
                    return Build.BOARD;
                case 12:
                    return Build.DEVICE;
                case 13:
                    return Build.HARDWARE;
                case 14:
                    return Build.DISPLAY;
                default:
                    return "";
            }
        } catch (Exception e) {
            LogUtils.e("出现异常了");
        }
        return "";
    }

    /**
     * 打印设备的一些信息
     */
    public static void printDeviceInfo() {
        LogUtils.e("imei = " + Util.getDeviceInfo(instance, 1) +
                "\nVERSION.RELEASE = " + Util.getDeviceInfo(instance, 2) +
                "\nMODEL = " + Util.getDeviceInfo(instance, 3) +
                "\nversionName = " + Util.getDeviceInfo(instance, 4) +
                "\nBRAND = " + Util.getDeviceInfo(instance, 5) +
                "\nversionCode = " + Util.getDeviceInfo(instance, 6) +
                "\nSDK_INT = " + Util.getDeviceInfo(instance, 7) +
                "\nsubscriberId = " + Util.getDeviceInfo(instance, 8) +
                "\nversionName = " + Util.getDeviceInfo(instance, 9) +
                "\nMANUFACTURER = " + Util.getDeviceInfo(instance, 10) +
                "\nBOARD = " + Util.getDeviceInfo(instance, 11) +
                "\nDEVICE = " + Util.getDeviceInfo(instance, 12) +
                "\nHARDWARE = " + Util.getDeviceInfo(instance, 13) +
                "\nDISPLAY = " + Util.getDeviceInfo(instance, 14));
    }

    public static int parseInt(String num) {
        try {
            return Integer.parseInt(num);
        } catch (Exception e) {
            return -1;
        }
    }

    public static int dp2px(float dipValue) {
        final float scale = Util.getContext().getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + 0.5f);
    }

    public static boolean checkApkExist(String packageName) {

        if (TextUtils.isEmpty(packageName)) {
            return false;
        }

        final PackageManager packageManager = Util.getContext().getPackageManager();
        List<PackageInfo> pinfo = packageManager.getInstalledPackages(0);
        for (int i = 0; i < pinfo.size(); i++) {
            String pn = pinfo.get(i).packageName;
            if (pn.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * versionCode:101
     *
     * @return
     */
    public static String getVersionCode() {
        PackageInfo packageInfo;
        try {
            packageInfo = Util.getContext().getPackageManager().getPackageInfo(Util.getContext().getPackageName(), 0);
            return "" + packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * versionName:1.0.1
     *
     * @return
     */
    public static String getVersionName() {
        PackageInfo packageInfo = null;
        try {
            packageInfo = Util.getContext().getPackageManager().getPackageInfo(Util.getContext().getPackageName(), 0);
            return "" + packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取文件保存路径 sdcard根目录/download/文件名称
     *
     * @param fileUrl
     * @return
     * @deprecated 废弃使用Environment
     */
    public static String getSaveFilePath(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1, fileUrl.length());//获取文件名称
        if (!fileName.endsWith(".apk")) {
            fileName = fileName + ".apk";
        }
        String dir = Environment.getExternalStorageDirectory() + "/Download/com.dianniu.pig/";
        File fileDir = new File(dir);
        if (!fileDir.exists()) {
            fileDir.mkdir();
        }

        return fileDir.getAbsolutePath() + "/" + fileName;
    }

    private static LocationManager locationManager;

    public static String getLocation(Context context) {
        Location location = null;
        try {
            String locationProvider = "";
            locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
            //2.获取位置提供器，GPS或是NetWork
            List<String> providers = locationManager.getProviders(true);
            if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
                //如果是网络定位
                locationProvider = LocationManager.NETWORK_PROVIDER;
            } else if (providers.contains(LocationManager.GPS_PROVIDER)) {
                //如果是GPS定位
                locationProvider = LocationManager.GPS_PROVIDER;
            }

//            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//                // 没有定位权限
//                return toggleGPS(context);
//            }

            location = locationManager.getLastKnownLocation(locationProvider);
            if (location == null) {
                return "";
            }
        } catch (Exception e) {
            //
        }

        if (location != null) {
            return location.getLatitude() + "," + location.getLongitude();
        }
        return "";
    }

    private static String toggleGPS(Context context) {
        Intent gpsIntent = new Intent();
        gpsIntent.setClassName("com.android.settings", "com.android.settings.widget.SettingsAppWidgetProvider");
        gpsIntent.addCategory("android.intent.category.ALTERNATIVE");
        gpsIntent.setData(Uri.parse("custom:3"));
        try {
            PendingIntent.getBroadcast(context, 0, gpsIntent, 0).send();
        } catch (PendingIntent.CanceledException e) {
            e.printStackTrace();
//            if (ActivityCompat.checkSelfPermission(Util.getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(Util.getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//                return "";
//            }
            Location location1 = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            if (location1 != null) {
                double latitude = location1.getLatitude();// 经度
                double longitude = location1.getLongitude();// 纬度
                return latitude + "," + longitude;
            }
        }
        return null;
    }

    public static String getApkPackageName(String filePath) {

        PackageManager packageManager = Util.getContext().getPackageManager();
        PackageInfo packageArchiveInfo = packageManager.getPackageArchiveInfo(filePath, PackageManager.GET_ACTIVITIES);
        if (packageArchiveInfo != null) {
            ApplicationInfo applicationInfo = packageArchiveInfo.applicationInfo;
            if (applicationInfo != null) {

                return applicationInfo.packageName;
            }
        }

        return "";
    }

    /**
     * 内部路径
     *
     * @param dirName  文件夹名称
     * @param fileName 文件名称
     * @return
     */
    public static String getInternalSaveFilePath(String dirName, String fileName) {
        File filesDir = getContext().getFilesDir();
        File filePath = new File(filesDir, dirName);
        if (!filePath.exists()) {
            boolean mkdir = filePath.mkdir();
        }

        return filePath.getAbsolutePath() + "/" + fileName;
    }

    public static String getExternalFilePath(String dirName, String fileName) {

        File filesDir = getContext().getExternalFilesDir(dirName);

        File filePath = new File(filesDir, dirName);
        if (!filePath.exists()) {
            boolean mkdir = filePath.mkdir();
        }

        return filePath.getAbsolutePath() + "/" + fileName;
    }

//    public static String getXwDownloadPath(String downloadUrl) {
//        String fileName = Md5Util.md5(downloadUrl);
//
//        File downloadDir = getContext().getExternalFilesDir("51xianwan");
//        if (downloadDir == null) {
//            return "";
//        }
//        if (!downloadDir.exists()) {
//            downloadDir.mkdir();
//        }
//
//        return downloadDir.getAbsolutePath() + File.separator + fileName + ".apk";
//    }

    /**
     * 本地文件转换为URI
     *
     * @param file
     * @return
     */
    public static Uri getUriByPath(File file) {

        String filePath = file.getAbsolutePath();
        LogUtils.e("getUri By Path = " + filePath);

        Cursor cursor = getContext().getContentResolver().query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                new String[]{MediaStore.Images.Media._ID},
                MediaStore.Images.Media.DATA + "=? ",
                new String[]{filePath}, null);
        if (cursor != null && cursor.moveToFirst()) {
            int id = cursor.getInt(cursor.getColumnIndex(MediaStore.MediaColumns._ID));
            cursor.close();
            return Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "" + id);
        } else {
            if (file.exists()) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DATA, filePath);
                return getContext().getContentResolver().insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            } else {
                return null;
            }
        }
    }


    /**
     * 打开应用市场评论
     */
    public static void openMarketDetail() {

        String appChannel = HttpParamUtil.getChannel();
        LogUtils.e("appChannel = " + appChannel);

        switch (appChannel) {
            case "oppo":
            case "oppoad":
            case "Lightoppo":
                // com.oppo.market
                openMarket("com.heytap.market");
                break;
            case "xiaomi":
                openMarket("com.xiaomi.market");
                break;
            case "huawei":
                openMarket("com.huawei.appmarket");
                break;
            case "vivo":
                openMarket("com.bbk.appstore");
                break;
            case "yingyongbao":
            case "weixiazai":
                openMarket("com.tencent.android.qqdownloader");
                break;
            default:
                openDefaultMarket();
                break;
        }
    }

    private static void openDefaultMarket() {
        // 按一下顺序吊起
        // OPPO - vivo - 应用宝 - 华为 - 小米
        List<String> marketList = new ArrayList<>();
        marketList.add("com.bbk.appstore");
        marketList.add("com.oppo.market");
        marketList.add("com.heytap.market");

        marketList.add("com.tencent.android.qqdownloader");
        marketList.add("com.huawei.appmarket");
        marketList.add("com.xiaomi.market");
        boolean open = false;

        for (String pkg : marketList
        ) {
            boolean installSoftware = InstallUtil.isInstallSoftware(getContext(), pkg);
            if (installSoftware) {
                openMarket(pkg);
                open = true;
                break;
            }
        }

        if (!open) {
            String appName = getContext().getResources().getString(R.string.app_name);
            ToastUtil.showToast("在应用商店搜索\"" + appName + "\"即可评价");
        }
    }

    private static void openMarket(String pkgName) {
        boolean installSoftware = InstallUtil.isInstallSoftware(getContext(), pkgName);

        if (!installSoftware) {
//            String appName = Utils.getContext().getResources().getString(R.string.app_name);
//            ToastUtil.showToast("在应用商店搜索\"" + appName + "\"即可评价");

            openDefaultMarket();
            return;
        }

        launchAppDetail(getContext(), pkgName);
    }

    /**
     * 启动到应用商店app详情界面
     *
     * @param marketPkg 应用商店包名 ,如果为""则由系统弹出应用商店列表供用户选择,否则调转到目标市场的应用详情界面
     */
    private static void launchAppDetail(Context mContext, String marketPkg) {

        LogUtils.e("launchAppDetail marketPkg = " + marketPkg);

        String packageName = getContext().getPackageName();
        LogUtils.e("packageName = " + packageName);

        // 目标App的包名
//        String appPkg = "com.dianniu.pig";

        try {
            Uri uri = Uri.parse("market://details?id=" + packageName);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            if (!TextUtils.isEmpty(marketPkg)) {
                intent.setPackage(marketPkg);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
        } catch (Exception e) {
            LogUtils.e("launchAppDetail exception = " + e.toString());

            String appName = getContext().getResources().getString(R.string.app_name);
            ToastUtil.showToast("在应用商店搜索\"" + appName + "\"即可评价");

            e.printStackTrace();
        }
    }
}