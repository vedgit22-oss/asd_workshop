const express = require("express");
const productController = require("../controllers/productController");
const { cacheGet, invalidateOnSuccess } = require("../middleware/cache");

const router = express.Router();

router.get("/", cacheGet, productController.getAll);
router.get("/:id", cacheGet, productController.getById);
router.post("/", invalidateOnSuccess, productController.create);
router.put("/:id", invalidateOnSuccess, productController.update);
router.patch("/:id", invalidateOnSuccess, productController.patch);
router.delete("/:id", invalidateOnSuccess, productController.remove);

module.exports = router;
