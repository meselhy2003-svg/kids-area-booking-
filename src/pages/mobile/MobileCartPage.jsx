import React from 'react';
import DesktopCartPage from '../desktop/DesktopCartPage';

export default function MobileCartPage(props) {
  // MobileCartPage wraps DesktopCartPage with fully responsive layout
  return <DesktopCartPage {...props} />;
}
