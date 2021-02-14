import { InferGetServerSidePropsType } from "next";
import React from "react";
import Job from "../../lib/common/interfaces/Job.interface";
import fetchJobById from "../../lib/requests/fetchers/jobById";
import { useRouter } from "next/router";
import useSWR from "swr";
import Head from "next/head";

export default function JobPage({
  jobId,
  initialJob,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [jobDone, setJobDone] = React.useState(false);

  const { data: job, error: errorJob, isValidating: isValidatingJob } = useSWR(
    [`/api/jobs/${jobId}`, jobId],
    async (url, jobId) => await fetchJobById(jobId),
    {
      initialData: initialJob,
      revalidateOnFocus: false,
      refreshInterval: jobDone ? 0 : 2000,
    }
  );

  React.useEffect(() => {
    if (job?.status === "done") setJobDone(true);
  }, [job]);

  const loadingJob = !job || isValidatingJob;

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
          <div className="column is-12">
            {loadingJob ? (
              <>
                <h4>Getting conversion status..</h4>
                <progress className="progress is-medium is-dark" max="100">
                  45%
                </progress>
              </>
            ) : (
              <div className="content">
                {job.status === "error" ? (
                  <h4 style={{ color: "#FF0000" }}>Conversion Failed</h4>
                ) : job.status === "done" ? (
                  <>
                    {!job.gifUrl ? (
                      <h4 style={{ color: "#FF0000" }}>Conversion Failed</h4>
                    ) : (
                      <>
                        <h4>Gif</h4>
                        <img src={job.gifUrl}></img>
                        <h6>
                          GIF Url : <a href={job.gifUrl}>{job.gifUrl}</a>
                        </h6>
                        <h6>
                          Converted from :
                          <a href={job.youtubeUrl}>{job.youtubeUrl}</a>
                        </h6>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h4>Working..</h4>
                    <h5>Conversion Status : {job.status}</h5>
                    <progress className="progress is-medium is-dark" max="100">
                      45%
                    </progress>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const jobId = context.params.id;
  try {
    const initialJob: Job = await fetchJobById(jobId);
    return { props: { jobId, initialJob: initialJob } };
  } catch (err) {
    return { props: { jobId, initialJob: null } };
  }
};
