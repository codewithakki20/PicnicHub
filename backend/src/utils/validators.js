// EMAIL
export const validateEmail = (email = "") => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

// PASSWORD
export const validatePassword = (password = "") => {
  return password.length >= 6;
};

// Optional: stronger password (letter + number)
export const validateStrongPassword = (password = "") => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};


// REQUIRED FIELD
export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim() !== "";
};


// COMBINED VALIDATOR
export const validateForm = (fields = {}) => {
  const errors = {};

  if ("email" in fields && !validateEmail(fields.email)) {
    errors.email = "Invalid email address";
  }

  if ("password" in fields && !validatePassword(fields.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if ("name" in fields && !validateRequired(fields.name)) {
    errors.name = "This field is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
