const db = require("../database");
const bus = require("../events/bus");

function getAllProducts() {
  return db.getAll();
}

function getProductById(id) {
  return db.getById(id);
}

async function createProduct(payload) {
  const created = await db.create(payload);
  bus.emit("data:changed", { action: "create", product: created });
  return created;
}

async function updateProduct(id, payload) {
  const updated = await db.update(id, payload);
  if (updated) {
    bus.emit("data:changed", { action: "update", product: updated });
  }
  return updated;
}

async function patchProduct(id, payload) {
  const patched = await db.patch(id, payload);
  if (patched) {
    bus.emit("data:changed", { action: "patch", product: patched });
  }
  return patched;
}

async function deleteProduct(id) {
  const deleted = await db.remove(id);
  if (deleted) {
    bus.emit("data:changed", { action: "delete", product: deleted });
  }
  return deleted;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
