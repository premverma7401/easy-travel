import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { getPlacesData, getWeatherData } from './api/agent'


const App = () =>
{
  const [places, setPlaces] = useState([]);
  const [weather, setWeather] = useState([]);
  const [filteredPlaces, setFilterPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);


  // get current location of the user
  useEffect(() =>
  {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) =>
    {
      setCoordinates({ lat: latitude, lng: longitude })
    })
  }, [])


  // filter places based on the reviews from drop-down
  useEffect(() =>
  {
    const filterPlaces = places.filter((place) => place.rating > rating);
    setFilterPlaces(filterPlaces);
  }, [rating])


  // get all the places from api expect without name and no reviews
  useEffect(() =>
  {
    if (bounds.sw && bounds.ne)
    {
      setLoading(true);
      getWeatherData(coordinates.lat, coordinates.lng).then((data) =>
      {
        setWeather(data);
      })

      getPlacesData(type, bounds.sw, bounds.ne).then((data) =>
      {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilterPlaces([]);
        console.log(data);
        setLoading(false);
      })
    }
  }, [type, bounds])

  // auto complete search
  const onLoad = (autoc) =>
  {
    setAutocomplete(autoc)
  }
  // based on location change the map's coordinates
  const onPlaceChanged = () =>
  {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoordinates({ lat, lng });
  }

  return <>
    <CssBaseline />
    <Header
      setCoordinates={setCoordinates}
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    />
    <Grid container spacing={3} style={{ width: '100%' }}>
      <Grid item xs={12} md={4}>
        <List
          places={filteredPlaces.length ? filteredPlaces : places}
          childClicked={childClicked}
          loading={loading}
          type={type}
          setType={setType}
          rating={rating}
          setRating={setRating}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Map
          setCoordinates={setCoordinates}
          setBounds={setBounds}
          coordinates={coordinates}
          places={filteredPlaces.length ? filteredPlaces : places}
          setChildClicked={setChildClicked}
          weatherData={weather}
        />

      </Grid>
    </Grid>
  </>;
}
export default App;
