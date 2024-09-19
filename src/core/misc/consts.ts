export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER_KEY4TRANSACTION_NAM';

export const USER_INFO_KEY = 'USER_INFO_KEY4DATA';

export const jwtConstants = { secure: 'asdflkw99080w4rn,.cv8i23-089' };

export const ok = (msg?: string | {}) => {
  if (typeof msg === 'string')
    return { message: msg ?? 'Success', statusCode: 200 };
  return { message: 'Success', ...msg, statusCode: 200 };
};

export const OK = ok();

export const notOk = (msg?: string) => {
  return { message: msg ?? 'Unsuccess', statusCode: 201 };
};

export const NOT_OK = notOk();

export const getBarCode = () => {
  return Math.floor(Date.now() * Math.random() * 100000)
    .toString(24)
    .toUpperCase()
    .padEnd(13, '0');
};

export const getUID11 = (prefix?: string) => {
  const code =
    (prefix ?? '') +
    Math.floor(Date.now() * Math.random() * 100000)
      .toString(36)
      .toUpperCase()
      .padStart(11, '0');
  return code.slice(0, 11);
};

export const getUID6 = (prefix?: string) => {
  return (
    (prefix ?? '') +
    Math.floor(Math.random() * (99999 - 10000))
      .toString(8)
      .padStart(6, '0')
  );
};
