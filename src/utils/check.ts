import bs58 from 'bs58';

export function isBase58(str:string) {
  try {
    bs58.decode(str);
    return true;
  } catch (e) {
    return false;
  }
}
