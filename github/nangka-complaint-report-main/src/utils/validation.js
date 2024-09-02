// src/utils/validation.js

  
  // Function to validate password strength
  export const validatePassword = (password) => {
    // Password must be at least 8 characters long and include an uppercase letter, a number, and a special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  