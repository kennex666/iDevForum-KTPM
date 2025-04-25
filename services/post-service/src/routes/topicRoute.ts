import express from 'express';
import { createTopicController, deleteTopicController, getAllTopicsController, getTopicByIdController, searchTopicController, updateTopicController } from '../controllers/topicController';
import e from 'express';

const topicRoute = express.Router();

topicRoute.get('/', getAllTopicsController);
topicRoute.post('/save', createTopicController);
topicRoute.get('/:id', getTopicByIdController);
topicRoute.put('/:id', updateTopicController);
topicRoute.delete('/:id', deleteTopicController);
topicRoute.post('/search', searchTopicController); 

export default topicRoute;
