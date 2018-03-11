export default class FileDownloader {
  constructor() {}

  downloadImages(urls) {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          resolve(image);
        };
        image.onerror = () => {
          alert(`Could not load image at url ${url}`);
          reject('Could not load image!');
        };
        image.src = url;
      });
    });

    return Promise.all(promises);
  }
}
