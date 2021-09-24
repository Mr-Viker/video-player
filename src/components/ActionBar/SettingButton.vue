<!-- 按钮-设置 -->
<template>
    <div class="vp-setting-button vp-box-trigger">
        <i class="vp-btn-setting vp-pointer fa fa-fw fa-cog"></i>

        <div class="vp-setting-box vp-box">
            <template v-for="(item, key) in Player.config.settingButton.list">
                <div v-if="item.show" class="vp-box-item" :key="key">
                    <label class="vp-box-item-hd">{{item.label}}</label>

                    <!-- 循环播放 -->
                    <template v-if="key === 'loop'">
                        <input class="vp-box-item-bd vp-box-item-input" type="checkbox" v-model="Player.config.video.loop" @change="onLoopChange" />
                    </template>
                    <!-- 高能进度条 -->
                    <template v-else-if="key === 'epb'">
                        <input class="vp-box-item-bd vp-box-item-input" type="checkbox" v-model="Player.config.energyProgressBar.show" :disabled='item.disabled' @change="onEpbChange" />
                    </template>

                </div>
            </template>
        </div>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';
import { Storage, STORAGE_KEY_EPB_SHOW, STORAGE_KEY_LOOP } from '@/utils/storage';

@Component
export default class SettingButton extends Mixins(UsePlayer) {

    // 同步设置到缓存 暂时未做初始化获取缓存作为默认设置
    onLoopChange() {
        Storage.set(STORAGE_KEY_LOOP, this.Player.config.video.loop);
    }

    onEpbChange() {
        Storage.set(STORAGE_KEY_EPB_SHOW, this.Player.config.energyProgressBar.show);
    }

}
</script>


<style lang='scss' scoped>
.vp-setting-button {
    padding: 0 5px;
}
</style>