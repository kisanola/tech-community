const general = (resource, action) =>
  `${resource} has been ${action} successfully`;

export const deleted = resource => general(resource, 'deleted');
export const created = resource => general(resource, 'created');
export const updated = resource => general(resource, 'updated');
export const resetPasswordEmail = resource => general(resource, 'sent');

export const exist = resource => `${resource} already exists`;
export const notExist = resource => `${resource} does not exist`;
export const alreadyExist = resource => `${resource} already exist`;
export const unauthorized = () => 'Unauthorized access';
export const notAllowed = (resource, action) =>
  `${resource} not allowed to ${action}`;
export const alreadyLike = resource => `You already like this ${resource}`;
export const notLiked = resource => `You do not like this ${resource}`;
