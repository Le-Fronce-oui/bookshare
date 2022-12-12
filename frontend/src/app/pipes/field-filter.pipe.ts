import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldFilter'
})
export class FieldFilterPipe implements PipeTransform {

  transform(objects: any[], filter: string, field: string = 'name'): any[] {
    if(!objects || !filter) {
      return objects;
    }
    filter = filter.trim().toLocaleLowerCase();
    if(filter.length == 0) {
      return objects;
    }
    return objects.filter(o => o[field].toLocaleLowerCase().includes(filter));
  }

}
