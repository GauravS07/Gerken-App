import { InputFields } from './inputfields';

export class Umfrage {
  id: number;
  titel: string;
  type: number;
  content: string;
  decoded: Array<InputFields>;

  constructor() {
    this.id = 0;
    this.titel = '';
    this.type = 0;
    this.content = '';
    this.decoded = Array<InputFields>();
  }
}
