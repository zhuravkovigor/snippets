import { useRouter, useSearchParams } from "next/navigation";

type Params = {
  [key: string]: string | undefined; // Define the type for the parameters
};

type SearchParamsFunc = (
  updater: Params | ((prev: Params) => Params),
  options?: { replace: boolean }
) => void;

/**
 * Custom hook to manage search parameters in the URL
 * @returns An array with the parameters object and a function to set parameters
 * @example
 * const [params, setParams] = useCustomSearchParams();
 * const id = params.id;
 * setParams({ id: "123" });
 * setParams((prev) => ({ ...prev, id: "123" }));
 */
export function useCustomSearchParams(): [Params, SearchParamsFunc] {
  const search = useSearchParams();
  const router = useRouter();

  // Convert the search string to a URLSearchParams object
  const searchParams = new URLSearchParams(search.toString());

  // Create an object to hold the parameters
  const params: Params = {};

  // Populate the params object with key-value pairs from the searchParams
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Function to set parameters
  function setParams(
    updater: Params | ((prev: Params) => Params),
    options: { replace: boolean } = { replace: false }
  ) {
    // Create a new object based on the current params
    const newParams: Params =
      typeof updater === "function" ? updater(params) : updater;

    // Update the searchParams with new parameters
    Object.entries(newParams).forEach(([key, value]) => {
      // Remove the parameter if the value is undefined or an empty string
      if (value === undefined || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value); // Set or update the parameter
      }
    });

    // Check if searchParams is empty after updates
    const updatedSearchString = searchParams.toString();

    // Update the URL with the new search parameters
    if (updatedSearchString) {
      const newUrl = `${window.location.pathname}?${updatedSearchString}${window.location.hash}`;
      if (options.replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    } else {
      // If there are no search parameters, navigate to the path without query
      const newUrl = `${window.location.pathname}${window.location.hash}`;
      if (options.replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    }
  }

  return [params, setParams];
}
