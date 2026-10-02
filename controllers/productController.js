const productService = require("../services/productService");

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateProduct(body, { partial = false } = {}) {
  if (!body || typeof body !== "object") {
    return "Request body is required";
  }

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return "name must be a non-empty string";
    }
  }

  if (!partial || body.price !== undefined) {
    if (typeof body.price !== "number" || Number.isNaN(body.price)) {
      return "price must be a number";
    }
  }

  return null;
}

async function getAll(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to read products" });
  }
}

async function getById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to read product" });
  }
}

async function create(req, res) {
  try {
    const error = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const created = await productService.createProduct({
      name: req.body.name.trim(),
      price: req.body.price,
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
}

async function update(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const error = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const updated = await productService.updateProduct(id, {
      name: req.body.name.trim(),
      price: req.body.price,
    });
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
}

async function patch(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const error = validateProduct(req.body, { partial: true });
    if (error) {
      return res.status(400).json({ error });
    }

    const payload = {};
    if (req.body.name !== undefined) {
      payload.name = req.body.name.trim();
    }
    if (req.body.price !== undefined) {
      payload.price = req.body.price;
    }

    const patched = await productService.patchProduct(id, payload);
    if (!patched) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(patched);
  } catch (err) {
    res.status(500).json({ error: "Failed to patch product" });
  }
}

async function remove(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
};
