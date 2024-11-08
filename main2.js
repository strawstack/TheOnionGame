import { parse } from 'node-html-parser';
import { readFileSync, writeFileSync, createWriteStream, appendFileSync, link, chownSync } from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

async function getArticle(url) {
    const res = await fetch(url);
    const html = parse(await res.text());
    const title = html.querySelector("header>h1").innerHTML;
    const img = html.querySelector("figure>img").getAttribute("src");
    const date = html.querySelector("time").innerHTML;
    return { title, img, date };
}

function getName(img, i) {
    const last = img.split("/").pop();
    let name = `PLACEHOLDER_${i}`;
    try {
        if (last.indexOf("?") === -1) {
            name = last;
        } else {
            name = last.match(/(.+)\?/)[1];
        }
    } catch(e) {
        console.log(`${i} last: ${last}`);
    }
    return name;
}

async function saveImg(url, name) {
    const stream = createWriteStream(`img/${name}`);
    const { body } = await fetch(url);
    await finished(Readable.fromWeb(body).pipe(stream));
}

async function main() {
    const links = readFileSync("links.txt").toString("utf-8").split("\n");
    for (let i = 2218; i < links.length; i++) {
        const { title, img, date } = await getArticle(links[i]);
        // await saveImg(img, getName(img, i));
        const line = [i.toString(), title, date, getName(img, i), img].join("@@");
        appendFileSync("articles.csv", `${line}\n`);
        console.log(i);
    }
}

main();