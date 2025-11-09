import { API_BASE_URL, getAuthHeaders } from "../config";

const API_URL = `${API_BASE_URL}/users`;

export async function getUsersFromServer() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch users" }));
    throw new Error(error.error || "Failed to fetch users");
  }
  return res.json();
}

export async function addUserToServer(user) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to add user" }));
    throw new Error(error.error || "Failed to add user");
  }
  return res.json();
}

export async function updateUserOnServer(user) {
  const res = await fetch(`${API_URL}/${user.id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to update user" }));
    throw new Error(error.error || "Failed to update user");
  }
  return res.json();
}

export async function deleteUserFromServer(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to delete user" }));
    throw new Error(error.error || "Failed to delete user");
  }
  return id; // נחזיר רק את ה־id שנמחק
}
