package com.yishua.hbxxl.http;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.telephony.TelephonyManager;

import com.yishua.hbxxl.Util;


/**
 * Created by Junguo.L on 2019-12-24.
 */
public class HttpUtils {

    /**
     * 检测网络状态
     *
     * @param context
     * @return
     */
    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivity = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivity == null) {
            return false;
        } else {
            NetworkInfo[] info = connectivity.getAllNetworkInfo();
            if (info != null) {
                for (int i = 0; i < info.length; i++) {
                    if (info[i].getState() == NetworkInfo.State.CONNECTED) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static String getNetworkType(Context context) {
        String type;
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo info = cm.getActiveNetworkInfo();
        if (info == null) {
            type = "null";
        } else if (info.getType() == ConnectivityManager.TYPE_WIFI) {
            type = "wifi";
        } else if (info.getType() == ConnectivityManager.TYPE_MOBILE) {
            int subType = info.getSubtype();
            if (subType == TelephonyManager.NETWORK_TYPE_CDMA || subType == TelephonyManager.NETWORK_TYPE_GPRS
                    || subType == TelephonyManager.NETWORK_TYPE_EDGE) {
                type = "2g";
            } else if (subType == TelephonyManager.NETWORK_TYPE_UMTS || subType == TelephonyManager.NETWORK_TYPE_HSDPA
                    || subType == TelephonyManager.NETWORK_TYPE_EVDO_A || subType == TelephonyManager.NETWORK_TYPE_EVDO_0
                    || subType == TelephonyManager.NETWORK_TYPE_EVDO_B) {
                type = "3g";
            } else if (subType == TelephonyManager.NETWORK_TYPE_LTE) {// LTE是3g到4g的过渡，是3.9G的全球标准
                type = "4g";
            } else {
                type = "mobile_" + subType;
            }
        } else {
            type = "type_" + info.getType();
        }
        return type;
    }

    public static long networkType(Context context) {

        long type;
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo info = cm.getActiveNetworkInfo();
        if (info == null) {
            type = 0;
        } else if (info.getType() == ConnectivityManager.TYPE_WIFI) {
            type = 4;
        } else if (info.getType() == ConnectivityManager.TYPE_MOBILE) {
            int subType = info.getSubtype();
            if (subType == TelephonyManager.NETWORK_TYPE_CDMA || subType == TelephonyManager.NETWORK_TYPE_GPRS
                    || subType == TelephonyManager.NETWORK_TYPE_EDGE) {
                type = 1;
            } else if (subType == TelephonyManager.NETWORK_TYPE_UMTS || subType == TelephonyManager.NETWORK_TYPE_HSDPA
                    || subType == TelephonyManager.NETWORK_TYPE_EVDO_A || subType == TelephonyManager.NETWORK_TYPE_EVDO_0
                    || subType == TelephonyManager.NETWORK_TYPE_EVDO_B) {
                type = 2;
            } else if (subType == TelephonyManager.NETWORK_TYPE_LTE) {// LTE是3g到4g的过渡，是3.9G的全球标准
                type = 3;
            } else {
                type = 0;
            }
        } else {
            type = 0;
        }
        return type;
    }

    /**
     * 获取网络接入点类型
     *
     * @param context
     */
    public static String netWorkType(Context context) {
        String network_type = "";
        try {
            ConnectivityManager conManager = (ConnectivityManager) context
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo info_mobile = conManager.getActiveNetworkInfo();
            if (info_mobile != null && info_mobile.getState() == NetworkInfo.State.CONNECTED) {
                if (info_mobile.getType() == ConnectivityManager.TYPE_WIFI) {
                    network_type = "wifi";
                } else {
                    network_type = info_mobile.getExtraInfo();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (null == network_type) {
            network_type = "";
        }
        return network_type;
    }


    public static String getMnc() {
        TelephonyManager tm = (TelephonyManager) Util.getContext().getSystemService(Context.TELEPHONY_SERVICE);
        String mnc = tm.getNetworkOperator();
        return mnc==null?"":mnc;
    }
}
