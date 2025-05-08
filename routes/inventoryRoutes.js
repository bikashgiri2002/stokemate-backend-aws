import express from "express";
import Inventory from "../models/inventoryModel.js";
import Warehouse from "../models/warehouseModel.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Add a Product to Inventory (Protected)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { warehouseId, productName, sku, quantity, price, category } =
      req.body;

    // Check if the warehouse belongs to the shop
    const warehouse = await Warehouse.findOne({
      _id: warehouseId,
      shopId: req.shop._id,
    });
    if (!warehouse)
      return res
        .status(403)
        .json({ message: "Unauthorized: Warehouse not found" });

    const inventory = await Inventory.create({
      shopId: req.shop._id,
      warehouseId,
      productName,
      sku,
      quantity,
      price,
      category,
    });

    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * ✅ Delete a Product from Inventory (Protected)
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const inventoryItem = await Inventory.findOne({
      _id: req.params.id,
      shopId: req.shop._id,
    });

    if (!inventoryItem)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    await inventoryItem.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * ✅ Update Inventory Quantity (Protected)
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const inventoryItem = await Inventory.findOne({
      _id: req.params.id,
      shopId: req.shop._id,
    });
    if (!inventoryItem)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    inventoryItem.quantity = quantity;
    await inventoryItem.save();

    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * ✅ Update Inventory Product Price (Protected)
 */
router.patch("/:id/price", protect, async (req, res) => {
  try {
    const { price } = req.body;

    if (price == null || isNaN(price)) {
      return res.status(400).json({ message: "Invalid price provided" });
    }

    const inventoryItem = await Inventory.findOne({
      _id: req.params.id,
      shopId: req.shop._id,
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    inventoryItem.price = price;
    await inventoryItem.save();

    res.json({
      message: "Product price updated successfully",
      updatedItem: inventoryItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * ✅ Get All Inventory for a Shop (Protected)
 */
router.get("/", protect, async (req, res) => {
  try {
    const inventory = await Inventory.find({ shopId: req.shop._id });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

/**
 * ✅ Bulk Update Inventory Quantities (Protected)
 */
router.patch("/update-quantities", protect, async (req, res) => {
  try {
    const updates = req.body.updates; // Array of { id, quantity }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const updatePromises = updates.map(async ({ id, quantity }) => {
      const inventoryItem = await Inventory.findOne({
        _id: id,
        shopId: req.shop._id,
      });
      if (inventoryItem) {
        inventoryItem.quantity = quantity;
        return inventoryItem.save();
      }
      return null;
    });

    const updatedItems = (await Promise.all(updatePromises)).filter(Boolean);

    res.json({
      message: "Inventory quantities updated successfully",
      updatedItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
