package com.yishua.hbxxl.util;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.support.v4.content.FileProvider;

import com.yishua.hbxxl.Util;

import java.io.File;


/**
 * Created on 2018/4/25.
 * Author：Junguo
 */

public class InstallUtil {

    public static void installApk(String filePath) {
        installApk(new File(filePath));
    }

    public static void installApk(File file) {

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Uri data;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {//判断版本大于等于7.0
            // "com.ansen.checkupdate.fileprovider"即是在清单文件中配置的authorities
            // 通过FileProvider创建一个content类型的Uri
            String packageName = Util.getContext().getPackageName();
            data = FileProvider.getUriForFile(Util.getContext(), packageName + ".provider", file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);// 给目标应用一个临时授权
            intent.setDataAndType(data, "application/vnd.android.package-archive");
        } else {
            intent.addCategory("android.intent.category.DEFAULT");
            intent.setDataAndType(Uri.fromFile(file.getAbsoluteFile()),
                    "application/vnd.android.package-archive");
        }

        Util.getContext().startActivity(intent);
    }

    public static boolean isInstallSoftware(Context context, String packageName) {
        PackageManager packageManager = context.getPackageManager();
        try {
            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, PackageManager.COMPONENT_ENABLED_STATE_DEFAULT);
            if (packageInfo != null) {
                return true;
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static void startApp(String packageName) {
        final Intent intent = Util.getContext().getPackageManager().getLaunchIntentForPackage(packageName);
        if (intent != null) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            Util.getContext().startActivity(intent);
        }
    }
}
