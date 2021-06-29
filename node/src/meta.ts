import os from 'os';

export const host = os.hostname() || '';
export const port = +(process.env.PORT || 3000);
export const address = `http://${host}:${port}`;