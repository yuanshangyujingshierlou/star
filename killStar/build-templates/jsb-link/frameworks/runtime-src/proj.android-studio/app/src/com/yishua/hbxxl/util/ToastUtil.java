package com.yishua.hbxxl.util;

import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.Util;

/**
 * Created by Junguo.L on 2017/9/5.
 */

public class ToastUtil {

    private static Toast toast;
    private static Toast centerToast;
    private static Toast centerLongToast;
    private static Toast longToast;

    public static void showToast(String des) {
        new Handler(Looper.getMainLooper())
                .post(new Runnable() {
                    @Override
                    public void run() {
                        if (toast != null) {
                            toast.cancel();
                        }

                        toast = Toast.makeText(Util.getContext(), des, Toast.LENGTH_SHORT);

                        toast.setText(des);
                        toast.show();
                    }
                });
    }

    /**
     * 在中间长时间展示的Toast
     *
     * @param des
     */
    public static void showLongToast(String des) {
        new Handler(Looper.getMainLooper())
                .post(new Runnable() {
                    @Override
                    public void run() {
                        if (centerLongToast != null) {
                            centerLongToast.cancel();
                        }

                        centerLongToast = Toast.makeText(Util.getContext(), des, Toast.LENGTH_LONG);

                        centerLongToast.setGravity(Gravity.CENTER, 0, 0);

                        TextView v = centerLongToast.getView().findViewById(android.R.id.message);
                        v.setPadding(30, 0, 30, 0);

                        v.setTextSize(18);

                        centerLongToast.show();
                    }
                });
    }

    /**
     * 在屏幕中间显示Toast,duration=Long
     *
     * @param text
     */
    public static void showCenterLongToast(String text) {
        new Handler(Looper.getMainLooper())
                .post(new Runnable() {
                    @Override
                    public void run() {
                        View v = LayoutInflater.from(Util.getContext()).inflate(R.layout.toast_center, null);
                        TextView textView = (TextView) v.findViewById(R.id.textView1);
                        textView.setText(text);
                        textView.setTextSize(18);

                        if (longToast != null) {
                            longToast.cancel();
                        }

                        longToast = new Toast(Util.getContext());
                        longToast.setDuration(Toast.LENGTH_LONG);
                        longToast.setView(v);
                        longToast.setGravity(Gravity.CENTER, 0, 0);

                        longToast.show();
                    }
                });
    }


    public static void showCenterToast(String des) {
        new Handler(Looper.getMainLooper())
                .post(new Runnable() {
                    @Override
                    public void run() {
                        if (centerToast != null) {
                            centerToast.cancel();
                        }

                        centerToast = Toast.makeText(Util.getContext(), des, Toast.LENGTH_SHORT);
                        centerToast.setGravity(Gravity.CENTER, 0, 0);

                        View view = centerToast.getView();
                        view.setBackground(null);

                        TextView textView = view.findViewById(android.R.id.message);
                        textView.setBackgroundColor(Util.getContext().getResources().getColor(R.color.black_alpha));
                        textView.setTextColor(Util.getContext().getResources().getColor(R.color.white));
                        textView.setTextSize(13);
                        textView.setPadding(60, 8, 60, 8);

                        centerToast.setText(des);

                        centerToast.show();
                    }
                });
    }

    /**
     * 测试阶段使用
     * @param text
     */
    public static void showDebugToast(String text) {
        if (ConstantValue.isRelease) {
            return;
        }
        new Handler(Looper.getMainLooper())
                .post(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(Util.getContext(), text + "  （测试用）", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}