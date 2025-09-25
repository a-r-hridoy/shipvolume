import { json , redirect} from "@remix-run/react"
import { DiscountForm } from "../components/discounts/discountForm.jsx"
import { authenticateExtra } from "../config/shopify";
import { VolumeDiscountModel } from "../models/volumeDiscount.model.js"
import {Discount} from '../entities/discount.js'


export const loader = async ({request}) => {
  const {admin} = await authenticateExtra(request);

  return json({});
};

export const action = async ({request}) => {
  const {admin, metaobject} = await authenticateExtra(request)
  const formData = await request.json();

  if (formData.saveDiscount) {
    try {

      const newDiscount = await saveDiscount(admin, formData, metaobject)
      return redirect(`/app/discounts/edit/${newDiscount.id.split("/").pop()}`)

    } catch (error) {
      return json({
        status: {
          success: false,
          message: `Error saving discount: ${error.message}`
        }
      }, {status: 400})
    }
  }
  return json({});
};

export default function NewDiscountPage() {
  return <DiscountForm/>;
}


// helper Function
async function saveDiscount(admin, formData, metaobject) {

  const formattedDiscountValues = formData.discountValues.map(discount => ({
    discount_message: discount.discount_message,
    discount_type: discount.discount_type,
    quantity: discount.quantity,
    discount: discount.discount
  }));

  try {

    const discount = new Discount(admin);

    const result = await discount.createAutomatic({
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

    console.log('Shopify App Function >>>>>>>>')
    console.log(result)


    const newData = {
      title: formData.title,
      discountId: result.discountId,
      products_reference: JSON.stringify(formData.products.flatMap(g => (g.variants.map(v => v.id)))),
      products: JSON.stringify(formData.products),
      discountValues: JSON.stringify(formData.discountValues),
      isActive: formData.isActive ? 'true' : 'false',
      combinesWith: JSON.stringify(formData.combinesWith),
      createdAt: new Date().toISOString()
    };


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
      await metaobject.update(VolumeDiscountModel, newData.id, formData);
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
      {status: 400},
    );
  }
}