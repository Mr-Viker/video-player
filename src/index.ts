import './styles/index.scss';
import { withInstall } from '@/utils';
import VideoPlayer from './VideoPlayer.vue';

export * from './types';

export default withInstall(VideoPlayer);