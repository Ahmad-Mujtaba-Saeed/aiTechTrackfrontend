import React from 'react';
import SidebarLayout from './SidebarLayout';

/**
 * Professional — dark slate sidebar, square photo, skill meters.
 * The most conservative of the two-column designs.
 */
export default function Professional({ resume, theme }) {
  return <SidebarLayout resume={resume} theme={theme} skillVariant="bars" photoRadius={3} />;
}
