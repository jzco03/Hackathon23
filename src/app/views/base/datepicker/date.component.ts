import { Component } from '@angular/core';

@Component({
  selector: 'date-picker',
  templateUrl: './date.component.html'
})
export class DatePickerComponent {

  public date = new Date();

}