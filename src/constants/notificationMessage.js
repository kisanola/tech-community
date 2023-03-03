export const notifyOwner = ({ username, action, resource, text = '' }) =>
  `${username} has ${action} on your $${resource}. ${text}`;
