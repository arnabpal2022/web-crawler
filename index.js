const axios = require("axios");
const cheerio = require("cheerio");

let successCount = 0;
let failCount = 0;
const crawllimit = 3;

async function getHTML(url) {
  if (successCount+failCount == crawllimit) return;
  try {
    const response = await axios.get(url);
    successCount++;

    const $ = cheerio.load(response.data);
    const allLinks = [];

    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("https://")) {
        allLinks.push(href);
      }
    });

    allLinks.forEach((link) => {
      getHTML(link);
    });

    console.log(`crawled ${url} + ${successCount+failCount}`)
  } catch (error) {
    failCount++;
  }
}

setInterval(() => {
  getHTML("https://mockaroo.com/");
}, 10000);

process.on("exit", () => {
  const successRatio = successCount / (successCount + failCount);
  console.log(
    `Success-Error Ratio: ${successRatio.toFixed(
      2
    )} (${successCount} successful, ${failCount} errors)`
  );
});
