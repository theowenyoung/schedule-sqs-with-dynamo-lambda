const db = require('./connection');
const config = require('./config');
const schema = new db.Schema(
  {
    id: {
      hashKey: true,
      type: String,
      required: true
    },
    queueUrl: {
      type: String,
      required: true
    },
    payload: {
      type: Object
    },
    status: {
      type: String,
      defualt: 'active',
      index: {
        name: 'statusIndex',
        global: true
      }
    },
    triggeredAt: {
      type: Number,
      required: true,
      index: {
        name: 'triggeredAtIndex',
        global: true
      }
    }
  },
  {
    saveUnknown: ['payload.**'],
    timestamps: true
  }
);
const QueueSchedule = db.model('queue_schedules', schema, {
  prefix: config.tablePrefix,
  create: false,
  throughput: 'ON_DEMAND',
  waitForActive: false
});

module.exports = QueueSchedule;
