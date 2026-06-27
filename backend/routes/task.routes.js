const router = require('express').Router();
const {
  getTasks,
  getStats,
  createTask,
  updateTask,
  deleteTask,
  toggleStatus,
  reorderTasks,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { taskValidator } = require('../validators/task.validator');

router.use(protect);

router.get('/', getTasks);
router.get('/stats', getStats);
router.post('/', taskValidator, validate, createTask);
router.patch('/reorder', reorderTasks);
router.put('/:id', taskValidator, validate, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', toggleStatus);

module.exports = router;
