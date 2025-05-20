import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, Button, Typography, TextField, DialogActions, CircularProgress } from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';

const AssociationsDialog = ({ open, onClose, userId }) => {
  const [associationsData, setAssociationsData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAssociation, setNewAssociation] = useState({
    club_name: '',
    activity_name: '',
    roles: '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch associations data
  const fetchAssociations = async (userId) => {
    if (!userId) return;
    setLoading(true);
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
              {
                activity_name: 'Camping',
                roles: ['Organizer', 'Participant'],
              },
            ],
            no_of_activities: 2,
          },
        ],
        no_of_associations: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dialog opens or userId changes
  useEffect(() => {
    if (open && userId) {
      fetchAssociations(userId);
    } else {
      setAssociationsData(null);
    }
  }, [open, userId]);

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

      await axios.post(`https://domain.com/associations/${userId}/`, payload);
      await fetchAssociations(userId);
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding association:', error);
      setFormError('Failed to add association. Please try again.');
    }
  };

  // Transform associations data into rows with one activity per row
  const getActivityRows = () => {
    if (!associationsData?.associations) return [];
    return associationsData.associations.flatMap((assoc) =>
      assoc.activities.map((activity, index) => ({
        id: `${assoc.association_id}-${index}`, // Unique ID for each activity row
        association_id: assoc.association_id,
        club_name: assoc.club_name,
        activity_name: activity.activity_name,
        roles: activity.roles.join(', '),
        no_of_activities: assoc.no_of_activities,
      }))
    );
  };

  // Dialog DataGrid columns
  const associationColumns = [
    { field: 'club_name', headerName: 'Club Name', width: 150 },
    { field: 'activity_name', headerName: 'Activity', width: 150 },
    { field: 'roles', headerName: 'Roles', width: 200 },
    { field: 'no_of_activities', headerName: 'No. of Activities', width: 150 },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Associations for User {userId || 'Unknown'}</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <CircularProgress />
            </div>
          ) : associationsData?.no_of_associations === 0 ? (
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
                  rows={getActivityRows()}
                  columns={associationColumns}
                  getRowId={(row) => row.id}
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
    </>
  );
};

export default AssociationsDialog;
