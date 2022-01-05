import type { IPostItem } from "./post.interface";

export interface IParser {
    // 适用会场编号
    adaptTo: string[];
    // 转换方法
    parse: () => IPostItem[];
}