import React from 'react';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <div className="p-6">{children}</div>}
    </div>
  );
}

export default TabPanel;