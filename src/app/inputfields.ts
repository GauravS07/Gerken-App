export class InputFields {
  id: string;
  notallowed: string;
  required: boolean;
  category: string;
  minlength: number;
  name: string;
  target: string;
  numbersonly: boolean;

  constructor(
    id: string,
    notallowed: string,
    required: boolean,
    category: string,
    minlength: number,
    name: string,
    target: string,
    numbersonly: boolean
  ) {
    this.id = id;
    this.notallowed = notallowed;
    this.required = required;
    this.category = category;
    this.minlength = minlength;
    this.name = name;
    this.target = target;
    this.numbersonly = numbersonly;
  }
}
