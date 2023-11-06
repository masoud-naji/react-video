# React Image Accordion

The video-caption-component npm package is a powerful tool for seamlessly integrating caption support into your web-based video components. With this package, you can effortlessly add subtitles to your videos in three popular formats: SubRip (.srt), SubViewer (.sbv), and WebVTT (.vtt). This versatile solution simplifies the process of creating accessible and inclusive video content for your web applications.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install react-image-accordion.

```bash
npm i react-video-all-caption
```




## Usage

To use the component in your React application, import it and pass the necessary props:

```jsx
import ReactImageAccordion from 'react-video-all-caption';

function MyComponent() {
  return (
    <ReactVideoPlayer
      videopath: {videUrl},
      autoplay: true,
      captionurl: {captionurl},
      embedurl: {embedurltest},
      loop: true,
      muted: true,
      playPause: true,
      type: type,
      control: true,
    />
  );
}

```
---

## Contributing
For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## License
[MIT](https://choosealicense.com/licenses/mit/)
