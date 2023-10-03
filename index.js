const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const download = require("image-downloader");

async function getAllCatImages(numOfPages) {
  const catImages = [];

  for (let i = 1; i < numOfPages; i++) {
    let url = `https://icanhas.cheezburger.com${i === 1 ? "" : `/page/${i}`}`;
    await JSDOM.fromURL(url, {}).then((dom) => {
      console.log(dom);
      catImages.push(
        ...Array.from(
          dom.window.document.querySelectorAll(".mu-post .resp-media")
        )
      );
    });
  }

  return catImages;
}

function downloadCatImages(catImages) {
  catImages.forEach((img, index) => {
    let src = img.getAttribute("data-src") || img.src;
    console.log(src);
    download
      .image({
        url: src,
        dest: `C:/Users/lndub/Documents/CodingFolder/scrapping/catImages/${index}.jpg`,
      })
      .then(({ filename }) => console.log(`Saved to ${filename}`))
      .catch((err) => console.log(err));
  });
}

async function main() {
  const catImages = await getAllCatImages(10);

  downloadCatImages(catImages);
}

main();
