import axios from "axios";
import Job from "../../common/interfaces/Job.interface";

export default async function fetchJobById(jobId: string): Promise<Job> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/jobs/${jobId}`
    );

    return response.data;
  } catch (err) {
    if (err.response?.status === 404) window.location.href = "/404";
    throw err;
  }
}
