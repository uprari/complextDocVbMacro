import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const fetchDropdownOptions = (): Promise<{
  color: string[];
  city: string[];
  metal: string[];
}> =>
  Promise.resolve({
    color: ['red', 'white', 'Khaki'],
    city: ['delhi', 'bombay'],
    metal: ['carbonfiber', 'steel', 're-inforced steel'],
  });

export default function MaxWidthDialog() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  const [dropdownData, setDropdownData] = React.useState<{
    color: string[];
    city: string[];
    metal: string[];
  }>({ color: [], city: [], metal: [] });

  const [selectedColor, setSelectedColor] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [selectedMetal, setSelectedMetal] = React.useState('');

  const [responseData, setResponseData] = React.useState<any>(null);

  React.useEffect(() => {
    fetchDropdownOptions().then((data) => {
      setDropdownData(data);
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFetchData = async () => {
    const url = `http://domain.com/cars/?colors="${selectedColor}"&metal="${selectedMetal}"&city="${selectedCity}"`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched Data:', data);
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponseData({ error: 'Failed to fetch data' });
    }
  };

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                <MenuItem value={false as any}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel>Color</InputLabel>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                label="Color"
              >
                {dropdownData.color.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
              >
                {dropdownData.city.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel>Metal</InputLabel>
              <Select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                label="Metal"
              >
                {dropdownData.metal.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Switch checked={fullWidth} onChange={handleFullWidthChange} />
              }
              label="Full width"
            />

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleFetchData}
              disabled={!selectedColor || !selectedCity || !selectedMetal}
            >
              Fetch Data
            </Button>

            {responseData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Response:
                </Typography>
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
