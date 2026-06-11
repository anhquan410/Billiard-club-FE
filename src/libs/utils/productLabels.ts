export const getCategoryLabel = (category: string) => {
  switch (category) {
    case "FOOD":
      return "Đồ ăn";
    case "BEVERAGE":
      return "Nước ngọt không gas";
    case "SERVICE":
      return "Dịch vụ";
    case "CIGARETTE":
      return "Thuốc lá";
    case "OTHER":
      return "Khác";
    case "EQUIPMENT":
      return "Thiết bị";
    case "SODA":
      return "Nước ngọt có gas";
    case "COFFEE":
      return "Cà phê";
    case "BEER":
      return "Bia";
    default:
      return category;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "Hàng có sẵn";
    case "OUT_OF_STOCK":
      return "Hết hàng";
    case "DISCONTINUED":
      return "Ngừng kinh doanh";
    default:
      return status;
  }
};
