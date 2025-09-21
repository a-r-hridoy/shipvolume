import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DiscountForm } from "../components/discounts/discountForm.jsx"
import { authenticateExtra } from "../config/shopify";
import { VolumeDiscountModel } from "../models/volumeDiscount.model";


// export const loader = async ({ params, request }) => {
//     const { metaobject } = await authenticateExtra(request);
//     const discountId = `gid://shopify/Metaobject/${params.id}`;

//     try {
//         const discountData = await metaobject.find(VolumeDiscountModel, discountId);

//         // Parse JSON strings back into objects
//         const parsedData = {
//             ...discountData,
//             products: JSON.parse(discountData.products),
//             discountValues: JSON.parse(discountData.discountValues),
//             combinesWith: JSON.parse(discountData.combinesWith),
//             isActive: discountData.isActive === 'true',
//         };

//         return json(parsedData);
//     } catch (error) {
//         console.error("Error loading discount data:", error);
//         return json({ error: "Failed to load discount data" }, { status: 500 });
//     }
// };

function safeParse(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value; // fallback if string isn't valid JSON
    }
  }
  return value; // already an object/array
}

export const loader = async ({ params, request }) => {
  const { metaobject } = await authenticateExtra(request);
  const discountId = `gid://shopify/Metaobject/${params.id}`;

  try {
    const discountData = await metaobject.find(VolumeDiscountModel, discountId);

    const parsedData = {
      ...discountData,
      products: safeParse(discountData.products),
      discountValues: safeParse(discountData.discountValues),
      combinesWith: safeParse(discountData.combinesWith),
      isActive: discountData.isActive === "true" || discountData.isActive === true,
    };

    return json(parsedData);
  } catch (error) {
    console.error("Error loading discount data:", error);
    return json({ error: "Failed to load discount data" }, { status: 500 });
  }
};


export const action = async ({ request }) => {
    const { metaobject } = await authenticateExtra(request);
    let formData = await request.json();

    if (formData.updateDiscount) {
        try {
            await updateDiscount(formData, metaobject);
            return json({ succes: true, message: "Discount updated successfully" });
        } catch (error) {
            console.error("Error updating discount:", error);
            return json({ error: "Failed to update discount" }, { status: 500 });
        }
    }

    return json({});
};

export default function EditDiscountPage() {
    const loaderData = useLoaderData();

    if (loaderData.error) {
        return <div>Error: {loaderData.error}</div>;
    }

    return <DiscountForm isEditing={true} />;
}

//helper function
async function updateDiscount(formData, metaobject) {
    const newData = {
        title: formData.title,
        products_reference: JSON.stringify(formData.products.flatMap(g => g.variants.map(v => v.id))),
        products: JSON.stringify(formData.products),
        discountValues: JSON.stringify(formData.discountValues),
        isActive: formData.isActive ? 'true' : 'false',
        combinesWith: JSON.stringify(formData.combinesWith),
        createdAt: formData.createdAt || "",
    };

    await metaobject.update(VolumeDiscountModel, formData.id, newData);
}