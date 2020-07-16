# Schedule SQS WITH Dynamo and Lambda

This project provides a solution for AWS SQS long live time schedule.

You can use it to have a schedule queue feature at AWS SQS.

## How it works?

We use the SQS can delay 15 minutes, and a 10 minutes schedule lambda function to scan dynamo queues, add the future 15 minutes queue to the SQS.

1. Use push a queue to SQS
1. A trigger lambda function will add it to dynamo,
1. A schedule lambda function(run every 10 minutes) will get the future 15minutes item to the SQS
1. the trigger queue will be triggered at the right time.

## How to deploy?

### 1. Create tables

Your can run `yarn db:show` to look the tables structure details, or direct create a table named `schedule_queue_schedules` at [console](https://console.aws.amazon.com/dynamodb/home), with the Primary key `id`, type: `String`, and Secondary indexes with `StatusIndex(String)` , rangeKey `triggeredAt(Number)`

or, if you set the enviroment `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, you can run follow commands to create db tables for aws dynamodb

```bash
NODE_ENV=production yarn db:init
```

### 2. Create receive queue for receive schedule queue

Create a queue named `schedule_receive_queue` at [SQS Console](https://console.aws.amazon.com/sqs/v2/home)

### 3. Deploy dependence layer

First you should run `make init-deploy-layer`, run `make deploy-layer` for the future.

### 4. Deploy schedule app

change the `template.yaml`, Change the `Mappings.Layers.NodeModules.ARN` to the node_modules layer arn (previous step result), you can found it at [here](https://console.aws.amazon.com/lambda/home?#/layers)

and run `make init-deploy`, run `make deploy` for the future.

### 5. Create a due queue for receive the queue that should triggered

Create a queue, you can name it as `schedule_due_queue` at [SQS Console](https://console.aws.amazon.com/sqs/v2/home)

### 6. Test send a schedule queue to the receive queue,

Open [SQS Console](https://console.aws.amazon.com/sqs/v2/home), enter `schedule_receive_queue`, Click `Send and receive messages`,

input follow content at Message body:

> Note: Change the `triggered_at`, `queue_url` to yours.

```json
{
  "queue_url": "https://sqs.us-west-1.amazonaws.com/912951144733/schedule_due_queue",
  "payload": {
    "test": "test"
  },
  "triggered_at": 1594916118000
}
```

if the triggered_at is less than or equal current time, then you can found a queue at the due queue (createed at step 5)

Or, you can send a future triggered message, the message will send to due queue at the right time.
