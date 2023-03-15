const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const setProfile = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]
	let filename = null

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { firstName, name, email, bio, socialsAccounts } = req.body
	console.log(req.body)

		const user = await User.findById(info.id, "-password")
		if(req?.file && user?.image !== 'uploads/default-user.png') {
			filename = req.file.filename
			fs.unlink(user.image, (err) => {
				if(err) {
					console.log(err)
				}
				console.log('Previous image deleted')
			})
		}
		if(email !== user.email) {
			const existingEmail = await User.findOne({ email: email })
			if(existingEmail) {
				return res.status(400).json({ message: `${email} already exist \n Try again` })
			}
		}

		await user.updateOne({
			firstName,
			name,
			email,
			image: filename ? `uploads/${filename}` : user.image,
			bio,
			socialsAccounts,
			isSettinged: true
		})
		res.status(200).json(user)
	})
}

exports.setProfile = setProfile