import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldBoolean'
})
export class FieldBooleanPipe implements PipeTransform {

  transform(objects: any[], field: string, invert: boolean = false): unknown {
    if(!objects || !field) {
      return objects;
    }
    if(invert) {
      return objects.filter(o => !o[field]);
    }
    return objects.filter(o => o[field]);
  }

}
