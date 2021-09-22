<!-- 计时器 -->
<template>
    <div class="vp-timer">
        <span class="vp-timer-current">{{currentTime | secondToTime}}</span>
        <span class="vp-timer-separator">/</span>
        <span class="vp-timer-duration">{{duration | secondToTime}}</span>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins, Watch } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';
import { secondToTime } from '@/utils/format'


@Component({
    filters: { secondToTime },
})
export default class Timer extends Mixins(UsePlayer) {

}
</script>


<style lang='scss' scoped>
.vp-timer {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-left: 15px;

    .vp-timer-separator {
        padding: 0 2px;
    }
}
</style>