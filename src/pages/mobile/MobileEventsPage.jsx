import React from 'react';
import DesktopEventsPage from '../desktop/DesktopEventsPage';

export default function MobileEventsPage(props) {
  // MobileEventsPage uses DesktopEventsPage with fully responsive CSS
  return <DesktopEventsPage {...props} />;
}
