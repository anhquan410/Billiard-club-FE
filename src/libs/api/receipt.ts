import type {
  StockMovement,
  StockMovementPaginationResponse,
} from "../types/warehouse.type";
import agent from "./agent";

// get stock-movement items with pagination
export async function getStockItemsPagination(
  page: number,
  limit: number,
  type?: string,
  search?: string,
) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (type) params.set("type", type);
    if (search?.trim()) params.set("search", search.trim());

    const response = await agent.get<StockMovementPaginationResponse>(
      `/stocks-movement?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// create import stock-movement
export async function createImportStockMovement(
  data: StockMovement,
  staffId: string,
) {
  try {
    const response = await agent.post(`/stocks-movement/import`, {
      ...data,
      staffId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// create export stock-movement
export async function createExportStockMovement(
  data: StockMovement,
  staffId: string,
) {
  try {
    const response = await agent.post(`/stocks-movement/export`, {
      ...data,
      staffId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
