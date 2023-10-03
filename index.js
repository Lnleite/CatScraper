const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const download = require("image-downloader");

async function getAllCatImgNodes(numOfPages) {
  const pageDomPromises = [];
  const catImgNodeArray = [];

  for (let i = 1; i <= numOfPages; i++) {
    const url = `https://icanhas.cheezburger.com${i === 1 ? "" : `/page/${i}`}`;
    pageDomPromises.push(JSDOM.fromURL(url));
  }

  await Promise.all(pageDomPromises).then((doms) => {
    doms.forEach((dom) => {
      catImgNodeArray.push(
        ...Array.from(
          dom.window.document.querySelectorAll("section .resp-media")
        )
      );
    });
  });

  return catImgNodeArray;
}

function downloadCatImages(catImgNodes) {
  catImgNodes.forEach((imgNode, index) => {
    const src = imgNode.getAttribute("data-src") || imgNode.src;
    const filename = src.split("/").at(-1);

    download
      .image({
        url: src,
        dest: `${__dirname}/catImages/${filename || `Cat${index}`}.jpg`,
      })
      .then(({ filename }) => console.log(`Saved to ${filename}`))
      .catch((err) => console.log(err));
  });
}

async function main() {
  const catImgNodes = await getAllCatImgNodes(1);
  downloadCatImages(catImgNodes);
}

main();
