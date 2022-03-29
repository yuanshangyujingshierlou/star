package com.yishua.hbxxl.http.download;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import org.cocos2dx.okhttp3.MediaType;
import org.cocos2dx.okhttp3.ResponseBody;
import org.cocos2dx.okio.Buffer;
import org.cocos2dx.okio.BufferedSource;
import org.cocos2dx.okio.ForwardingSource;
import org.cocos2dx.okio.Okio;
import org.cocos2dx.okio.Source;

import java.io.IOException;

//import okhttp3.MediaType;
//import okhttp3.ResponseBody;
//import okio.Buffer;
//import okio.BufferedSource;
//import okio.ForwardingSource;
//import okio.Okio;
//import okio.Source;

/**
 * Created by Junguo.L on 2020-01-09.
 */
public class DownloadProgressResponseBody extends ResponseBody {
    public static final int UPDATE = 0x01;
    private DownloadProgressListener mListener;
    private ResponseBody responseBody;
    private BufferedSource bufferedSink;
    private long totalBytesRead;
    private final MyHandler myHandler;

    public DownloadProgressResponseBody(ResponseBody body, DownloadProgressListener downloadProgressListener) {
        this.responseBody = body;
        this.mListener = downloadProgressListener;

        myHandler = new MyHandler();
    }

    /**
     * 通过Handler发送到主线程中执行
     */
    class MyHandler extends Handler {

        public MyHandler() {
            super(Looper.getMainLooper());
        }

        @Override
        public void handleMessage(Message msg) {
            if (msg.what == UPDATE && mListener != null) {
                int progress = msg.arg1;
                mListener.onProgress(progress);
            }
        }
    }

    @Override
    public MediaType contentType() {
        // contentType = application/vnd.android.package-archive
        return responseBody.contentType();
    }

    @Override
    public long contentLength() {
        // contentLength = 2719284
        return responseBody.contentLength();
    }

    @Override
    public BufferedSource source() {
        if (bufferedSink == null) {
            bufferedSink = Okio.buffer(getMySource(responseBody.source()));
        }
        return bufferedSink;
    }

    private Source getMySource(Source source) {

        ForwardingSource forwardingSource = new ForwardingSource(source) {
            /**
             *
             * @param sink
             * @param byteCount 定义的每次读取的byte的大小：long[] byteCount = 8192字节
             * @return
             * @throws IOException
             */
            @Override
            public long read(Buffer sink, long byteCount) throws IOException {
                // bytesRead：实际每次读取的字节数，bytesRead=-1表示已经读取完成
                long bytesRead = super.read(sink, byteCount);

                totalBytesRead += bytesRead != -1 ? bytesRead : 0; // 每次读取的字节数相加，totalBytesRead == contentLength（）表示读取完成

//                LogUtils.e("source  byteCount = " + byteCount + "  bytesRead = " + bytesRead + "   totalBytesRead = " + totalBytesRead);

                if (bytesRead != -1) {
                    Message msg = Message.obtain();
                    msg.what = UPDATE;
                    msg.arg1 = (int) (totalBytesRead * 1.0 / contentLength() * 100);
                    myHandler.sendMessage(msg);
                }
                return bytesRead;
            }
        };

        return forwardingSource;
    }
}
