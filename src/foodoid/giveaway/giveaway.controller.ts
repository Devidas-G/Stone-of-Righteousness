import { Request, Response } from "express";
import * as service from "./giveaway.service";

interface NearbyQuery {
  lat?: string;
  lng?: string;
  radius?: string;
  sortby?: "live" | "starting_soon";
}

interface NearbyRequestBody  {
  filters?: {
    status?: ("active" | "scheduled" | "expired" | "closed")[];
    foodType?: ("veg" | "non-veg" | "both")[];
  };
}

export const createGiveaway = async (req: Request, res: Response) => {
  try {
    // 1. Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required",
      });
    }

    // 2. Validate required fields
    const {
      title,
      location,
      startTime,
      endTime,
      foodType,
      address,
      quantityEstimate,
      description,
    } = req.body;

    const requiredFields = {
      title,
      location,
      startTime,
      endTime,
      foodType,
      address,
      quantityEstimate
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      return res.status(400).json({
        message: "Validation failed",
        missingFields,
      });
    }


    // 3. Validate GeoJSON location (CRITICAL for your app)
    if (
      !location.type ||
      location.type !== "Point" ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message:
          "Invalid location format. Expected GeoJSON { type: 'Point', coordinates: [lng, lat] }",
      });
    }

    const [lng, lat] = location.coordinates;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    // 4. Call service only after validation
    const giveaway = await service.createGiveawayService({
      title,
      description,
      location,
      address,
      foodType,
      quantityEstimate,
      startTime,
      endTime,
    });

    res.status(201).json(giveaway);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create giveaway" });
  }
};


export const getNearbyGiveaways = async (
  req: Request<{}, {}, NearbyRequestBody , NearbyQuery>,
  res: Response
) => {
  try {
    const { lat, lng, radius } = req.query;
    const filters = req.body?.filters;


    // Validate required params
    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng query parameters are required",
      });
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const parsedRadius = radius ? Number(radius) : 5000;

    // Validate numeric values
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        message: "lat and lng must be valid numbers",
      });
    }

    if (isNaN(parsedRadius)) {
      return res.status(400).json({
        message: "radius must be a valid number",
      });
    }

    const data = await service.getNearbyGiveawaysService(
      parsedLat,
      parsedLng,
      parsedRadius,
      filters
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch nearby giveaways" });
  }
};

export const confirmGiveaway = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Giveaway ID is required" });
    }

    const updated = await service.confirmGiveawayService(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm giveaway" });
  }
};

export const reportGiveaway = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Giveaway ID is required" });
    }

    const updated = await service.reportGiveawayService(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to report giveaway" });
  }
};

