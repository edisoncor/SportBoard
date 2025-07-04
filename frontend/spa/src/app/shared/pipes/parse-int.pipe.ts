import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseint',
  standalone: true
})
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    return parseInt(value, 10);
  }
}
