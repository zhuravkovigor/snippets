document.addEventListener("alpine:init", () => {
  const cache = {};
  const cacheTimers = {};
  const CACHE_TIMEOUT_DURATION = 2 * 60 * 1000; // 2 minutes

  const router = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);

    handleLocation();
  };

  const routes = {
    "/": "/pages/index.html",
    "/post/:id": "/pages/post.html", // Define a route for posts
    404: "/pages/error.html",
  };

  const handleLocation = async () => {
    const path = window.location.pathname;
    const queryParams = new URLSearchParams(window.location.search);
    const route = matchRoute(path) || routes[404];

    Alpine.store("pageName", path);
    Alpine.store("queryParams", Object.fromEntries(queryParams.entries()));

    // Extract parameters if the route matches
    const params = extractParams(path);
    if (params) {
      Alpine.store("params", params);
    }

    if (cache[path]) {
      document.getElementById("content").innerHTML = cache[path];
      resetCacheTimer(path);
    } else {
      const html = await fetch(route).then((data) => data.text());
      cache[path] = html;
      document.getElementById("content").innerHTML = html;
      setCacheTimer(path);
    }
  };

  const matchRoute = (path) => {
    for (const route in routes) {
      const regex = new RegExp(route.replace(/:\w+/g, '(\\w+)'));
      if (regex.test(path)) {
        return route;
      }
    }
    return null;
  };

  const extractParams = (path) => {
    const params = {};
    for (const route in routes) {
      const regex = new RegExp(route.replace(/:\w+/g, '(\\w+)'));
      const match = path.match(regex);
      if (match) {
        const keys = route.match(/:(\w+)/g);
        if (keys) {
          keys.forEach((key, index) => {
            params[key.substring(1)] = match[index + 1]; // Remove ':' from key
          });
        }
        return params;
      }
    }
    return null;
  };

  const setCacheTimer = (path) => {
    if (cacheTimers[path]) {
      clearTimeout(cacheTimers[path]);
    }
    cacheTimers[path] = setTimeout(() => {
      delete cache[path];
      delete cacheTimers[path];
    }, CACHE_TIMEOUT_DURATION);
  };

  const resetCacheTimer = (path) => {
    clearTimeout(cacheTimers[path]);
    setCacheTimer(path);
  };

  addEventListener("popstate", handleLocation);
  window.router = router;

  handleLocation();
});

// example use
// <a href="/" onclick="router()">Home</a>
// <a href="/about" onclick="router()">About</a> //
// <div id="content">...</div>
