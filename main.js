import { parse } from 'node-html-parser';
import { writeFileSync } from 'fs';

const LAST_PAGE = 842;

async function getPage(n) {
    const res = await fetch(`https://theonion.com/news/page/${n}/`);
    const html = parse(await res.text());
    const atags = html.querySelectorAll("article>div>div:nth-child(2)>h3 a");
    return atags.map(link => link.getAttribute("href"));
}

async function main() {
    const links = [];
    for (let i = 1; i <= LAST_PAGE; i++) {
        const data = await getPage(i);
        for (let d of data) {
            links.push(d);
        }
    }

    writeFileSync("links.txt", links.join("\n"));
}

main();