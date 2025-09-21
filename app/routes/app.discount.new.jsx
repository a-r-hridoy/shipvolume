import { json } from "@remix-run/react"
import { DiscountForm } from "../components/discounts/discountForm.jsx"
import { authenticateExtra } from "../config/shopify";
import { VolumeDiscountModel }  from "../models/volumeDiscount.model.js"


export const loader = async ({ request }) => {
  const { admin } = await authenticateExtra(request);
  return json({})
}

export const action = async ({ request }) => {
  const { admin, metaobject } = await authenticateExtra(request);
  let formData = await request.json();
  if (formData.saveDiscount){
    await saveDiscount(formData, metaobject);
  }

  return json({});
}

export default function NewDiscountPage(){
  return <DiscountForm />
}


// Helper Function
async function saveDiscount(formData, metaobject){

  const newData = {
    title: formData.title,
    products_reference: JSON.stringify(formData.products.flatMap(g => (g.variants.map(v => v.id)))),
    products: JSON.stringify(formData.products),
    discountValues: JSON.stringify(formData.discountValues),
    isActive: formData.isActive ? 'true' : 'false',
    combinesWith: JSON.stringify(formData.combinesWith),
    createdAt: new Date().toISOString(),

  }

  try {
    // Check if the MetaObject definition already exists
    let definition;
    try {
      definition = await metaobject.getDefinition({
        type: VolumeDiscountModel.type,
      });
    } catch (error) {
      // If the definition doesn't exist, create it
      if (error.message.includes("No definition found")) {
        await metaobject.define(VolumeDiscountModel);
      } else {
        throw error; // Re-throw if it's a different error
      } 
    }

    // Now proceed with create or update
    if (formData.id) {
      await metaobject.update(VolumeDiscountModel, formData.id, newData);
    } else {
      await metaobject.create(VolumeDiscountModel, newData);
    }
  } catch (e) {
    console.error("Error saving features:", e);
    return json(
      {
        status: {
          success: false,
          message: `Error saving features: ${e.message}`,
        },
      },
      { status: 400 },
    );
  }
}
