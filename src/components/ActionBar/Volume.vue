<!-- 按钮-音量 -->
<template>
    <div class="vp-volume vp-box-trigger">
        <i :class="['vp-btn-volume vp-pointer fa fa-fw', isMuted ? 'fa-volume-off' : 'fa-volume-up']" @click.stop='onBtnVolumeClick'></i>

        <div class="vp-volume-slide-bar-wrap vp-box">
            <div class="vp-volume-slide-bar-tips">{{volume | toPercentNumber}}</div>

            <div class="vp-volume-slide-bar" @click.stop="onSlideBarClick" @mousedown="onSlideBarMouseDown">
                <div class="vp-volume-slide-bar-total" :style="slideBarTotalStyle" ref="slideBarTotal">
                    <div class="vp-volume-slide-bar-current" :style="slideBarCurrentStyle">
                        <span class="vp-volume-slide-bar-dot"></span>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';
import { toNumberWithKeep, toPercent, toPercentNumber } from "@/utils/format";


@Component({
    filters: { toPercentNumber },
})
export default class Volume extends Mixins(UsePlayer) {

    volume: number = 0; // 音量
    isMuted: boolean = false; // 是否静音 因为video.muted不是响应式 需要另外的变量来响应记录

    SLIDE_BAR_TOTAL_HEIGHT: number = 60; // 总音量滑动条高度px


    // 总音量滑动条样式
    get slideBarTotalStyle() { return { height: `${this.SLIDE_BAR_TOTAL_HEIGHT}px` }; }
    // 当前音量滑动条样式 根据音量大小自动计算高度
    get slideBarCurrentStyle() { return { height: toPercent(this.volume) }; }
    // 总音量滑动条ref
    get slideBarTotal() { return this.$refs.slideBarTotal as HTMLElement; }


    mounted() {
        // 根据传入的配置初始化音量
        this.setVolume(this.Player.config.video.volume);
    }


    // 设置音量 并自动更新音量bar及图标
    private setVolume(volume: any = 1) {
        volume = volume > 1 ? 1 : volume < 0 ? 0 : volume;
        this.volume = this.Player.video.volume = toNumberWithKeep(volume);
        if(this.Player.video.muted && volume > 0) this.Player.video.muted = false;
        if(!this.Player.video.muted && volume === 0) this.Player.video.muted = true;
        this.isMuted = this.Player.video.muted;
    }

    // 点击音量图标 开关音量
    onBtnVolumeClick() {
        this.isMuted ? this.setVolume(1) : this.setVolume(0);
    }


    // 点击滑动条 计算出当前位置的占比 然后更新音量
    // 和进度条不同的在于音量滑动需要实时改变 而进度条是放手后再改变
    onSlideBarClick(ev) {
        this.setVolumeByEvent(ev);
    }


    // 移动滑动条
    onSlideBarMouseDown(ev) {
        document.addEventListener('mousemove', this.onSlideBarMouseMove);
        document.addEventListener('mouseup', this.onSlideBarMouseUp);
    }

    // 移动滑动条
    private onSlideBarMouseUp(ev) {
        document.removeEventListener('mousemove', this.onSlideBarMouseMove);
        document.removeEventListener('mouseup', this.onSlideBarMouseUp);
    }

    // 移动滑动条
    private onSlideBarMouseMove(ev) {
        this.setVolumeByEvent(ev);
    }

    // 根据操作事件(点击or移动滑动条)来计算出当前音量并设置
    private setVolumeByEvent(ev) {
        const blankHeight = ev.clientY - this.slideBarTotal.getBoundingClientRect().top;
        const ratio = (this.SLIDE_BAR_TOTAL_HEIGHT - blankHeight) / this.SLIDE_BAR_TOTAL_HEIGHT;
        this.setVolume(ratio);
    }

}
</script>


<style lang='scss' scoped>
.vp-volume {
    padding: 0 5px;

    .vp-volume-slide-bar-wrap {
        left: 0;
        width: 30px;
        height: 100px;

        .vp-volume-slide-bar-tips {
            font-size: 12px;
            line-height: 14px;
        }

        .vp-volume-slide-bar {
            width: 100%;
            // height: 70px;
            cursor: pointer;
            
            .vp-volume-slide-bar-total {
                position: relative;
                width: 4px;
                height: 100%;
                margin: 0 auto;
                background-color: #fff;
                border-radius: 2px;

                .vp-volume-slide-bar-current {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    // height: 100%;
                    background-color: #00a1d6;

                    .vp-volume-slide-bar-dot {
                        position: absolute;
                        left: -3px;
                        top: -5px;
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background-color: inherit;
                    }
                }
            }
            
        }

    }
}
</style>