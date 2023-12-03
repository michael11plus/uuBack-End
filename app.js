import express from "express";
import asyncHandler from 'express-async-handler';
import { authenticate } from './middleware';
import { body, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
});

app.get('/list/:listId', authenticate, asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const userId = req.user.id;
    res.status(200).json({ message: `Access to list ${listId} granted for user ${userId}` });
}));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
