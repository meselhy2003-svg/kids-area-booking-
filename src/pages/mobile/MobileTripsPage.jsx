import React from 'react';
import DesktopTripsPage from '../desktop/DesktopTripsPage';

export default function MobileTripsPage(props) {
  // MobileTripsPage wraps DesktopTripsPage with full mobile responsive layouts and controls
  return <DesktopTripsPage {...props} />;
}
