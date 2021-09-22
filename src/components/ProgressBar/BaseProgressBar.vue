<!-- 控制栏 -->
<template>
    <div class="vp-base-progress-bar-mask">
        <div v-if="isShowTooltips"  :class="['vp-tooltips', {'vp-tooltips--show': tooltips.show}]" 
            :style="tooltips.style" v-html="tooltips.content" ref="tooltipsRef">
        </div>

        <div class="vp-base-progress-bar vp-pointer" ref="baseProgressBarRef"
            @mousedown="onBarMouseDown"
            @mouseenter="onBarMouseEnter" @mousemove="onBarMouseMove" @mouseleave="onBarMouseLeave" 
            >
            <EnergyProgressBar v-if="isShowEnergyProgressBar" ref="energyProgressBarRef" />
            <ProgressBar v-if="isShowProgressBar" />
        </div>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';

import EnergyProgressBar from './EnergyProgressBar.vue';
import ProgressBar from './ProgressBar.vue';
import { EVENT_BASE_PROGRESS_BAR_MOUSE_DOWN, EVENT_BASE_PROGRESS_BAR_MOUSE_ENTER, EVENT_BASE_PROGRESS_BAR_MOUSE_LEAVE, EVENT_BASE_PROGRESS_BAR_MOUSE_MOVE, EVENT_BASE_PROGRESS_BAR_MOUSE_UP } from "@/utils/events";
import { secondToTime } from "@/utils/format";
import { isFunction } from "@/utils";


@Component({
    components: { EnergyProgressBar, ProgressBar },
})
export default class BaseProgressBar extends Mixins(UsePlayer) {

    private isPausedBeforeMove: boolean = false; // 滑动进度前是否已暂停
    
    // 鼠标悬浮提示框
    tooltips = {
        show: false,
        content: '',
        updateTimer: null, // 更新tooltips显示的定时器 防止mousemove时大量触发
        hideTimer: null,
        style: { left: '0px', bottom: '35px' },
    };
    

    get isShowEnergyProgressBar() { return this.Player.config.energyProgressBar.show; }
    get isShowProgressBar() { return this.Player.config.progressBar.show; }
    // 是否显示tooltips 配置开关
    get isShowTooltips() { return this.Player.config.baseProgressBar.tooltips.show; }
    // tooltips ref
    get tooltipsRef(): any { return this.$refs.tooltipsRef; }
    // 基础进度滑动条ref
    get baseProgressBarRef() { return this.$refs.baseProgressBarRef as HTMLElement; }
    // 高能进度滑动条ref
    get energyProgressBarRef(): any { return this.$refs.energyProgressBarRef; }


    /************************ 鼠标按下移动抬起事件处理 start *******************************/

    // 鼠标按下 先暂停 等抬起再判断是否继续播放
    onBarMouseDown(ev) {
        document.addEventListener('mousemove', this.onBarMouseMoveAfterDown);
        document.addEventListener('mouseup', this.onBarMouseUpAfterDown);
        this.isPausedBeforeMove = this.Player.reactiveVideoData.paused;
        this.Player.pause();
        this.Player.$emit(EVENT_BASE_PROGRESS_BAR_MOUSE_DOWN, ev);
    }
    
    // 移动滑动条 注：该滑动是在鼠标按下后监听的 直接鼠标悬浮滑动不会触发
    private onBarMouseMoveAfterDown(ev) {
        // this.updateTooltips(ev);
        this.Player.$emit(EVENT_BASE_PROGRESS_BAR_MOUSE_MOVE, ev);
    }

    // 鼠标抬起 最后再设置一次当前进度 然后根据滑动进度前是否已暂停来决定是否继续播放
    private onBarMouseUpAfterDown(ev) {
        document.removeEventListener('mousemove', this.onBarMouseMoveAfterDown);
        document.removeEventListener('mouseup', this.onBarMouseUpAfterDown);
        if(!this.isPausedBeforeMove) this.Player.play();
        this.Player.$emit(EVENT_BASE_PROGRESS_BAR_MOUSE_UP, ev);
    }

