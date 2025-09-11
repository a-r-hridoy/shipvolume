
import { Layout, Button, EmptyState, Card } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ShipReadyTable from "../shared/shipReadyTable";

export default function Discounts() {
  const { volumeDiscounts } = useLoaderData();

  const headings = [
    { title: 'Title' },
    { title: 'Status' },
    { title: 'Created At' },
    { title: 'Actions' },
  ];

  return (
    <PageLayout showBackButton title="Discounts" primaryAction={<Button variant="primary" url='/app/new-discount'>New Discount</Button>}>
      <PageTitleBar title="Discounts" />
      {volumeDiscounts.nodes.length < 1 ?(
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
      ) : (
          <ShipReadyTable
          data={volumeDiscounts}
          resourceName={{ singular: 'Volume Discount', plural: 'Volume Discounts' }}
          pagination={true}
          headings={headings}
          actions={true}
          />
      )}
    </PageLayout>
  );
}
