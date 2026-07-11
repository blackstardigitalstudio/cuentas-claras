import React from "react";
import { Composition } from "remotion";
import { ClubVideo, FPS, DURATION } from "./ClubVideo";
import { CLUB_PAGE_SLUGS } from "../../web/src/data/futbol";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClubVideo"
      component={ClubVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ slug: "juventus" as (typeof CLUB_PAGE_SLUGS)[number] }}
    />
  );
};
