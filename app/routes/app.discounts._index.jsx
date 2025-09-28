import { authenticateExtra } from "../config/shopify.js";
import { json } from "@remix-run/node";
import Discounts from "../components/discounts/index.jsx";
import { VolumeDiscountModel } from "../models/volumeDiscount.model.js";
import { Discount } from "../entities/discount"; 

export const loader = async ({ request }) => {
  const { metaobject } = await authenticateExtra(request);

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limit = 10; // You can adjust this or make it dynamic
  const volumeDiscounts = await metaobject.list(VolumeDiscountModel, limit, cursor);
  
  return json({
    volumeDiscounts
  });  

};



export async function action({request}) {
  const {metaobject} = await authenticateExtra(request)
  let formData = await request.json();

  if (formData.deleteObject) {
    await metaobject.delete(formData.objectId)
    return json({
      status: {
        success: true,
        message: "Discount Deleted Successfully"
      }
    })
  }

}

export default function DiscountsPage() {
  return <Discounts/>;
}

