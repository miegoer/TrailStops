import React from 'react';
import './settings.css';
import { Select, FormControl, Button, MenuItem, SelectChangeEvent } from '@mui/material';
import DBService from '../../services/DBService';
import routeCalculation from '../../helperFunctions/routeCalculation';
import { useEffect } from 'react';
import { useUser } from '../../context/userContext';

function Settings() {

  const { settings, setSettings, setSettingsOverlay, markers, setMarkers } = useUser();

  // Effect to handle updates based on settingsData changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (settings.speed !== undefined) {
        const updatedMarkers = await routeCalculation(Object.values(markers), settings);
        DBService.updateAllMarkers(updatedMarkers);
        setMarkers(updatedMarkers);
      }
    };

    updateMarkers();
  }, [settings]); // Trigger on settingsData change

  const changeSpeedSetting = (event: SelectChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, speed: Number(event.target.value) });
  };

  //TODO Implement change distance setting
  // const changeDistanceSetting = async (event) => {
  //   setSettings({ ...settings, distance: event.target.value });
  //   const updatedMarkers = await routeCalculation(Object.values(markers), { ...settings, distance: event.target.value });
  //   DBService.updateAllMarkers(updatedMarkers);
  //   setMarkers(updatedMarkers);
  // };

  return (
    <div style={{marginBottom:"10px"}}className="settingsScreen">
      <h1>Settings</h1>
      <form style={{marginBottom:"10px"}}>
        <FormControl>
          <Select value={settings.speed} onChange={changeSpeedSetting}>
            <MenuItem value="2">2Kmph - Slow</MenuItem>
            <MenuItem value="3">3Kmph - Regular</MenuItem>
            <MenuItem value="4">4Kmph - Fast</MenuItem>
            <MenuItem value="5">5Kmph - Lightning</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl>
          <Select value={settingsData.distance} onChange={changeDistanceSetting}>
            <MenuItem value="km">Kilometers</MenuItem>
            <MenuItem value="m">Miles</MenuItem>
          </Select>
        </FormControl> */}
      </form>
      <Button variant='contained' className='backButton' onClick={() => setSettingsOverlay(false)}>Back</Button>
    </div>
  );
}

export default Settings;
