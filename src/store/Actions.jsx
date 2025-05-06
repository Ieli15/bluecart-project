const API_BASE = "http://localhost:5000"; // Flask backend URL

export const searchProducts = async (query) => {
  const response = await fetch(`${API_BASE}/api/products/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return await response.json();
};