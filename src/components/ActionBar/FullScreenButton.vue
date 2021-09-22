<!-- 按钮-全屏 -->
<template>
    <div class="vp-full-screen-button">
        <i :class="['vp-pointer fa fa-fw', fullScreen ? 'fa-compress' : 'fa-arrows-alt fa-rotate-45']" @click.stop="toggleFullScreen"></i>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';


@Component
export default class FullScreenButton extends Mixins(UsePlayer) {

    get doc(): any { return document; }

    get fullScreen() { return this.Player.reactiveVideoData.fullScreen; }


    mounted() {
        // 监听全屏change事件 同步rvd状态 这样就不用另外监听esc按键了
        document.addEventListener('fullscreenchange', this.updateRVDFullScreen);
    }
    
    // 更新reactiveVideoData的全屏状态
    private updateRVDFullScreen() {
        this.Player.reactiveVideoData.fullScreen = !!(this.doc.fullscreenElement || this.doc.mozFullScreenElement || this.doc.msFullscreenElement || this.doc.webkitFullscreenElement);
    }


    // 切换全屏
    toggleFullScreen() {
        this.fullScreen ? this.exit() : this.request(this.Player.$vnode.elm);
    }

    // 进入全屏
    private request(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // 退出全屏
    private exit() {
        if(this.doc.exitFullscreen) {
            this.doc.exitFullscreen();
        } else if(this.doc.mozCancelFullScreen) {
            this.doc.mozCancelFullScreen();
        } else if(this.doc.webkitExitFullscreen) {
            this.doc.webkitExitFullscreen();
        } else if(this.doc.msExitFullscreen) {
            this.doc.msExitFullscreen();
        }
    }

}
</script>


<style lang='scss' scoped>
.vp-full-screen-button {
    padding-left: 5px;

    .fa-arrows-alt {
        font-size: 20px;
        vertical-align: bottom;
    }
}
</style>