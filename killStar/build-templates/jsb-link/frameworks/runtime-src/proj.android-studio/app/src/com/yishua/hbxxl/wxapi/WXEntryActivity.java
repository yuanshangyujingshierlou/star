package com.yishua.hbxxl.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.SubscribeMessage;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.splash.SplashActivity;
import com.yishua.hbxxl.util.ToastUtil;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler, WXContract.View {

    private WXPresenter presenter;

    public static String shareType = "0";//1为宝箱开奖后分享

    public static String log_instance = "0";//微信登录携带的随机数
    public static final String LOGIN = "log"; //登陆前缀
    public static final String BIND = "bind"; //绑定前缀
    public static final String GZH = "gzh"; //绑定公众号前缀


    /**
     * 分享到微信接口
     **/
    private IWXAPI mWxApi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        presenter = new WXPresenter(this);
        mWxApi = WXAPIFactory.createWXAPI(this, ConstantValue.APP_ID, false);
        mWxApi.registerApp(ConstantValue.APP_ID);
        Intent intent = getIntent();

        boolean result = mWxApi.handleIntent(intent, this);

        if (!result) {
            Bundle bundle = intent.getExtras();
            if (null != bundle) {
                String param = bundle.getString("_wxappextendobject_extInfo");
                presenter.sendMessageB(param);
            }
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        boolean result = mWxApi.handleIntent(intent, this);
        if (!result) {
            Bundle bundle = intent.getExtras();
            if (null != bundle) {
                String param = bundle.getString("_wxappextendobject_extInfo");
                presenter.sendMessageB(param);
            }
        }
    }

    /***
     * 请求微信的相应码
     * @author YOLANDA
     */
    @Override
    public void onResp(BaseResp baseResp) {
        String result = "";

        int type = baseResp.getType();

        if (1 == type) { // 微信登录回调
            SendAuth.Resp resp = (SendAuth.Resp) baseResp;
            if (log_instance.equals(resp.state)) { // state：第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用 sendReq 时传入，
                // 由微信终端回传，state 字符串长度不能超过 1K
                switch (resp.errCode) {
                    case BaseResp.ErrCode.ERR_OK:
                        //result = "授权成功";
                        String code = resp.code; // 用户换取 access_token 的 code，仅在 ErrCode 为 0 时有效
                        if (log_instance.startsWith(LOGIN)) {
                            presenter.weixinLogin(code);
                        } else if (log_instance.startsWith(BIND)) {
                            presenter.weixinBind(code);
                        }
                        break;
                    case BaseResp.ErrCode.ERR_USER_CANCEL:
                        result = "授权取消";
                        break;
                    case BaseResp.ErrCode.ERR_AUTH_DENIED:
                        result = "授权拒绝";
                        break;
                    case BaseResp.ErrCode.ERR_UNSUPPORT:
                        result = "系统不支持";
                        break;
                    default:
                        result = "未知错误";
                        break;
                }
            } else {
                result = "错误登录";
            }
        } else if (2 == type) {//分享回调
            SendMessageToWX.Resp resp = (SendMessageToWX.Resp) baseResp;
            switch (resp.errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    result = "分享成功";
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    result = "分享取消";
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    result = "分享拒绝";
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    result = "系统不支持";
                    break;
                default:
                    result = "未知错误";
                    break;
            }
            shareType = "0";
        } else if (18 == type) { // 下发一条消息
            SubscribeMessage.Resp resp = (SubscribeMessage.Resp) baseResp;
            switch (resp.errCode) {
                case BaseResp.ErrCode.ERR_OK:
                    String openid = resp.openId;
                    int scene = resp.scene;
                    String template_id = resp.templateID;
                    presenter.sendMessage(openid, scene, template_id);
                    break;
                case BaseResp.ErrCode.ERR_USER_CANCEL:
                    result = "取消";
                    break;
                case BaseResp.ErrCode.ERR_AUTH_DENIED:
                    result = "拒绝";
                    break;
                case BaseResp.ErrCode.ERR_UNSUPPORT:
                    result = "系统不支持";
                    break;
                default:
                    result = "未知错误";
                    break;
            }
        }

        if (!TextUtils.isEmpty(result))
            ToastUtil.showToast(result);
        this.finish();
    }

    /**
     * 微信主动请求我们
     **/
    @Override
    public void onReq(BaseReq baseResp) {
        try {
            Intent intent = new Intent(Util.getContext(), SplashActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            Util.getContext().startActivity(intent);
        } catch (Exception e) {
            //
        }
    }

    @Override
    public void bindWxSuccess() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ToastUtil.showToast("绑定成功！");

                Intent intent = new Intent(Util.getContext(), SplashActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                Util.getContext().startActivity(intent);
            }
        });
    }

    @Override
    public void bindWxFail(String message) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ToastUtil.showToast(message);
                finish();
            }
        });
    }

    @Override
    public void wxLoginSuccess() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ToastUtil.showToast("登录成功！");
                // EventBus.getDefault().post(new LoginEvent(true));

                Intent intent = new Intent(Util.getContext(), SplashActivity.class);
//        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });
    }

    @Override
    public void wxLoginFail(String message) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ToastUtil.showToast(message);
                finish();
            }
        });
    }

    @Override
    public void openWeixin() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mWxApi.openWXApp();
            }
        });
    }

    @Override
    public void finishActivity() {
        finish();
    }
}
