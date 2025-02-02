import Axios from "axios";

export const client = Axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export async function serviceHandler(callback: any) {
  try {
    const response = await callback();

    return {
      success: true,
      data: response.data,
      status: response.status,
      errors: response.data.errors,
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      status: error.response.status,
      errors: error.response.data.errors,
    };
  }
}

export function applyToken(token: string): void {
  client.defaults.headers.Authorization = `Bearer ${token}`;
}

export function unstickToken(): void {
  delete client.defaults.headers.Authorization;
}
