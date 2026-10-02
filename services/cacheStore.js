const bus = require("../events/bus");

const TTL_MS = Number(process.env.CACHE_TTL_MS) || 60 * 1000;
const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.createdAt >= TTL_MS) {
    store.delete(key);
    return null;
  }

  return entry;
}

function set(key, data) {
  store.set(key, {
    data,
    createdAt: Date.now(),
  });
}

function invalidateAll() {
  store.clear();
}

bus.on("data:changed", invalidateAll);

module.exports = {
  TTL_MS,
  get,
  set,
  invalidateAll,
};
