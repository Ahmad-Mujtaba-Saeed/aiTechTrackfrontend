import React from 'react';
import SidebarLayout from './SidebarLayout';

/**
 * Modern — blue sidebar with a circular photo and skill meters.
 */
export default function Modern({ resume, theme }) {
  return <SidebarLayout resume={resume} theme={theme} skillVariant="bars" />;
}
