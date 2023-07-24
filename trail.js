var trailing = function (settings) {
    'use strict';

    /* HELP FROM
	 * http://hakim.se/experiments/
	 */

    //set public object to store properties and functions
    var pub = {
        canvasId: (settings['canvasId'] !== undefined) ? settings['canvasId'] : 'trailCanvas',
        width: (settings['width'] !== undefined) ? settings['width'] : 1920,
        height: (settings['height'] !== undefined) ? settings['height'] : 1080,
        radius: (settings['radius'] !== undefined) ? settings['radius'] : 110,
        quantity: (settings['quantity'] !== undefined) ? settings['quantity'] : 25,
        particleColor: (settings['particleColor'] !== undefined) ? settings['particleColor'] : '#54bce5',
        particleSize: (settings['particleSize'] !== undefined) ? settings['particleSize'] : 1,
        particleTargetSize: (settings['particleTargetSize'] !== undefined) ? settings['particleTargetSize'] : 16,
        position: { x: 0, y: 0 }
    }

    //set internal poperties and functions
    var internal = {
        canvas: null,
        context: null,
        particles: []
    };

    pub.init = function () {
        //set canvas
        internal.canvas = document.getElementById(pub.canvasId);
        internal.context = internal.canvas.getContext('2d');
        if (internal.canvas && internal.canvas.getContext) {
            internal.createParticles();
            setInterval(internal.loop, 1000 / 120);
        }
    }

    internal.createParticles = function() {
        internal.particles = [];

        for (var i = 0; i < pub.quantity; i++) {
            var particle = {
                position: { x: pub.position.x, y: pub.position.y },
                shift: { x: pub.position.x, y: pub.position.y },
                size: pub.particleSize,
                angle: 0,
                speed: 0.01 + Math.random() * 0.04,
                targetSize: pub.particleTargetSize,
                fillColor: pub.particleColor, //'#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
                orbit: pub.radius * .5 + (pub.radius * .5 * Math.random())
            };

            internal.particles.push(particle);
        }
    }
    
	internal.loop = function() {
		
        //clear the background
        internal.context.clearRect(0, 0, internal.context.canvas.width, internal.context.canvas.height);
		//// Fade out the lines slowly by drawing a rectangle over the entire canvas
        //context.fillStyle = 'rgba(0,0,0,0.05)';
        //context.fillStyle = "rgba(0, 0, 200, 0)";
        //context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        for (var i = 0; i < internal.particles.length; i++) {
            var particle = internal.particles[i];
			
			var lp = { x: particle.position.x, y: particle.position.y };
			
			// Offset the angle to keep the spin going
			particle.angle += particle.speed;
			
			// Follow mouse with some lag
            particle.shift.x += (pub.position.x - particle.shift.x) * (particle.speed);
            particle.shift.y += (pub.position.y - particle.shift.y) * (particle.speed);
			
			// Apply position
			particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit);
			particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit);
			
			// Limit to screen bounds
			particle.position.x = Math.max( Math.min( particle.position.x, pub.width ), 0 );
			particle.position.y = Math.max( Math.min( particle.position.y, pub.height ), 0 );
			
			particle.size += ( particle.targetSize - particle.size ) * 0.05;
			
			// If we're at the target size, set a new one. Think of it like a regular day at work.
			if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
				particle.targetSize = 1 + Math.random() * 7;
			}
			
			internal.context.beginPath();
            internal.context.fillStyle = particle.fillColor;
            internal.context.strokeStyle = particle.fillColor;
            internal.context.lineWidth = particle.size;
            internal.context.moveTo(lp.x, lp.y);
            internal.context.lineTo(particle.position.x, particle.position.y);
            internal.context.stroke();
            internal.context.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI*2, true);
            internal.context.fill();
		}
	}

    return pub;
};