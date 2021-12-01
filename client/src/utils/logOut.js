export const logOut = async() => {
  
    const res = await fetch('/api/users/logout');
    const data = await res.json();
    if (data.data === "signed out") {
  
      return "signed out"
    }
    
    // Cookies.remove('jwt')
}