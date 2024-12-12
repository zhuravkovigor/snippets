import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

async function refetch(
  config: AxiosRequestConfig,
  retries: number = 3
): Promise<AxiosResponse> {
  let response: AxiosResponse;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      response = await axios(config);
      return response;
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
    }
  }

  throw new Error("Failed to fetch after multiple attempts");
}

export default refetch;
