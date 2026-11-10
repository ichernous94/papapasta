// Next compiles static image imports; SSR tests only need their metadata.
require.extensions['.png'] = (module, filename) => {
  module.exports = { src: `/images/${filename.split('/').pop()}`, width: 1020, height: 1430, blurDataURL: 'data:image/png;base64,AA==' };
};
