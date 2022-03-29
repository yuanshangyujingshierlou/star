package com.yishua.hbxxl.util;

import com.bytedance.sdk.openadsdk.preload.geckox.model.Response;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.http.Api;
import com.yishua.hbxxl.http.HttpClient;

import org.cocos2dx.okhttp3.Call;
import org.cocos2dx.okhttp3.Callback;
import org.cocos2dx.okhttp3.Request;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by Junguo.L on 2020-01-15.
 * <p>
 * 广告曝光点击上报到后台
 */
public class AdActionUtil {

    /**
     * @param adType         api 是返回对象里的相同字段名称，sdk 的是自己取名字(gdt，baidu)
     * @param downLoad       是否是下载：y，n
     * @param type           上报的类型：click、exp
     * @param adConfigId     api才有，对应字段
     * @param clientConfigId 头条原生：2  头条激励视频 201  api：对应返回的ClientConfigId
     */
    public static void upload(String adType, boolean downLoad, String type, int adConfigId, int clientConfigId) {

        Map<String, String> params = new HashMap<>();
        String down = "n";
        if (downLoad) {
            down = "y";
        }

        params.put("adTypeId", clientConfigId + "");
        params.put("userId", UserUtil.getUserId() + "");
        params.put("adConfigId", adConfigId + ""); // 只有 api 的有，返回的对象里 这个相同字段名称
        params.put("adType", adType); // api 是返回对象里的相同字段名称，sdk 的是自己取名字(gdt，baidu)
        params.put("downLoad", down);
        params.put("type", type); // 类型：click、exp
        //params.put("channel", HttpParamUtil.getChannel());
        params.put("version", Util.getVersionCode());
//        params.put("token", TokenUtil.getToken());
        //params.put("androidId", HttpParamUtil.getAndroidId());
        //params.put("imei", HttpParamUtil.getImei());
        //params.put("oaid", MiitHelper.oaid);

        Request postRequest = HttpClient.getPostRequest(Api.ADACTIONUPLOAD, params);
        HttpClient.getOkHttpClient()
                .newCall(postRequest)
                .enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {

                    }

                    @Override
                    public void onResponse(Call call, org.cocos2dx.okhttp3.Response response) throws IOException {

                    }
                });
    }
}
