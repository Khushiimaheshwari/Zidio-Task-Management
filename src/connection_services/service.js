const API_URL = "http://localhost:5000"; // Backend URL

const apiService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    alert("Login Successful")

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData)
      throw new Error(errorData.error || "Login failed");
    }

    return await response.json();
  },

  signup: async(credentials) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    alert("Signup Successful")

    if(!response.ok){
        const errorData = await response.json();
        alert(errorData)
        throw new Error(errorData.error || "Signup failed");
    }

    return await response.json();
  }
};

export default apiService;
