package com.yishua.hbxxl;

/**
 * Created by Junguo.L on 2020/4/13.
 */
public interface SpValue {

    interface Name {
        String USER_ID = "userId"; // 单独保存UserId

        String SP_CONFIG = "sp_config"; //

        String SP_LOGIN_DATA = "sp_login_data";

        String SP_NAME_SPLASH = "sp_splash";

        String SP_NAME_PIG_CONFIG = "sp_pig_config";

        String SP_NAME_PIG = "sp_pig_farm_config";

        String SP_NAME_AUDIO = "sp_audio"; // 音效

        String SP_TRACK_URL = "sp_track_urls";

        String SP_NAME_SETTING = "sp_setting";

        String SP_NAME_UM = "pig_um_config";

        String SPNAME_APP = "sp_app"; // 应用用到的基础配置
    }

    interface Key {
        String KEY_USERID = "key_userId";

        // splash
        String SPLASH_FIRST = "splashFirst";

        // login
        String SP_KEY_HEAD_URL = "headimgurl";
        String SP_KEY_NEWUSER_GOLD = "integral";
        String SP_KEY_NEWUSER_LUCK = "luck";
        String SP_KEY_USERID = "userId";
        String SP_KEY_STATUS = "openidstatus";
        String SP_KEY_NICKNAME = "nickname";
        String SP_KEY_NEWUSER = "isNewUser";
        // login

        // user
        String SP_KEY_NEW_USER_PRIZE = "newUserPrize"; // 新用户奖励金币数量
        // user

        // pigFarm
        String SP_KEY_HIGHEST_LEVEL = "highestLevel"; // 最高等级
        String SP_KEY_LUCK = "luckAmount"; // 账户中福气值
        String SP_KEY_GOLD = "gold"; // 账户中的猪币
        String SP_KEY_BUY_TIME = "buy_time"; // 对应等级的猪已经购买的次数
        String SP_KEY_PIGS_STATUS = "pigs_list"; // 猪场中的猪

        String SP_KEY_XW_PIG_LEVEL = "xwpiglevel"; // 首页显示闲玩入口的猪登记
        // pigFarm

        // 任务
        String SP_KEY_NEW_PIG_TIMES = "new_pig_times"; // 升级新猪的次数
        String SP_KEY_MERGE_PIG_TIMES = "merge_pig_times"; // 合成次数
        String SP_KEY_SHOP_BUY = "shop_buy_times"; // 通过商店购买的次数
        String SP_KEY_FIVE_PIGS = "five_pigs"; // 五福临门
        String SP_KEY_PIG_FARM_FULL = "pig_farm_full"; // 猪场全满了
        //

        // 音效
        String SP_KEY_AUDIO_BGM = "audio_bgm";
        String SP_KEY_AUDIO_EFFECT = "audio_effect";
        // 音效

        String TODAY_AD_API = "today_ad_api"; // 保存的API激励视频数据

        String CONFIG_APPIDSET = "config_splash_appidset";
        String CONFIG_SPLASHAD = "config_splash_splashad";
        String CONFIG_VIDEO_AD = "config_splash_videoad";

        String SP_KEY_VIDEO_TIME = "config_video_time"; // 加速倒计时

        String SP_KEY_UNLOCK = "unlock"; // 解锁红包配置

        String SETTING_INDIVIDUAL = "individual";
        String SETTING_AD = "ad";
        String SETTING_PUSH = "push";

        String XW_UM_INDEX_SHOW_TIME = "indexShowTime"; // 友盟上报首页展示入口的时间

        String NOAD = "no_ad";
        String NETSHIELD = "netshield";
        String SPLASHSHIELD = "splashshield";

        String CONFIG_APP_QUICK_GIFT_NUM = "quick_gift_num";
        String CONFIG_APP_QUICK_GIFT_INTERVAL = "quick_gift_interval";
        String CONFIG_APP_PROGRESS_TIME = "config_app_progress_time";
        String CONFIG_APP_PROGRESS_COUNT = "config_app_progress_count";
        String CONFIG_APP_PROGRESS = "config_app_progress";

        String CONFIG_APP_SOUND_EFFECT_ENABLE = "sound_effect_enable";
        String CONFIG_APP_SOUND_BGM_ENABLE = "sound_bgm_enable";

    }

}
