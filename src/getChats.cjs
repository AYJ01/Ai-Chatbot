import nhost from "../src/NhostClient";

const getChats = async (user, setChats) => {
  try {
    const token = nhost.auth.getDecodedAccessToken();

    const query = `
      query GetChats($userId: String!) {
  messages_user_messages(
    where: { uuid: { _eq: $userId } }
  ) {
    message_id
    message
    message_time
    usertype
    uuid
    reply
    localid
  }
}
    `;

    const response = await nhost.graphql.request(query, { userId: user.id }, {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': 'HN*XstYbC#p@h&Y!WR+2eY+Uc@X#cE#5',
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    console.log(response.data.messages_user_messages)
    const sortedChats = Object.values(response.data.messages_user_messages).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setChats(sortedChats);
    
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
};

export default getChats;