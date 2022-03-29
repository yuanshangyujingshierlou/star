package com.yishua.hbxxl.module.feedback;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;

import com.yishua.hbxxl.R;
import com.yishua.hbxxl.util.LogUtils;
import com.yishua.hbxxl.util.UserUtil;

public class FeedbackActivity extends AppCompatActivity implements View.OnClickListener {
    private WebView wb_feedback;
    private ImageView iv_close;
    private ValueCallback<Uri[]> mUploadMessage;
    private int FILECHOOSER_RESULTCODE = 10000;
    private String pushId = "330422";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);

        initView();
        initListener();
        initData();
    }

    protected void initView() {
        iv_close = findViewById(R.id.iv_close);

        wb_feedback = findViewById(R.id.wb_feedback);

        wb_feedback.getSettings().setJavaScriptEnabled(true);
        wb_feedback.getSettings().setDomStorageEnabled(true);       // 这个要加上

        /* WebView 内嵌 Client 可以在APP内打开网页而不是跳出到浏览器 */
        WebViewClient webViewClient = new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                super.shouldOverrideUrlLoading(view, url);
//                LogUtils.e("wx url = " + url);

                if (url == null) {
                    return false;
                }
                try {
                    if (url.startsWith("weixin://")) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        view.getContext().startActivity(intent);
                        return true;
                    }
                } catch (Exception e) {
                    return false;
                }
                view.loadUrl(url);
                return true;
            }
        };
        wb_feedback.setWebViewClient(webViewClient);

        // WebView 上传图片
        // https://developer.aliyun.com/article/685549
        wb_feedback.setWebChromeClient(new WebChromeClient() {

            // For Android >= 5.0
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (mUploadMessage != null) {
                    mUploadMessage.onReceiveValue(null);
                }
                LogUtils.e("UPFILE file chooser params：" + fileChooserParams.toString());
                mUploadMessage = filePathCallback;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    if (fileChooserParams.getAcceptTypes() != null && fileChooserParams.getAcceptTypes().length > 0) {
                        i.setType(fileChooserParams.getAcceptTypes()[0]);
                    } else {
                        i.setType("*/*");
                    }
                }
                startActivityForResult(Intent.createChooser(i, "File Chooser"), FILECHOOSER_RESULTCODE);
                return true;
            }
        });

        /* 获得 webview url，请注意url单词是product而不是products，products是旧版本的参数，用错地址将不能成功提交 */
        String url = "https://support.qq.com/product/" + pushId + "?d-wx-push=1"; // 把1221数字换成你的产品ID，否则会不成功
        /* 准备post参数 */
        String postData = "nickname=" + (UserUtil.getNickname() + UserUtil.getUserId()) + "&avatar=" + UserUtil.getHeadImgUrl() + "&openid=" + UserUtil.getUserId();
        wb_feedback.postUrl(url, postData.getBytes());
    }

    protected void initListener() {
        iv_close.setOnClickListener(this);
    }

    protected void initData() {

    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.iv_close) {
            finish();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (mUploadMessage == null) {
                return;
            }

            onActivityResultAboveL(requestCode, resultCode, data);
        }
    }

    private void onActivityResultAboveL(int requestCode, int resultCode, Intent intent) {
        if (requestCode != FILECHOOSER_RESULTCODE || mUploadMessage == null)
            return;

        Uri[] results = null;
        if (resultCode == Activity.RESULT_OK) {
            if (intent != null) {
                String dataString = intent.getDataString();
                ClipData clipData = intent.getClipData();
                if (clipData != null) {
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        ClipData.Item item = clipData.getItemAt(i);
                        results[i] = item.getUri();
                    }
                }
                if (dataString != null)
                    results = new Uri[]{Uri.parse(dataString)};
            }
        }
        mUploadMessage.onReceiveValue(results);
        mUploadMessage = null;
    }
}
