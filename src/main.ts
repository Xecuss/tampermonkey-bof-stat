import App from './App.svelte'
import { parse } from './lib/parser';

// 创建渲染区域
const div = document.createElement('div');
const contentDiv = document.createElement('div');
div.className = 'content-wrap';
contentDiv.className = 'container clearfix';
div.appendChild(contentDiv);
const target = document.querySelector('.content-wrap:nth-child(2)');
target.parentNode.insertBefore(div, target);

const data = parse();

console.log('[BOF Stat]: get Stat Data', data);

const app = new App({
    target: contentDiv,
    props: {
        data
    }
})

export default app
