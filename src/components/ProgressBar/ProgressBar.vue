<!-- 进度条 -->
<template>
    <div class="vp-progress-bar">
        <div class="vp-progress-bar-total" ref="progressBarTotalRef">
            <template v-if="iShowMarks">
                <span class="vp-progress-bar-mark" :style="markStyle(item)" v-for="(item, index) in markData" :key="index">
                    <span class="vp-tooltips" v-html="markFormat(item, Player.config)"></span>
                </span>
            </template>
            
            <div class="vp-progress-bar-current" :style="progressBarCurrentStyle">
                <div class="vp-progress-bar-dot"></div>
            </div>
        </div>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';
import { isEmptyValue, isPercent, noop } from "@/utils";
import { EVENT_BASE_PROGRESS_BAR_MOUSE_MOVE, EVENT_BASE_PROGRESS_BAR_MOUSE_UP } from "@/utils/events";
import { toPercent } from "@/utils/format";


@Component
export default class ProgressBar extends Mixins(UsePlayer) {

    // 当前进度滑动条样式 根据进度自动计算宽度
    get progressBarCurrentStyle() { return { width: toPercent(this.currentTime / this.duration) }; }
    // 总进度滑动条ref
    get progressBarTotalRef() { return this.$refs.progressBarTotalRef as HTMLElement; }


    mounted() {
        // 监听进度条容器的事件 更新当前进度
        this.Player.$on(EVENT_BASE_PROGRESS_BAR_MOUSE_MOVE, this.setProgressByEvent);
        this.Player.$on(EVENT_BASE_PROGRESS_BAR_MOUSE_UP, this.setProgressByEvent);
    }


    // 根据操作事件(点击or移动滑动条)来计算出当前进度
    private setProgressByEvent(ev) {
        const { left, width } = this.progressBarTotalRef.getBoundingClientRect();
        const currentWidth = ev.clientX - left;
        const ratio = currentWidth / width;
        this.setCurrentTime(ratio);
    }

    /**
     * 设置计算出的当前进度并赋值给currentTime
     * @param ratio 比例 当前进度条宽度/总进度条宽度
     */
    private setCurrentTime(ratio: number = 0) {
        if(isEmptyValue(this.duration)) return;
        ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;
        this.Player.seek(this.duration * ratio);
    }



    /****************************** 标记marks start ************************************/

    // 是否显示高亮标记
    get iShowMarks() { return this.Player.config.progressBar.marks?.show; }
    // 格式化方法
    get markData() { return this.Player.config.progressBar.marks?.data || []; }
    // 格式化方法
    get markFormat() { return this.Player.config.progressBar.marks?.format || noop; }
    // 标记数据的label名称
    get markLabelKey() { return this.Player.config.progressBar.marks?.props.labelKey || 'label'; }
    // 标记数据的label类型
    get markLabelType() { return this.Player.config.progressBar.marks?.props.labelType; }
    // 标记数据的value名称
    get markValueKey() { return this.Player.config.progressBar.marks?.props.valueKey || 'value'; }

    // 根据数据获取指定标记的样式
    markStyle(item: Record<string, any>) {
        const isPercentType = this.markLabelType === 'percent';
        let left = item[this.markLabelKey];
        left = isPercentType 
                ? (isPercent(left) ? left : toPercent(left))
                : toPercent(left / this.duration)
        return { left };
    }

    /****************************** 标记marks end ************************************/

}
</script>


<style lang='scss' scoped>
.vp-progress-bar {
    width: 100%;
    padding-bottom: 5px;

    .vp-progress-bar-total {
        position: relative;
        width: 100%;
        height: 4px;
        background-color: rgba(255, 255, 255, .5);
        border-radius: 2px;

        .vp-progress-bar-current {
            position: absolute;
            z-index: 20;
            left: 0;
            bottom: 0;
            height: 100%;
            // width: 50%;
            background-color: #00a1d6;

            .vp-progress-bar-dot {
                position: absolute;
                bottom: -3px;
                right: -5px;
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: inherit;
            }
        }


        .vp-progress-bar-mark {
            position: absolute;
            z-index: 100;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            top: -1px;
            // left: -3px;
            background: rgba(255, 255, 255, .8);

            .vp-tooltips {
                bottom: 10px;
                left: 50%;
                transform: scale(0) translateX(-50%);
            }

            &:hover {
                .vp-tooltips {
                    transform: scale(1) translateX(-50%);
                }
            }
        }
        
    }
}
</style>