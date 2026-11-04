// CSS Modules are compiled by Next.js. SSR unit tests only need stable class names.
require.extensions['.scss'] = (module) => {
  module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : String(key) });
};
