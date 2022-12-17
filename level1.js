const Matter = window.Matter;

// var w = window.innerWidth;
// var h = window.innerHeight;

var w = 1000;
var h = 1000;

// window.onresize = function(event) {
//     w = window.innerWidth;
//     h = window.innerHeight;
// };

go();
window.addEventListener('resize', go);

function go(){
    w = window.innerWidth;
    h = window.innerHeight;
}

console.log("W", w, h)

let engine = Matter.Engine.create();
let render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth, 
        height: window.innerHeight, 
        wireframes: false
    }
});

let startX = 400;
let startY = 600;

// gravity
engine.world.gravity.y = 0;
// engine.velocity.x = 1;

// Screen Borders
let border1 = Matter.Bodies.rectangle(w/2, h+30, w, 60, {isStatic: true});
let border2 = Matter.Bodies.rectangle(-30, 0, 60, w, {isStatic: true});
let border3 = Matter.Bodies.rectangle(w+30, 0, 60, w, {isStatic: true});
let border4 = Matter.Bodies.rectangle(h+30, -30, w, 60, {isStatic: true});

let netX = 400;
let netY = 50;
let netLengthX = 400;
let netLengthY = 40
let width = 20;
let height = 100;

let wall1 = Matter.Bodies.rectangle(netX, netY-50, netLengthX, width*2, {isStatic: true, render: {fillStyle: '#EBE3E1'}});
let wall2 = Matter.Bodies.rectangle(netX-netLengthX/2, netY, width, height, {isStatic: true, render: {fillStyle: '#EBE3E1'}});
let wall3 = Matter.Bodies.rectangle(netX+netLengthX/2, netY, width, height, {isStatic: true, render: {fillStyle: '#EBE3E1'}});
let wall4 = Matter.Bodies.rectangle(netX-((800-netLengthX)*2/4+netLengthX)/2, netY, (800-netLengthX)/2, height, {isStatic: true, render: {fillStyle: '#EBE3E1'}});
let wall5 = Matter.Bodies.rectangle(netX+((800-netLengthX)*2/4+netLengthX)/2, netY, (800-netLengthX)/2, height, {isStatic: true, render: {fillStyle: '#EBE3E1'}});

// let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
// let boxB = Matter.Bodies.rectangle(450, 50, 80, 80);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {visible: false}
    },
    collisionFilter: {mask: 1}
});
console.log(mouse, mouseConstraint)
render.mouse = mouse;

let ball = Matter.Bodies.circle(300, 600, 15, {
    restitution: 1,
    collisionFilter: {mask: 1}
});
let sling = Matter.Constraint.create({
    pointA: {x:startX, y:startY},
    bodyB: ball,
    stiffness: 0.7,
    length: 5,
})

let firing = false;
Matter.Events.on(mouseConstraint, 'enddrag', function(e) {
    if (e.body === ball) firing = true;
});

function win(circle) {
    Matter.World.remove(engine.world, ball);
    for (var i = 0; i < 3; i++) { 
        circle.circleRadius += 3; 
    }
}

let circles = [];
Matter.Events.on(engine, 'afterUpdate', function(){
    if (firing && Math.abs(ball.position.x-startX) < 20 && Math.abs(ball.position.y-startY) < 20) {
        circles.push(ball);
        ball = Matter.Bodies.circle(startX, startY, 15, {restitution: 1});
        Matter.World.add(engine.world, ball);
        sling.bodyB = ball;
        firing = false;
    } else {
        for (var i = 0; i < circles.length; i++) { 
            console.log(sling, ball, circles) 
            // circles[i].collisionFilter.mask = 2;
            if (netX-netLengthX/2 < circles[i].position.x < netX+netLengthX/2 && circles[i].position.y < netY+netLengthY) {
                circles[i].restitution = 0.00001;
                if (circles[i].speed < 0.1 && circles[i].speed < 0.1 && circles[i].circleRadius < 1000){
                    win(circles[i])
                }
            }
            else if (circles[i].speed < 0.01 && circles[i].speed < 0.01)
                Matter.World.remove(engine.world, circles[i]);
        }
    }
});



// Matter.World.add(engine.world, [boxA, boxB, ground, mouseConstraint])
Matter.World.add(engine.world, [wall1, wall2, wall3, wall4, wall5, border1, border2, border3, border4, ball, sling, mouseConstraint])
Matter.Engine.run(engine);
Matter.Render.run(render);