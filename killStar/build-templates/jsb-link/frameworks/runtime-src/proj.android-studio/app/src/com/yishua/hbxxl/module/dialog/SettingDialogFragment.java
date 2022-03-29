package com.yishua.hbxxl.module.dialog;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestOptions;
import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.Util;
import com.yishua.hbxxl.event.LogoutEvent;
import com.yishua.hbxxl.module.feedback.FeedbackActivity;
import com.yishua.hbxxl.module.hpage.NormalWebActivity;
import com.yishua.hbxxl.util.ConfigUtils;
import com.yishua.hbxxl.util.SoundEffectUtil;
import com.yishua.hbxxl.util.UserUtil;
import com.yishua.hbxxl.widget.NiceImageView;
import com.yishua.hbxxl.widget.SwitchButton;

import org.cocos2dx.javascript.JsbResponse;
import org.greenrobot.eventbus.EventBus;

public class SettingDialogFragment extends DialogFragment implements View.OnClickListener {

    private ImageView iv_close;
    private NiceImageView iv_avatar;
    private TextView tv_nickname;
    private TextView tv_userid;
    private SwitchButton switch_sound_effect;
    private SwitchButton switch_sound_bg;
    private ConstraintLayout cl_user_agreement;
    private ConstraintLayout cl_privacy_policy;
    private ImageView iv_logout;
    private OnSoundEffectCheckListener listener;
    private View cl_qa;

    public static SettingDialogFragment newInstance() {
        SettingDialogFragment settingDialogFragment = new SettingDialogFragment();

        return settingDialogFragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //设置style
//        setStyle(DialogFragment.STYLE_NO_TITLE, R.style.DialogFullScreen);

        init();
    }

    private void init() {

    }

    public Context getContextInstance() {
        Activity activity = getActivity();
        if (activity != null) {
            return activity;
        } else {
            return Util.getContext();
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        setCancelable(false);

        Dialog dialog = getDialog();
        if (dialog != null && dialog.getWindow() != null) {

            DisplayMetrics dm = new DisplayMetrics();
            getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);

            dialog.getWindow().setLayout((int) (dm.widthPixels * 1f), (int) (dm.heightPixels * 0.8f));

            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.layout_dialog_setting, container, false);

        initView(view);
        iniData();
        initListener();
        return view;
    }

    public void initView(View view) {
        iv_close = view.findViewById(R.id.iv_close);
        iv_avatar = view.findViewById(R.id.iv_avatar);
        tv_nickname = view.findViewById(R.id.tv_nickname);
        tv_userid = view.findViewById(R.id.tv_userid);

        switch_sound_effect = view.findViewById(R.id.switch_sound_effect);
        switch_sound_bg = view.findViewById(R.id.switch_sound_bg);

        cl_qa = view.findViewById(R.id.cl_qa);

        cl_user_agreement = view.findViewById(R.id.cl_user_agreement);
        cl_privacy_policy = view.findViewById(R.id.cl_privacy_policy);

        iv_logout = view.findViewById(R.id.iv_logout);
    }

    public void initListener() {
        iv_close.setOnClickListener(this);

        switch_sound_effect.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);

                ConfigUtils.setSoundEffectEnable(isChecked);
                if (listener != null) {
                    listener.onCheckedChanged(isChecked);
                }

                JsbResponse.resp1("setyinxiao", isChecked ? 1 : 0);

//                JsbResponse.resp(isChecked ? "resumeAll" : "pauseAll");
            }
        });

        switch_sound_bg.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);

                ConfigUtils.setBGMEnable(isChecked);
//                if (isChecked) {
//                    SoundEffectUtil.getInstance().playBackgroundSound();
//                } else {
//                    SoundEffectUtil.getInstance().pauseBackgroundSound();
//                }

                JsbResponse.resp1("setyinliang", isChecked ? 1 : 0);
            }
        });

        cl_user_agreement.setOnClickListener(this);
        cl_privacy_policy.setOnClickListener(this);
        iv_logout.setOnClickListener(this);
        cl_qa.setOnClickListener(this);
    }

    public void iniData() {
        String headImgUrl = UserUtil.getHeadImgUrl();

        if (TextUtils.isEmpty(headImgUrl)) {
            Glide.with(getContextInstance())
                    .applyDefaultRequestOptions(RequestOptions.bitmapTransform(new CircleCrop()))
                    .asBitmap()
                    .load(R.mipmap.avatar_default)
                    .into(iv_avatar);
        } else {
            Glide.with(getContextInstance())
                    .applyDefaultRequestOptions(RequestOptions.bitmapTransform(new CircleCrop()))
                    .asBitmap()
                    .load(headImgUrl)
                    .into(iv_avatar);
        }

        tv_nickname.setText(UserUtil.getNickname());
        tv_userid.setText("ID:" + UserUtil.getUserId());

        boolean soundBGMEnable = ConfigUtils.isSoundBGMEnable();
        switch_sound_bg.setChecked(soundBGMEnable);

        boolean soundEffectEnable = ConfigUtils.isSoundEffectEnable();
        switch_sound_effect.setChecked(soundEffectEnable);
    }


    public void setSoundEffectCheckListener(OnSoundEffectCheckListener listener) {
        this.listener = listener;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.cl_qa:
                startActivity(new Intent(getContextInstance(), FeedbackActivity.class));

                break;
            case R.id.iv_close:
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);
                dismiss();
                break;
            case R.id.cl_user_agreement:
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);
                Intent intent1 = new Intent(getContextInstance(), NormalWebActivity.class);
                intent1.putExtra("url", ConstantValue.USER_AGREEMENT);
                intent1.putExtra("title", "用户协议");
                startActivity(intent1);
                break;
            case R.id.cl_privacy_policy:
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);

                Intent intent2 = new Intent(getContextInstance(), NormalWebActivity.class);
                intent2.putExtra("url", ConstantValue.PRIVACY_POLICY);
                intent2.putExtra("title", "隐私政策");
                startActivity(intent2);
                break;
            case R.id.iv_logout:
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);
                logout();
                break;
        }
    }

    private void logout() {

        AlertDialog.Builder builder = new AlertDialog.Builder(getContextInstance(), R.style.AlertDialog_Common);
        builder.setTitle("确定要退出登录？")
                .setIcon(R.mipmap.ic_launcher)
                .setMessage("\n")
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {// 设置确定按钮
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);
                        EventBus.getDefault().post(new LogoutEvent());
                        dismiss();
                    }
                }).setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                SoundEffectUtil.getInstance().playSoundEffect(SoundEffectUtil.AUDIO_TYPE_CLICK);
            }
        });
        AlertDialog alertDialog = builder.create();
        // 显示对话框
        alertDialog.show();
    }

    public interface OnSoundEffectCheckListener {
        void onCheckedChanged(boolean isChecked);
    }
}
