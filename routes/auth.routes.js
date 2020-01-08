const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('config');
const User = require('../models/User');

const router = Router();

// /api/auth/register
router.post(
	'/register',
	[
		check('email', 'email error').isEmail(),
		check('password', 'password very short').isLength({min: 5})
	],
	async (req, res) => {
		try {

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({errors: errors.array(), message: 'data is not corrected (sign_up)'})
			}
			const {email, password} = req.body;
			const candidate = await User.findOne({email});

			if (candidate) {
				return res.status(400).json({message: 'user already exists'})
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({email, password: hashedPassword});

			await user.save();

			res.status(201).json({message: 'user has been created'})


		} catch (e) {
			res.status(500).json({message: 'register error'})
		}
	});

// /api/auth/login
router.post(
	'/login',
	[
		check('email', 'password error').normalizeEmail().isEmail(),
		check('password', 'password should not be empty').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({errors: errors.array(), message: 'data is not corrected (sign_in)'})
			}

			const {email, password} = req.body;
			const user = await User.findOne({email});

			if (!user) {
				return res.status(400).json({message: 'user is not find'})
			}
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({message: 'password is not valid'})
			}

			const token = await jwt.sign(
				{userId: user.id},
				config.get('jwtSecret'),
				{expiresIn: '1h'}
			);

			res.status(200).json({token, userId: user.id})
		} catch (e) {
			res.status(500).json({message: 'login error'})
		}
	});

module.exports = router;
