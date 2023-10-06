const User = require('./models/User')
const Role = require('./models/Role')
const Producte = require('./models/Producte')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require("./config")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {"expiresIn": "24h"})
}



class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if(candidate){
                return res.json({message:"login dubblicate"}) 
            }

            const hashPassword = bcrypt.hashSync(password,10)
            const userRole = await Role.findOne({value:"USER"})
            const user = new User({username, password:hashPassword,roles:[userRole.value]})
            user.save()
            return res.json({message:"Registration success"})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message:`Don't user ${username}`})
            }

            const  validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message:`Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
            
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Login error"})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
            console.log(res)
        } catch (error) {
            res.status(500).json({ message: "Server error "+ error.message});
            console.log(error)
        }
    }

    async deleteUser(req, res) {
        try {
            const {username} = req.body
            const user = await User.findOne({username})
            await user.deleteOne()
            return res.json({message: "user deleted!"})
        } catch (error) {
            return res.json({message: "error delete"})
        }
    }

    async addPost(req,res) {
        try {
            const {title,description,price} = req.body
            const newProduct = new Producte({
                title,
                description,
                price
            })
            if(!title || !description || !price){
                return res.json({message: "empty"})
            }
            console.log(newProduct)
            newProduct.save()
            return res.status(200).json({message: "post created"})
        } catch (error) {
            return res.json(error)
        }
    }

    async deletePost(req, res) { 
        const {_id} = req.body
        const post = await Producte.findOne({_id})
        await post.deleteOne()
        return res.json({message: "post deleted"})
    }


}

module.exports = new authController()