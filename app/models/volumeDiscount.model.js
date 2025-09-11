export const VolumeDiscountModel = {
  name: "Volume Discount",
  type: "$app:volumeDiscount",
  access: {
    admin: "MERCHANT_READ_WRITE",
    storefront: "PUBLIC_READ",
  },
  fieldDefinitions: [
    { name: "Title", key: "title", type: "single_line_text_field" },
    { name: "Products reference", key: "products_reference", type: "list.variant_reference" },
    { name: "Products", key: "products", type: "json" },
    { name: "Discount Values", key: "discountValues", type: "json" },
    { name: "Is active", key: "isActive", type: "boolean" },
    { name: "Combines with", key: "combinesWith", type: "json" },
    { name: "Created at", key: "createdAt", type: "date_time" }
  ],
};
