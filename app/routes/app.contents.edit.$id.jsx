import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DiscountForm } from "../components/discounts/discountForm";
import { authenticateExtra } from "../config/shopify";
import { VolumeDiscountModel } from "../models/volumeDiscount.model";
import { Discount } from "../entities/discount";

export const loader = async ({params, request}) => {
  const {admin, metaobject} = await authenticateExtra(request)
  const discountId = `gid://shopify/Metaobject/${params.id}`;
  try {
    const discountData = await metaobject.find(VolumeDiscountModel, discountId);

    const parsedData = {
      ...discountData,
      products: discountData.products,
      discountValues: discountData.discountValues,
      combinesWith: discountData.combinesWith,
      isActive: discountData.isActive,
    };
    // console.log("parsedData")
    // console.log('gid://shopify/DiscountAutomaticNode/2223588737214')
    return json(parsedData);

  } catch (error) {
    console.error("Error loading discount data:", error);
    return json({error: "Failed to load discount data"}, {status: 500});
  }

}

export async function action({request}) {
  const {admin, metaobject} = await authenticateExtra(request);
  let formData = await request.json();

  if (formData.updateDiscount) {
    const updatedDiscount = await updateDiscount(admin, formData, metaobject);
    
  }
  return json({});
}

export default function discountEditPage() {
  const loaderData = useLoaderData();
  if (loaderData.error) {
    return <div>Error: {loaderData.error}</div>;
  }
  return <DiscountForm isEditing={true}/>;
}


// Helper function
async function updateDiscount(admin, formData, metaobject) {
  const discount = new Discount(admin);


  const formattedDiscountValues = formData.discountValues.map(discount => ({
    discount_message: discount.discount_message,
    discount_type: discount.discount_type,
    quantity: discount.quantity,
    discount: discount.discount
  }));



  const result = await discount.updateAutomatic({
    id: formData.discountId,
    title: formData.title,
    functionId: process.env.SHOPIFY_VOLUME_DISCOUNT_ID,
    startsAt: new Date(),
    endsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    metafields: [
      {
        key: "function-configuration",
        namespace: "$app:volume-discount",
        type: "json",
        value : JSON.stringify({
          title: formData.title,
          discountValues: formattedDiscountValues,
          variants:formData.products.flatMap(g => (g.variants.map(v => v.id)))
        })
      }
    ],
    combinesWith: formData.combinesWith
  })


  const newData = {
    title: formData.title,
    discountId: formData.discountId,
    products_reference: JSON.stringify(formData.products.flatMap(g => (g.variants.map(v => v.id)))),
    products: JSON.stringify(formData.products),
    discountValues: JSON.stringify(formData.discountValues),
    isActive: formData.isActive ? 'true' : 'false',
    combinesWith: JSON.stringify(formData.combinesWith),
    createdAt: formData.createdAt || ''
  };


  if (formData.id) {
    await metaobject.update(VolumeDiscountModel, formData.id, newData);
  }

}

