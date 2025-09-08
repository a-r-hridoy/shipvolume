import { Layout, Button, EmptyState, Card } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";

export default function Discounts() {
  const { settingsData } = useLoaderData();

  return (
    <PageLayout showBackButton title="Discounts" primaryAction={<Button variant="primary" url='/app/new-discount'>New Discount</Button>}>
      <PageTitleBar title="Discounts" />
        <Card>
          <EmptyState
            heading="Manage your Discounts"
            action={{content: 'Add discount', url: '/app/new-discount'}}
            secondaryAction={{
              content: 'Learn more',
              url: 'https://help.shopify.com',
            }}
            image="https://cdn.shopify.com/b/shopify-guidance-dashboard-public/m66z0a57ues1gygrane8proz6gqn.svgz"
          >
            <p>Create discounts for your products and colleciton</p>
          </EmptyState>
        </Card>
    </PageLayout>
  );
}
