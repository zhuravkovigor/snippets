import { useSearchParams } from "react-router-dom";

type Params = {
  [key: string]: string | undefined;
};

type SearchParamsFunc = (
  updater: Params | ((prev: Params) => Params),
  options?: { replace?: boolean }
) => void;

export function useCustomSearchParams(): [Params, SearchParamsFunc] {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: Params = Object.fromEntries(searchParams.entries());

  function setParams(
    updater: Params | ((prev: Params) => Params),
    options: { replace?: boolean } = { replace: false }
  ) {
    const newParams: Params =
      typeof updater === "function" ? updater(params) : updater;

    // Create a new URLSearchParams object to avoid mutating the original
    const updatedSearchParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        updatedSearchParams.delete(key);
      } else {
        updatedSearchParams.set(key, value);
      }
    });

    const updatedSearchString = updatedSearchParams.toString();
    const newUrl = `${window.location.pathname}${
      updatedSearchString ? "?" + updatedSearchString : ""
    }${window.location.hash}`;

    if (options.replace) {
      window.history.replaceState(null, "", newUrl);
    } else {
      window.history.pushState(null, "", newUrl);
    }

    // Update the searchParams state
    setSearchParams(updatedSearchParams);
  }

  return [params, setParams];
}

// Example usage of useCustomSearchParams hook
// const SearchComponent: React.FC = () => {
//   const [params, setParams] = useCustomSearchParams();

//   const updateSearchParams = () => {
//     setParams((prev) => ({ ...prev, page: "1" }));
//   };

//   return (
//     <div>
//       <button onClick={updateSearchParams}>Update Search Params</button>
//       <div>Current Query: {params.query}</div>
//       <div>Current Page: {params.page}</div>
//     </div>
//   );
// };

// export default SearchComponent;
