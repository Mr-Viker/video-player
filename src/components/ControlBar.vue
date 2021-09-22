<!-- 控制栏 -->
<template>
    <div class="vp-control-bar">
        <BaseProgressBar v-if="isShowBaseProgressBar" />
        <ActionBar v-if="isShowActionBar" />
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';

import BaseProgressBar from './ProgressBar/BaseProgressBar.vue';
import ActionBar from './ActionBar/ActionBar.vue';


@Component({
    components: { BaseProgressBar, ActionBar },
})
export default class ControlBar extends Mixins(UsePlayer) {

    get isShowBaseProgressBar() { return this.Player.config.baseProgressBar.show; }
    get isShowActionBar() { return this.Player.config.actionBar.show; }

}
</script>


<style lang='scss' scoped>
.vp-control-bar {
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px 10px;
    background-image: linear-gradient(to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
    user-select: none;
    transition: all .3s;
}
</style>