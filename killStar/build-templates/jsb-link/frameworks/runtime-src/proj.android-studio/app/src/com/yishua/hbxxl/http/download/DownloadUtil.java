package com.yishua.hbxxl.http.download;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.util.LogUtils;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Interceptor;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

/**
 * Created on 2018/7/31.
 * Author：Junguo
 */
public class DownloadUtil {
    private volatile static OkHttpClient okHttpClient;

    private static OkHttpClient getClient() {
        if (okHttpClient == null) {
            synchronized (DownloadUtil.class) {
                if (okHttpClient == null) {
                    okHttpClient = new OkHttpClient.Builder().connectTimeout(10000, TimeUnit.MILLISECONDS)
                            .readTimeout(30, TimeUnit.SECONDS)
                            .writeTimeout(30, TimeUnit.SECONDS).build();
                }
            }
        }

        return okHttpClient;
    }

    private static void writeLocal(InputStream inputStream, String outputPath) {

        LogUtils.e("outputPath = " + outputPath + " thread = " + Thread.currentThread().getName());

        File file = new File(outputPath);
        FileOutputStream fos = null;

        try {
            if (file.exists()) {
                file.delete();
            }

            fos = new FileOutputStream(file);

            byte[] buffer = new byte[1024];
            int len;

            while ((len = inputStream.read(buffer)) != -1) {
                fos.write(buffer, 0, len);

                fos.flush();
            }

            inputStream.close();
            fos.close();

        } catch (IOException e) {
            e.printStackTrace();
            LogUtils.e("writeLocal Exception = " + e.toString());

            throw new RuntimeException("apk下载失败");
        } finally {
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                if (fos != null) {
                    fos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void progressDownload(String downloadUrl, final String fileSavePath, final DownloadProgressListener downloadProgressListener) {

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .addNetworkInterceptor(new Interceptor() {
                    @Override
                    public Response intercept(Chain chain) throws IOException {

                        Response response = chain.proceed(chain.request());

                        // 拦截 Response
                        Response newResponse = response.newBuilder()
                                .body(new DownloadProgressResponseBody(response.body(), downloadProgressListener))
                                .build();

                        return newResponse;
                    }
                }).build();

        Request request = new Request.Builder()
                .get()
                .url(downloadUrl)
                .build();

        okHttpClient.newCall(request)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        LogUtils.e("onFailure = " + e.getMessage());

                        if (downloadProgressListener != null) {
                            downloadProgressListener.onFail("下载失败");
                        }
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        long l = System.currentTimeMillis();


                        if (response.isSuccessful()) {
                            try {
                                // 保存到本地
                                writeLocal(response.body().byteStream(), fileSavePath);

                                if (downloadProgressListener != null) {
                                    downloadProgressListener.onComplete();
                                }
                            } catch (Exception e) {
                                //
                                LogUtils.e("exception = " + e.toString());

                                if (downloadProgressListener != null) {
                                    downloadProgressListener.onFail("下载失败");
                                }
                            }
                        } else {
                            if (downloadProgressListener != null) {
                                downloadProgressListener.onFail("下载失败");
                            }
                        }

                        LogUtils.e("doOnNext Thread = " + Thread.currentThread().getName() + "  time = " + (System.currentTimeMillis() - l));
                    }
                });
    }

    public static void downloadPicBitmap(String imgUrl, DownloadPicBitmapListener listener) {

        RequestBuilder<File> requestBuild = Glide.with(Util.getContext())
                .downloadOnly()
                .load(imgUrl)
                .listener(new RequestListener<File>() {
                    @Override
                    public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<File> target, boolean isFirstResource) {
                        if (listener != null) {
                            listener.onLoadFailed(e.getMessage());
                        }
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(File resource, Object model, Target<File> target, DataSource dataSource, boolean isFirstResource) {
                        try {
                            FileInputStream fis = new FileInputStream(resource);
                            Bitmap bmp = BitmapFactory.decodeStream(fis);

                            if (listener != null) {
                                listener.onLoadReady(bmp);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        return false;
                    }
                });
        requestBuild.preload();

//        Request request = new Request.Builder()
//                .get()
//                .url(imgUrl)
//                .build();
//
//        HttpClient.getOkHttpClient()
//                .newCall(request)
//                .enqueue(new Callback() {
//                    @Override
//                    public void onFailure(Call call, IOException e) {
//                        LogUtils.e("downloadPicBitmap onFailure " + e.getMessage());
//
//                        if (listener != null) {
//                            listener.onLoadFailed(e.getMessage());
//                        }
//                    }
//
//                    @Override
//                    public void onResponse(Call call, Response response) throws IOException {
//
//                        if (response.isSuccessful() && response.body() != null) {
//                            new Handler(Looper.getMainLooper())
//                                    .post(new Runnable() {
//                                        @Override
//                                        public void run() {
//                                            try {
//                                                InputStream inputStream = response.body().byteStream();
//
//                                                LogUtils.e("inputStream is null = " + (inputStream == null));
//                                                if (inputStream != null) {
//                                                    int read = inputStream.read();
//                                                    LogUtils.e("read = " + read);
//                                                }
//
//                                                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
//
//                                                if (listener != null) {
//                                                    listener.onLoadReady(bitmap);
//                                                }
//                                            } catch (Exception e) {
//                                                LogUtils.e("decode bitmap Exception = " + e.getMessage());
//
//                                                if (listener != null) {
//                                                    listener.onLoadFailed("error");
//                                                }
//                                            }
//                                        }
//                                    });
//                        } else if (listener != null) {
//
//                            listener.onLoadFailed("error");
//                        }
//                    }
//                });
    }

    public interface DownloadPicBitmapListener {
        void onLoadFailed(String errMsg);

        void onLoadReady(Bitmap bitmap);
    }

}
