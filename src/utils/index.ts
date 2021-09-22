import Vue from "vue";

/**
 * 组件全局化
 * @param comp 直接使用的组件
 * @param name 组件名称
 * @returns 可安装的组件
 * 注：vue-property-decorator会将name放在comp.options下
 */
export function withInstall(comp: any, name?: string) {
    comp.install = (Vue: Vue) => Vue.component(name || comp.options.name || comp.name, comp);
    return comp;
};


// 合并默认配置和自定义配置
// 合并规则：字段名相同：1. 基本类型则直接覆盖  2. 引用类型则递归属性合并
export function deepMerge<T>(defaultConfig: T, customConfig: T): T {
    if(!customConfig) return deepClone(defaultConfig);

    let defaultValue, customValue;
    const keys = Object.keys(defaultConfig);

    keys.map(key => {
        defaultValue = defaultConfig[key];
        customValue = customConfig[key];
        
        if(!hasOwn(customConfig, key)) {
            // @ts-ignore
            Vue.set(customConfig, key, isReferType(defaultValue) ? deepClone(defaultValue) : defaultValue);
        } else if(defaultValue !== customValue && isObject(defaultValue) && isObject(customValue)) {
            deepMerge(defaultValue, customValue);
        }
    })

    return customConfig;
}

// 深拷贝
export function deepClone<T>(source: T): T {
    if (!source || typeof source !== 'object') {
      throw new Error('[deepClone] error arguments')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    })
    return targetObj as T;
}

// 在不改变target地址的情况下深度赋值 将source的值覆盖target原有的值 如果是object类型则继续递归调用
export function deepAssign<T>(target: T, source: T): T {
    if(!isObject(source)) return target;

    for(const [key, value] of Object.entries(source)) {
        if(!hasOwn(target, key)) {
            // @ts-ignore
            Vue.set(target, key, isReferType(value) ? deepClone(value) : value);
        } else if(target[key] !== value) {
            // @ts-ignore
            (isObject(target[key]) && isObject(value)) ? deepAssign(target[key], value) : Vue.set(target, key, value);
        }
    }

    return target;
}


// 获取某个父级组件引用
export function getParentComponent(componentName: string) {
    //@ts-ignore
    var parent = this.$parent || this.$root;
    //@ts-ignore
    var name = parent.$options.componentName || parent.$options.name;

    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
            //@ts-ignore
            name = parent.$options.componentName || parent.$options.name;
        }
    }
    
    return parent;
}


// 空方法
export function noop() {}


// 是否是引用类型
export function isReferType(value: any) {
    return Array.isArray(value) || Object.prototype.toString.call(value) == '[object Object]';
}

// 是否是对象类型
export function isObject(value: any) {
    return Object.prototype.toString.call(value) == '[object Object]';
}

// 是否是方法
export function isFunction(functionToCheck: any) {
    return Object.prototype.toString.call(functionToCheck) === '[object Function]';
}

// 是否是数字
export function isNumber(value: any) {
    return Object.prototype.toString.call(value) === '[object Number]';
}

// 是否是百分数
export function isPercent(value: any) {
    return /^\d+(\.\d+)?%$/.test(value);
}


// 是否包含指定属性
export function hasOwn(obj: any, key: string) {
    return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}

// 判断是否是空值 undefined null '' [] {}
export function isEmptyValue(value: any) {
    let type = Object.prototype.toString.call(value);
    type = type.substring(1, type.length - 1).split(' ')[1];
    if(type === 'Null' || type === 'Undefined' 
        || (type === 'String' && value === '') 
        || (type === 'Array' && value.length <= 0) 
        || (type === 'Object' && Object.keys(value).length <= 0)) {
            return true;
    }
    return false;
}