import express from 'express';
import { loginUser, registerUser, updateUserProfile, getUserProfile, followUser, unfollowUser, getUsers, verifyUser, markNotificationsAsRead } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', updateUserProfile);
router.put('/:id/verify', verifyUser);
router.get('/:id', getUserProfile);
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.put('/:id/notifications/read', markNotificationsAsRead);

export default router;
