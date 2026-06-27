const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define(
  'Task',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: { msg: 'Title is required' } },
      set(value) {
        this.setDataValue('title', value.trim());
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
      set(value) {
        this.setDataValue('description', (value || '').trim());
      },
    },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    priority: {
      type: DataTypes.STRING(10),
      defaultValue: 'medium',
      validate: {
        isIn: { args: [['low', 'medium', 'high']], msg: 'Priority must be low, medium, or high' },
      },
    },
    dueDate: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: 'general',
      set(value) {
        this.setDataValue('category', (value || 'general').trim());
      },
    },
    tags: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        try {
          return JSON.parse(this.getDataValue('tags') || '[]');
        } catch {
          return [];
        }
      },
      set(value) {
        this.setDataValue('tags', JSON.stringify(Array.isArray(value) ? value : []));
      },
    },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    indexes: [{ fields: ['userId', 'completed', 'priority'] }],
  }
);

Task.prototype.toJSON = function () {
  const v = this.get();
  v._id = v.id;
  if (v.dueDate) {
    v.dueDate = new Date(v.dueDate).toISOString().slice(0, 10);
  }
  return v;
};

module.exports = Task;
