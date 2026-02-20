import { Request, Response } from "express";
import * as service from "./giveaway.service";
import mongoose from "mongoose";

export const createGiveaway = async (req: Request, res: Response) => {
  try {
    // Already validated by Zod middleware
    const giveaway = await service.createGiveawayService(req.body);

    res.status(201).json(giveaway);
  } catch (error) {
    res.status(500).json({ message: "Failed to create giveaway" });
  }
};

export const getNearbyGiveaways = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;
    const filters = req.body?.filters;

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const parsedRadius = radius ? Number(radius) : 5000;

    const data = await service.getNearbyGiveawaysService(
      parsedLat,
      parsedLng,
      parsedRadius,
      filters
    );

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch nearby giveaways" });
  }
};

export const confirmGiveaway = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Giveaway ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid giveaway ID",
      });
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
      return res.status(400).json({
        message: "Giveaway ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid giveaway ID",
      });
    }

    const updated = await service.reportGiveawayService(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to report giveaway" });
  }
};