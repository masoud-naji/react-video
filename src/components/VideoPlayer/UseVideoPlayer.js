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


  console.log(captionurl);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("play", () => {
        setVideoPaused(false);
      });

      videoElement.addEventListener("pause", () => {
        setVideoPaused(true);
      });

      // Fetch and convert subtitles if needed
      if (captionurl && captionurl.toLowerCase().endsWith(".srt")) {
        fetch(captionurl)
          .then((response) => response.text())
          .then((srtText) => {
            // Convert SRT to VTT using your conversion logic
            const vttText = convertSrtToVtt(srtText);
            const vttBlob = new Blob([vttText], { type: "text/vtt" });
            const vttURL = URL.createObjectURL(vttBlob);

            console.log("from srt", vttURL);
            // Add the VTT file as a subtitle track
            const trackElement = document.createElement("track");
            trackElement.kind = "subtitles";
            trackElement.label = "English";
            trackElement.srclang = "en";
            trackElement.src = vttURL;
            videoElement.appendChild(trackElement);
          });
      } else if (captionurl && captionurl.toLowerCase().endsWith(".sbv")) {
        fetch(captionurl)
          .then((response) => response.text())
          .then((sbvText) => {
            // Convert SRT to VTT using your conversion logic
            const vttText = convertSbvToVtt(sbvText);
            const vttBlob = new Blob([vttText], { type: "text/vtt" });
            const vttURL = URL.createObjectURL(vttBlob);

            console.log(vttURL);
            // Add the VTT file as a subtitle track
            const trackElement = document.createElement("track");
            trackElement.kind = "subtitles";
            trackElement.label = "English";
            trackElement.srclang = "en";
            trackElement.src = vttURL;
            videoElement.appendChild(trackElement);
          });
      } else if (captionurl && captionurl.toLowerCase().endsWith(".vtt")) {
        const trackElement = document.createElement("track");
        trackElement.kind = "subtitles";
        trackElement.label = "English";
        trackElement.srclang = "en";
        trackElement.src = captionurl;
        videoElement.appendChild(trackElement);
      }

      // Play the video (if autoplay is true)
      if (autoplay) {
        videoElement.play();
      }
    }
  }, [videopath, autoplay, captionurl]);

  return (
    <div>
      Video Player here
      <br />
      {type}
      {type === "videoPath" ? (
        <div>
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
          </video>
          {autoplay && loop && playPause && !control && (
            <div className="cmp-video__autoplay-control">
              <button
                onClick={() =>
                  videoPaused
                    ? videoRef.current.play()
                    : videoRef.current.pause()
                }
                className={`icon icon--${
                  autoplay ? "pause" : "play"
                }-button-white autoplay-control`}
                aria-label="click to pause video"
              ></button>
            </div>
          )}
        </div>
      ) : type === "thirdPartyEmbed" ? (
        <div dangerouslySetInnerHTML={{ __html: embedurl }} />
      ) : null}
      End of video player
    </div>
  );
};

export default VideoPlayer;
