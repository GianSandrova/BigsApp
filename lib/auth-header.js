const authHeader = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const token = JSON.parse(storedToken);
        return { Authorization: `Bearer ${token}` };
      } catch (error) {
        console.error('Error parsing token in authHeader:', error);
        return {};
      }
    } else {
      return {};
    }
  }
  
  export default authHeader;