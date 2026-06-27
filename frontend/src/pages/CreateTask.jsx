import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskService } from '../services/task.service';
import TaskForm from '../components/tasks/TaskForm.jsx';

export default function CreateTask() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await taskService.create(data);
      toast.success('Task created');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create a Task</h1>
          <p className="page-subtitle">Add a new item to your list.</p>
        </div>
      </div>
      <div className="card p-6">
        <TaskForm onSubmit={handleSubmit} submitLabel="Create task" />
      </div>
    </div>
  );
}
