import { Component } from '@angular/core';
import { RandomGalaxyDirective } from './random-galaxy.directive';

@Component({
	selector: 'galaxy',
	templateUrl: 'app/galaxy.component.html',
	directives: [
		RandomGalaxyDirective
	]
})

export class GalaxyComponent {}
