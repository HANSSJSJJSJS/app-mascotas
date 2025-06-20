class ApiService {
  baseUrl = "http://localhost:3001/api";

  // Actualizar datos del usuario (solo datos, no imagen)
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseUrl}/usuario/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Subir imagen de propietario
  async uploadImage(userId, imageFile) {
    try {
      const formData = new FormData();
      formData.append("imagen", imageFile);
      const response = await fetch(`${this.baseUrl}/propietario/${userId}/imagen`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Obtener datos del usuario (propietario)
  async getUserData(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/usuario/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();