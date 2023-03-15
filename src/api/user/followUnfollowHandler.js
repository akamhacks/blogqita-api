const User = require('../../models/User')
const jwt = require('jsonwebtoken')

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
		if(JSON.stringify(id) === JSON.stringify(info.id)) {
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

exports.followUnfollowHandler = followUnfollowHandler