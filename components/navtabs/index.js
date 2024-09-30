import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Box from '@mui/material/Box';

export default function IconTabs({ value, handleChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        sx={{
          '& .MuiTabs-flexContainer': {
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '300px',
          },
        }}
      >
        <Tab 
          icon={<PersonPinIcon />} 
          label="PROFILE"
          sx={{ minWidth: '120px' }}
        />
        <Tab 
          icon={<AccessTimeIcon />} 
          label="PENDING"
          sx={{ minWidth: '120px' }}
        />
      </Tabs>
    </Box>
  );
}