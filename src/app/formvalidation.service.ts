import { Injectable } from '@angular/core';
import { Fields, fields, FieldPresets, presets, Values } from '../formdata';
declare var $: any;

@Injectable({ providedIn: 'root' })
export class FormvalidationService {
  constructor() {}
  fields = fields;
  presets = presets;

  validateBase(input: any, field: Fields): boolean {
    console.log('validateBase of ' + input['value']);
    if (input['value'].length < field.minlength) {
      return false;
    }
    var exclude = field.exclude.split('|');
    for (let i = 0; i < exclude.length; i++) {
      if (exclude[i] == input['value']) {
        return false;
      }
    }
    return true;
  }

  validateConnected(
    inputA: string,
    inputB: string,
    fieldA: Fields,
    fieldB: Fields
  ) {
    console.log('validateConnected of ' + inputA + ' and ' + inputB);
    if (fieldA.type == 'password') {
      if (inputA == inputB) {
        return true;
      } else {
        return false;
      }
    } else {
      if (inputA != '' || inputB != '') {
        return true;
      } else {
        return false;
      }
    }
  }

  validateEmail(input: any, field: Fields): boolean {
    console.log('validateEmail of ' + input['value']);
    var result = true;
    result = this.validateBase(input, field);
    var emailCheck =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (!result) {
      return result;
    } else {
      result = emailCheck.test(input['value']);
    }
    return result;
  }

  validateNumber(input: any, field: Fields): boolean {
    console.log('validateNumber of ' + input['value']);
    var result = true;
    result = this.validateBase(input, field);
    var reg = /^\d+$/;
    if (!result) {
      return result;
    } else {
      result = reg.test(input['value']);
    }
    return result;
  }

  validateText(input: any, field: Fields): boolean {
    console.log('validateText of ' + input['value']);
    var result = true;
    result = this.validateBase(input, field);
    return result;
  }

  validatePhone(input: any, field: Fields): boolean {
    console.log('validatePhone of ' + input['value']);
    var result = true;
    result = this.validateBase(input, field);
    if (!result) {
      return result;
    } else {
      result = this.validateNumber(input, field);
    }
    return result;
  }

  validatePlz(input: any, field: Fields): boolean {
    console.log('validatePlz of ' + input['value']);
    var result = true;
    result = this.validateBase(input, field);
    if (!result) {
      return result;
    } else {
      result = this.validateNumber(input, field);
    }
    return result;
  }

  validateDate(input: any, field: Fields): boolean {
    console.log('validateDate of ' + input['value']);
    var result = true;
    var additional = field.additional.split('|');
    var max = parseInt(additional[0]);

    console.log(input);
    console.log('Max: ' + max);
    var date = new Date(input['value']);
    var ts = date.getTime();
    console.log(ts);
    var datum = new Date();
    var heute1 = [datum.getDate(), datum.getMonth() + 1, datum.getFullYear()];

    var today = new Date(heute1[2], heute1[1] - 1, heute1[0]).getTime();
    console.log(today);

    if (ts > today) {
      result = false;
    } else {
      var diff = (today - ts) / (1000 * 365 * 24 * 60 * 60);
      console.log('Difference: ' + diff);
      if (additional[1]) {
        var min = parseInt(additional[1]);
        console.log('Max: ' + max);
        if (diff < min || diff > max) {
          result = false;
        }
      } else {
        if (diff > max) {
          result = false;
        }
      }
    }
    return result;
  }

  validateCheckbox(input: any, field: Fields): boolean {
    console.log('validateCheckbox of ' + input['value']);
    var result = true;
    return result;
  }

  validateForm(input: string): any {
    console.log('validateForm');
    var data = JSON.parse(input);
    console.log(data);
    var final = true;
    var reject = Array<string>();
    var connections = Array<any>();
    //console.log(data.length);
    var objectArray = Object.entries(data);
    objectArray.forEach(([key, value]) => {
      //for (let i = 0; i < data.length; i++) {
      var feld = value;
      var field = this.findField(feld['name']);
      console.log(field);
      var result = false;
      if (field.type == 'email') {
        result = this.validateEmail(feld, field);
      }
      if (field.type == 'text') {
        result = this.validateText(feld, field);
      }
      if (field.type == 'number') {
        result = this.validateNumber(feld, field);
      }
      if (field.type == 'phone') {
        result = this.validatePhone(feld, field);
      }
      if (field.type == 'plz') {
        result = this.validatePlz(feld, field);
      }
      if (field.type == 'date') {
        result = this.validateDate(feld, field);
      }
      console.log('a');
      if (field.connected != '') {
        connections.push([feld, field]);
      }

      if ((result = false)) {
        final = false;
        reject.push(feld['name']);
      }
      //}
    });
    console.log(connections);
    for (let j = 0; j < connections.length; j++) {
      var pair = Array<any>();
      pair.push(connections[j]);
      var search = pair[0][1].connected;
      for (let j2 = 0; j2 < connections.length; j2++) {
        console.log(
          'Connections Name: ' + connections[j2][1].name + ', Search: ' + search
        );
        if (connections[j2][1].name == search) {
          pair.push(connections[j2]);
        }
      }
      //Das Paar sollte nun vollständig sein.
      console.log('Pair');
      console.log(pair);
      var result = this.validateConnected(
        pair[0][0],
        pair[1][0],
        pair[0][1],
        pair[1][1]
      );
      if ((result = false)) {
        final = false;
        reject.push(pair[0][0]['name']);
        reject.push(pair[1][0]['name']);
      }
    }
    return final;
  }

