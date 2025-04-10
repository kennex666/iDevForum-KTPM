import express from "express";

const router = express.Router();

router.post('/image', (req, res) => {
    res.send('upload image');
});

router.post('/video', (req, res) => {
    res.send('upload video');
});

router.post('/pdf', (req, res) => {
    res.send('upload pdf');
});
export default router;