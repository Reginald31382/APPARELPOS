import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: null,
    },
    cost: {
      type: Number,
      min: 0,
      default: null,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      default: "",
    },

    supplierVariantId: {
      type: String,
      default: "",
      trim: true,
    },

    supplierSku: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Unisex",
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    cost: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    variants: [variantSchema],

    fulfillmentType: {
      type: String,
      enum: ["InHouse", "PrintOnDemand", "Dropship"],
      default: "InHouse",
      index: true,
    },

    supplier: {
      name: {
        type: String,
        default: "",
        trim: true,
      },

      productId: {
        type: String,
        default: "",
        trim: true,
      },

      syncEnabled: {
        type: Boolean,
        default: false,
      },
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
    soldOut: {
      type: Boolean,
      default: false,
    },

    recommendedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "variants.sku": 1 });

export default mongoose.model("Product", productSchema);
