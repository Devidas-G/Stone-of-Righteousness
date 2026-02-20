import Giveaway, { IGiveaway } from "./giveaway.model";

export const createGiveaway = async (data: Partial<IGiveaway>) => {
  return await Giveaway.create(data);
};

export const findNearbyGiveaways = async (
  lat: number,
  lng: number,
  radius: number
) => {
  return await Giveaway.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: radius,
      },
    },
    // status: "active",
  });
};

export const findById = async (id: string) => {
  return await Giveaway.findById(id);
};

export const incrementConfirm = async (id: string) => {
  return await Giveaway.findByIdAndUpdate(
    id,
    { $inc: { confirmCount: 1 } },
    { new: true }
  );
};

export const incrementReport = async (id: string) => {
  return await Giveaway.findByIdAndUpdate(
    id,
    { $inc: { reportCount: 1 } },
    { new: true }
  );
};
