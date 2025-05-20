import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, Button, Typography, IconButton, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import Head from 'next/head';

const Home = () => {
  // Sample data for main DataGrid
  const [rows] = useState([
    { id: 1, name: 'John Doe', user_id: 'user1' },
    { id: 2, name: 'Jane Smith', user_id: 'user2' },
  ]);

  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [associationsData, setAssociationsData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newAssociation, setNewAssociation] = useState({
    club_name: '',
    activity_name: '',
    roles: '',
  });
  const [formError, setFormError] = useState(null);

  // Fetch associations data
  const fetchAssociations = async (userId) => {
    try {
      const response = await axios.get(`https://domain.com/associations/${userId}/`);
      setAssociationsData(response.data);
    } catch (error) {
      console.error('Error fetching associations:', error);
      // Fallback mock data
      setAssociationsData({
        associations: [
          {
            association_id: 'uuid1',
            club_name: 'Trinetra',
            activities: [
              {
                activity_name: 'Hiking',
                roles: ['Leader', 'Follower', 'Server'],
              },
            ],
            no_of_activities: 1,
          },
        ],
        no_of_associations: 1,
      });
    }
  };

  // Handle icon click to open main dialog
  const handleIconClick = (userId) => {
    setSelectedUserId(userId);
    fetchAssociations(userId);
    setOpen(true);
  };

  // Handle main dialog close
  const handleClose = () => {
    setOpen(false);
    setAssociationsData(null);
    setSelectedUserId(null);
  };

  // Handle add dialog open
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
    setNewAssociation({ club_name: '', activity_name: '', roles: '' });
    setFormError(null);
  };

  // Handle add dialog close
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewAssociation({ club_name: '', activity_name: '', roles: '' });
    setFormError(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssociation((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add association submission
  const handleAddAssociation = async () => {
    if (!newAssociation.club_name || !newAssociation.activity_name || !newAssociation.roles) {
      setFormError('All fields are required');
      return;
    }

    try {
      const payload = {
        club_name: newAssociation.club_name,
        activities: [
          {
            activity_name: newAssociation.activity_name,
            roles: newAssociation.roles.split(',').map((role) => role.trim()),
          },
        ],
        no_of_activities: 1,
      };

      await axios.post(`https://domain.com/associations/${selectedUserId}/`, payload);
      // Refresh associations data
      if (selectedUserId) {
        await fetchAssociations(selectedUserId);
      }
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding association:', error);
      setFormError('Failed to add association. Please try again.');
    }
  };

  // Main DataGrid columns
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleIconClick(params.row.user_id)}
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

  // Dialog DataGrid columns
  const associationColumns = [
    { field: 'club_name', headerName: 'Club Name', width: 150 },
    {
      field: 'activity_name',
      headerName: 'Activity',
      width: 150,
      valueGetter: (params) => params.row.activities.map((act) => act.activity_name).join(', '),
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 200,
      valueGetter: (params) => params.row.activities[0]?.roles.join(', ') || '',
    },
    { field: 'no_of_activities', headerName: 'No. of Activities', width: 150 },
  ];

  return (
    <>
      <Head>
        <title>DataGrid with Associations Dialog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="p-4">
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
        </div>

        {/* Main Associations Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Associations for User {selectedUserId}</DialogTitle>
          <DialogContent>
            {associationsData?.no_of_associations === 0 ? (
              <div className="flex flex-col items-center py-4">
                <Typography>No associations found</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddDialogOpen}
                  className="mt-4"
                >
                  Add Association
                </Button>
              </div>
            ) : (
              <div className="py-4">
                <div style={{ height: 300, width: '100%' }}>
                  <DataGrid
                    rows={associationsData?.associations || []}
                    columns={associationColumns}
                    getRowId={(row) => row.association_id}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddDialogOpen}
                  className="mt-4"
                >
                  Add Association
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Association Dialog */}
        <Dialog open={addDialogOpen} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Association</DialogTitle>
          <DialogContent>
            <div className="flex flex-col gap-4 py-4">
              <TextField
                label="Club Name"
                name="club_name"
                value={newAssociation.club_name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Activity Name"
                name="activity_name"
                value={newAssociation.activity_name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Roles (comma-separated)"
                name="roles"
                value={newAssociation.roles}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="e.g., Leader, Follower, Server"
              />
              {formError && (
                <Typography color="error" variant="body2">
                  {formError}
                </Typography>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddDialogClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAssociation}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Home;
