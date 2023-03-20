const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const login = async (req, res, next) => {
	const { email, password } = req.body
	if(req.headers.cookie) {
		req.headers.cookie = ''
	}

	let existingUser;
	try{
		existingUser = await User.findOne({ email: email })
	} catch (err) {
		return new Error(err)
	}

	if(!existingUser) {
		return res.status(400).json({ message: "You are have not register. Please register first :)" })
	}
	if(!existingUser?.isVerified) {
		return res.status(400).json({ message: "You have not verified your account, please check your email to verify it!" })
	}

	const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
	if(!isPasswordCorrect) {
		return res.status(400).json({ message: `Wrong Password for Account ${existingUser?.name}` })
	}
	const token = jwt.sign({ email, id: existingUser._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: "1d"
	})

	if (req.cookies[`${existingUser._id}`]) {
		req.cookies[`${existingUser._id}`] = "";
	}

	console.log("Generated Token\n", token)
	res.cookie(String(existingUser._id), token)

	return res.status(200).json({ message: "Successfully Logged In", firstName: existingUser.firstName, name: existingUser.name, email: existingUser.email, id: existingUser._id, token })
}

exports.login = login