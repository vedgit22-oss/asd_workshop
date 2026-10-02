const cacheStore = require("../services/cacheStore");

function cacheKey(req) {
  return `${req.method}:${req.originalUrl}`;
}

function cacheGet(req, res, next) {
  const key = cacheKey(req);
  const cached = cacheStore.get(key);

  if (cached) {
    res.set("X-Cache", "HIT");
    res.set("X-Cache-Created-At", new Date(cached.createdAt).toISOString());
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cacheStore.set(key, body);
      const fresh = cacheStore.get(key);
      if (fresh) {
        res.set("X-Cache-Created-At", new Date(fresh.createdAt).toISOString());
      }
    }
    res.set("X-Cache", "MISS");
    return originalJson(body);
  };

  next();
}

function invalidateOnSuccess(req, res, next) {
  const originalJson = res.json.bind(res);
  const originalSendStatus = res.sendStatus.bind(res);

  function maybeInvalidate() {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cacheStore.invalidateAll();
    }
  }

  res.json = (body) => {
    maybeInvalidate();
    return originalJson(body);
  };

  res.sendStatus = (status) => {
    res.status(status);
    maybeInvalidate();
    return originalSendStatus(status);
  };

  next();
}

module.exports = {
  cacheGet,
  invalidateOnSuccess,
};
