import { ILongPostItem, IPostItem, IResponsePostItem, IShortPostItem, IVotePostItem, POST_TYPE } from "src/interface/post.interface";

function statVote() {
    const postList = [...document.querySelectorAll('.feature-box')];
    let res: IVotePostItem[] = [];
    for (let item of postList) {
        const imgEl: HTMLImageElement = item.querySelector('img.flag')
        const tempRes: IVotePostItem = {
            type: POST_TYPE.VOTE,
            point: Number(item.querySelector('.fbox-icon').textContent),
            name: item.querySelector('h4.nobottommargin').textContent.trim(),
            region: imgEl ? imgEl.title : '?',
        };
        res.push(tempRes);
    }
    return res;
}

function statShort() {
    const postList = [...document.querySelectorAll('.col_full > .col_full > .col_full > .spost')];
    let res: IShortPostItem[] = [];
    for (let item of postList) {
        const pointEl = item.querySelector('.points_oneline');
        const imgEl: HTMLImageElement = item.querySelector('img.flag');
        const tempRes: IShortPostItem = {
            type: POST_TYPE.SHORT,
            point: pointEl ? Number(pointEl.textContent) : -1,
            name: item.querySelector('.icon-user').parentNode.textContent.trim(),
            region: imgEl ? imgEl.title : '?',
            content: item.querySelectorAll('.entry-title')[1].textContent
        };
        res.push(tempRes);
    }
    return res;
}

function statLong() {
    const postList = [...document.querySelectorAll('.col_full + .spost')];
    let res: ILongPostItem[] = [];
    let rootTemp: ILongPostItem | null = null;
    for (let item of postList) {
        const contentEl = item.nextElementSibling;
        if (contentEl.querySelector('button[name=shortimpressionr-form-submit]')) {
            if (rootTemp) {
                res.push(rootTemp);
                rootTemp = null;
            }
            continue;
        }
        const pointEl = item.querySelector('.points_normal');
        const imgEl: HTMLImageElement = item.querySelector('img.flag');
        const tempRes: IResponsePostItem = {
            type: POST_TYPE.RESPONSE,
            point: pointEl ? Number(pointEl.textContent) : -1,
            name: item.querySelector('.entry-title strong').textContent.trim(),
            region: imgEl ? imgEl.title : '?',
            content: contentEl.innerHTML,
            label: [...item.querySelectorAll('.label')].map(label => label.textContent.trim())
        };
        if (rootTemp) {
            rootTemp.responses.push(tempRes);
        }
        else {
            rootTemp = {
                ...tempRes,
                type: POST_TYPE.LONG,
                responses: []
            }
        }
    }
    return res;
}

export function parse(): IPostItem[] {
    return [...statVote(), ...statShort(), ...statLong()];
}