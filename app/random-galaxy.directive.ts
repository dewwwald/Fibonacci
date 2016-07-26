import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[myRdGalaxy]'
})

export class RandomGalaxyDirective {
	// by using fibonaki well be generating a spiral
	// Fibonaki Config
	iterations = 1;
	sqSize = 10;
	circleCorners = [
		'topLeft',
		'bottomLeft',
		'bottomRight',
		'topRight'
	];
	circleIndex = 0;
	canvas;
	ctx;
	preceding = 0;
	maxIterations = 12;
	fibonakiSeq = [];
	negPos = [-1, 1];

	// this damn complication of origin
	xOff = 0;
	yOff = 0;
	multiplier = 4;
	spiralPixels = 1;

	constructor(el: ElementRef) {
		this.generateFibonaki();
		this.canvas = el.nativeElement;
		this.canvas.style.width = window.innerWidth;
		this.canvas.style.height = window.innerHeight;

		this.canvas.setAttribute('width', window.innerWidth);
		this.canvas.setAttribute('height', window.innerHeight);

		this.ctx = this.canvas.getContext("2d");

		this.calculateFibonakiSpiral(1);
	}

	// then (cb) {
	// 	cb.call(this);
	// }
	generateFibonaki () {
		var term = 2;
		this.fibonakiSeq[term-2] = 1;
		this.fibonakiSeq[term-1] = 1;
		do {
			this.fibonakiSeq[term] = this.fibonakiSeq[term - 1] + this.fibonakiSeq[term - 2];
			term++;
		} while (term <= this.maxIterations);
	}

	circleX (r, a) {
		/*
			r = radius
			cx = origin point x
			a = angle
		*/
		var cx = 0;
		var x = cx + r * Math.cos(a * Math.PI / 180)
		if (a > 0 && a <= 90) {
			return x; 
		}
		else if (a > 90 && a <= 180) {
			return -1 * x;
		}
		else if (a > 180 && a <= 270) {
			return 1 * x;
		}
		else if (a > 270 && a <= 360 || a == 0) {
			return -1 * x;
		}
		else {
			console.error('Case not handled: ' + a)
			return x;
		}
	}

	circleY (r, a) {
		/*
			r = radius
			cy = origin point y
			a = angle
		*/
		var cy = 0;
		var y = cy + r * Math.sin(a * Math.PI / 180)
		if (a > 0 && a <= 90) {
			return y; 
		}
		else if (a > 90 && a <= 180) {
			return -1 * y;
		}
		else if (a > 180 && a <= 270) {
			return 1 * y;
		}
		else if (a > 270 && a <= 360 || a == 0) {
			return -1 * y;
		}
		else {
			console.error('Case not handled: ' + a)
			return y;
		}
	}

	offsetSquareY () {
		// formula only on evens: Tn = F(n) x F(n - 1)
		var F = this.fibonakiSeq;
		var term = this.iterations - 2;
		if(term % 2 == 0) {
			this.yOff = F[term/2] * F[term/2 - 1] * (this.negPos[term/2 % 2]);
			return this.yOff;
		}
		else {
			return this.yOff;	
		}
	}

	offsetSquareX () {
		// formula only on evens: Tn = F(n)^2 x (-1)^n
		var F = this.fibonakiSeq;
		var term = this.iterations - 3;
		if(term % 2 == 0) {
			this.xOff = (F[term/2] * F[term/2]) * (this.negPos[term/2 % 2]);
			return this.xOff;
		}
		else {
			return this.xOff;	
		}
	}

	calculateFibonakiSpiral (iteration) {
		// start drawing at this point
		var startLeft = this.canvas.offsetWidth/3*1.9;
		var startTop = this.canvas.offsetHeight/3*1.9;
		var pre = this.preceding;
		this.preceding = iteration;
		var squareOffsetY;
		var squareOffsetX;
		var spiralPixels = this.spiralPixels;
		if (spiralPixels/this.multiplier > 360) {
			this.spiralPixels = 1;
			spiralPixels = 1;
		}

		/* origin shift x and y offset */

		if (this.iterations == 1 || this.iterations == 2) {
			squareOffsetX = this.xOff * this.sqSize; // value stays the same
		}
		else {
			squareOffsetX = this.offsetSquareX() * this.sqSize;
		}
		if (this.iterations == 1 || this.iterations == 2 || this.iterations == 3) {
			squareOffsetY = this.yOff * this.sqSize; // value stays the same
		}
		else {
			squareOffsetY = this.offsetSquareY() * this.sqSize;
		}

		// if (this.iterations == 1 || this.iterations == 2) {
		// 	squareOffsetX = 1 * this.sqSize; // value stays the same
		// 	squareOffsetY = 1 * this.sqSize; // value stays the same
		// }
		// if (this.iterations == 3) {
		// 	squareOffsetX = 1 * this.sqSize; // value stays the same
		// 	squareOffsetY = 2 * this.sqSize; // value stays the same
		// }
		
		do {
			var offsetLeft = startLeft + this.circleX(this.sqSize * iteration, spiralPixels/this.multiplier) + (squareOffsetX);
			var offsetTop = startTop + this.circleY(this.sqSize * iteration, spiralPixels/this.multiplier) + (squareOffsetY);
			this.ctx.fillStyle = "#FFFFaa";
			this.ctx.fillRect(offsetLeft, offsetTop, 1, 1);
			spiralPixels++;

			if (spiralPixels - this.spiralPixels == 90 * this.multiplier && this.maxIterations >= this.iterations) //final
			{	
				this.iterations++;
				this.circleIndex++;
				this.spiralPixels = spiralPixels;
				this.calculateFibonakiSpiral(iteration+pre);
			}
		} while (spiralPixels - this.spiralPixels <= 90 * this.multiplier);
	}

}
