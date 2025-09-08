import {
  Card,
  Tabs,
  TextField,
  BlockStack,
  Collapsible,
  Text,
  InlineGrid,
  Box,
  ResourceList,
  ResourceItem,
} from "@shopify/polaris";
import PageLayout from "../shared/pageLayout";
import { PageTitleBar } from "../shared/pageTitleBar";
import { faqData } from "./faqData";
import { useCallback, useState } from "react";

export const NewDiscount = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  const handleSearchChange = useCallback((value) => setSearchValue(value), []);

  const toggleQuestion = useCallback((id) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const categories = [
    "All",
    ...[...new Set(faqData?.map((item) => item.category) || [])],
  ];

  const tabs = categories.map((category, index) => ({
    id: `category-${index}`,
    content: category,
    accessibilityLabel: `${category} category`,
    panelID: `category-panel-${index}`,
  }));

  const filteredFAQs = (faqData || []).filter(
    (item) =>
      (selectedTab === 0 || item.category === categories[selectedTab]) &&
      (item.question.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchValue.toLowerCase())),
  );

  return (
    <PageLayout showBackButton title="New Discount">
    </PageLayout>
  );
};
