package com.yishua.hbxxl.module.hpage;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

public class HpageUtil {

    public static void jumpFunction(Context context, String functionUrl,String title) {
        if (TextUtils.isEmpty(functionUrl)) {
            return;
        }

        Intent intent7 = new Intent(context, NormalWebActivity.class);
        intent7.putExtra("url", functionUrl);
        intent7.putExtra("title", title);
        intent7.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent7);

    }

    public static void jumpTask(Context context, String functionUrl) {
        if (TextUtils.isEmpty(functionUrl)) {
            return;
        }

        Intent intent7 = new Intent(context, TaskActivity.class);
        intent7.putExtra("url", functionUrl);
        intent7.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent7);

    }
}
