const cache = new Map(); // url -> Promise<string> of the SVG's text

// Downloads an SVG file's text once; later calls reuse it.
export function fetchSvg(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`Couldn't load ${url} (${res.status})`);
        return res.text();
      })
    );
  }
  return cache.get(url);
}
