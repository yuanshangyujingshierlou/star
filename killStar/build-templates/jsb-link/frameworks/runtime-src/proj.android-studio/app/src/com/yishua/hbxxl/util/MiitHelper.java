package com.yishua.hbxxl.util;

import android.content.Context;
import android.text.TextUtils;

import com.bun.miitmdid.core.ErrorCode;
import com.bun.miitmdid.core.MdidSdkHelper;
import com.bun.miitmdid.interfaces.IIdentifierListener;
import com.bun.miitmdid.interfaces.IdSupplier;

/**
 * Created by zheng on 2019/8/22.
 */

public class MiitHelper implements IIdentifierListener {


    public static String vaid = "";
    public static String aaid = "";
    public static String oaid = "";


    public MiitHelper() {

    }

    public void getDeviceIds(Context cxt) {
        try {
            int nres = CallFromReflect(cxt);
            if (nres == ErrorCode.INIT_ERROR_DEVICE_NOSUPPORT) {//1008612 不支持的设备
                // MyApplication.setIsSupportOaid(false);
            } else if (nres == ErrorCode.INIT_ERROR_LOAD_CONFIGFILE) {//1008613 加载配置文件出错
                //MyApplication.setIsSupportOaid(false);
            } else if (nres == ErrorCode.INIT_ERROR_MANUFACTURER_NOSUPPORT) {//1008611 不支持的设备厂商
                //MyApplication.setIsSupportOaid(false);
            } else if (nres == ErrorCode.INIT_ERROR_RESULT_DELAY) {//1008614 获取接口是异步的，结果会在回调中返回，回调执行的回调可能在工作线程
                // MyApplication.setIsSupportOaid(false);
            } else if (nres == ErrorCode.INIT_HELPER_CALL_ERROR) {//1008615 反射调用出错
                //MyApplication.setIsSupportOaid(false);
            }
            LogUtils.e("getDeviceIds oaid  nres" + nres);
        } catch (Exception e) {
            e.printStackTrace();

        }
    }


    /*
     * 通过反射调用，解决android 9以后的类加载升级，导至找不到so中的方法
     *
     * */
    private int CallFromReflect(Context cxt) {
        return MdidSdkHelper.InitSdk(cxt, true, this);
    }

    /*
     * 直接java调用，如果这样调用，在android 9以前没有题，在android 9以后会抛找不到so方法的异常
     * 解决办法是和JLibrary.InitEntry(cxt)，分开调用，比如在A类中调用JLibrary.InitEntry(cxt)，在B类中调用MdidSdk的方法
     * A和B不能存在直接和间接依赖关系，否则也会报错
     *
     * */
//    private int DirectCall(Context cxt) {
//        MdidSdk sdk = new MdidSdk();
//        return sdk.InitSdk(cxt, this);
//    }

    @Override
    public void OnSupport(boolean isSupport, IdSupplier _supplier) {
        try {
            if (_supplier == null) {
                return;
            }
            oaid = _supplier.getOAID();
            if (TextUtils.isEmpty(oaid)) {
                oaid = "";
            }
            vaid = _supplier.getVAID();
            if (TextUtils.isEmpty(vaid)) {
                vaid = "";
            }
            aaid = _supplier.getAAID();
            if (TextUtils.isEmpty(aaid)) {
                aaid = "";
            }
            //String udid=_supplier.getUDID();
//        StringBuilder builder=new StringBuilder();
//        builder.append("support: ").append(isSupport?"true":"false").append("\n");
//       // builder.append("UDID: ").append(udid).append("\n");
//        builder.append("OAID: ").append(oaid).append("\n");
//        builder.append("VAID: ").append(vaid).append("\n");
//        builder.append("AAID: ").append(aaid).append("\n");
//        String idstext=builder.toString();
            //String oaid = _supplier.getOAID();
//            _supplier.shutDown();           //关闭接口

            LogUtils.e("OnSupport oaid = " + oaid);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