    /************************ 鼠标按下移动抬起事件处理 end *******************************/


    /************************ 鼠标直接进入移动离开事件处理 start *******************************/

    // 当鼠标悬浮进入滑动条时触发
    onBarMouseEnter(ev) {
        this.showTooltips(ev);
        this.Player.$emit(EVENT_BASE_PROGRESS_BAR_MOUSE_ENTER, ev);
    }

    // 当鼠标悬浮离开滑动条时触发
    onBarMouseLeave(ev) {
        this.hideTooltips(ev);
        this.Player.$emit(EVENT_BASE_PROGRESS_BAR_MOUSE_LEAVE, ev);
    }

    // 当鼠标悬浮移动时触发 使用节流优化
    onBarMouseMove(ev) {
        if(this.tooltips.updateTimer) return;
        this.tooltips.updateTimer = setTimeout(() => {
            this.updateTooltips(ev);
            this.tooltips.updateTimer = null;
        }, 16);
    }

    // 显示tooltips
    private showTooltips(ev) {
        if(!this.isShowTooltips) return;
        this.tooltips.hideTimer && clearTimeout(this.tooltips.hideTimer);
        this.tooltips.show = true;
        this.updateTooltips(ev);
    }

    /**
     * 当鼠标悬浮滑动时触发 
     * 计算当前滑动位置对应的时间 更新tooltips内容(调用自定义的格式化方法获取显示内容 支持html) 最后更新tooltips显示位置
     * 注：如果显示高能进度条则加上时间对应的值 因为video处理时间是向下取整 所以这里为了保持一致使用Math.floor
     */
    updateTooltips(ev) {
        if(!this.isShowTooltips) return;

        const { left, width, height } = this.baseProgressBarRef.getBoundingClientRect();
        const currentWidth = ev.clientX - left;
        let time = Math.floor(currentWidth / width * this.duration);
        time = time < 0 ? 0 : time > this.duration ? Math.floor(this.duration) : time;
        const formatTime = secondToTime(time);
        
        let value = '-';
        if(this.isShowEnergyProgressBar) value = this.energyProgressBarRef.getSeriesValueByTime(time);

        const formatFn = this.Player.config.baseProgressBar.tooltips.format;
        if(isFunction(formatFn)) this.tooltips.content = formatFn({time, formatTime, value}, this.Player.config);

        this.updateTooltipsStyle(currentWidth, width, height + 2); // 预留2px的bottom间隔
    }

    // 指定秒数后tooltips自动消失
    private hideTooltips(ev) {
        this.tooltips.hideTimer = setTimeout(() => {
            this.tooltips.show = false;
            this.tooltips.content = '';
        }, 500);
    }

    // 更新tooltips的位置 需要判断是否已经在临界位置
    updateTooltipsStyle(mouseLeft: number, baseProgressBarWidth: number, baseProgressBarHeight: number = 35) {
        const { left, width, bottom } = this.tooltipsRef.getBoundingClientRect();
        const maxLeft = Math.floor(baseProgressBarWidth - width);
        mouseLeft = mouseLeft < 0 ? 0 : mouseLeft > maxLeft ? maxLeft : mouseLeft;
        requestAnimationFrame(() => {
            if(left !== mouseLeft) this.tooltips.style.left = `${mouseLeft}px`;
            if(baseProgressBarHeight !== bottom) this.tooltips.style.bottom = `${baseProgressBarHeight}px`;
        });
    }
    

    /************************ 鼠标直接进入移动离开事件处理 end *******************************/



    beforeDestroy() {
        this.tooltips.hideTimer && clearTimeout(this.tooltips.hideTimer);
        this.tooltips.hideTimer = null;
    }

}
</script>


<style lang='scss' scoped>
.vp-base-progress-bar-mask {
    position: relative;
}
</style>