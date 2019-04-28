export const UPDATE = Symbol('UPDATE');

export const update = payload => ({
  type: UPDATE,
  payload,
});
