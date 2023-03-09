63e959636ac91c6ee9017af6
$2a$10$pifUOt5HRt8nkYNxqhGnxO.Qfp2257Nksra6ZFfc7BdxSV62NC1AS



app.post('/register', async (req, res) => {
	const {username, password} = req.body
	try {
		const userDoc = await User.create({
			username,
			password: bcrypt.hashSync(password, salt)
		})
		res.json(userDoc)
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
})

app.post('/login', async (req, res) => {
	const {username, password} = req.body
	const userDoc = await User.findOne({ username })
	const passOk = bcrypt.compareSync(password, userDoc.password)
	if(passOk) {
		// Logged in
		jwt.sign({username, id: userDoc._id}, process.env.JWT_SECRET_KEY, {}, (err, token) => {
			if(err) throw err
			res.cookie('token', token).json({
				id: userDoc._id,
				username,
			})
		})
		// res.json()
	} else {
		res.status(400).json('Wrong Credentials')
	}
})

app.get('/profile', (req, res) => {
	const { token } = req.cookies
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, info) => {
		if(err) throw err
		res.json(info)
	})

	res.json(req.cookies)
})

app.post('/logout', (req, res) => {
	res.cookie('token', '').json('OK')
})

app.post('/post',uploadMiddleware.single('file'), async (req, res) => {
	const { originalname, path } = req.file
	const parts = originalname.split('.')
	const ext = parts[parts.length - 1]
	const newPath = path+'.'+ext
	fs.renameSync(path, newPath)

	const { token } = req.cookies
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { title, summary, content } = req.body
		const postDoc = await Post.create({
			title,
			summary,
			content,
			cover: newPath,
			author: info.id
		})
		res.json(postDoc)
	})

})

app.get('/post', async (req, res) => {
	const posts = await Post.find()
		.populate('author', ['username'])
		.sort({ createdAt: -1 })
		.limit(20)
	res.json(posts)
})

app.get('/post/:id', async (req, res) => {
	const { id } = req.params
	const postDoc = await Post.findById(id).populate('author', ['username'])
	res.json(postDoc)
})

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
	let newPath = null
	if(req.file) {
		const { originalname, path } = req.file
		const parts = originalname.split('.')
		const ext = parts[parts.length - 1]
		newPath = path+'.'+ext
		fs.renameSync(path, newPath)
	}

	const { token } = req.cookies
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { id, title, summary, content } = req.body
		const postDoc = await Post.findById(id)
		const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
		if(!isAuthor) {
			res.status(400).json('You Are not Author')
		}

		await postDoc.update({
			title,
			summary,
			content,
			cover: newPath ? newPath : postDoc.cover
		})
		res.json(postDoc)
	})
})

app.listen(4000, console.log('Listening on http://localhost:4000'))
