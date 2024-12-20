import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function refetch<T>(
  config: AxiosRequestConfig,
  retries: number = 3
): Promise<T> {
  let response: AxiosResponse<T>;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      response = await axios<T>(config);
      return response.data;
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

// Define the type for the response data
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Example usage of the refetch function with JSONPlaceholder
async function fetchData() {
  const config: AxiosRequestConfig = {
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
  };

  try {
    const data = await refetch<Post>(config);
    console.log("Data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
