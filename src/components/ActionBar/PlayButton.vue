<!-- 按钮-播放 -->
<template>
    <div class="vp-play-button">
        <i :class="['vp-pointer fa fa-fw', Player.reactiveVideoData.paused ? 'fa-play' : 'fa-pause']" @click.stop="Player.toggle"></i>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';


@Component
export default class PlayButton extends Mixins(UsePlayer) {

}
</script>


<style lang='scss' scoped>
</style>