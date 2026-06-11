export const TIER_LABELS: Record<string, string> = {
  BRONZE: "Đồng",
  SILVER: "Bạc",
  GOLD: "Vàng",
  PLATINUM: "Bạch kim",
  DIAMOND: "Kim cương",
};

export const TIER_COLORS: Record<string, string> = {
  BRONZE: "#cd7f32",
  SILVER: "#9e9e9e",
  GOLD: "#ffc107",
  PLATINUM: "#7b1fa2",
  DIAMOND: "#00bcd4",
};

export const BONUS_TX_TYPE_LABELS: Record<string, string> = {
  EARNED: "Tích điểm",
  REDEEMED: "Đổi điểm",
  ADJUSTED: "Điều chỉnh",
  EXPIRED: "Hết hạn",
};

export function getTierLabel(tier?: string | null) {
  if (!tier) return "—";
  return TIER_LABELS[tier] ?? tier;
}
