import { SetMetadata } from '@nestjs/common';

export const Provider = () => SetMetadata('isProvider', true);
