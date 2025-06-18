import { Filter } from 'bad-words';

const filter = new Filter();

export function checkName(nickname: string): boolean {
  console.log(nickname);
  return filter.isProfane(nickname);
}
