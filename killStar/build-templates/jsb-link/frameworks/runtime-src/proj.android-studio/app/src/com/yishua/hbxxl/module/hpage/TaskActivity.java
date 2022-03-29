package com.yishua.hbxxl.module.hpage;

import android.content.Intent;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.webkit.DownloadListener;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.yishua.hbxxl.R;
import com.yishua.hbxxl.module.dialog.DialogUtil;
import com.yishua.hbxxl.util.LogUtils;

public class TaskActivity extends AppCompatActivity {

    private WebView webView;
    public static final String TAG = "TaskActivity";
    private boolean isviewinit = false;
    private String urlPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_task);

        webView = findViewById(R.id.webView);

        urlPath = getIntent().getStringExtra("url");

        initWebView();
    }

    private void initWebView() {
        WebSettings setting = webView.getSettings();
        setting.setJavaScriptEnabled(true);
        setting.setBuiltInZoomControls(true);
        setting.setDisplayZoomControls(false);
        setting.setSupportZoom(true);
        setting.setDomStorageEnabled(true);
        setting.setDatabaseEnabled(true);
        setting.setCacheMode(WebSettings.LOAD_DEFAULT);//关闭webview中缓存
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            setting.setMediaPlaybackRequiresUserGesture(false);
        }
        // 全屏显示
        setting.setLoadWithOverviewMode(true);
        setting.setUseWideViewPort(true);
        /*if (Build.VERSION.SDK_INT >= 21) {
            setting.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }*/
        setting.setTextZoom(100);

        //注册js调用方法
        WebAppInterface webInterface = new WebAppInterface(this);
        webView.addJavascriptInterface(webInterface, "android");

        webView.loadUrl(urlPath);

        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // 不校验证书
                handler.proceed();
            }

            @Override
            public void onPageFinished(WebView view, String url) {

                super.onPageFinished(view, url);


            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return super.shouldOverrideUrlLoading(view, request);
            }

//            @Override
//            public boolean shouldOverrideUrlLoading(WebView view, String url) {
//                return super.shouldOverrideUrlLoading(view, url);
//            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http:") || url.startsWith("https:")) {
                    // webView.loadUrl(url);
                    Intent intent4 = new Intent(TaskActivity.this, TaskActivity.class);
                    intent4.putExtra("url", url);
                    intent4.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    TaskActivity.this.startActivity(intent4);

                    return true;
                } else {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        return true;
                    } catch (Exception e) { //防止crash (如果手机上没有安装处理某个scheme开头的url的APP, 会导致crash)
                        LogUtils.e(e.getMessage());
                        return true;
                    }
                }
            }
        });
        webView.setDownloadListener(new DownloadListener() {

            @Override
            public void onDownloadStart(final String arg0, String arg1, String arg2,
                                        String arg3, long arg4) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_BROWSABLE);
                intent.setData(Uri.parse(arg0));
                startActivity(intent);
            }
        });

        isviewinit = true;
    }

    public void loadJs(String func, String data) {
        runOnUiThread(new Runnable() {
                          @Override
                          public void run() {
                              if (null != webView) {
                                  webView.loadUrl("javascript:" + func + "('" + data + "')");  //仔细看我给标红的单引号
                              }
                          }
                      }
        );
    }
}
