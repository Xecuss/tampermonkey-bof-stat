import { ILongPostItem, IPostItem, POST_TYPE } from "src/interface/post.interface";

export interface IRegionStatResult {
    // 包含仅评价和投票的总人数
    count: number,
    // 地区总投票点数
    point: number,
    // 地区总投票数
    pCount: number,
    // 该地区下的所有评论
    posts: IPostItem[]
}

// 统计各个地区的投票情况
export function statRegion(result: IPostItem[]) {
    let resObj: Map<string, IRegionStatResult> = new Map();
    let sumPoint = 0;
    let voteSum = 0;
    // 把长评的回复展开
    const wraplongRes = result
        .filter(item => item.type === POST_TYPE.LONG)
        .reduce((prev: IPostItem[], current: ILongPostItem) => {
            return prev.concat(current.responses);
        }, []);

    const resAll = [...result, ...wraplongRes];
    for(let item of resAll) {
        const region = item.region;
        let regionRes = resObj.get(region)
        if(!regionRes) {
            regionRes = {
                count: 0,
                point: 0,
                pCount: 0,
                posts: []
            };
            resObj.set(region, regionRes);
        }
        regionRes.count += 1;
        regionRes.posts.push(item);
        if(item.point !== -1) {
            regionRes.point += item.point;
            regionRes.pCount += 1;
            sumPoint += item.point;
            voteSum += 1;
        }
    }
    // 展开成数组并排序
    const resArr = [...resObj.keys()]
    .map(region => ({
        name: region,
        result: resObj.get(region)
    }))
    .sort((l, r) => r.result.point - l.result.point);

    return {
        regionData: resArr,
        sumPoint,
        voteSum
    };
}