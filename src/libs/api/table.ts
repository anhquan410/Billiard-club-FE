import agent from "./agent";

// Get all tables
export async function getAllTables() {
  try {
    const response = await agent.get(`/tables/all`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get table by ID
export async function getTableById(id: string) {
  try {
    const response = await agent.get(`/tables/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Start session for a table
export async function startTableSession(tableId: string, note?: string) {
  try {
    const response = await agent.post(`/tables/${tableId}/start-session`, {
      note,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// End session for a table
export async function endTableSession(
  tableId: string,
  data: {
    paymentMethod: "CASH" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "OTHER";
    discount?: number;
    note?: string;
    customerId?: string;
  },
) {
  try {
    const response = await agent.post(`/tables/${tableId}/end-session`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get session details for a table
export async function getTableSession(tableId: string) {
  try {
    const response = await agent.get(`/tables/${tableId}/active-session`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Add service to table
export async function addServiceToTable(
  sessionId: string,
  productId: string,
  quantity: number = 1,
) {
  try {
    const response = await agent.post(
      `/table-sessions/${sessionId}/add-service`,
      {
        productId,
        quantity,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Remove service from table
export async function removeServiceFromTable(
  sessionId: string,
  serviceId: string,
) {
  try {
    const response = await agent.delete(
      `/table-sessions/${sessionId}/remove-service`,
      {
        data: { serviceId },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateServiceQuantity(
  sessionId: string,
  serviceId: string,
  quantity: number,
) {
  try {
    const response = await agent.post(
      `/table-sessions/${sessionId}/update-service-quantity`,
      { serviceId, quantity },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
