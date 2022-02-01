export interface Fields {
  name: string;
  type: string;
  minlength: number;
  exclude: string;
  connected: string;
  required: boolean;
  additional: string;
  listener: string;
}

export const fields = [
  {
    name: 'username',
    type: 'email',
    minlength: 5,
    exclude: '',
    connected: '',
    listener: 'none',
  },
  {
    name: 'anrede',
    type: 'text',
    minlength: 0,
    exclude: 'Anrede',
    connected: '',
    listener: 'none',
  },
  {
    name: 'vorname',
    type: 'text',
    minlength: 2,
    exclude: '',
    connected: '',
    listener: 'nonumbers',
  },
  {
    name: 'nachname',
    type: 'text',
    minlength: 2,
    exclude: '',
    connected: '',
    listener: 'nonumbers',
  },
  {
    name: 'strasse',
    type: 'text',
    minlength: 2,
    exclude: '',
    connected: '',
    listener: 'nonumbers',
  },
  {
    name: 'hausnummer',
    type: 'number',
    minlength: 1,
    exclude: '',
    connected: '',
    listener: 'numbers',
  },
  {
    name: 'postleitzahl',
    type: 'plz',
    minlength: 5,
    exclude: '',
    connected: '',
    listener: 'numbers',
  },
  {
    name: 'land',
    type: 'text',
    minlength: 4,
    exclude: '',
    connected: '',
    listener: 'none',
  },
  {
    name: 'ort',
    type: 'text',
    minlength: 4,
    exclude: '',
    connected: '',
    listener: 'nonumbers',
  },
  {
    name: 'geburtsdatum',
    type: 'date',
    minlength: 0,
    exclude: '',
    connected: '',
    additional: 'max100',
    listener: 'date',
  },
  {
    name: 'geburterz',
    type: 'date',
    minlength: 0,
    exclude: '',
    connected: '',
    additional: 'max100|min18',
    listener: 'date',
  },
  {
    name: 'namerz',
    type: 'text',
    minlength: 4,
    exclude: '',
    connected: '',
    listener: 'nonumbers',
  },
  {
    name: 'telefonnummer',
    type: 'phone',
    minlength: 7,
    exclude: '',
    connected: 'mobil',
    listener: 'numbers',
  },
  {
    name: 'mobil',
    type: 'phone',
    minlength: 7,
    exclude: '',
    connected: 'telefonnummer',
    listener: 'numbers',
  },
  {
    name: 'password1',
    type: 'password',
    minlength: 1,
    exclude: '',
    connected: 'password2',
    listener: 'none',
  },
  {
    name: 'password2',
    type: 'password',
    minlength: 1,
    exclude: '',
    connected: 'password1',
    listener: 'none',
  },
];

export interface FieldPresets {
  name: string;
  type: string;
  options: Values;
}

export interface Values {
  data_attributes: string;
  value: string;
}

export const laenderlist = [
  { data_attributes: 'value:Deutschland|selected:true', value: 'Deutschland' },
  { data_attributes: 'value:Niederlande', value: 'Niederlande' },
  { data_attributes: 'value:Belgien', value: 'Belgien' },
];

export const position = [
  {
    value: 'Chef',
  },
  {
    value: 'Werkstudent',
  },
  {
    value: 'Azubi',
  },
  {
    value: 'Hilfsarbeiter',
  },
  {
    value: 'Praktikant',
  },
];

export const branche = [
  {
    value: 'Branche 1',
  },
  {
    value: 'Branche 2',
  },
  {
    value: 'Branche 3',
  },
  {
    value: 'Branche 4',
  },
  {
    value: 'Branche 5',
  },
];

export const presets = [
  {
    name: 'land',
    type: 'select',
    options: laenderlist,
  },
  {
    name: 'position',
    type: 'select',
    options: position,
  },
  {
    name: 'branche',
    type: 'select',
    options: branche,
  },
];