  validatePassword(input: any): number {
    console.log('validatePassword of ' + input['value']);
    //-1 invalid 1 valid (everything over 1 equals higher password strength)
    var result = -1;
    if (input['value'].length > 4) {
      result = 1;
    }
    return result;
  }

  findField(input: string): any {
    var fields = this.fields;
    for (let i = 0; i < fields.length; i++) {
      var ele = fields[i];
      if (ele.name == input) {
        return ele;
      }
    }
  }

  show_source() {
    console.log(this.fields);
  }

  getAge(value: string): number {
    console.log('getAge of ' + value);
    var date = new Date(value);
    var ts = date.getTime();
    console.log(ts);
    var datum = new Date();
    var heute1 = [datum.getDate(), datum.getMonth() + 1, datum.getFullYear()];

    var today = new Date(heute1[2], heute1[1] - 1, heute1[0]).getTime();
    console.log(today);

    var diff = (today - ts) / (1000 * 365 * 24 * 60 * 60);
    return diff;
  }

  onchangeNum(value: string): string {
    //console.log('onchangeNum');
    return value.replace(/[^\d]/g, '');
  }

  onchangeLower(value: string): string {
    //console.log('onchangeNum');
    return value.toLowerCase();
  }

  onchangeNoNum(value: string): string {
    //console.log('onchangeNoNum');
    return value.replace(/[^a-zA-Z]/g, '');
  }

  generateInput(eingabe: Array<any>): string {
    var result = '';
    for (let i = 0; i < eingabe.length; i++) {
      if (result == '') {
        result =
          '{"' +
          i +
          '":{"name":"' +
          eingabe[i][0] +
          '", "value":"' +
          eingabe[i][1] +
          '"}';
      } else {
        result +=
          ',"' +
          i +
          '":{"name":"' +
          eingabe[i][0] +
          '", "value":"' +
          eingabe[i][1] +
          '"}';
      }
    }
    result += '}';
    console.log(result);
    return result;
  }

  getPresets(input: string): any {
    //console.log(this.presets);
    var presets = this.presets;
    var result: any;
    for (let i = 0; i < presets.length; i++) {
      if (input == presets[i].name) {
        result = presets[i];
      }
    }
    return result;
  }

  implementPresets(preset_name: string, id: string) {
    console.log('implement Presets for ' + id + ', load from ' + preset_name);
    var ele_html = document.getElementById(id);
    console.log(ele_html.tagName);
    ele_html.innerHTML = '';
    var preset = this.getPresets(preset_name);
    var objectArray = Object.entries(preset.options);
    objectArray.forEach(([key, value]) => {
      var option = document.createElement('option');
      option.innerHTML = (value as Values).value;
      if (ele_html.tagName != 'DATALIST') {
        var raw = (value as Values).data_attributes;
        //console.log(raw);
        if (raw != '' && raw) {
          var additional = (value as Values).data_attributes.split('|');
          for (let j = 0; j < additional.length; j++) {
            var name = additional[j].split(':')[0];
            var wert = additional[j].split(':')[1];
            option.setAttribute(name, wert);
          }
        }
      }
      ele_html.appendChild(option);
    });
  }

  adjustInput(id: string, type: string) {
    var ele = document.getElementById(id) as HTMLInputElement;
    if (ele.name == 'postleitzahl' || id == 'postleitzahl') {
      ele.maxLength = 5;
    }
    var env = this;
    if (type == 'numbers') {
      ele.addEventListener('input', function (event) {
        this.value = env.onchangeNum(this.value);
      });
    }
    if (type == 'nonumbers') {
      ele.addEventListener('input', function (event) {
        this.value = env.onchangeNoNum(this.value);
      });
    }
    if (type == 'lower') {
      ele.addEventListener('input', function (event) {
        this.value = env.onchangeLower(this.value);
      });
    }
  }

  generellAdjust(input: Array<string>) {
    for (let i = 0; i < input.length; i++) {
      var field = this.findField(input[i]) as Fields;
      if (document.getElementById(input[i])) {
        this.adjustInput(input[i], field.listener);
      }
    }
  }
}
