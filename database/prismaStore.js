const prisma = require("./prisma");
const pg = require("./pg");

const READ_DELAY_MS = Number(process.env.READ_DELAY_MS) || 2000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAll() {
  await delay(READ_DELAY_MS);
  return prisma.product.findMany({ orderBy: { id: "asc" } });
}

async function getById(id) {
  await delay(READ_DELAY_MS);
  return prisma.product.findUnique({ where: { id } });
}

async function create(product) {
  return prisma.product.create({
    data: {
      name: product.name,
      price: product.price,
    },
  });
}

async function update(id, product) {
  try {
    return await prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        price: product.price,
      },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
}

async function patch(id, updates) {
  const data = {};
  if (updates.name !== undefined) {
    data.name = updates.name;
  }
  if (updates.price !== undefined) {
    data.price = updates.price;
  }

  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
}

async function remove(id) {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err.code === "P2025") {
      return null;
    }
    throw err;
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
  ping: pg.ping,
  countProducts: pg.countProducts,
};
