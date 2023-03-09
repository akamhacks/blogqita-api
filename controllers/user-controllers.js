const User = require('../models/User')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const getAuthors = async (req, res, next) => {
	const author = await User.find({ isVerified: true }, "-password")
	return res.status(200).json(author)
}

const getProfile = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	let id;
	id = req.query.id
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(!req?.query?.id) {
			id = info.id
		}
		const user = await User.findById(id)
		return res.status(200).json({ user })
		
	})
}

const setProfile = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { firstName, name, email, bio, socialsAccounts } = req.body

		const user = await User.findById(info.id, "-password")
		const { filename } = req.file
		if(req?.file && user?.image !== 'uploads/default-user.png') {
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

const followUnfollowHandler = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const { id } = req.query

		const followingUser = await User.findById(info.id)
		const followedUser = await User.findById(id)
		const isFollowedUser = followingUser.following.includes(followedUser._id)
		if(String(id) === String(info.id)) {
			return res.status(400).json({ message: `Cannot Follow your self` })
		} else if(isFollowedUser) {
			const addedUnfollowedUser = await User.findByIdAndUpdate(id, { $pull: { followers: info.id } }, {new: true})
        	const addedUnfollowingUser = await User.findByIdAndUpdate(info.id, { $pull: { following: id } }, {new: true})
			return res.status(200).json({ addedUnfollowedUser: addedUnfollowedUser, addedUnfollowingUser: addedUnfollowingUser })
		}
		const addedFollowedUser = await User.findByIdAndUpdate(id, { $push: { followers: info.id } }, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        const addedFollowingUser = await User.findByIdAndUpdate(info.id, { $push: { following: id } }, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
		res.status(200).json({ addedFollowedUser: addedFollowedUser, addedFollowingUser: addedFollowingUser })
	})
}

exports.getAuthors = getAuthors
exports.getProfile = getProfile
exports.setProfile = setProfile
exports.followUnfollowHandler = followUnfollowHandler
