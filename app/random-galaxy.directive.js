"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var RandomGalaxyDirective = (function () {
    function RandomGalaxyDirective(el) {
        // by using fibonaki well be generating a spiral
        // Fibonaki Config
        this.iterations = 1;
        this.sqSize = 10;
        this.circleCorners = [
            'topLeft',
            'bottomLeft',
            'bottomRight',
            'topRight'
        ];
        this.circleIndex = 0;
        this.preceding = 0;
        this.maxIterations = 12;
        this.fibonakiSeq = [];
        this.negPos = [-1, 1];
        // this damn complication of origin
        this.xOff = 0;
        this.yOff = 0;
        this.multiplier = 4;
        this.spiralPixels = 1;
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
    RandomGalaxyDirective.prototype.generateFibonaki = function () {
        var term = 2;
        this.fibonakiSeq[term - 2] = 1;
        this.fibonakiSeq[term - 1] = 1;
        do {
            this.fibonakiSeq[term] = this.fibonakiSeq[term - 1] + this.fibonakiSeq[term - 2];
            term++;
        } while (term <= this.maxIterations);
    };
    RandomGalaxyDirective.prototype.circleX = function (r, a) {
        /*
            r = radius
            cx = origin point x
            a = angle
        */
        var cx = 0;
        var x = cx + r * Math.cos(a * Math.PI / 180);
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
            console.error('Case not handled: ' + a);
            return x;
        }
    };
    RandomGalaxyDirective.prototype.circleY = function (r, a) {
        /*
            r = radius
            cy = origin point y
            a = angle
        */
        var cy = 0;
        var y = cy + r * Math.sin(a * Math.PI / 180);
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
            console.error('Case not handled: ' + a);
            return y;
        }
    };
    RandomGalaxyDirective.prototype.offsetSquareY = function () {
        // formula only on evens: Tn = F(n) x F(n - 1)
        var F = this.fibonakiSeq;
        var term = this.iterations - 2;
        if (term % 2 == 0) {
            this.yOff = F[term / 2] * F[term / 2 - 1] * (this.negPos[term / 2 % 2]);
            return this.yOff;
        }
        else {
            return this.yOff;
        }
    };
    RandomGalaxyDirective.prototype.offsetSquareX = function () {
        // formula only on evens: Tn = F(n)^2 x (-1)^n
        var F = this.fibonakiSeq;
        var term = this.iterations - 3;
        if (term % 2 == 0) {
            this.xOff = (F[term / 2] * F[term / 2]) * (this.negPos[term / 2 % 2]);
            return this.xOff;
        }
        else {
            return this.xOff;
        }
    };
    RandomGalaxyDirective.prototype.calculateFibonakiSpiral = function (iteration) {
        // start drawing at this point
        var startLeft = this.canvas.offsetWidth / 3 * 1.9;
        var startTop = this.canvas.offsetHeight / 3 * 1.9;
        var pre = this.preceding;
        this.preceding = iteration;
        var squareOffsetY;
        var squareOffsetX;
        var spiralPixels = this.spiralPixels;
        if (spiralPixels / this.multiplier > 360) {
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
            var offsetLeft = startLeft + this.circleX(this.sqSize * iteration, spiralPixels / this.multiplier) + (squareOffsetX);
            var offsetTop = startTop + this.circleY(this.sqSize * iteration, spiralPixels / this.multiplier) + (squareOffsetY);
            this.ctx.fillStyle = "#FFFFaa";
            this.ctx.fillRect(offsetLeft, offsetTop, 1, 1);
            spiralPixels++;
            if (spiralPixels - this.spiralPixels == 90 * this.multiplier && this.maxIterations >= this.iterations) {
                this.iterations++;
                this.circleIndex++;
                this.spiralPixels = spiralPixels;
                this.calculateFibonakiSpiral(iteration + pre);
            }
        } while (spiralPixels - this.spiralPixels <= 90 * this.multiplier);
    };
    RandomGalaxyDirective = __decorate([
        core_1.Directive({
            selector: '[myRdGalaxy]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], RandomGalaxyDirective);
    return RandomGalaxyDirective;
}());
exports.RandomGalaxyDirective = RandomGalaxyDirective;
//# sourceMappingURL=random-galaxy.directive.js.map