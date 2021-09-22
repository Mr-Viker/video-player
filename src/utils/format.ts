/**
 * 格式化
 */

// 格式化成百分比
export function toPercent(value: any, keep: number = 2) {
    if (typeof value == 'undefined' || value == null || isNaN(value)) { return value; }
    return (parseFloat(value) * 100).toFixed(keep) + '%';
}


// 格式化成百分比后只显示整数部分
export function toPercentNumber(value: any, keep: number = 0) {
    return parseInt(toPercent(value, keep));
}

// 格式化成小数点后保留指定位数的数字
export function toNumberWithKeep(value: any, keep: number = 2) {
    return Number(parseFloat(value).toFixed(keep));
}


// 将秒转换成显示字符 00:00:00
export function secondToTime(second: number = 0) {
    if (second === 0 || second === Infinity || second.toString() === 'NaN') return '00:00';
    const add0 = (num: number) => (num < 10 ? '0' + num : '' + num);
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
}