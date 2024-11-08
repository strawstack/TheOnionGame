import { readFileSync, writeFileSync } from 'fs';

function main() {
    const data = readFileSync("articles.csv").toString("utf-8").split("\n").map(line => line.split("@@"));
    data.pop();
    const jsonl = [];
    for (let [n, title, date, _, img] of data) {
        jsonl.push({
            title,
            date,
            img_url: img
        });
    }
    const out = jsonl.map(row => JSON.stringify(row)).join("\n");
    writeFileSync('articles.jsonl', out);
    writeFileSync('articles.js', `const articles = ${JSON.stringify(jsonl, null, 2)};`);
}

main();