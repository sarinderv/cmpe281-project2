const AWS = require('aws-sdk')
const ses = new AWS.SES({ region: 'us-west-2' });

exports.handler = event => {
  //eslint-disable-line
  console.log(JSON.stringify(event, null, 2));
  var record = event.Records[0];
    const op = record.eventName;
    console.log(record.eventID);
    console.log(op);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (op === "INSERT") {
      let docName = record.dynamodb.NewImage.doctorId.S;
      let time = record.dynamodb.NewImage.appointmentTime.S;
      let subject = "New appointment with Dr. " + docName;
      let body = "At " + time;
      console.log(subject);
      console.log(body);
      return sendMail(subject, body);
    }
  return Promise.resolve('failed to send AppointmentEmail for DynamoDB record');
};

function sendMail(subject, data) {
  const params = {
    Destination: {
      ToAddresses: ["sarinder.virk@sjsu.edu"],
    },
    Message: {
      Body: {
        Text: { Data: data },
      },
      Subject: { Data: subject },
    },
    Source: "savirk@cmpe281.com",
  };

  try {
    return ses.sendEmail(params).promise();
  } catch (e) {
    console.log("FAILURE IN SENDING MAIL!!", e);
  }
  return;
}
