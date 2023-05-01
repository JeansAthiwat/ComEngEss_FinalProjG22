const dotenv = require("dotenv");
dotenv.config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  BatchWriteCommand,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// TODO #1.1: Get Events from one user from DynamoDB
exports.getEvents = async (req, res) => {
  const student_id = req.params.student_id;
  // You should change the response below.
  const params = {
    TableName: process.env.aws_events_table_name,
    Key: {
      student_id: student_id,
    },
  };
  try {
    const data = await docClient.send(new GetCommand(params));
    res.send(data);
    console.log("Retrieved item: ",data);
  } catch (err) {
    console.error("Error retrieving item: ", err);
    res.status(500).send(err);
  }
};

// // TODO #1.2: Updates an Event to DynamoDB
exports.updateEvent = async (req, res) => {
  const student_id = req.params.student_id;
  // Set the parameters.
  const params = {
    TableName: process.env.aws_events_table_name,
    Key: {
      student_id: student_id,
    },
    UpdateExpression: "SET events_list = :events_list",
    ExpressionAttributeValues: {
      ":events_list": req.body,
    },
  };
  try {
    const data = await docClient.send(new UpdateCommand(params));
    res.send("updateEvent complete");
    console.log("Success - event_list updated", data);
  } catch (err) {
    console.log("Error -", err);
    res.status(500).send(err);
  }
};

// // TODO #1.3: Updates an assignmet_id_finished to DynamoDB
exports.updateAssignment = async (req, res) => {
  const student_id = req.params.student_id;
  // Set the parameters.
  const params = {
    TableName: process.env.aws_events_table_name,
    Key: {
      student_id: student_id,
    },
    UpdateExpression: "SET assignment_id_finished = :assignment_id_finished",
    ExpressionAttributeValues: {
      ":assignment_id_finished": req.body,
    },
  };
  try {
    const data = await docClient.send(new UpdateCommand(params));
    res.send("conplete");
    console.log("Success - event_list updated", data);
  } catch (err) {
    console.log("Error -", err);
    res.status(500).send(err);
  }
};





// TODO #1.4: add new student+Event to DynamoDB
exports.addEvent = async (req, res) => {
  const event = req.body;

  // You should change the response below.
  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.aws_events_table_name,
        Item: event,
      })
    );
    res.send(event);
    console.log("Success - event_list updated", event);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// req.body = {
//     "L": [
//         {
//             "S": "{\"day\":13,\"month\":11,\"year\":2022,\"events\":[{\"id\":\"22504\",\"title\":\"Event 1 lorem ipsun dolar sit genfa tersd dsad \",\"time\":\"10:00 AM - 10:00 AM\",\"description\":\"hello you need to do this and that bro\",\"subject\":\"E22101225\",\"status\":0},{\"id\":\"sdfsad156384s2df65\",\"title\":\"Event 2 what sub bero\",\"time\":\"10:00 AM - 10:00 AM\",\"description\":\"hello you need to do this and that brofdssdfsd\",\"subject\":\"E221055\",\"status\":1}]}"
//         },
//         {
//             "S": "{\"day\":11,\"month\":12,\"year\":2022,\"events\":[{\"id\":\"22504\",\"title\":\"Event 1 lorem ipsun dolar sit genfa tersd dsad \",\"time\":\"10:00 AM - 10:00 AM\",\"description\":\"hello you need to do this and that bro\",\"subject\":\"E22101225\",\"status\":0},{\"id\":\"sdfsad156384s2df65\",\"title\":\"Event 2 what sub bero\",\"time\":\"10:00 AM - 10:00 AM\",\"description\":\"hello you need to do this and that brofdssdfsd\",\"subject\":\"E221055\",\"status\":1}]}"
//         }
//     ]
// }
