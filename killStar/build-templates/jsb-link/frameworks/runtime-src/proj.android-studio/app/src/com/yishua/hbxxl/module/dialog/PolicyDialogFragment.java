package com.yishua.hbxxl.module.dialog;

import android.app.Dialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.v4.app.DialogFragment;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.yishua.hbxxl.ConstantValue;
import com.yishua.hbxxl.R;
import com.yishua.hbxxl.module.hpage.HpageUtil;
import com.yishua.hbxxl.util.ToastUtil;

public class PolicyDialogFragment extends DialogFragment {
    private DialogClickListener listener;

    public static PolicyDialogFragment getInstance() {
        PolicyDialogFragment policyDialogFragment = new PolicyDialogFragment();

        return policyDialogFragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //设置style
//        setStyle(DialogFragment.STYLE_NO_TITLE, R.style.DialogFullScreen);
    }

    @Override
    public void onStart() {
        super.onStart();

        setCancelable(false);

        Dialog dialog = getDialog();
        if (dialog != null) {

            DisplayMetrics dm = new DisplayMetrics();
            getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);

            dialog.getWindow().setLayout((int) (dm.widthPixels * 0.9), (int) (dm.heightPixels * 0.8));

//            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View inflate = inflater.inflate(R.layout.layout_dialog_policy, container, false);

        iniView(inflate);

        return inflate;
    }

    private void iniView(View view) {

        TextView tv_policy = view.findViewById(R.id.tv_policy);
        TextView tv_privacy_policy = view.findViewById(R.id.tv_privacy_policy);
        tv_policy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HpageUtil.jumpFunction(getContext(), ConstantValue.USER_AGREEMENT, "用户协议");
            }
        });

        tv_privacy_policy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HpageUtil.jumpFunction(getContext(), ConstantValue.PRIVACY_POLICY, "隐私政策");
            }
        });

        TextView tv_disagree = view.findViewById(R.id.tv_disagree);
        ConstraintLayout tv_agree = view.findViewById(R.id.cl_agree);


        tv_disagree.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String appName = getString(R.string.app_name);

                ToastUtil.showToast("请您同意授权，否则将无法使用" + appName + "APP功能");
            }
        });

        tv_agree.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dismiss();
                if (listener != null) {
                    listener.dismiss();
                }
            }
        });
    }


    public void setOnDialogClickListener(DialogClickListener listener) {
        this.listener = listener;
    }

    public void showDialog() {
        show(getFragmentManager(), "");
    }

    public interface DialogClickListener {
        void dismiss();
    }
}
