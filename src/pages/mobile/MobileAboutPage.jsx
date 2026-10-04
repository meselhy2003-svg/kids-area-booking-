import React from 'react';
import DesktopAboutPage from '../desktop/DesktopAboutPage';

export default function MobileAboutPage(props) {
  // MobileAboutPage wraps DesktopAboutPage with fully responsive layout
  return <DesktopAboutPage {...props} />;
}
