const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const router = Router();

router.post('/generate', auth, async (req, res) => {
	try {
		const baseUrl = config.get('baseUrl')
		const {among} = req.body

		const code = shortid.generate()

		const existing = await Link.findOne({among})

		if (existing) {
			return res.json({link: existing})
		}

		const to = baseUrl + '/t/' + code

		const link = new Link({
			among , to, code,  owner: req.user.userId
		})

		await link.save()

		res.status(201).json({link})

	} catch (e) {
		res.status(500).json({message: 'links /generate error'})
	}
})

router.get('/', auth, async (req, res) => {
	try {
		const links = await Link.find({owner: req.user.userId})
		res.status(200).json(links)
	} catch (e) {
		res.status(500).json({message: 'links / error'})
	}
})

router.get('/:id', auth, async (req, res) => {
	try {
		const link = await Link.findById(req.params.id)
		res.status(200).json(link)
	} catch (e) {
		res.status(500).json({message: 'links /id error'})
	}
})


module.exports = router
