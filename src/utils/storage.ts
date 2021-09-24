/**
 * 本地存储类
 */

export const PREFIX = 'video-player:'; // key前缀

export const STORAGE_KEY_LOOP = `${PREFIX}loop`; // 设置-循环播放
export const STORAGE_KEY_EPB_SHOW = `${PREFIX}epb:show`; // 设置-是否显示高能进度条


export class Storage {
    
    // 存储key数组
    static KEYS = [
        STORAGE_KEY_LOOP,
        STORAGE_KEY_EPB_SHOW,
    ];


    // 保存
    static set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    // 获取
    static get(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    // 获取全部
    static getList() {
        return Storage.KEYS.map(key => ({[key]: Storage.get(key)}));
    }

    // 删除
    static remove(key: string) {
        return localStorage.removeItem(key);
    }

    // 清空
    static clear() {
        return Storage.KEYS.forEach(key => Storage.remove(key));
    }

    // 判断是否有指定key
    static hasKey(key: string) {
        return Storage.KEYS.includes(key);
    }
    
}