module.exports = {
    resolve: {
      fallback: {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
      }
    }
  };
  