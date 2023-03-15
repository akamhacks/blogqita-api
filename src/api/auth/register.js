const sendVerifyEmail = require('../utils/sendVerifyEmail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10)
const User = require('../../models/User')

const register = async (req, res) => {
	const { firstName, name, email, password } = req.body;
	if(!firstName || !name || !email || !password) {
		return res.status(400).json({ message: "please fill all fields!", success: false })
	}
	
	let existingUser;
	let newUser;
	let token;
	try {
		existingUser = await User.findOne({ email: email })
		if(existingUser?.isVerified) {
			return res.status(400).json({ message: `${email} already exist...\n Login instead` })
		} else if(!existingUser) {
			const hashedPassword = bcrypt.hashSync(password, salt)
			let newUser = await User.create({
				firstName,
				name,
				email,
				password: hashedPassword
			});
			token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
			await newUser.updateOne({ $set: {verificationToken: token} })
			const link = `http://localhost:3000/verify?token=${newUser?.token}`
			await sendVerifyEmail(newUser?.email, newUser?.name, link)
			.then(res.status(201).json({ message: {newUser} ? "Email verification has been sended to your email" : "Successfully register" }))
			.catch(err => console.log(err))
		} else if(existingUser) {
			token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
			await existingUser.updateOne({ $set: {verificationToken: token} })
			const link = `http://localhost:3000/verify?token=${token}`
			await sendVerifyEmail(existingUser?.email, existingUser?.name, link)
			.then(res.status(201).json({ message: {existingUser} ? "Email verification has been sended to your email" : "Successfully register" }))
			.catch(err => console.log(err))
		}
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: err })
	}
}

exports.register = register