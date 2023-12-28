// src/modules/core/helpers/utils.ts
import deepmerge from 'deepmerge';
import { isNil } from 'lodash';

/**
 * 用于请求验证中的boolean数据转义
 * @param value
 */
export function toBoolean(value?: string | boolean): boolean {
    if (isNil(value)) return false;
    if (typeof value === 'boolean') return value;
    try {
        return JSON.parse(value.toLowerCase());
    } catch (error) {
        return value as unknown as boolean;
    }
}

/**
 * 用于请求验证中转义null
 * @param value
 */
export function toNull(value?: string | null): string | null | undefined {
    return value === 'null' ? null : value;
}

/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]));
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};

// 元旦假期想要做的事情：
// mac 环境搭建完毕
// 整理下公司的项目成为自己的项目
// 学习nest.js
// 搭建博客技术网站
// 健身

// 周五：
// 明天早起跑步
// 吃早餐喝咖啡
// 早点去公司
// 晚上早点下班买炸串回来吃
// 然后 mac 环境初始化

// 周六
// 早起跑步
// 回来吃早餐可以自己做，也可以买
// 上午在家里做运动，学习，打扫卫生
// 中午吃火锅 下午逛优衣库然后回家
// 晚上吃炒饭？煎饺？

// 周日
// 早起跑步
// 回来吃早餐可以自己做，也可以买
// 上午出去爬山
// 中午吃铁锅炖
// 下午回家休息

// 周一
// 早起跑步
// 回来吃早餐可以自己做，也可以买
// 看不良人电影，嗑瓜子
// 学习健身
