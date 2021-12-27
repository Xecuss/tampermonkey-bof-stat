// ==UserScript==
// @name         BOF Stat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在BOF详情页显示投票的地区详情表格
// @author       Xs!
// @match        https://manbow.nothing.sh/event/event.cgi?action=More_def*
// @icon         https://www.google.com/s2/favicons?domain=nothing.sh
// @grant        none
// @license MIT
// ==/UserScript==
(function() {
    'use strict';

    /*
     * 统计仅分数结果
     * 分数结果 type = 'vote'
     * 包含 point、name、region 三个字段
     */
    function statVote() {
        const postList = [...document.querySelectorAll('.feature-box')];
        let res = [];
        for(let item of postList) {
            const pointEl = item.querySelector('.points_oneline');
            const tempRes = {
                type: 'vote',
                point: Number(item.querySelector('.fbox-icon').textContent),
                name: item.querySelector('h4.nobottommargin').textContent.trim(),
                region: item.querySelector('img.flag').title,
            }
            res.push(tempRes)
        }
        return res;
    }
    /*
     * 统计短评结果
     * 短评结果 type = 'short'
     * 包含 point、name、region、content 四个字段
     */
    function statShort() {
        const postList = [...document.querySelectorAll('.col_full > .col_full > .col_full > .spost')];
        let res = [];
        for(let item of postList) {
            const pointEl = item.querySelector('.points_oneline');
            const tempRes = {
                type: 'short',
                point: pointEl ? Number(pointEl.textContent) : -1,
                name: item.querySelector('.icon-user').parentNode.textContent.trim(),
                region: item.querySelector('img.flag').title,
                content: item.querySelectorAll('.entry-title')[1].textContent
            }
            res.push(tempRes)
        }
        return res;
    }
    /*
     * 统计长评结果
     * 分数结果 type = 'long'
     * 包含 point、name、region、content、label 五个字段
     * label 是一个string[]，包含形如 labelName: labelValue 形式的字符串
     */
    function statLong() {
        const postList = [...document.querySelectorAll('.points_normal')].map(node => node.parentNode.parentNode);
        let res = [];
        for(let item of postList) {
            const tempRes = {
                type: 'long',
                point: Number(postList[0].querySelector('.points_normal').textContent),
                name: item.querySelector('.entry-title').textContent.trim(),
                region: item.querySelector('img.flag').title,
                content: item.nextElementSibling.innerHTML,
                label: [...item.querySelectorAll('.label')].map(label => label.textContent.trim())
            }
            res.push(tempRes)
        }
        return res;
    }
    // 取得所有的投票结果，可以直接处理这个数组
    const resJson = [...statVote(), ...statShort(), ...statLong()];

    // 统计各个地区的投票情况
    function statRegion() {
        let resObj = {};
        let sumPoint = 0;
        let voteSum = 0;
        for(let item of resJson) {
            const region = item.region;
            if(!resObj[region]) {
                resObj[region] = {
                    count: 0,
                    point: 0,
                    pCount: 0,
                };
            }
            resObj[region].count += 1;
            if(item.point !== -1) {
                resObj[region].point += item.point;
                resObj[region].pCount += 1;
                sumPoint += item.point;
                voteSum += 1;
            }
        }
        return {
            regionData: resObj,
            sumPoint,
            voteSum
        };
    }
    const renderList = [];

    // 渲染区域统计结果
    function renderRegion(regionObj) {
        const {
            regionData,
            sumPoint,
            voteSum,
        } = regionObj;
        let resHtml = `<table class="table table-striped">
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
        </thead>`;
        resHtml += Object.getOwnPropertyNames(regionData)
        .map(c => {
            const { count, point, pCount } = regionData[c];
            const countPercent = (pCount / voteSum * 100).toFixed(2);
            const pointPercent = (point / sumPoint* 100).toFixed(2);
            const avgPoint = (point / pCount).toFixed(2);
            const onlyComment = count - pCount;
            return `<tr>
            <th>
                <img src="./images/flags/${c}.png" class="flag" style="margin-right: 5px; vertical-align: top;">
                ${c}
            </th>
            <th>${point}</th>
            <th>${pointPercent}%</th>
            <th>${pCount}</th>
            <th>${countPercent}%</th>
            <th>${avgPoint}</th>
            <th>${onlyComment}</th>
            </tr>`
        })
        .join('');
        resHtml += '</tr></table>'
        return resHtml;
    }

    function render() {
        // 创建渲染区域
        const div = document.createElement('div');
        const contentDiv = document.createElement('div');
        div.className = 'content-wrap';
        contentDiv.className = 'container clearfix';
        div.appendChild(contentDiv);
        const target = document.querySelector('.content-wrap:nth-child(2)');
        target.parentNode.insertBefore(div, target);

        let renderHTML = '';
        // 以下放置渲染内容
        renderHTML += renderRegion(statRegion())
        contentDiv.innerHTML =renderHTML;
    }

    render();
})();