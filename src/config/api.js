// API Configuration for different environments

const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD) {
    // Production backend URL (Render)
    return 'https://unhbackend.onrender.com';
  }
  
  // Development - use localhost
  return 'http://localhost:5000';
};

export const API_URL = getApiUrl();

// Helper function to get full API endpoint
export const getApiEndpoint = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/${cleanPath}`;
};

// Export for direct use
export default {
  API_URL,
  getApiEndpoint
};

