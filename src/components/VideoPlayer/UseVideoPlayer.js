import React, { useState, useEffect, useRef } from "react";
import { convertSrtToVtt, convertSbvToVtt } from "./subConverter";

const VideoPlayer = ({
  videopath,
  autoplay,
  captionurl,
  embedurl,
  loop,
  muted,
  playPause,
  type,
  control,
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
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const vttText =
          format === "srt" ? convertSrtToVtt(text) : convertSbvToVtt(text);
        addSubtitleTrack(
          URL.createObjectURL(new Blob([vttText])),
          videoElement
        );
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
        return (
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            style={{ width: "100%", height: "100%" }}
            controls={control}
            loop={loop}
            muted={muted}
            playsInline
            autoPlay={autoplay}
            disablePictureInPicture
          >
            <source src={videopath} type="video/mp4" />
            <source src={videopath} type="video/webm" />
            <source src={videopath} type="video/ogg" />
            {/* ... potentially other sources */}
          </video>
        );
      case "thirdPartyEmbed":
        return <div dangerouslySetInnerHTML={{ __html: embedurl }} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {VideoContent()}
      {autoplay && loop && playPause && !control && (
        <button
          onClick={() =>
            videoPaused ? videoRef.current.play() : videoRef.current.pause()
          }
          className={`icon icon--${
            videoPaused ? "play" : "pause"
          }-button-white autoplay-control`}
          aria-label={
            videoPaused ? "click to play video" : "click to pause video"
          }
        />
      )}
    </div>
  );
};

export default VideoPlayer;
