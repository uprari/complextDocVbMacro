// pages/index.js or your component
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    name: 'Item A',
    details: [
      { label: 'Toys', list: ['Train Set', 'Remote Control Car'] },
      { label: 'Books', list: ['Harry Potter', 'Atomic Habits'] },
    ],
  },
  {
    id: 2,
    name: 'Item B',
    details: [
      { label: 'Games', list: ['Chess', 'Monopoly'] },
      { label: 'Tools', list: ['Hammer', 'Screwdriver'] },
    ],
  },
];

export default function DataGridWithPopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);

  const handleMouseEnter = (event, row) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(row);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setPopoverContent(null);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'info',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onMouseEnter={(e) => handleMouseEnter(e, params.row)}
          onMouseLeave={handleMouseLeave}
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 400, width: '100%', padding: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
        />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          onMouseEnter: () => {}, // Keeps open if hovered
          onMouseLeave: handleMouseLeave,
          sx: { pointerEvents: 'auto', p: 2, maxWidth: 300 },
        }}
      >
        {popoverContent?.details?.map((section, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {section.label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {section.list.map((item, i) => (
                <Chip key={i} label={item} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        ))}
      </Popover>
    </>
  );
}

