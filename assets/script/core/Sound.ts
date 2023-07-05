import { AudioClip, error, resources } from "cc";

/*
 * @Descripttion: 
 * @version: 
 * @Author: liqiang
 * @email: 497232807@qq.com
 * @Date: 2022-02-10 13:46:59
 * @LastEditTime: 2022-02-10 14:08:58
 */
export default {
    effectIds: {},
    playEffect: function (effectName, loop = false, endCall: Function = null) {
        // var effectPath = "sound/" + effectName
        // resources.load(effectPath, AudioClip, function (err, audio: AudioClip) {
        //     if (err) {
        //         error(err);
        //         return;
        //     }
        //     // var id = audioEngine.playEffect(audio, loop);
        //     // Sound.effectIds[effectPath] = id;
        //     // cc.audioEngine.setFinishCallback(id, () => {
        //     //     if (endCall) {
        //     //         endCall()
        //     //         resources.release(effectPath);
        //     //     }
        //     // })
        // });

    },
    playMusic: function (musicName, loop = true) {
        var musicPath = "sound/" + musicName
        resources.load(musicPath, AudioClip, function (err, audio: AudioClip) {
            if (err) {
                error(err);
                return;
            }
            // var id = audioEngine.playMusic(audio, loop);
            // Sound.effectIds[musicPath] = id;
        });
    },
    setEffectVolume: function (volume) {
        // cc.audioEngine.setEffectsVolume(volume);
    },
    setMusicVolume: function (volume) {
        // cc.audioEngine.setMusicVolume(volume);
    },

}
