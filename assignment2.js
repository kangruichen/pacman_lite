import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        this.arrays.position = Vector3.cast([-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1,-1,-1],[-1,1,-1],[-1,-1,1],[-1,1,1],[1,-1,-1],[1,1,-1],[1,-1,1],[1,1,1]);
        //this.arrays.position = Vector3.cast([-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],[1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1]);
        const white = color(1, 1, 1, 1);
        for (let i = 0; i < 24; i++) {
            this.arrays.color.push(white);
        }
        this.indices = false;
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        this.arrays.position = Vector3.cast([-1,-1,1],[-1,-1,-1],[-1,1,-1],[-1,1,1],
            [1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]);//the 8 point that form the cube
        this.arrays.normal = this.arrays.position;
        //this.indices = [0,4,7,6,3,2,1,6,5,4,1,0,3,7];
        this.indices = [0,4,7,5,6,2,7,3,0,2,1,5,0,4];
        //this.indices = [0,7,4,5,0,1,2,5,6,7,2,3,0,2];
        // TODO (Requirement 6)
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        this.outlined = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'strip': new Cube_Single_Strip(),
            sphere: new defs.Subdivision_Sphere(4),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            pacman: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#FFFF00"), specular: 0.6}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());

        // Direction status
        this.up = this.down = this.left = this.right = false;
        this.up2 = this.down2 = this.left2 = this.right2 = false;

        // Initial location of pacman
        this.pacman_transform = Mat4.identity();
        this.pacman_transform = this.pacman_transform.times(Mat4.translation(12, 0, -4));
        this.pacman_transform2 = Mat4.identity();
        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(-12, 0, -4));
    }


    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        this.initial_camera_location = Mat4.look_at(vec3(0, 35, 10), vec3(0, 20, 0), vec3(0, 1, 0)).times(Mat4.translation(1,0,0));
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment2 extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    set_colors() {
        // TODO:  Create a class member variable to store your cube's colors.
        let cnt = 0
        let len_c = this.color.length;
        //this.color = []
        while (cnt<9){
            this.color.pop();
            cnt+=1
        }
        cnt = 0
        while (cnt<8){
            if (len_c >= 2 && this.color[0] === this.color[1]) {
                this.color.pop();
                this.color.push(color(Math.random(),
                    Math.random(), Math.random(), 1.0));
            }
            else{
                this.color.push(color(Math.random(),
                    Math.random(), Math.random(), 1.0));
                cnt = cnt+1
            }
        }
        // Hint:  You might need to create a member variable at somewhere to store the colors, using `this`.
        // Hint2: You can consider add a constructor for class Assignment2, or add member variables in Base_Scene's constructor.
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
            this.outlined = !this.outlined;
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
            this.hover = !this.hover;
        });

        // Directions for player #1
        this.key_triggered_button("Move up", ["ArrowUp"], () => {
            this.up = true;
        });
        this.key_triggered_button("Move down", ["ArrowDown"], () => {
            this.down = true;
        });
        this.key_triggered_button("Move left", ["ArrowLeft"], () => {
            this.left = true;
        });
        this.key_triggered_button("Move right", ["ArrowRight"], () => {
            this.right = true;
        });

        // Directions for player #2
        this.key_triggered_button("Move up", ["w"], () => {
            this.up2 = true;
        });
        this.key_triggered_button("Move down", ["s"], () => {
            this.down2 = true;
        });
        this.key_triggered_button("Move left", ["a"], () => {
            this.left2 = true;
        });
        this.key_triggered_button("Move right", ["d"], () => {
            this.right2 = true;
        });
    }

    draw_box(context, program_state, model_transform) {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        // Hint:  You can add more parameters for this function, like the desired color, index of the box, etc.
        let clk = this.t = program_state.animation_time * Math.PI *2 / 1000;
        if (clk == 0) {
            this.color = [];
            let cnt = 0;
            while (cnt<8){
                if (this.color.length >= 2 && this.color[0] === this.color[1]) {
                    this.color.pop();
                    this.color.push(color(Math.random(),
                        Math.random(), Math.random(), 1.0));
                }
                else{
                    this.color.push(color(Math.random(),
                        Math.random(), Math.random(), 1.0));
                    cnt = cnt+1
                }
            }
        }
        //model_transform = model_transform.times(Mat4.scale(1, 1.5 , 1));

        if (!this.outlined){
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));}
        else{
            this.shapes.outline.draw(context, program_state, model_transform, this.white,"LINES");}
        //model_transform = model_transform.times(Mat4.scale(1, 1/1.5, 1));



        const t = this.t = program_state.animation_time / 1000;

        //Outline sample
        //model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        //this.shapes.outline.draw(context, program_state, model_transform, this.white,"LINES");

        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));

        // Blocks for boundary
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(24, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, -2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));

        // ... more blocks for the map ...
        model_transform = model_transform.times(Mat4.translation(20, 0, -6));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));

        model_transform = Mat4.identity();  // reset to origin

        // Draw pacman #1 (speed = 0.2)
        if (this.up){
            this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, -0.2));
            if (this.down === true || this.left === true || this.right === true)  this.up = false;
        }
        if (this.down){
            this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, 0.2));
            if (this.up === true || this.left === true || this.right === true)  this.down = false;
        }
        if (this.left){
            this.pacman_transform = this.pacman_transform.times(Mat4.translation(-0.2, 0, 0));
            if (this.up === true || this.down === true || this.right === true)  this.left = false;
        }
        if (this.right){
            this.pacman_transform = this.pacman_transform.times(Mat4.translation(0.2, 0, 0));
            if (this.up === true || this.down === true || this.left === true)  this.right = false;
        }

        this.up = this.down = this.left = this.right = false;  // reset for next time instance
        this.shapes.sphere.draw(context, program_state, this.pacman_transform, this.materials.pacman);

        // Draw pacman #2 (speed = 0.2)
        if (this.up2){
            this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, -0.2));
            if (this.down === true || this.left === true || this.right === true)  this.up = false;
        }
        if (this.down2){
            this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, 0.2));
            if (this.up === true || this.left === true || this.right === true)  this.down = false;
        }
        if (this.left2){
            this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(-0.2, 0, 0));
            if (this.up === true || this.down === true || this.right === true)  this.left = false;
        }
        if (this.right2){
            this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0.2, 0, 0));
            if (this.up === true || this.down === true || this.left === true)  this.right = false;
        }

        this.up2 = this.down2 = this.left2 = this.right2 = false;  // reset for next time instance
        this.shapes.sphere.draw(context, program_state, this.pacman_transform2, this.materials.pacman);

        //Triangle_strip sample
        //model_transform = model_transform.times(Mat4.translation(-8, 0, 0));
        //this.shapes.strip.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[1]),"TRIANGLE_STRIP");

        /*
        let k = 0.025 * Math.PI;
        let count = 0;
        let a = 1;


        while (count<7) {
            model_transform = model_transform.times(Mat4.translation(-a, a*1.5, 0));
            if (!this.hover) {
                model_transform = model_transform.times(Mat4.rotation(-(Math.cos(clk) + 1) * k, 0, 0, 1));
            }

            model_transform = model_transform.times(Mat4.rotation(  Math.PI+k*2, 0, 0, 1));
            model_transform = model_transform.times(Mat4.scale(1, 1.5 , 1));
            model_transform = model_transform.times(Mat4.translation(-a, -a, 0));
            if (!this.outlined) {
                if (count % 2 != 0) {
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[count + 1]));
                }
                else{
                    this.shapes.strip.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[count + 1]),"TRIANGLE_STRIP");
                }
            }
            else{
                this.shapes.outline.draw(context, program_state, model_transform, this.white,"LINES");
            }
            model_transform = model_transform.times(Mat4.scale(1, 1/1.5 , 1));
            a = -a;
            count += 1;
        }*/

        return model_transform;
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();
        this.draw_box(context,program_state,model_transform);
        //abc


        // TODO:  Draw your entire scene here.  Use this.draw_box( graphics_state, model_transform ) to call your helper.
    }
}