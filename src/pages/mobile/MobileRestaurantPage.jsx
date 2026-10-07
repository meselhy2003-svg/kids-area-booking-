import React from 'react';
import DesktopRestaurantPage from '../desktop/DesktopRestaurantPage';

export default function MobileRestaurantPage(props) {
  // MobileRestaurantPage wraps DesktopRestaurantPage with responsive mobile-friendly controls
  return <DesktopRestaurantPage {...props} />;
}
