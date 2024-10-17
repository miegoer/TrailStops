const { User, UserMarkers } = require('../models/schema');
import { Request, Response } from "express";
import { MarkerType } from "../types/types";

export const getMarkers = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    const response = await UserMarkers.find({user_id: user_id})
    const positions = response.map((marker: MarkerType) => marker);
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).send(`Server Error0: ${error}`);
  }
}

export const addMarker = async (req: Request, res: Response) => {
  try {
    const { _id, user_id, marker, updatedMarkers, settings } = req.body;
    const newMarker = new UserMarkers({user_id: user_id, position: marker.position, hotel: marker.hotel, _id:_id, nextDist: marker.nextDist, prevDist: marker.prevDist, order: marker.order, walkingSpeed: settings.speed, distanceMeasure: settings.distance}); 
    let response = await newMarker.save();
    for (const key in updatedMarkers) {
      response = await UserMarkers.findOneAndUpdate({_id: key}, {prevDist: updatedMarkers[key].prevDist, nextDist: updatedMarkers[key].nextDist, order: updatedMarkers[key].order});
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error1: ${error}`);
  }
}

export const updateAllMarkers = async (req: Request, res: Response) => {
  try {
    const { markers } = req.body;
    const updatePromises = Object.keys(markers).map(async (key) => {
      const marker = markers[key];
      return await UserMarkers.updateOne({ _id: marker._id }, marker);
    });
    await Promise.all(updatePromises);
    res.status(200).json('Markers updated successfully');
  } catch (error) {
    res.status(500).send(`Server Error2: ${error}`);
  }
}

export const removeMarker = async (req: Request, res: Response) => {
  try {
    const { user_id, _id } = req.body;
    const response = await UserMarkers.deleteOne({user_id:user_id, _id:_id})
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error3: ${error}`);
  }
}

// TODO: add password hashing
export const addUser = async (req: Request, res: Response) => {
  try {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  const response = await newUser.save();
  res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error4: ${error}`);
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  res.status(200).json(user);
}

export const getAccommodation = async (req: Request, res: Response) => {
  try {
  const { user_id, markerId } = req.query;
  const accommodation = await UserMarkers.findOne({ user_id: user_id, _id:markerId });
  res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).send(`Server Error5: ${error}`);
  }
}

export const addAccommodation = async (req: Request, res: Response) => {
  try {
    const { user_id, hotel, markerId } = req.body;
    const response = await UserMarkers.updateOne({user_id: user_id, _id: markerId}, {hotel: hotel});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Server Error6: ${error}`);
  }
}

