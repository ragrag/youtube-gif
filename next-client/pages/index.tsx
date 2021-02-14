import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import YouTube from "react-youtube";
import axios from "axios";
import { useRouter } from "next/router";
// import RangeSlider from "@aklos/react-range-slider";

const Home: React.FC = () => {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [ytPlayer, setYtPlayer] = useState(null);

  const ytVideoId = useMemo(() => {
    return youtubeUrl.split("v=")[1]?.slice(0, 11);
  }, [youtubeUrl]);

  const submitYoutubeVideo = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/jobs`,
        {
          youtubeUrl,
          startTime: Number(startTime),
          endTime: Number(endTime),
        },
        {}
      );
      router.push(`/jobs/${response.data.id}`);
    } catch (err) {
      console.log(err);
      alert("Something went wrong try again");
    }
    setLoading(false);
  };
  return (
    <>
      <Head>
        <title>ytgif</title>
      </Head>
      <div
        className="container is-fluid is-flex is-align-items-center is-justify-content-center is-flex-direction-column "
        style={{ height: "100vh" }}
      >
        <div
          className="columns is-mobile is-vcentered  is-centered has-text-centered"
          style={{ width: "100%" }}
        >
          <div className="column is-6">
            <div className="content">
              <h3>Preview</h3>
              {youtubeUrl ? (
                <YouTube
                  videoId={ytVideoId}
                  opts={{
                    playerVars: {
                      start: Number(startTime),
                      end: Number(endTime),
                      autoplay: 0,
                      disablekb: 1,
                      loop: 0,
                      rel: 0,
                      color: "white",
                      fs: 0,
                      // controls: 1,
                    },
                  }}
                  onReady={(e) => {
                    setYtPlayer(e.target);
                  }}
                />
              ) : (
                <h4>No Youtube Video Link Selected</h4>
              )}

              <br></br>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input is-dark"
                        type="text"
                        placeholder="Youtube URL, eg: https://www.youtube.com/watch?v=I-QfPUz1es8"
                        value={youtubeUrl}
                        onChange={(e) => {
                          setYoutubeUrl(e.target.value);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <br></br>

              <label className="label">Start/End Seconds</label>
              {/* <RangeSlider
                min={0}
                max={videoDuration}
                increment={1}
                showLabels
                flexibleRange
                labelTransform={(labelStr) => "second : " + labelStr}
                onChange={(start, end) => console.log(start, end)}
              /> */}
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input is-dark"
                        type="number"
                        placeholder="Start Second, eg: 38"
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                        }}
                      />
                    </p>
                  </div>
                </div>

                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        className="input is-dark"
                        type="number"
                        placeholder="End Second, eg: 72"
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value);
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <br></br>
              <button
                className={`button is-black`}
                onClick={() => {
                  if (ytPlayer)
                    ytPlayer.loadVideoById({
                      videoId: ytVideoId,
                      startSeconds: Number(startTime),
                      endSeconds: Number(endTime),
                    });
                }}
              >
                Preview
              </button>
              <br></br>
              <br></br>
              <button
                className={`button is-black is-outlined ${
                  loading ? "is-loading" : ""
                }`}
                onClick={submitYoutubeVideo}
              >
                Generate GIF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
