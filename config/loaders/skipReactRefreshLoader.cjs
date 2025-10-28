const REFRESH_SKIP_PRAGMA = '/* @refresh skip */';

module.exports = function skipReactRefreshLoader(source) {
  if (typeof source !== 'string') {
    return source;
  }

  if (source.startsWith(REFRESH_SKIP_PRAGMA)) {
    return source;
  }

  return `${REFRESH_SKIP_PRAGMA}\n\n${source}`;
};
