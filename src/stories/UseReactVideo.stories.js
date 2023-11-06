import React from "react";
import { ReactVideoPlayer } from "../components/VideoPlayer";

export default {
  title: "React Video Player",
  component: ReactVideoPlayer,
  argTypes: {
    type: {
      options: ["videoPath", "thirdPartyEmbed"],
      control: { type: "select" },
    },
  },
};

const Template = (args) => <ReactVideoPlayer {...args} />;

export const App = Template.bind({});
App.args = {
  videopath: videUrl,
  autoplay: true,
  captionurl: captionurl,
  embedurl: embedurltest,
  loop: true,
  muted: true,
  playPause: true,
  type: type,
  control: true,
};
