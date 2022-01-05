<table class="table table-striped">
    <thead>
    <tr>
        <th>地区</th>
        <th>总分</th>
        <th>总分占比</th>
        <th>打分总数</th>
        <th>打分占比</th>
        <th>平均</th>
        <th>仅评论数</th>
    </tr>
    </thead>
    <tbody>
        {#each regionResult as item}
            <tr>
                <th>
                    {#if item.regionName !== '?'}
                        <img src={item.icon} class="flag" style="margin-right: 5px; vertical-align: top;" alt={item.regionName}>
                    {/if}
                    {item.regionName}
                </th>
                <th class="region_point">{item.point}</th>
                <th>{item.pointPercent}%</th>
                <th>{item.pCount}</th>
                <th>{item.countPercent}%</th>
                <th>{item.avgPoint}</th>
                <th>{item.onlyComment}</th>
            </tr>
        {/each}
    </tbody>
</table>

<script lang="ts">
import type { IPostItem } from "src/interface/post.interface";
import { statRegion } from "src/lib/regionStat";

export const data: IPostItem[] = [];

$: regionResult = (() => {
    const result = statRegion(data);
    const { sumPoint, voteSum } = result;
    return result.regionData.map(item => {
        const { count, point, pCount } = item.result;
        return {
            regionName: item.name,
            countPercent: (pCount / voteSum * 100).toFixed(2),
            pointPercent: (point / sumPoint* 100).toFixed(2),
            avgPoint: (point / pCount).toFixed(2),
            onlyComment: count - pCount,
            icon: `./images/flags/${item.name}.png`,
            ...item.result
        };
    })
})()
</script>