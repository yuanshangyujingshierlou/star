package com.yishua.hbxxl.module.hpage;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.WebView;
import android.widget.TextView;

import com.yishua.hbxxl.R;

public class NormalWebActivity extends AppCompatActivity {

    private String url;
    private String title;
    private TextView tvTitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_normal_web);

        url = getIntent().getStringExtra("url");
        title = getIntent().getStringExtra("title");

        tvTitle = findViewById(R.id.title);

        tvTitle.setText(title);

        WebView webView = findViewById(R.id.webView);
        webView.loadUrl(url);
    }
}
