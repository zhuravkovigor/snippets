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
    404: "/pages/error.html",
  };

  const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];

    Alpine.store("pageName", path);

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
