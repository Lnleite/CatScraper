const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const download = require("image-downloader");

async function getAllCatImgNodes(numOfPages) {
  const catImagePromise = [];
  const catImgNodeArray = [];

  for (let i = 1; i < numOfPages; i++) {
    let url = `https://icanhas.cheezburger.com${i === 1 ? "" : `/page/${i}`}`;
    catImagePromise.push(JSDOM.fromURL(url, {}));
  }

  await Promise.all(catImagePromise).then((doms) => {
    doms.forEach((dom) => {
      catImgNodeArray.push(
        ...Array.from(
          dom.window.document.querySelectorAll(".mu-post .resp-media")
        )
      );
    });
  });

  return catImgNodeArray;
}

function downloadCatImages(catImages) {
  catImages.forEach((img, index) => {
    let src = img.getAttribute("data-src") || img.src;
    let filename = src.split("/").at(-1);
    download
      .image({
        url: src,
        dest: `C:/Users/lndub/Documents/CodingFolder/scrapping/catImages/${filename}.jpg`,
      })
      .then(({ filename }) => console.log(`Saved to ${filename}`))
      .catch((err) => console.log(err));
  });
}

async function main() {
  const catImages = await getAllCatImgNodes(10);
  downloadCatImages(catImages);
}

main();
