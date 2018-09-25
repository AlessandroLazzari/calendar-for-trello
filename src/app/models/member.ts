import {Board} from './board';

export class Member {
  avatarHash: string;
  constructor(public id?: string,
              public fullName?: string,
              public username?: string,
              public boards?: Board[]) {

  }
}
