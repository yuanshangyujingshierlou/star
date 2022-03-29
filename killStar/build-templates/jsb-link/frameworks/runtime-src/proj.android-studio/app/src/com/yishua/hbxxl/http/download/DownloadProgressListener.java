package com.yishua.hbxxl.http.download;

/**
 * Created by Junguo.L on 2020-01-09.
 */
public interface DownloadProgressListener {
    void onProgress(int progress);

    void onFail(String message);

    void onComplete();
}
