import type { StockMovement } from "../types/warehouse.type";
import agent from "./agent";

// get stock-movement items with pagination
export async function getStockItemsPagination(
  page: number,
  limit: number,
  type?: string,
) {
  try {
    const response = await agent.get(
      `/stocks-movement?page=${page}&limit=${limit}&type=${type || ""}`,
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
