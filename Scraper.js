
console.log("SCRAPER LOADED");

browser.browserAction.onClicked.addListener(async () => {
    console.log("========== SCANNING ==========");

    const tabs = await browser.tabs.query({});
    const cardNames = new Set();

    for (const tab of tabs) {
        if (!tab.url) continue;

        let url;

        try {
            url = new URL(tab.url);
        } catch {
            continue;
        }

        if (
            url.hostname !== "edhrec.com" &&
            url.hostname !== "www.edhrec.com"
        ) {
            continue;
        }

        // Accept both regular card and commander pages
        const match = url.pathname.match(
            /^\/(cards|commanders)\/([^/]+)\/?$/i
        );

        if (!match) continue;

        const pageType = match[1].toLowerCase();
        const slug = match[2];

        // Convert URL slug into a readable name
        const name = decodeURIComponent(slug)
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());

        if (cardNames.has(name.toLowerCase())) {
            console.log("DUPLICATE SKIPPED:", name);
            continue;
        }

        cardNames.add(name.toLowerCase());
        console.log(`FOUND (${pageType}):`, name);
    }

    // Keep the original display names for output
    const names = [...cardNames].map(name => {
        return name
            .replace(/\b\w/g, c => c.toUpperCase());
    });

    const output = names.join("\n");

    console.log("========== OUTPUT ==========");
    console.log(output);

    try {
        await navigator.clipboard.writeText(output);
        console.log(`COPIED ${names.length} UNIQUE CARDS`);
    } catch (error) {
        console.error("CLIPBOARD FAILED:", error);
    }
});
