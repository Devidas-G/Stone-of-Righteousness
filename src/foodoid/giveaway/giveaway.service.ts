import * as repo from "./giveaway.repository";

type TimeStatus = "scheduled" | "active" | "expired" | "closed" | "unknown";
type FoodType = "veg" | "non-veg" | "both";

interface NearbyFilters {
  status?: TimeStatus[];
  foodType?: FoodType[];
}

const getTimeStatusLabel = (
  startTime: Date,
  endTime: Date,
  status?: string
): TimeStatus => {
  const now = new Date();

  if (status === "closed") return "closed";

  if (now < new Date(startTime)) return "scheduled";
  if (now >= new Date(startTime) && now <= new Date(endTime)) return "active";
  if (now > new Date(endTime)) return "expired";

  return "unknown";
};


const getReliabilityLabel = (confirmCount: number, reportCount: number) => {
  const score = confirmCount - reportCount;

  if (score >= 3) return "Highly Reliable";
  if (score >= 0) return "Likely Available";
  return "Possibly Finished";
};

export const createGiveawayService = async (payload: any) => {
  return await repo.createGiveaway(payload);
};

export const getNearbyGiveawaysService = async (
  lat: number,
  lng: number,
  radius: number,
  filters?: NearbyFilters
) => {
  const giveaways = await repo.findNearbyGiveaways(lat, lng, radius);
  const mapped = giveaways.map((g: any) => {
    const timeStatus = getTimeStatusLabel(
      g.startTime,
      g.endTime,
      g.status
    );

    const reliabilityStatus = getReliabilityLabel(
      g.confirmCount,
      g.reportCount
    );

    return {
      id: g._id,
      title: g.title,
      foodType: g.foodType,
      address: g.address,
      location: g.location,
      statusLabel: timeStatus,
      timeStatus, // IMPORTANT for sorting
      reliabilityStatus,
      confirmCount: g.confirmCount,
      reportCount: g.reportCount,
      startTime: g.startTime,
      endTime: g.endTime,
    };
  });

  // 🔥 Apply filters dynamically (scalable & optimal)
  let result = mapped;
  if (filters) {
    const { status, foodType } = filters;

    if (status && status.length > 0) {
      result = result.filter((g) => status.includes(g.timeStatus));
    }
    
    if (foodType && foodType.length > 0) {
      result = result.filter((g) => foodType.includes(g.foodType));
    }
  }
  return result;
};

export const confirmGiveawayService = async (id: string) => {
  return await repo.incrementConfirm(id);
};

export const reportGiveawayService = async (id: string) => {
  return await repo.incrementReport(id);
};
