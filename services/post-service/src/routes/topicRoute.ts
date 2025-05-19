import express from 'express';
import { createTopicController, deleteTopicController, getAllTopicsController, getTopicByIdController, searchTopicController, updateTopicController } from '../controllers/topicController';
import { authenticate } from '../utils/authenticate';

const topicRoute = express.Router();

topicRoute.get('/', getAllTopicsController);
topicRoute.post('/save',authenticate, createTopicController);
topicRoute.get('/:id', getTopicByIdController);
topicRoute.put('/:id',authenticate, updateTopicController);
topicRoute.delete('/:id',authenticate, deleteTopicController);
topicRoute.post('/search', searchTopicController); 

export default topicRoute;
