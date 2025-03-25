const apiService = {
  login: async (credentials) => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(JSON.stringify(errorData))
      throw new Error(errorData.error || "Login failed");
    }

    console.log("Login Successful!");

    return await response.json();
  },

  signup: async(credentials) => {

    if (!credentials.Email || !credentials.Password || !credentials.Name) {
      alert("Please fill in all fields!");
      return;
    }

    console.log("📤 Sending credentials:", credentials);

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if(!response.ok){
        const errorData = await response.json();
        console.log("ERROR in service.js");
        alert(JSON.stringify(errorData))
        throw new Error(errorData.error || "Signup failed");
    }

    const data = await response.json();
    console.log("Response from server:", data);
    
    console.log("SignUp Successful!");

    return data;
  }
};

export default apiService;
