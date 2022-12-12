import { Pipe, PipeTransform } from '@angular/core';
import ShortBookDTO from '../classes/dto/books/short';

@Pipe({
  name: 'bookFilterPipe'
})
export class BookFilterPipePipe implements PipeTransform {

  transform(books: ShortBookDTO[], filter: string): ShortBookDTO[] {
    if(!books || !filter) {
      return books;
    }
    filter = filter.trim().toLocaleLowerCase();
    if(filter.length == 0) {
      return books;
    }
    return books.filter(b => b.name.toLocaleLowerCase().includes(filter));
  }

}
