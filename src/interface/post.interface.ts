// 投票类型
export enum POST_TYPE {
    // 投票
    VOTE,
    // 短评
    SHORT,
    // 长评
    LONG,
    // 长评中的回复
    RESPONSE,
}

export interface IBasePostItem {
    type: POST_TYPE;
    // 评分，-1为没有评分
    point: number;
    // 用户名
    name: string;
    // 地区
    region: string;
}

export interface IVotePostItem extends IBasePostItem {
    type: POST_TYPE.VOTE;
}

export interface IShortPostItem extends IBasePostItem {
    type: POST_TYPE.SHORT;
    // 短评内容，纯string
    content: string;
}

export interface IResponsePostItem extends IBasePostItem {
    type: POST_TYPE.RESPONSE;
    // 长评内容，是一个HTML
    content: string;
    // label，一个字符串数组
    label: string[];
}

export interface ILongPostItem extends IBasePostItem {
    type: POST_TYPE.LONG;
    // 长评内容，是一个HTML
    content: string;
    // label，一个字符串数组
    label: string[];
    // response，长评下的评论数组
    responses: IResponsePostItem[];
}

export type IPostItem = IVotePostItem | IShortPostItem | ILongPostItem | IResponsePostItem;