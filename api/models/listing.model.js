import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Listing name is required"],
      trim: true,
      minlength: [10, "Listing name must be at least 10 characters"],
      maxlength: [62, "Listing name cannot exceed 62 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
      min: [50, "Regular price must be at least 50"],
      max: [1000000, "Regular price cannot exceed 1,000,000"],
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
      max: [1000000, "Discount price cannot exceed 1,000,000"],
    },

    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [1, "Bedrooms must be at least 1"],
      max: [10, "Bedrooms cannot exceed 10"],
    },

    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [1, "Bathrooms must be at least 1"],
      max: [10, "Bathrooms cannot exceed 10"],
    },

    furnished: {
      type: Boolean,
      default: false,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      required: [true, "Listing type is required"],
      enum: {
        values: ["rent", "sale"],
        message: "Listing type must be either rent or sale",
      },
    },

    offer: {
      type: Boolean,
      default: false,
    },

    imageUrls: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0 && value.length <= 6;
        },
        message: "A listing must have between 1 and 6 images",
      },
    },

    userRef: {
      type: String,
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true }
);

listingSchema.pre("validate", function (next) {
  if (this.offer && this.discountPrice >= this.regularPrice) {
    this.invalidate(
      "discountPrice",
      "Discount price must be lower than regular price"
    );
  }

  if (!this.offer) {
    this.discountPrice = 0;
  }

  next();
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;