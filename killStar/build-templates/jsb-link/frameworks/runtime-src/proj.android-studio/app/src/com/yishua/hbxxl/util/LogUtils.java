package com.yishua.hbxxl.util;

import android.text.TextUtils;
import android.util.Log;

import com.yishua.hbxxl.ConstantValue;


/**
 *
 */

public class LogUtils {

    /**
     * 日志输出级别V
     */
    public static final int LEVEL_VERBOSE = 1;
    /**
     * 日志输出级别D
     */
    public static final int LEVEL_DEBUG = 2;
    /**
     * 日志输出级别I
     */
    public static final int LEVEL_INFO = 3;
    /**
     * 日志输出级别W
     */
    public static final int LEVEL_WARN = 4;
    /**
     * 日志输出级别E
     */
    public static final int LEVEL_ERROR = 5;

    /**
     * 日志输出时的TAG
     */
    private static String mTag = "HBXXL";

    /**
     * 日志输出级别NONE
     */
    public static final int LEVEL_NONE = 6;
    /**
     * 是否允许输出log
     */

    private static int mDebuggable = LEVEL_NONE;


    /**
     * 用于记时的变量
     */
    private static long mTimestamp = 0;
    /**
     * 写文件的锁对象
     */
    private static final Object mLogLock = new Object();

    /**
     * 以级别为 d 的形式输出LOG
     */
//    public static void v(String msg) {
//        if (mDebuggable <= LEVEL_VERBOSE) {
//            Log.v(mTag, msg);
//        }
//    }

    /**
     * 以级别为 d 的形式输出LOG
     */
//    public static void d(String msg) {
//        if (mDebuggable <= LEVEL_DEBUG) {
//            Log.d(mTag, msg);
//        }
//    }

    /**
     * 以级别为 i 的形式输出LOG
     */
//    public static void i(String msg) {
//        if (mDebuggable <= LEVEL_INFO) {
//            Log.i(mTag, msg);
//        }
//    }

    /**
     * 以级别为 w 的形式输出LOG
     */
//    public static void w(String msg) {
//        if (mDebuggable <= LEVEL_WARN) {
//            Log.w(mTag, msg);
//        }
//    }

    /**
     * 以级别为 w 的形式输出Throwable
     */
    public static void w(Throwable tr) {
        if (mDebuggable <= LEVEL_WARN) {
            Log.w(mTag, "", tr);
        }
    }

    /**
     * 以级别为 w 的形式输出LOG信息和Throwable
     */
    public static void w(String msg, Throwable tr) {
        if (mDebuggable <= LEVEL_WARN && null != msg) {
            Log.w(mTag, msg, tr);
        }
    }

    /**
     * 以级别为 e 的形式输出LOG
     */
    public static void e(String msg) {

        if (!ConstantValue.isRelease) {
            if (TextUtils.isEmpty(msg)) {
                Log.e(mTag, getTopStackInfo() + "：" + "打印的msg为空");
            } else {
                Log.e(mTag, getTopStackInfo() + "：" + msg);
            }
        }
    }

    /**
     * 以级别为 e 的形式输出Throwable
     */
    public static void e(Throwable tr) {
        if (mDebuggable <= LEVEL_ERROR) {
            Log.e(mTag, "", tr);
        }
    }

    /**
     * 以级别为 e 的形式输出LOG信息和Throwable
     */
    public static void e(String msg, Throwable tr) {
        if (mDebuggable <= LEVEL_ERROR && null != msg) {
            Log.e(mTag, msg, tr);
        }
    }


    /**
     * 以级别为 e 的形式输出msg信息,附带时间戳，用于输出一个时间段起始点
     *
     * @param msg 需要输出的msg
     */
    public static void msgStartTime(String msg) {
        mTimestamp = System.currentTimeMillis();
        if (mDebuggable <= LEVEL_ERROR &&!TextUtils.isEmpty(msg)) {
            e("[Started：" + mTimestamp + "]" + msg);
        }
    }

    /**
     * 以级别为 e 的形式输出msg信息,附带时间戳，用于输出一个时间段结束点* @param msg 需要输出的msg
     */
    public static void elapsed(String msg) {
        long currentTime = System.currentTimeMillis();
        long elapsedTime = currentTime - mTimestamp;
        mTimestamp = currentTime;
        e("[Elapsed：" + elapsedTime + "]" + msg);
    }

//    public static <T> void printList(List<T> list) {
//        if (list == null || list.size() < 1) {
//            return;
//        }
//        int size = list.size();
//        i("---begin---");
//        for (int i = 0; i < size; i++) {
//            i(i + ":" + list.get(i).toString());
//        }
//        i("---end---");
//    }

//    public static <T> void printArray(T[] array) {
//        if (array == null || array.length < 1) {
//            return;
//        }
//        int length = array.length;
//        i("---begin---");
//        for (int i = 0; i < length; i++) {
//            i(i + ":" + array[i].toString());
//        }
//        i("---end---");
//    }

    /**
     * 获取最顶部stack信息
     *
     * @return
     */
    public static String getTopStackInfo() {
        StackTraceElement caller = getCurrentStackTrace();
        if (caller == null) {
//            Log.e("tag", "StackTraceElement == null");
            return "";
        }
        String stackTrace = caller.toString();
        stackTrace = stackTrace.substring(stackTrace.lastIndexOf('('), stackTrace.length());
        String tag = "%s.%s%s";
        String callerClazzName = caller.getClassName();
        callerClazzName = callerClazzName.substring(callerClazzName.lastIndexOf(".") + 1);
        tag = String.format(tag, callerClazzName, caller.getMethodName(), stackTrace);

        return tag;
    }

    /**
     * 获取当前activity栈信息
     *
     * @return
     */
    private static StackTraceElement getCurrentStackTrace() {
        StackTraceElement[] trace = Thread.currentThread().getStackTrace();
        for (int i = 0; i < trace.length; i++) {
            String name = trace[i].getClassName();

            if (name != null && name.equals(LogUtils.class.getName())) {
                StackTraceElement element = trace[i + 1];

                String elementClassName = element.getClassName();
                if (elementClassName != null && !elementClassName.equals(LogUtils.class.getName())) {
                    return element;
                }
            }
        }

        return null;
    }
}
