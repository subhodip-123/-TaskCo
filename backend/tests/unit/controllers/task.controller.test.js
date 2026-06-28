jest.mock('../../../models/Task', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

const Task = require('../../../models/Task');
const {
  getTasks,
  getStats,
  createTask,
  updateTask,
  deleteTask,
  toggleStatus,
  reorderTasks,
} = require('../../../controllers/task.controller');

const makeCtx = (query = {}, body = {}, params = {}) => {
  const req = {
    query,
    body,
    params,
    user: { id: 1 },
    app: { get: jest.fn().mockReturnValue(null) }, // no socket
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
};

const mockTask = (overrides = {}) => ({
  id: 1,
  _id: 1,
  title: 'Sample Task',
  description: '',
  completed: false,
  priority: 'medium',
  userId: 1,
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe('getTasks', () => {
  it('returns paginated tasks with default parameters', async () => {
    const tasks = [mockTask(), mockTask({ id: 2, _id: 2, title: 'Second Task' })];
    Task.findAll.mockResolvedValue(tasks);
    Task.count.mockResolvedValue(2);

    const { req, res } = makeCtx();
    await getTasks(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ tasks, page: 1, pages: 1, total: 2 })
    );
  });

  it('filters by status=completed', async () => {
    Task.findAll.mockResolvedValue([]);
    Task.count.mockResolvedValue(0);

    const { req, res } = makeCtx({ status: 'completed' });
    await getTasks(req, res, jest.fn());

    const whereArg = Task.findAll.mock.calls[0][0].where;
    expect(whereArg.completed).toBe(true);
  });

  it('filters by status=pending', async () => {
    Task.findAll.mockResolvedValue([]);
    Task.count.mockResolvedValue(0);

    const { req, res } = makeCtx({ status: 'pending' });
    await getTasks(req, res, jest.fn());

    const whereArg = Task.findAll.mock.calls[0][0].where;
    expect(whereArg.completed).toBe(false);
  });

  it('filters by priority', async () => {
    Task.findAll.mockResolvedValue([]);
    Task.count.mockResolvedValue(0);

    const { req, res } = makeCtx({ priority: 'high' });
    await getTasks(req, res, jest.fn());

    const whereArg = Task.findAll.mock.calls[0][0].where;
    expect(whereArg.priority).toBe('high');
  });

  it('calculates correct page count', async () => {
    Task.findAll.mockResolvedValue([]);
    Task.count.mockResolvedValue(25);

    const { req, res } = makeCtx({ page: '1', limit: '10' });
    await getTasks(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ pages: 3 }));
  });
});

describe('getStats', () => {
  it('returns correct stats with completed and pending counts', async () => {
    Task.count.mockResolvedValueOnce(10).mockResolvedValueOnce(4);
    Task.findAll
      .mockResolvedValueOnce([{ priority: 'high', count: '2' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { req, res } = makeCtx();
    await getStats(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ total: 10, completed: 4, pending: 6, progress: 40 })
    );
  });

  it('returns 0% progress when there are no tasks', async () => {
    Task.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    Task.findAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { req, res } = makeCtx();
    await getStats(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ progress: 0 }));
  });
});

describe('createTask', () => {
  it('creates a task and responds with 201', async () => {
    const created = mockTask({ id: 10, title: 'New Task' });
    Task.create.mockResolvedValue(created);

    const { req, res, next } = makeCtx({}, { title: 'New Task', priority: 'high' });
    await createTask(req, res, next);

    expect(Task.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Task', userId: 1 })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });
});

describe('updateTask', () => {
  it('updates the task and returns it', async () => {
    const task = mockTask({ id: 3 });
    Task.findOne.mockResolvedValue(task);

    const { req, res, next } = makeCtx({}, { title: 'Updated' }, { id: '3' });
    await updateTask(req, res, next);

    expect(task.update).toHaveBeenCalledWith({ title: 'Updated' });
    expect(res.json).toHaveBeenCalledWith(task);
  });

  it('returns 404 when the task does not exist', async () => {
    Task.findOne.mockResolvedValue(null);

    const { req, res, next } = makeCtx({}, {}, { id: '999' });
    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('deleteTask', () => {
  it('deletes the task and returns a success message', async () => {
    const task = mockTask({ id: 5 });
    Task.findOne.mockResolvedValue(task);

    const { req, res, next } = makeCtx({}, {}, { id: '5' });
    await deleteTask(req, res, next);

    expect(task.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Task deleted', _id: '5' })
    );
  });

  it('returns 404 when the task does not exist', async () => {
    Task.findOne.mockResolvedValue(null);

    const { req, res, next } = makeCtx({}, {}, { id: '999' });
    await deleteTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('toggleStatus', () => {
  it('toggles completed from false to true when no body.completed provided', async () => {
    const task = mockTask({ completed: false });
    Task.findOne.mockResolvedValue(task);

    const { req, res, next } = makeCtx({}, {}, { id: '1' });
    await toggleStatus(req, res, next);

    expect(task.update).toHaveBeenCalledWith({ completed: true });
    expect(res.json).toHaveBeenCalledWith(task);
  });

  it('sets completed to the explicit boolean value from body', async () => {
    const task = mockTask({ completed: false });
    Task.findOne.mockResolvedValue(task);

    const { req, res, next } = makeCtx({}, { completed: false }, { id: '1' });
    await toggleStatus(req, res, next);

    expect(task.update).toHaveBeenCalledWith({ completed: false });
  });

  it('returns 404 when task does not exist', async () => {
    Task.findOne.mockResolvedValue(null);

    const { req, res, next } = makeCtx({}, {}, { id: '999' });
    await toggleStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('reorderTasks', () => {
  it('updates order for each item and returns success', async () => {
    Task.update.mockResolvedValue([1]);

    const items = [
      { _id: 1, order: 0 },
      { _id: 2, order: 1 },
    ];
    const { req, res, next } = makeCtx({}, { items });
    await reorderTasks(req, res, next);

    expect(Task.update).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order updated' });
  });

  it('returns 400 when items is not an array', async () => {
    const { req, res, next } = makeCtx({}, { items: 'not-an-array' });
    await reorderTasks(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('supports id field as well as _id', async () => {
    Task.update.mockResolvedValue([1]);

    const items = [{ id: 3, order: 0 }];
    const { req, res, next } = makeCtx({}, { items });
    await reorderTasks(req, res, next);

    expect(Task.update).toHaveBeenCalledWith(
      { order: 0 },
      expect.objectContaining({ where: expect.objectContaining({ id: 3 }) })
    );
  });
});
