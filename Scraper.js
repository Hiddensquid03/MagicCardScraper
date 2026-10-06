console.log("SCRAPER LOADED");

browser.browserAction.onClicked.addListener(async () => {
    console.log("========== SCANNING ==========");

    const tabs = await browser.tabs.query({});

    const cardNames = [];

    for (const tab of tabs) {
        if (!tab.url || !tab.url.startsWith("https://edhrec.com/")) {
            continue;
        }

        const title = tab.title || "";

        const match = title.match(
            /^(.+?)\s*\((?:Card|Commander)\)\s*\|?\s*EDHREC/i
        );

        if (!match) {
            continue;
        }

        const name = match[1].trim();

        // Don't add the same card twice
        if (!cardNames.includes(name)) {
            cardNames.push(name);
            console.log("FOUND:", name);
        } else {
            console.log("DUPLICATE SKIPPED:", name);
        }
    }

    const output = cardNames.join("\n");

    console.log("========== OUTPUT ==========");
    console.log(output);

    await navigator.clipboard.writeText(output);

    console.log(`COPIED ${cardNames.length} UNIQUE CARDS`);
});