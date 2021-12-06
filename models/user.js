const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {        
        email: {
            type: String, 
            required: [true, 'Please enter an email'], 
            unique: true,
            lowercase: true,
            validate: [isEmail, 'Please enter a valid email']
        },
        password: {
            type: String, 
            required: [true, 'Please enter a password'],
            minlength: [8, 'Minimum password length is 8 characters']
        },
        domain: {
            type: String, 
            required: [true, 'Please enter domain'], 
            validate: {
                validator: function(value) {
                  return value.slice(0,5).includes("http");
                },
                message: props => `${props.value} must start with http or https!`
            },
            
        },
        domainValidated: {
            type: Boolean
        },
        issuer: {
            type: String, 
            required: [true, 'Please enter name of instituition']
        }, 
        walletAddress: {
            type: String
        }
    }, 
    {
        timestamps: true
    }
);


//fire a function before doc saved to db 
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    //if we have a user
    if (user) {
        //auth can be true or false
        const auth = await bcrypt.compare(password, user.password);
        
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
        
        
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;