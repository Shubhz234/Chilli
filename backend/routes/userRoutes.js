import express from 'express';
import { loginUser, registerUser, updateUserProfile, getUserProfile, followUser, unfollowUser, getUsers, verifyUser, markNotificationsAsRead, deleteUser, toggleBlockUser, sendLoginOTP, verifyLoginOTP } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/otp/send', sendLoginOTP);
router.post('/login/otp/verify', verifyLoginOTP);
router.put('/profile/:id', updateUserProfile);
router.put('/:id/verify', verifyUser);
router.put('/:id/block', toggleBlockUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserProfile);
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);
router.put('/:id/notifications/read', markNotificationsAsRead);

export default router;
