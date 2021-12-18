const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { requireAuth } = require('../middleware/authMiddleware');
const axios = require('axios');

router.post('/verify', requireAuth, async(req, res) => {
    try {
        
        const result = await axios.get(req.body.domainToCheck);  
        const user = await User.findOne({_id: req.profile.id});
        
        console.log("data from txt", result.data.trim());
        console.log("data from client", req.body.domainKey.trim());
        if (result.data.trim() === req.body.domainKey.trim()) {
           const newUpdate = await User.findOneAndUpdate({_id: req.profile.id}, {domainValidated: true}, {new: true});
           res.status(200).json({data: "Verification successful"});
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({data: "Verification failed."})
    }    

});

module.exports = router;
