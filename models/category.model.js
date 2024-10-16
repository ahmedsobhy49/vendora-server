import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to another category
    default: null, // Parent category is optional (null for top-level categories)
  },
  image: {
    type: String,
    validate: {
      validator: function (value) {
        // If there's no parent category, the image field is required
        return !!this.parentCategoryId || (!!value && value.length > 0);
      },
      message: "Image is required for categories without a parent category",
    },
  },
});

categorySchema.set("timestamps", true);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
