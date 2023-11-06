import React, { useRef, useState, useEffect } from 'react';

// Utility function to convert SRT caption to WebVTT format
function convertSrtToVtt(srtText) {
  // Remove DOS newlines
  var srt = srtText.replace(/\r+/g, '');
  // Trim whitespace at the start and end
  srt = srt.replace(/^\s+|\s+$/g, '');
  // Get cues
  var cuelist = srt.split('\n\n');
  var result = "";
  if (cuelist.length > 0) {
    result += "WEBVTT\n\n";
    for (var i = 0; i < cuelist.length; i++) {
      result += convertSrtCue(cuelist[i]);
    }
  }
  return result;
}

// Utility function to convert a single SRT caption cue to WebVTT format
function convertSrtCue(caption) {
  // Remove all HTML tags for security reasons
  // caption = caption.replace(/<[a-zA-Z\/][^>]*>/g, '');
  var cue = "";
  var s = caption.split(/\n/);
  // Concatenate multi-line string separated in the array into one
  while (s.length > 3) {
    for (var i = 3; i < s.length; i++) {
      s[2] += "\n" + s[i];
    }
    s.splice(3, s.length - 3);
  }
  var line = 0;
  // Detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += s[0].match(/\w+/) + "\n";
    line += 1;
  }
  // Get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // Convert time string
    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += m[1] + ":" + m[2] + ":" + m[3] + "." + m[4] + " --> " + m[5] + ":" + m[6] + ":" + m[7] + "." + m[8] + "\n";
      line += 1;
    } else {
      // Unrecognized timestring
      return "";
    }
  } else {
    // File format error or comment lines
    return "";
  }
  // Get cue text
  if (s[line]) {
    cue += s[line] + "\n\n";
  }
  return cue;
}

// Utility function to convert SBV caption to WebVTT format
function convertSbvToVtt(sbvText) {
  // Remove DOS newlines
  var sbv = sbvText.replace(/\r+/g, '');
  // Trim whitespace at the start and end
  sbv = sbv.replace(/^\s+|\s+$/g, '');
  // Get cues
  var cuelist = sbv.split('\n\n');
  var result = "";
  if (cuelist.length > 0) {
    result += "WEBVTT\n\n";
    for (var i = 0; i < cuelist.length; i++) {
      result += i + 1 + "\n"; // Add cue number
      result += convertSbvCue(cuelist[i]);
    }
  }
  return result;
}

// Utility function to convert a single SBV caption cue to WebVTT format
function convertSbvCue(caption) {
  var cue = "";
  var s = caption.split(/\n/);
  // Concatenate multi-line string separated in the array into one
  while (s.length > 3) {
    for (var i = 3; i < s.length; i++) {
      s[2] += "\n" + s[i];
    }
    s.splice(3, s.length - 3);
  }
  var line = 0;
  // Get time strings
  if (s[line].match(/\d+:\d+.\d+,\d+:\d+.\d+/)) {
    // Convert time string (SBV format) to WebVTT format
    var m = s[0].match(/(\d+:\d+:\d+.\d+),(\d+:\d+:\d+.\d+)/);
    if (m) {
      var startTime = m[1];
      var endTime = m[2];
      cue += startTime + " --> " + endTime + "\n";
      line += 1;
    } else {
      // Unrecognized timestring
      return "";
    }
  } else {
    // File format error or comment lines
    return "";
  }
  // Get cue text
  if (s[line]) {
    cue += s[line] + "\n\n";
  }
  return cue;
}

const VideoPlayer = ({
  videopath,
  autoplay,
  captionurl,
  embedurl,
  loop,
  muted,
  playPause,
  type,
  control
}) => {
  const videoRef = useRef(null);
  const [videoPaused, setVideoPaused] = useState(true);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const handlePlay = () => setVideoPaused(false);
    const handlePause = () => setVideoPaused(true);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    if (autoplay) videoElement.play();
    if (captionurl) {
      const fileExtension = captionurl.toLowerCase().split(".").pop();
      switch (fileExtension) {
        case "srt":
        case "sbv":
          convertAndAddSubtitle(captionurl, fileExtension, videoElement);
          break;
        case "vtt":
          addSubtitleTrack(captionurl, videoElement);
          break;
        default:
          console.error("Unsupported subtitle format");
      }
    }
    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, [autoplay, captionurl, videopath]);
  const convertAndAddSubtitle = (url, format, videoElement) => {
    fetch(url).then(response => response.text()).then(text => {
      const vttText = format === "srt" ? convertSrtToVtt(text) : convertSbvToVtt(text);
      addSubtitleTrack(URL.createObjectURL(new Blob([vttText])), videoElement);
    });
  };
  const addSubtitleTrack = (src, videoElement) => {
    const trackElement = document.createElement("track");
    trackElement.kind = "subtitles";
    trackElement.label = "English";
    trackElement.srclang = "en";
    trackElement.src = src;
    videoElement.appendChild(trackElement);
  };
  const VideoContent = () => {
    switch (type) {
      case "videoPath":
        return /*#__PURE__*/React.createElement("video", {
          ref: videoRef,
          className: "video-js vjs-default-skin",
          style: {
            width: "100%",
            height: "100%"
          },
          controls: control,
          loop: loop,
          muted: muted,
          playsInline: true,
          autoPlay: autoplay,
          disablePictureInPicture: true
        }, /*#__PURE__*/React.createElement("source", {
          src: videopath,
          type: "video/mp4"
        }), /*#__PURE__*/React.createElement("source", {
          src: videopath,
          type: "video/webm"
        }), /*#__PURE__*/React.createElement("source", {
          src: videopath,
          type: "video/ogg"
        }));
      case "thirdPartyEmbed":
        return /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: embedurl
          }
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", null, VideoContent(), autoplay && loop && playPause && !control && /*#__PURE__*/React.createElement("button", {
    onClick: () => videoPaused ? videoRef.current.play() : videoRef.current.pause(),
    className: `icon icon--${videoPaused ? "play" : "pause"}-button-white autoplay-control`,
    "aria-label": videoPaused ? "click to play video" : "click to pause video"
  }));
};

const ReactVideoPlayer = prop => {
  return /*#__PURE__*/React.createElement(VideoPlayer, prop);
};

export { ReactVideoPlayer };
