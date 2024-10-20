import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { Request, Response } from "express";

export const getGoogleAccommodation = async (req: Request, res: Response) => {
  try {
    const { lon, lat } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lon}&radius=500&type=lodging`);
    const data = await response.json();
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
}

export const getAccommodationPic = async (req: Request, res: Response) => {
  try {
    const { photo_reference } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo_reference}&key=${apiKey}`;
    
    const response = await fetch(imageUrl);
    if (response.ok) {
      res.status(200).json({data: response.url}); 
    } else {
      const errorMessage = await response.text();
      console.log("Error fetching image:", errorMessage);
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
}

export const getAccommodationDetails = async (req: Request, res: Response) => {
  try {
    const { place_id } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${place_id}`);
    const data = await response.json();
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
}