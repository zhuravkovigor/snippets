import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      await delay((attempt + 1) * 1000); // Delay increases with each retry
    }
  }

  throw new Error("Failed to fetch after multiple attempts");
}

export default refetch;
