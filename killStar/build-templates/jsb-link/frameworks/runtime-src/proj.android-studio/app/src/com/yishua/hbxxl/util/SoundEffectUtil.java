package com.yishua.hbxxl.util;

import android.media.AudioManager;
import android.media.SoundPool;
import android.util.SparseIntArray;

import com.yishua.hbxxl.R;
import com.yishua.hbxxl.Util;

public class SoundEffectUtil {
    public static final int AUDIO_TYPE_BGM = 1; // 游戏背景音效
    public static final int AUDIO_TYPE_CLICK = 2; // 点击音效
    public static final int AUDIO_TYPE_GOLD = 3; // 金币
    public static final int AUDIO_TYPE_PASS_GAME = 4; // 通关音效

    private static SoundEffectUtil instance;
    private static SoundPool soundPool;

    private static SparseIntArray soundIds;

    private SoundEffectUtil() {

    }

    public static SoundEffectUtil getInstance() {
        if (instance == null) {
            synchronized (SoundEffectUtil.class) {
                if (instance == null) {
                    instance = new SoundEffectUtil();

                    soundPool = new SoundPool(2, AudioManager.STREAM_MUSIC, 0);
                }
            }
        }

        return instance;
    }

    public void initSound() {
        soundIds = new SparseIntArray(5);

        soundIds.put(AUDIO_TYPE_CLICK, soundPool.load(Util.getContext(), R.raw.sound_click, 0));
        soundIds.put(AUDIO_TYPE_GOLD, soundPool.load(Util.getContext(), R.raw.sound_gold, 0));
        soundIds.put(AUDIO_TYPE_PASS_GAME, soundPool.load(Util.getContext(), R.raw.sound_pass_game, 0));

        soundPool.setOnLoadCompleteListener(new SoundPool.OnLoadCompleteListener() {
            @Override
            public void onLoadComplete(SoundPool soundPool, int sampleId, int status) {
                LogUtils.e("AudioUtil onLoadComplete ------  sampleId = " + sampleId + "  status = " + status);
            }
        });
    }

    /**
     * 播放音效
     */
    public void playSoundEffect(int soundType) {
        boolean soundEffectEnable = ConfigUtils.isSoundEffectEnable();
        if (soundEffectEnable) {

            int voiceId = soundIds.get(soundType);

            if (voiceId > 0) {
                soundPool.play(voiceId, 0.7f, 0.7f, 0, 0, 1);
            }
        }
    }

    public void playClickSound() {
        playSoundEffect(AUDIO_TYPE_CLICK);
    }
}
