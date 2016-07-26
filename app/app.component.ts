import { Component } from '@angular/core';
import { GalaxyComponent } from './galaxy.component';
import { RandomGalaxyDirective } from './random-galaxy.directive';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [
	  GalaxyComponent,
	  RandomGalaxyDirective
  ]
})

export class AppComponent { }
