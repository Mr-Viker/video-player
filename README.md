# video-player

> 轻量级的视频播放器 支持高能进度条  
> 技术栈: vue(2) + typescript + vue-property-decorator + webpack

<br />


### Usage
```
npm i @viker-lib/video-player
```

[main.ts]
```js
import VideoPlayer from '@viker-lib/video-player';
import '@viker-lib/video-player/dist/index.css';
Vue.use(VideoPlayer);
```

[Demo.vue]
```html
<VideoPlayer src='xxx' poster='xxx' />
```

[default player config]
```js
{
    mutex: true,
    video: {
        autoplay: true,
        loop: false,
        preload: 'auto',
    },
    controlBar: { show: true },
    baseProgressBar: { 
        show: true, 
        tooltips: {
            show: true,
            format: ({formatTime, value}, config) => config.energyProgressBar.show ? `<div>时间: ${formatTime}</div><div>值: ${value}</div>` : formatTime,
        }
    },
    energyProgressBar: { 
        show: false, 
        series: [],
    },
    progressBar: { 
        show: true,
    },
    actionBar: { show: true },
    playButton: { show: true },
    timer: { show: true },
    volume: { show: true },
    settingButton: { 
        show: true,
        list: {
            loop: { show: true, label: '循环播放' },
            epb: { show: false, label: '高能进度条' },
        }
    },
    fullScreenButton: { show: true },
}
```



<br />

### Dev
```
git clone git@github.com:Mr-Viker/video-player.git
cd video-player
npm i 
npm run dev  
```