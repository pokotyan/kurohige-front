export const UPDATE = Symbol(
  'UPDATE'
);

export const SAVE_SESSION = Symbol(
  'SAVE_SESSION'
);

export const update = payload => ({
  type: UPDATE,
  payload
});

export const saveSession = payload => ({
  type: SAVE_SESSION,
  payload
});
