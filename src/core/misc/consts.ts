import ShortUniqueId from 'short-unique-id';

const uidRepo = new ShortUniqueId({ dictionary: 'number' });

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

export const genBarCode = () => uidRepo.rnd(13);

export const genUID = (len: number = 6, perfix?: string) => uidRepo.rnd(len);

export const dashFormat = (value: string, digit: number = 3) => {
  let result: string = '';
  switch (digit) {
    case 2:
      result = value.replace(/\B(?=(\d{2})+(?!\d))/g, '-');
      break;
    case 3:
      result = value.replace(/\B(?=(\d{3})+(?!\d))/g, '-');
      break;
    case 4:
      result = value.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
      break;
    default:
      result = value.replace(/\B(?=(\d{3})+(?!\d))/g, '-');
      break;
  }
  return result;
};
