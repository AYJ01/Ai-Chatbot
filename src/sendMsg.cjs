import nhost from "../src/NhostClient";

const sendMsg = async (user, message, localid) => {
  try {
    if (!user || !message.trim() || !localid) {
      throw new Error("Missing required parameters: user, message, or localid");
    }

    const mutation = `
      mutation SendMessage($uuid: String!, $localid: Int!, $message: String!, $usertype: String!) {
        insert_messages_user_messages_one(object: {
          uuid: $uuid,
          localid: $localid,
          message: $message,
          usertype: $usertype
        }) {
          message_id
          message
          message_time
          uuid
          localid
          usertype
        }
      }
    `;

    const variables = {
      uuid: user.id,
      localid: parseInt(localid, 10),
      message,
      usertype: "user", 
    };

    const response = await nhost.graphql.request(mutation, variables, {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "HN*XstYbC#p@h&Y!WR+2eY+Uc@X#cE#5",
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log("Message sent:", response.data.insert_messages_user_messages_one);

    return response.data.insert_messages_user_messages_one;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default sendMsg;
