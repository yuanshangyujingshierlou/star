package com.yishua.hbxxl.module.dialog;

import android.app.Activity;
import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.yishua.hbxxl.R;
import com.yishua.hbxxl.lifecycle.LifecycleCallback;
import com.yishua.hbxxl.util.ToastUtil;

public class DialogUtil {

    private static AlertDialog alertDialog;

    public static void showTipDialog(String tip) {
        Activity currentActivity = LifecycleCallback.getInstance().getCurrentActivity();

        if (currentActivity != null && !currentActivity.isFinishing()) {

            View tipView = LayoutInflater.from(currentActivity).inflate(R.layout.layout_dialog_tip, null);
            ImageView iv_close = tipView.findViewById(R.id.iv_close);
            TextView tv_tip = tipView.findViewById(R.id.tv_tip);

            tv_tip.setText(tip);

            iv_close.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (alertDialog != null && alertDialog.isShowing()) {
                        alertDialog.dismiss();
                    }
                }
            });

            alertDialog = new AlertDialog.Builder(currentActivity, R.style.dialog_tip)
                    .setView(tipView)
                    .setCancelable(false)
                    .create();

            alertDialog.show();
        }else {
            // 使用Toast
            ToastUtil.showCenterLongToast(tip);
        }
    }
}
