const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "db.json");
const READ_DELAY_MS = Number(process.env.READ_DELAY_MS) || 2000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readAll() {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeAll(products) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
}

function nextId(products) {
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
}

async function getAll() {
  await delay(READ_DELAY_MS);
  return readAll();
}

async function getById(id) {
  await delay(READ_DELAY_MS);
  const products = await readAll();
  return products.find((product) => product.id === id) || null;
}

async function create(product) {
  const products = await readAll();
  const created = {
    id: nextId(products),
    name: product.name,
    price: product.price,
  };
  products.push(created);
  await writeAll(products);
  return created;
}

async function update(id, product) {
  const products = await readAll();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  products[index] = {
    id,
    name: product.name,
    price: product.price,
  };
  await writeAll(products);
  return products[index];
}

async function patch(id, updates) {
  const products = await readAll();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  if (updates.name !== undefined) {
    products[index].name = updates.name;
  }
  if (updates.price !== undefined) {
    products[index].price = updates.price;
  }

  await writeAll(products);
  return products[index];
}

async function remove(id) {
  const products = await readAll();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [deleted] = products.splice(index, 1);
  await writeAll(products);
  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
};
