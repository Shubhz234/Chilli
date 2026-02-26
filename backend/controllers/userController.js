import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

// Initialize Resend with the provided API Key. In production, this goes in the .env file.
const resend = new Resend(process.env.RESEND_API_KEY || 're_HMs7FFNE_JCfzor1vupMmpf9eLwFkgLEL');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'chilli_secret_123', { expiresIn: '30d' });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error registering user', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please create an account.', code: 'USER_NOT_FOUND' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked by the admin.' });
        }

        // Capture Login Info
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
        const device = req.headers['user-agent'] || 'Unknown Device';
        user.loginHistory.push({ ip, device, time: new Date() });
        // Keep only last 10 logins
        if (user.loginHistory.length > 10) user.loginHistory.shift();
        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'chilli_secret_123', { expiresIn: '30d' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            bio: user.bio,
            profilePhoto: user.profilePhoto,
            followers: user.followers,
            following: user.following,
            savedRecipes: user.savedRecipes,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error logging in', error: error.message });
    }
};

// @desc    Get all users (Public)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users', error: error.message });
    }
};

// @desc    Get user profile profile by ID (Public)
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'name profilePhoto')
            .populate('following', 'name profilePhoto')
            .select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
    }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Public (needs userId in body)
export const followUser = async (req, res) => {
    try {
        const { currentUserId } = req.body;
        if (!currentUserId) return res.status(400).json({ message: 'Current user ID is required' });

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(currentUserId);

        if (userToFollow && currentUser) {
            // Use strict String conversion Set logic to guarantee no duplicate Fake Follower logic
            const uniqueFollowers = new Set(userToFollow.followers.map(id => id.toString()));
            const isAlreadyFollower = uniqueFollowers.has(currentUserId.toString());

            if (!isAlreadyFollower) {
                uniqueFollowers.add(currentUserId.toString());
                userToFollow.followers = Array.from(uniqueFollowers);

                // Add notification
                userToFollow.notifications.push({
                    type: 'follow',
                    message: `${currentUser.name} started following you.`,
                    link: `/user/${currentUserId}`
                });

                await userToFollow.save();
            }

            const uniqueFollowing = new Set(currentUser.following.map(id => id.toString()));
            const isAlreadyFollowing = uniqueFollowing.has(req.params.id.toString());

            if (!isAlreadyFollowing) {
                uniqueFollowing.add(req.params.id.toString());
                currentUser.following = Array.from(uniqueFollowing);
                await currentUser.save();
            }
            res.json({ message: 'Successfully followed user' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error following user', error: error.message });
    }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Public (needs userId in body)
export const unfollowUser = async (req, res) => {
    try {
        const { currentUserId } = req.body;
        if (!currentUserId) return res.status(400).json({ message: 'Current user ID is required' });

        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(currentUserId);

        if (userToUnfollow && currentUser) {
            // Filter and guarantee uniqueness
            userToUnfollow.followers = Array.from(new Set(userToUnfollow.followers
                .map(id => id.toString())
                .filter(id => id !== currentUserId.toString())));
            await userToUnfollow.save();

            currentUser.following = Array.from(new Set(currentUser.following
                .map(id => id.toString())
                .filter(id => id !== req.params.id.toString())));
            await currentUser.save();

            res.json({ message: 'Successfully unfollowed user' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error unfollowing user', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Public
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
            user.age = req.body.age || user.age;
            user.dob = req.body.dob || user.dob;
            user.favoriteDish = req.body.favoriteDish || user.favoriteDish;
            user.spiceLevel = req.body.spiceLevel || user.spiceLevel;
            user.favoriteCuisine = req.body.favoriteCuisine || user.favoriteCuisine;
            user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;
            user.allergies = req.body.allergies || user.allergies;
            user.extras = req.body.extras || user.extras;

            const updatedUser = await user.save();

            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                isVerified: updatedUser.isVerified,
                bio: updatedUser.bio,
                profilePhoto: updatedUser.profilePhoto,
                followers: updatedUser.followers,
                following: updatedUser.following,
                savedRecipes: updatedUser.savedRecipes,
                age: updatedUser.age,
                dob: updatedUser.dob,
                favoriteDish: updatedUser.favoriteDish,
                spiceLevel: updatedUser.spiceLevel,
                favoriteCuisine: updatedUser.favoriteCuisine,
                dietaryPreference: updatedUser.dietaryPreference,
                allergies: updatedUser.allergies,
                extras: updatedUser.extras,
                token: req.body.token // send back existing token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

// @desc    Toggle user verification
// @route   PUT /api/users/:id/verify
// @access  Public (in real app, should be Admin only)
export const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isVerified = !user.isVerified;
            // Add notification
            user.notifications.push({
                type: 'verification',
                message: user.isVerified
                    ? 'Congratulations! Your account is now Verified as a Pro Chef.'
                    : 'Your Verified Pro status has been removed by an admin.',
                link: '/profile'
            });

            const updatedUser = await user.save();
            res.json({ message: 'User verification toggled', isVerified: updatedUser.isVerified });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling verification', error: error.message });
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/users/:id/notifications/read
// @access  Public
export const markNotificationsAsRead = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.notifications.forEach(n => n.read = true);
            await user.save();
            res.json({ message: 'Notifications marked as read' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error marking notifications read', error: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public (in real app, should be Admin only)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed completely' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
};

// @desc    Block / Unblock a user
// @route   PUT /api/users/:id/block
// @access  Public (Admin only in real app)
export const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isBlocked = !user.isBlocked;
            const updatedUser = await user.save();
            res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: updatedUser.isBlocked });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling block status', error: error.message });
    }
};

// @desc    Send OTP to user email
// @route   POST /api/users/login/otp/send
// @access  Public
export const sendLoginOTP = async (req, res) => {
    try {
        const email = req.body.email ? req.body.email.toLowerCase() : '';
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please create an account.', code: 'USER_NOT_FOUND' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked by the admin.' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        await user.save(); // CRITICAL: Save the generated OTP to the database

        // Send Email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Chilli <onboarding@resend.dev>', // Keep onboarding@resend.dev for the free tier testing
            to: user.email,
            subject: 'Chilli Login OTP Verification code',
            html: `<h3>Your Chilli Recipe Login OTP</h3>
                   <p>Use the following 6-digit code to securely log in to your account. This code is valid for 10 minutes.</p>
                   <h1 style="font-size: 32px; letter-spacing: 4px; padding: 10px; background: #f4f4f5; display: inline-block; border-radius: 8px;">${otp}</h1>`
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(500).json({ message: 'Failed to send OTP email', error });
        }

        res.json({ message: 'OTP sent to your email successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error sending OTP', error: error.message });
    }
};


// @desc    Verify OTP & get token
// @route   POST /api/users/login/otp/verify
// @access  Public
export const verifyLoginOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase() : '';

        const user = await User.findOne({ email }).select('+otp');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked by the admin.' });
        }

        if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP is expired or invalid. Please request a new one.' });
        }

        const isMatch = await bcrypt.compare(otp.toString(), user.otp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect OTP. Try again.' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;

        // Capture Login Info
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
        const device = req.headers['user-agent'] || 'Unknown Device';
        user.loginHistory.push({ ip, device, time: new Date() });
        if (user.loginHistory.length > 10) user.loginHistory.shift();
        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'chilli_secret_123', { expiresIn: '30d' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            bio: user.bio,
            profilePhoto: user.profilePhoto,
            followers: user.followers,
            following: user.following,
            savedRecipes: user.savedRecipes,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error verifying OTP', error: error.message });
    }
};
