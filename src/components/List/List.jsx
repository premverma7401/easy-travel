import React, { createRef, useEffect, useState } from "react";
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import useStyle from "./styles";
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = ({ places, childClicked, loading, rating, setRating, type, setType }) =>
{
  const classes = useStyle();
  const [elRefs, setElRefs] = useState([]);

  useEffect(() =>
  {
    setElRefs((refs) => Array(places?.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places])

  return <div className={classes.container}>
    <Typography variant="h4">
      Restaurants, Hotels and Attractions around you.
    </Typography>
    {
      loading ? (
        <div className={classes.loading}>
          <CircularProgress size='5rem' />
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl}>
            <InputLabel>
              Type
            </InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value='restaurants'> Restaurants</MenuItem>
              <MenuItem value='hotels'> Hotels</MenuItem>
              <MenuItem value='attractions'> Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>
              Rating
            </InputLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value='0'> All</MenuItem>
              <MenuItem value='3'> Above 3.0</MenuItem>
              <MenuItem value='4'> Above 4.0</MenuItem>
              <MenuItem value='4.5'> Above 4.5</MenuItem>
            </Select>
          </FormControl>
          <Grid container className={classes.list} spacing={3}>
            {places?.map((place, i) => (
              <Grid item key={i} xs={12} ref={elRefs[i]}>
                <PlaceDetails place={place} selected={Number(childClicked) === i} refProp={elRefs[i]}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )

    }
  </div >
};

export default List;
