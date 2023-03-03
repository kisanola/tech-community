import express from 'express';
import posts from './posts';
import auth from './auth';
import recommendations from './recommendations';
import chat from './chat';
import profiles from './profiles';
import educations from './educations';
import experiences from './experiences';
import projects from './projects';
import notifications from './notifications';
import follow from './follow';
import organizations from './organizations';
import feed from './feed';
import jobCategories from './jobCategories';

const router = express.Router();

router.use('/posts', posts);
router.use('/auth', auth);
router.use('/recommendations', recommendations);
router.use('/chats', chat);
router.use('/profiles', profiles);
router.use('/educations', educations);
router.use('/experiences', experiences);
router.use('/projects', projects);
router.use('/notifications', notifications);
router.use('/follow', follow);
router.use('/organizations', organizations);
router.use('/feed', feed);
router.use('/jobs', jobCategories);

export default router;
