/**
 * Fetches quotes from the Goodreads website.
 * @url https://www.goodreads.com/quotes
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

async function scrapeHTMLPages(url, numPages) {
  const quotes = [];

  for (let i = 1; i <= numPages; i++) {
    const pageUrl = `${url}?page=${i}`;
    console.log("Fetching page: ", pageUrl);
    const response = await axios.get(pageUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract and process quotes from the HTML
    // Add them to the 'quotes' array
    $(".quoteText").each((index, element) => {
      const quote = $(element)
        .contents()
        .filter(function () {
          return this.nodeType === 3; // Node.TEXT_NODE
        })
        .first()
        .text()
        .trim()
        .replace(/^“/, "")
        .replace(/”$/, "");
      const authorOrTitleQuery = $(element).find(".authorOrTitle");
      const author = $(authorOrTitleQuery)
        .first()
        .text()
        .trim()
        .replace(/,$/, "");
      const title =
        authorOrTitleQuery.length === 2
          ? $(authorOrTitleQuery).last().text().trim()
          : "";

      quotes.push({
        quote,
        author,
        title,
      });
    });

    console.log("Found", $(".quoteText").length, "quotes on page", i);

    // Wait to prevent timeout errors.
    await new Promise((r) => setTimeout(r, getRandomDelay()));
  }

  return quotes;
}

function getRandomDelay() {
  const min = 1500;
  const max = 2500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const url = "https://www.goodreads.com/quotes";
const numPages = 100;

scrapeHTMLPages(url, numPages)
  .then((quotes) => {
    console.log(quotes);
    fs.writeFileSync(
      path.join(__dirname, "/goodquotes.json"),
      JSON.stringify(quotes, null, 2)
    );
  })
  .catch((error) => {
    console.log(error);
  });
