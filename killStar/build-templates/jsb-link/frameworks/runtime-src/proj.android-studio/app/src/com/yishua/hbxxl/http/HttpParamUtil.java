package com.yishua.hbxxl.http;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.Settings;
import android.text.TextUtils;
import android.webkit.WebSettings;

import com.yishua.hbxxl.Util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Random;

import static android.content.Context.BATTERY_SERVICE;

/**
 * Created by Junguo.L on 2020/4/13.
 */
public class HttpParamUtil {
    public static String getTimeStamp() {
        return String.valueOf(System.currentTimeMillis());
    }

    public static String getNonce() {

        return String.valueOf(Math.abs(new Random().nextInt()));
    }

    public static String getSign(String... strs) {
        String result = "";

        ArrayList<String> list = new ArrayList<>(Arrays.asList(strs));

        Collections.sort(list);

        StringBuilder input = new StringBuilder();
        for (String str : list) {
            input.append(str);
        }

        try {
            result = sha1(input.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    private static String sha1(String input) throws Exception {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA1");
        byte[] result = messageDigest.digest(input.getBytes());
        StringBuilder buffer = new StringBuilder();

        for (byte aResult : result) {
            buffer.append(Integer.toString((aResult & 0xff) + 0x100, 16).substring(1));
        }
        return buffer.toString();
    }

    public static String getChannel() {
        String appChannel = "unknow";

        ApplicationInfo appInfo = null;
        try {
            appInfo = Util.getContext().getPackageManager()
                    .getApplicationInfo(Util.getContext().getPackageName(),
                            PackageManager.GET_META_DATA);
            appChannel = appInfo.metaData.getString("UMENG_CHANNEL");

            appInfo.metaData.putString("", "");
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        if (TextUtils.isEmpty(appChannel)) {
            appChannel = "unknow";
        }
        return appChannel;
    }

    public static String getImei() {
        String deviceInfo = Util.getDeviceInfo(Util.getContext(), 1);
        if (TextUtils.isEmpty(deviceInfo)) {
            // 部分华为手机获取到的IMEI为null，这里再判断一次
            return "";
        }
        return deviceInfo;
    }

    /**
     * AndroidId
     *
     * @return
     */
    public static String getAndroidId() {
        String androidId = Settings.Secure.getString(Util.getContext().getContentResolver(), Settings.Secure.ANDROID_ID);
        if (TextUtils.isEmpty(androidId)) {
            androidId = "";
        }
        return androidId;
    }

    public static String getUserAgent() {
        String UA;
        try {
            // Mozilla/5.0 (Linux; Android 9; ONEPLUS A5010 Build/PKQ1.180716.001; wv) AppleWebKit/537.36
            // (KHTML, like Gecko) Version/4.0 Chrome/73.0.3683.90 Mobile Safari/537.36
            UA = WebSettings.getDefaultUserAgent(Util.getContext());
        } catch (Exception e) {
            // Dalvik/2.1.0 (Linux; U; Android 9; ONEPLUS A5010 Build/PKQ1.180716.001)
            UA = System.getProperty("http.agent");
        }

        return UA;
    }

    public static String getOsVersion() {
        return Util.getDeviceInfo(Util.getContext(), 2);
    }

    public static String getApiVersion() {
        return Util.getDeviceInfo(Util.getContext(), 7);
    }

    public static String getMacAddress() {
        String strMacAddr = "";
        try {
            //获得IpD地址
            InetAddress ip = getLocalInetAddress();
            byte[] b = NetworkInterface.getByInetAddress(ip).getHardwareAddress();
            StringBuilder buffer = new StringBuilder();
            for (int i = 0; i < b.length; i++) {
                if (i != 0) {
                    buffer.append(':');
                }
                String str = Integer.toHexString(b[i] & 0xFF);
                buffer.append(str.length() == 1 ? 0 + str : str);
            }
            strMacAddr = buffer.toString().toUpperCase();
        } catch (Exception e) {

        }

        return strMacAddr;
    }

    private static InetAddress getLocalInetAddress() {
        InetAddress ip = null;
        try {
            //列举
            Enumeration<NetworkInterface> en_netInterface = NetworkInterface.getNetworkInterfaces();
            while (en_netInterface.hasMoreElements()) {//是否还有元素
                NetworkInterface ni = (NetworkInterface) en_netInterface.nextElement();//得到下一个元素
                Enumeration<InetAddress> en_ip = ni.getInetAddresses();//得到一个ip地址的列举
                while (en_ip.hasMoreElements()) {
                    ip = en_ip.nextElement();
                    if (!ip.isLoopbackAddress() && !ip.getHostAddress().contains(":"))
                        break;
                    else
                        ip = null;
                }

                if (ip != null) {
                    break;
                }
            }
        } catch (SocketException e) {

            e.printStackTrace();
        }
        return ip;
    }

    public static String getDeviceBrand() {
        return Util.getDeviceInfo(Util.getContext(), 5);
    }

    public static String getModel() {
        return Util.getDeviceInfo(Util.getContext(), 3);
    }

    /**
     * 获取设备的名称，以蓝牙的名称返回
     * @return
     */
    public static String getDeviceName() {
        return Settings.Secure.getString(Util.getContext().getContentResolver(), "bluetooth_name");
    }

    public static String getWifiType() {
        return HttpUtils.getNetworkType(Util.getContext());
    }


    public static String getImsi() {
        return Util.getDeviceInfo(Util.getContext(), 8);
    }

    public static String getTotalRam(Context context) {//KB
        String path = "/proc/meminfo";
        String firstLine = null;
        String totalRam = "0";
        try {
            FileReader fileReader = new FileReader(path);
            BufferedReader br = new BufferedReader(fileReader, 8192);
            firstLine = br.readLine().split("\\s+")[1];
            br.close();
            if (firstLine != null) {
                totalRam = firstLine;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return totalRam;
    }

    public static String getTotalRom() {
        try {
            File path = Environment.getDataDirectory();
            StatFs stat = new StatFs(path.getPath());
            long blockSize = stat.getBlockSize();
            long totalBlocks = stat.getBlockCount();
            return String.valueOf(totalBlocks * blockSize);
        } catch (Exception e) {
            return "0";
        }
    }

    private static String appListString = "";

    public static String getApplist() {

        if (TextUtils.isEmpty(appListString)) {
            //获取已安装列表
            List<PackageInfo> info = null;
            try {
                PackageManager packageManager = Util.getContext().getPackageManager();
                // 获取所有已安装程序的包信息
                info = packageManager.getInstalledPackages(0);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (null != info && info.size() > 0) {
                List<String> applist = new ArrayList<>();
                for (PackageInfo packageInfo : info) {
                    applist.add(RsaPhone.jiami(packageInfo.packageName));
                }

//                appListString = new Gson().toJson(applist);
            }
        }

        return appListString;
    }

    public static String getBatteryLevel() {
        try {
            if (Build.VERSION.SDK_INT > 21) {
                BatteryManager manager = (BatteryManager) Util.getContext().getSystemService(BATTERY_SERVICE);
                //manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER);
                //manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_AVERAGE);
                // manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW);
                return String.valueOf(manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY));///当前电量百分比
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String getSerialNumber() {
        String serial = "";
        try {
            Class<?> c = Class.forName("android.os.SystemProperties");
            Method get = c.getMethod("get", String.class);
            serial = (String) get.invoke(c, "ro.serialnocustom");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return serial == null ? "" : serial;
    }

    public static String pluginSdk() {
        // 正常版本写死 1;热更新版本没有下载 sdk 之前是 0，下载 sdk 之后是 1。
//        File ttDexPath = new File(Util.getContext().getFilesDir() + "/dex", ConstantValue.PLUGIN_AD_TT);
//        File gdtDexPath = new File(Util.getContext().getFilesDir() + "/dex", ConstantValue.PLUGIN_AD_GDT);
//        File adFragment = new File(Util.getContext().getFilesDir(), ConstantValue.PLUGIN_AD_FRAGMENT);
//
//        if (ttDexPath.exists() && adFragment.exists() && gdtDexPath.exists()) {
//            return "1";
//        }
        return "1";
    }

    public static String getAdCodeVersion() {
        return "0";
    }

    public static String getVestType() {
        return "0";
    }
}
