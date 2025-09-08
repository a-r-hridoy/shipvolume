import { json } from "@remix-run/react";
import { NewDiscount } from "../components/newDiscount";
import { authenticate } from "../config/shopify";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return json({});
};

export const action = async ({ request }) => {
  // todo handle the action only if needed!
};

export default function NewDiscountPage() {
  return <NewDiscount />;
}
