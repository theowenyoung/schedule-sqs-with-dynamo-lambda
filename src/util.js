exports.getTimestamp = function () {
  return Math.floor(Date.now() / 1000);
};

exports.recordToQueueMessage = record => {
  let dueToTime = record.triggeredAt - Date.now();
  if (dueToTime > 0) {
    // do nothing
  } else {
    dueToTime = 0;
  }
  let MessageBody = '{}';
  if (record.payload) {
    MessageBody = JSON.stringify(record.payload);
  }
  return {
    Id: record.id,
    MessageBody: MessageBody,
    DelaySeconds: dueToTime
  };
};
