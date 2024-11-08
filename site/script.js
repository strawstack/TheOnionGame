function main() {
    const q = s => document.querySelector(s);
    const container = {
        e: q('.container'),
        h1: { e: q('.container h1') },
        img_area: {
            e: q('.container .img-area'),
            img: { e: q('.container .img-area img') }
        },
        h2: { e: q('.container h2') },
        select: {
            e: q('.container .select'),
            d1: { e: q('.container .select .d1') },
            d2: { e: q('.container .select .d2') },
            d3: { e: q('.container .select .d3') },
        },
        result_area: {
            e: q('.container .result-area'),
            h1: { e: q('.container .result-area h1') },
            info: { e: q('.container .result-area .info') },
            next: { e: q('.container .result-area .next') },
        }
    };

    const debug = false;
    let hasAnswered = null;
    let correct_date = null;
    let correct_year = null;
    let dy1 = null;
    let dy2 = null;
    let dy3 = null;

    const all_years = [];
    for (let y = 1995; y <= 2024; y++) {
        all_years.push(y);
    }

    function shuffle(lst) {
        let index = lst.length - 1;
        while (index > 0) {
            const r = Math.floor(Math.random() * index);
            const temp = lst[index];
            lst[index] = lst[r];
            lst[r] = temp;
            index -= 1;
        }
        return lst;
    }

    function hideResults(value) {
        container.result_area.e.style.display = value ? "none" : "flex";
    }

    function nextArticle() {
        if (debug) console.log("called: nextArticle");

        hasAnswered = false;
        hideResults(true);

        const r = Math.floor(Math.random() * articles.length);
        const { title, date, img_url } = articles[r];

        if (debug) console.log(title, date);

        container.h2.e.innerHTML = title;
        container.img_area.img.e.src = img_url;

        correct_date = date;
        correct_year = parseInt(new Date(date).getFullYear());
        if (debug) console.log(`correct_year: ${correct_year}`);
        const year_guess = shuffle(all_years.filter(y => y !== correct_year));

        const sort_years = [correct_year, year_guess[0], year_guess[1]];
        sort_years.sort((a, b) => a - b);

        if (debug) console.log(`sort_years: ${sort_years.map(e => e.toString()).join(", ")}`);

        dy1 = sort_years[0];
        dy2 = sort_years[1];
        dy3 = sort_years[2];

        if (debug) console.log(dy1, dy2, dy3);

        container.select.d1.e.innerHTML = dy1;
        container.select.d2.e.innerHTML = dy2;
        container.select.d3.e.innerHTML = dy3;
    }

    function correct(isCorrect, date) {
        if (debug) console.log("called: correct");
        if (debug) console.log(isCorrect, date);
        hideResults(false);
        container.result_area.h1.e.classList.remove("yes");
        container.result_area.h1.e.classList.remove("no");
        container.result_area.h1.e.innerHTML = isCorrect ? "Correct!" : "Incorrect";
        container.result_area.h1.e.classList.add(isCorrect ? "yes": "no");
        container.result_area.info.e.innerHTML = `Article date: ${date}`;
    }

    container.result_area.next.e.addEventListener("click", e => {
        nextArticle();
    });

    container.select.d1.e.addEventListener("click", e => {
        if (hasAnswered) return;
        hasAnswered = true;
        if (debug) console.log(`clickEvent: d1: ${dy1}`);
        correct(dy1 === correct_year, correct_date);
    });

    container.select.d2.e.addEventListener("click", e => {
        if (hasAnswered) return;
        hasAnswered = true;
        if (debug) console.log(`clickEvent: d2: ${dy2}`);
        correct(dy2 === correct_year, correct_date);
    });

    container.select.d3.e.addEventListener("click", e => {
        if (hasAnswered) return;
        hasAnswered = true;
        if (debug) console.log(`clickEvent: d3: ${dy3}`);
        correct(dy3 === correct_year, correct_date);
    });

    nextArticle();
}

main();