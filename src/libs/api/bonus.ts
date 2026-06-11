import agent from "./agent";

export type BonusProfile = {
  id: string;
  fullName: string;
  bonusPoints: number;
  membershipTier: string;
  tierDiscountPercentage: number;
  nextTierThreshold: number | null;
  pointsToNextTier: number | null;
};

export type BonusDiscountPreview = {
  pointsDiscount: number;
  tierDiscount: number;
  totalDiscount: number;
  finalAmount: number;
  canUsePoints: boolean;
  maxUsablePoints: number;
};

export type BonusTransaction = {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
  order?: { orderNumber: string; total: number } | null;
};

export type BonusSettings = {
  id: string;
  pointsPerVnd: number;
  vndPerPoint: number;
  maxDiscountPercent: number;
  silverThreshold: number;
  goldThreshold: number;
  platinumThreshold: number;
  diamondThreshold: number;
  bronzeDiscount: number;
  silverDiscount: number;
  goldDiscount: number;
  platinumDiscount: number;
  diamondDiscount: number;
  updatedAt: string;
};

export type BonusSystemInfo = {
  pointsPerVnd: number;
  vndPerPoint: number;
  maxDiscountPercent: number;
  membershipTiers: Record<string, { threshold: number; discount: number }>;
};

export async function getBonusProfile(userId: string) {
  const response = await agent.get<BonusProfile>(`/bonus/profile/${userId}`);
  return response.data;
}

export async function getBonusHistory(userId: string, limit = 50) {
  const response = await agent.get<BonusTransaction[]>(
    `/bonus/history/${userId}?limit=${limit}`,
  );
  return response.data;
}

export async function calculateBonusDiscount(data: {
  userId: string;
  totalAmount: number;
  usePoints?: number;
  useTierDiscount?: boolean;
}) {
  const response = await agent.post<BonusDiscountPreview>(
    "/bonus/calculate-discount",
    data,
  );
  return response.data;
}

export async function adjustBonusPoints(data: {
  userId: string;
  points: number;
  reason: string;
}) {
  const response = await agent.post<{ message: string }>(
    "/bonus/admin/adjust",
    data,
  );
  return response.data;
}

export async function getBonusSettings() {
  const response = await agent.get<BonusSettings>("/bonus/settings");
  return response.data;
}

export async function updateBonusSettings(
  data: Omit<BonusSettings, "id" | "updatedAt">,
) {
  const response = await agent.post<BonusSettings>("/bonus/settings", data);
  return response.data;
}

export async function getBonusSystemInfo() {
  const response = await agent.get<BonusSystemInfo>("/bonus/system-info");
  return response.data;
}
