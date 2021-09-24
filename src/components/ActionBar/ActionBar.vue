<!-- 操作栏 按钮组 -->
<template>
    <div class="vp-action-bar">
        <div class="vp-action-bar-l">
            <PlayButton v-if="isShowPlayButton" />
            <Timer  v-if="isShowTimer" />
        </div>
        <div class="vp-action-bar-r">
            <Volume v-if="isShowVolume" />
            <SettingButton v-if="isShowSettingButton" />
            <FullScreenButton v-if="isShowFullScreenButton" />
        </div>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';

import PlayButton from './PlayButton.vue';
import Timer from './Timer.vue';
import Volume from './Volume.vue';
import SettingButton from './SettingButton.vue';
import FullScreenButton from './FullScreenButton.vue';


@Component({
    components: { PlayButton, Timer, Volume, SettingButton, FullScreenButton },
})
export default class ActionBar extends Mixins(UsePlayer) {

    get isShowPlayButton() { return this.Player.config.playButton.show; }
    get isShowTimer() { return this.Player.config.timer.show; }
    get isShowVolume() { return this.Player.config.volume.show; }
    get isShowSettingButton() { return this.Player.config.settingButton.show; }
    get isShowFullScreenButton() { return this.Player.config.fullScreenButton.show; }

}
</script>


<style lang='scss' scoped>
.vp-action-bar {
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    .vp-action-bar-l,
    .vp-action-bar-r {
        display: flex;
        align-items: center;
    }
}
</style>