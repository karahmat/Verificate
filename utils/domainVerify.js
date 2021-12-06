const axios = require('axios');

const domainCheck = async (domain_name, txt_file) => {
    
    try {
        const response = await axios.get(domain_name + "/" + txt_file);     
        if (response.status === 200) {
            return response.data;
        }
    } catch (err) {
        return "error"
    }    
   
}


