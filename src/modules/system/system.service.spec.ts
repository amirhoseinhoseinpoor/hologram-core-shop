import { NotFoundException } from '@nestjs/common';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, relative } from 'path';
import { SystemService } from './system.service';

describe('SystemService.getPublicFile', () => {
  const previousLocation = process.env.UPLOAD_LOCATION;
  let root: string;
  const media = (fileName: string) => ({ fileName, tag: 'productImage', isPublic: true });
  const serviceFinding = (found: unknown) =>
    new SystemService({ findOneFlexible: async () => found } as never);

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'uploads-'));
    process.env.UPLOAD_LOCATION = relative(process.cwd(), root);
    const folder = join(root, 'public', 'productImage');
    mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, 'photo.PNG'), 'png-bytes');
    writeFileSync(join(folder, 'drawing.svg'), '<svg/>');
  });

  afterAll(() => {
    process.env.UPLOAD_LOCATION = previousLocation;
    rmSync(root, { recursive: true, force: true });
  });

  it('sends the real type and length of an image', async () => {
    const file = await serviceFinding(media('photo.PNG')).getPublicFile('photo');
    const headers = file.getHeaders();
    expect(headers.type).toBe('image/png');
    expect(headers.length).toBe(Buffer.byteLength('png-bytes'));
    file.getStream().destroy();
  });

  it('does not serve svg as an image', async () => {
    const file = await serviceFinding(media('drawing.svg')).getPublicFile('drawing');
    expect(file.getHeaders().type).toBe('application/octet-stream');
    file.getStream().destroy();
  });

  it('answers 404 when the record or the file is missing', async () => {
    await expect(serviceFinding(null).getPublicFile('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      serviceFinding(media('gone.png')).getPublicFile('gone'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
