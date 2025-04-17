const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// ➤ 1. Get All Courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ 2. Create New Course
router.post('/', async (req, res) => {
  const { title, description, content, videoUrl } = req.body;
  try {
    const newCourse = new Course({ title, description, content, videoUrl });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ 3. Update Course
router.put('/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ 4. Delete Course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
