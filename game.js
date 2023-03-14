import {defs, tiny} from './examples/common.js';
import {Text_Line} from "./examples/text-demo.js";
import {Obj_File_Demo} from './examples/obj-file-demo.js';
import {Shape_From_File} from './examples/obj-file-demo.js';

//This is the main file
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Texture, Scene, Shader
} = tiny;

const blue = hex_color("#1a9ffa");

const {Textured_Phong} = defs;

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
    }
}


class Base_Scene extends Scene {
    constructor() {
        super();
        this.hover = this.swarm = false;
        this.outlined = this.swarm = false;
        this.swarm2 = false;

        this.shapes = {
            'cube': new Cube(),
            box_start_page: new defs.Cube(),
            'outline': new Cube_Outline(),
            'strip': new Cube_Single_Strip(),
            sphere: new defs.Subdivision_Sphere(4),
            pacman: new Shape_From_File("assets/pacmanRotateY90.obj"),
            pacmanMouthClose: new Shape_From_File("assets/pacmanMouthClose1.obj"),
            pacmanEyes: new Shape_From_File("assets/pacmanEyes2.obj"),
            bean: new Shape_From_File("assets/beanPixel8.obj"),
            cherryStem: new Shape_From_File("assets/cherryStem1.obj"),
            cherrySphere: new Shape_From_File("assets/cherrySphere1.obj"),
            text: new Text_Line(35)
        };


        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            pacman: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#FFFF00"), specular: 0.6}),
            pacman2: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#FFC0CB"), specular: 0.6}),
            pacmanEyes: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#000000"), specular: 0.6}),
            bean: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#FFE333"), specular: 0.6}),
            cherryStem: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#694E2A"), specular: 0.6}),
            cherrySphere: new Material(new defs.Phong_Shader(),
                {ambient: 0.2, diffusivity: 1, color: hex_color("#E70035"), specular: 0.6}),
            text_image: new Material(new defs.Textured_Phong(1),
                {ambient: 1, diffusivity: 0, texture: new Texture("assets/stars.png")}),
            start_page: new Material(new defs.Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/titleScreen5.png", "NEAREST")
            }),
            timeIsUp_page: new Material(new defs.Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/TimeIsUpScreen.png", "NEAREST")
            })
        };

        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());

        // Game status
        this.status = "START";
        this.paused = true;

        // Timer
        this.timerCount = 120;
        this.timerCountShown = 120;

        // Direction status
        this.up = true;
        this.down = this.left = this.right = false;
        this.up2 = true;
        this.down2 = this.left2 = this.right2 = false;
        this.rotate = this.swarm= false;
        this.rotate2 = this.swarm2 = false;

        // Initial location of pacman
        this.pacman_transform = Mat4.identity();
        this.pacman_transform = this.pacman_transform.times(Mat4.translation(3, 0, -26));
        this.direction = 'up';
        this.pacman_transform2 = Mat4.identity();
        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(-15, 0, -3));
        this.direction2 = 'up';

        this.pac1_front = -27;
        this.pac1_left = 2;
        this.pac1_right = 4;
        this.pac1_back = -25;

        this.pac2_front = -4;
        this.pac2_left = -16;
        this.pac2_right = -14;
        this.pac2_back = -2;

        this.bean_location = [];
        this.bean_status = [];

        this.poison_location = [];
        this.poison_status = [];

        this.cherry_stem_location = [];
        this.cherry_sphere_location = [];
        this.cherry_status = [];

        this.block_location = [];

        this.pac1_poison = [];
        this.pac2_poison = [];
        this.pac1_bean_location = [];
        this.pac2_bean_location = [];
        this.pac1_bean_status = [];
        this.pac2_bean_status = [];

        // Score board
        this.total_score = 0;
        this.score1 = 0;
        this.score2 = 0;

        this.creation = true;
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        //Second parameter of the first vec3 controls the height of the camera. Can also be adjusted in the translation at the end.
        this.initial_camera_location = Mat4.look_at(vec3(0, 75, 1), vec3(0, 21, -1), vec3(0, 1, 0)).times(Mat4.translation(-2,0,25));
        if (!context.scratchpad.controls) {
            //this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        let light_position = vec4(0, 200, -30, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 50000)];
    }
}

export class Game extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    set_colors() {
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
        // Hint: You might need to create a member variable at somewhere to store the colors, using `this`.
        // Hint2: You can consider add a constructor for class Assignment2, or add member variables in Base_Scene's constructor.
    }

    make_control_panel() {
        if(this.status === "PLAY" || this.status === "PLAY2") {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
            //this.control_panel.innerHTML += 'Use WASD to control Pacman 1, arrow keys to control Pacman 2.';
            this.live_string(box => box.textContent = "Use WASD to control Pacman 1, arrow keys to control Pacman 2.");
            this.new_line();
            this.live_string(box => box.textContent = "Timer: " + this.timerCountShown.toFixed(2));
            this.new_line();

            if(this.timerCount <= 0){
                this.live_string(box => box.textContent = "Time is Up!");
                this.new_line();
            }
            this.live_string(box => box.textContent = "-Pacman1 front: " + this.pac1_front.toFixed(2) + ", back: " + this.pac1_back.toFixed(2)
                + ", left: " + this.pac1_left.toFixed(2) + ", right: " + this.pac1_right.toFixed(2));
            this.new_line();
            this.live_string(box => box.textContent = "-Pacman2 front: " + this.pac2_front.toFixed(2) + ", back: " + this.pac2_back.toFixed(2)
                + ", left: " + this.pac2_left.toFixed(2) + ", right: " + this.pac2_right.toFixed(2));
            this.live_string(box => box.textContent = "-Total score: " + this.total_score.toFixed(0));
            this.new_line();
            this.live_string(box => box.textContent = "-Player #1 score: " + this.score1.toFixed(0));
            this.new_line();
            this.live_string(box => box.textContent = "-Player #2 score: " + this.score2.toFixed(0));
            this.new_line();

            this.countdown = 0;
            this.countdown2 = 0;

            // Directions for player #1
            this.key_triggered_button("Move up", ["ArrowUp"], () => {
                if (this.countdown === 0) {
                    this.down = false;
                    this.right = false;
                    this.left = false;
                    if (this.up === false) {
                        this.countdown = 30;
                    }
                    this.up = true;
                    this.i1 = 0;
                }

            });
            this.key_triggered_button("Move down", ["ArrowDown"], () => {
                if (this.countdown === 0) {
                    this.up = false;
                    this.right = false;
                    this.left = false;
                    if (this.down === false) {
                        this.countdown = 30;
                    }
                    this.down = true;
                    this.i1 = 0;
                }

            });
            this.key_triggered_button("Move left", ["ArrowLeft"], () => {
                if (this.countdown === 0) {
                    this.down = false;
                    this.right = false;
                    this.up = false;
                    if (this.left === false) {
                        this.countdown = 30;
                    }
                    this.left = true;
                    this.i1 = 0;
                }
            });
            this.key_triggered_button("Move right", ["ArrowRight"], () => {
                if (this.countdown === 0) {
                    if (this.right === false) {
                        this.countdown = 30;
                    }
                    this.down = false;
                    this.left = false;
                    this.up = false;
                    this.right = true;
                    this.i1 = 0;
                }
            });

            // Directions for player #2
            this.key_triggered_button("Move up", ["w"], () => {
                if (this.countdown2 === 0) {
                    this.down2 = false;
                    this.right2 = false;
                    this.left2 = false;
                    if (this.up2 === false) {
                        this.countdown2 = 30;
                    }
                    this.up2 = true;
                    this.i = 0;
                }
            });
            this.key_triggered_button("Move down", ["s"], () => {
                if (this.countdown2 === 0) {
                    this.up2 = false;
                    this.left2 = false;
                    this.right2 = false;
                    if (this.down2 === false) {
                        this.countdown2 = 30;
                    }
                    this.down2 = true;
                    this.i = 0;
                }
            });
            this.key_triggered_button("Move left", ["a"], () => {
                if (this.countdown2 === 0) {
                    this.right2 = false;
                    this.up2 = false;
                    this.down2 = false;
                    this.i = 0;
                    if (this.left2 === false) {
                        this.countdown2 = 30;
                    }
                    this.left2 = true;
                }
            });
            this.key_triggered_button("Move right", ["d"], () => {
                if (this.countdown2 === 0) {
                    this.left2 = false;
                    this.up2 = false;
                    this.down2 = false;
                    this.i = 0;
                    if (this.right2 === false) {
                        this.countdown2 = 30;
                    }
                    this.right2 = true;
                }
            });

            // Quit the game
            this.key_triggered_button("Quit", ["q"], () => {
                this.status = "START";
                this.paused = true;

                // Remove buttons on START page
                let buttons = document.getElementsByTagName('button');
                while(buttons.length > 0){
                    buttons[0].parentNode.removeChild(buttons[0]);
                }
                let live_strings = document.getElementsByClassName('live_string');
                while(live_strings.length > 0){
                    live_strings[0].parentNode.removeChild(live_strings[0]);
                }
                let new_lines = document.getElementsByTagName('br');
                while(new_lines.length > 0){
                    new_lines[0].parentNode.removeChild(new_lines[0]);
                }

                // Add main game buttons
                this.make_control_panel();
            });
        }

        // Other temporary game status (default to one mode)
        else if(this.status == "START") {
            this.live_string(box => box.textContent = "Welcome to the Ultimate Pacman!");
            this.new_line();
            this.live_string(box => box.textContent = "You have 60 seconds to complete the game!");
            this.new_line();
            this.live_string(box => box.textContent = "Timer: 60");
            this.new_line();

            this.key_triggered_button("Collab Mode", ["y"], () => {
                this.status = "PLAY";
                this.paused = false;

                // Remove stuff on START page
                let buttons = document.getElementsByTagName('button');
                while(buttons.length > 0){
                    buttons[0].parentNode.removeChild(buttons[0]);
                }
                let live_strings = document.getElementsByClassName('live_string');
                while(live_strings.length > 0){
                    live_strings[0].parentNode.removeChild(live_strings[0]);
                }
                let new_lines = document.getElementsByTagName('br');
                while(new_lines.length > 0){
                    new_lines[0].parentNode.removeChild(new_lines[0]);
                }

                // Add stuff on PLAY page
                this.make_control_panel();
            });
            this.key_triggered_button("Compete Mode", ["n"], () => {
                this.status = "PLAY2";
                this.paused = false;

                // Remove buttons on START page
                let buttons = document.getElementsByTagName('button');
                while(buttons.length > 0){
                    buttons[0].parentNode.removeChild(buttons[0]);
                }
                let live_strings = document.getElementsByClassName('live_string');
                while(live_strings.length > 0){
                    live_strings[0].parentNode.removeChild(live_strings[0]);
                }
                let new_lines = document.getElementsByTagName('br');
                while(new_lines.length > 0){
                    new_lines[0].parentNode.removeChild(new_lines[0]);
                }

                // Add stuff on PLAY2 page
                this.make_control_panel();
            });
        }

        else if(this.status == "TIMEISUP") {
            this.live_string(box => box.textContent = "Time is Up!");
            this.new_line();
            this.live_string(box => box.textContent = "Thank you very much for playing!");
            this.new_line();
            this.live_string(box => box.textContent = "Timer: 0.00");
            this.new_line();

            this.key_triggered_button("Collab Mode", ["y"], () => {
                this.status = "PLAY";
                this.paused = false;

                // Remove stuff on START page
                let buttons = document.getElementsByTagName('button');
                while(buttons.length > 0){
                    buttons[0].parentNode.removeChild(buttons[0]);
                }
                let live_strings = document.getElementsByClassName('live_string');
                while(live_strings.length > 0){
                    live_strings[0].parentNode.removeChild(live_strings[0]);
                }
                let new_lines = document.getElementsByTagName('br');
                while(new_lines.length > 0){
                    new_lines[0].parentNode.removeChild(new_lines[0]);
                }

                // Add stuff on PLAY page
                this.make_control_panel();
            });
            this.key_triggered_button("Compete Mode", ["n"], () => {
                this.status = "PLAY2";
                this.paused = false;

                // Remove buttons on START page
                let buttons = document.getElementsByTagName('button');
                while(buttons.length > 0){
                    buttons[0].parentNode.removeChild(buttons[0]);
                }
                let live_strings = document.getElementsByClassName('live_string');
                while(live_strings.length > 0){
                    live_strings[0].parentNode.removeChild(live_strings[0]);
                }
                let new_lines = document.getElementsByTagName('br');
                while(new_lines.length > 0){
                    new_lines[0].parentNode.removeChild(new_lines[0]);
                }

                // Add stuff on PLAY2 page
                this.make_control_panel();
            });
        }
    }

    draw_box(context, program_state, model_transform) {
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

        const t = this.t = program_state.animation_time / 1000;
        this.t = 0;


        // Set game status
        if(this.status == "START") {
            this.paused = true;
            this.initial_camera_location = Mat4.look_at(vec3(0, 0, 40), vec3(0, 0, 0), vec3(0, 1, 4.5));
            //this.initial_camera_location = Mat4.look_at(vec3(0, 2, 13), vec3(0, 0, 0), vec3(0, 1, 0));
            let light_position = vec4(0, -5, -5, -1);
            program_state.set_camera(this.initial_camera_location);
            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

            let model_transform = Mat4.identity();

            let TrPacman2Eye1Title = Mat4.translation(-0.2, 1, 0.05);
            let TrPacman2Eye2Title = Mat4.translation(-0.2, -1, 0.05);
            let ScPacman2EyeTitle = Mat4.scale(.2, .2, .2);
            model_transform = model_transform.times(Mat4.rotation(0.5*Math.PI, 1, 0, 0));
            model_transform = model_transform.times(Mat4.rotation(-0.5*Math.PI, 0, 1, 0));

            let ScPacmanTitle = Mat4.scale(3, 3, 3);


            this.shapes.pacman.draw(context, program_state, model_transform.times(ScPacmanTitle), this.materials.pacman);



            this.shapes.pacmanEyes.draw(context, program_state,
                model_transform.times(ScPacmanTitle).times(TrPacman2Eye1Title).times(ScPacman2EyeTitle),
                this.materials.pacmanEyes);
            this.shapes.pacmanEyes.draw(context, program_state,
                model_transform.times(ScPacmanTitle).times(TrPacman2Eye2Title).times(ScPacman2EyeTitle),
                this.materials.pacmanEyes);

            //Text box in the title screen
            model_transform = Mat4.identity().times(Mat4.translation(0,0,-50)).times(Mat4.scale(50, 50, 1));
            this.shapes.box_start_page.draw(context, program_state, model_transform, this.materials.start_page);


            // this.shapes.pacman.draw(context, program_state, model_transform, this.materials.pacman);

            //model_transform = Mat4.identity().times(Mat4.translation(0,0,-50)).times(Mat4.scale(50, 50, 1));
            //this.shapes.box_start_page.draw(context, program_state, model_transform, this.materials.start_page);
            return;
        }
        else if(this.status == "TIMEISUP") {
            this.paused = true;
            this.initial_camera_location = Mat4.look_at(vec3(0, 0, 40), vec3(0, 0, 0), vec3(0, 1, 4.5));
            let light_position = vec4(0, -5, -5, -1);
            program_state.set_camera(this.initial_camera_location);
            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

            let model_transform = Mat4.identity();
            model_transform = model_transform.times(Mat4.rotation(0.5*Math.PI, 1, 0, 0));
            model_transform = model_transform.times(Mat4.rotation(-0.5*Math.PI, 0, 1, 0));

            // Text box in the Time is Up screen
            model_transform = Mat4.identity().times(Mat4.translation(0,0,-50)).times(Mat4.scale(50, 50, 1));
            this.shapes.box_start_page.draw(context, program_state, model_transform, this.materials.timeIsUp_page);

            return;
        }
        if (this.paused) { return;}

        model_transform = Mat4.identity();
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
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
        model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));

        model_transform = model_transform.times(Mat4.translation(28, 0, 0));
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
        // END CREATING BOUNDARY

        model_transform = Mat4.identity();  // reset to origin

        // For rotation animation
        if (this.countdown>0) {
            this.countdown = this.countdown - 1;
        }
        if (this.countdown2>0) {
            this.countdown2 = this.countdown2 - 1;
        }

        // Draw pacman #1
        if(this.pac1_poison.length<2) {
            if (this.up) {
                if (this.i1 < 10 && this.rotate === false) {
                    if (this.direction === "up") {
                        this.i1 = this.i1 + 10;
                    }
                    if (this.direction === "down") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "right") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "left") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                } else {
                    this.direction = "up";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac1_front - 1.5 < this.block_location[i][1] && this.pac1_back > this.block_location[i][1] && this.pac1_right + 1 > this.block_location[i][0] && this.pac1_left - 1 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }

                    if (judge && this.pac1_front > -54.5) {
                        this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, -0.03));
                        this.pac1_front = this.pac1_front - 0.03;
                        this.pac1_back = this.pac1_back - 0.03;
                    }
                }
            }
            if (this.down) {
                if (this.i1 < 10 && this.rotate === false) {
                    if (this.direction === "down") {
                        this.i1 = this.i1 + 10;
                    }
                    if (this.direction === "up") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "right") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "left") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                } else {
                    this.direction = "down";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac1_front < this.block_location[i][1] && this.pac1_back + 1.5 > this.block_location[i][1] && this.pac1_right + 1 > this.block_location[i][0] && this.pac1_left - 1 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac1_back < -1.5) {
                        this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, -0.03));
                        this.pac1_front = this.pac1_front + 0.03;
                        this.pac1_back = this.pac1_back + 0.03;
                    }
                }
            }
            if (this.left) {
                if (this.i1 < 10 && this.rotate === false) {
                    if (this.direction === "up") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "down") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "right") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "left") {
                        this.i1 = this.i1 + 10;
                    }
                } else {
                    this.direction = "left";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac1_front - 1 < this.block_location[i][1] && this.pac1_back + 1 > this.block_location[i][1] && this.pac1_right > this.block_location[i][0] && this.pac1_left - 1.5 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac1_left > -24.5) {
                        this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, -0.03));
                        this.pac1_left = this.pac1_left - 0.03;
                        this.pac1_right = this.pac1_right - 0.03;
                    }
                }
            }
            if (this.right) {
                if (this.i1 < 10 && this.rotate === false) {
                    if (this.direction === "up") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "down") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "left") {
                        this.pacman_transform = this.pacman_transform.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i1 = this.i1 + 1;
                    }
                    if (this.direction === "right") {
                        this.i1 = this.i1 + 10;
                    }
                } else {
                    this.direction = "right";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac1_front - 1 < this.block_location[i][1] && this.pac1_back + 1 > this.block_location[i][1] && this.pac1_right + 1.5 > this.block_location[i][0] && this.pac1_left < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac1_right < 24.5) {
                        this.pacman_transform = this.pacman_transform.times(Mat4.translation(0, 0, -0.03));
                        this.pac1_left = this.pac1_left + 0.03;
                        this.pac1_right = this.pac1_right + 0.03;
                    }
                }
            }

            /*  collision detection between pacman
            let pac2_center_x = (this.pac2_left + this.pac2_right)/2;
            let pac2_center_z = (this.pac2_front + this.pac2_back)/2;
            if (this.pac1_front < pac2_center_z && this.pac1_back > pac2_center_z && this.pac1_right > pac2_center_x && this.pac1_left < pac2_center_x) {
                if (this.direction = "right"){
                    this.direction = "left";
                }
                if (this.direction = "left"){
                    this.direction = "right";
                }
                if (this.direction = "up"){
                    this.direction = "down";
                }
                if (this.direction = "down"){
                    this.direction = "up";
                }
            }
            */
        }

        let TrPacman1Eye1 = Mat4.translation(-0.2, 1, 0.05);
        let TrPacman1Eye2 = Mat4.translation(-0.2, -1, 0.05);
        let ScPacman1Eye = Mat4.scale(.2, .2, .2);

        const timePacmanAnimation = program_state.animation_time / 300
        let timePacmanAnimationInt = Math.floor(timePacmanAnimation);
        let timeMod2 = timePacmanAnimationInt % 2;

        //Timer
        this.timerCountShown = this.timerCountShown - program_state.animation_delta_time / 1000;
        this.timerCount = this.timerCount - program_state.animation_delta_time / 1000;
        if (this.timerCount <= 0){
            this.timerCountShown = 10;
            this.timerCount = 10;
            this.status = "TIMEISUP";
        }

        // Draw pacman depending on two modes
        if (this.status === "PLAY") {

            //This if and else if is for the animation of the Pacman.
            if (timeMod2 == 0){
                this.shapes.pacmanMouthClose.draw(context, program_state, this.pacman_transform, this.materials.pacman);
            }
            else if (timeMod2 == 1){
                this.shapes.pacman.draw(context, program_state, this.pacman_transform, this.materials.pacman);
            }
            this.shapes.pacmanEyes.draw(context, program_state,
                this.pacman_transform.times(TrPacman1Eye1).times(ScPacman1Eye),
                this.materials.pacmanEyes);
            this.shapes.pacmanEyes.draw(context, program_state,
                this.pacman_transform.times(TrPacman1Eye2).times(ScPacman1Eye),
                this.materials.pacmanEyes);
        } else if (this.status === "PLAY2") {
            //This if and else if is for the animation of the Pacman.
            if (timeMod2 == 0){
                this.shapes.pacmanMouthClose.draw(context, program_state, this.pacman_transform,
                    this.materials.pacman.override(this.color[0]));
            }
            else if (timeMod2 == 1){
                this.shapes.pacman.draw(context, program_state, this.pacman_transform,
                    this.materials.pacman.override(this.color[0]));
            }
            this.shapes.pacmanEyes.draw(context, program_state,
                this.pacman_transform.times(TrPacman1Eye1).times(ScPacman1Eye),
                this.materials.pacmanEyes);
            this.shapes.pacmanEyes.draw(context, program_state,
                this.pacman_transform.times(TrPacman1Eye2).times(ScPacman1Eye),
                this.materials.pacmanEyes);
        }

        // Draw pacman #2
        if(this.pac2_poison.length<2) {
            if (this.up2) {
                if (this.i < 10 && this.rotate2 === false) {
                    if (this.direction2 === "up") {
                        this.i = this.i + 10;
                    }
                    if (this.direction2 === "down") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "right") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "left") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                } else {
                    this.direction2 = "up";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac2_front - 1.5 < this.block_location[i][1] && this.pac2_back > this.block_location[i][1] && this.pac2_right + 1 > this.block_location[i][0] && this.pac2_left - 1 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }

                    if (judge && this.pac2_front > -54.5) {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, -0.03));
                        this.pac2_front = this.pac2_front - 0.03;
                        this.pac2_back = this.pac2_back - 0.03;
                    }
                }
            }
            if (this.down2) {
                if (this.i < 10 && this.rotate2 === false) {
                    if (this.direction2 === "down") {
                        this.i = this.i + 10;
                    }
                    if (this.direction2 === "up") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "right") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "left") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                } else {
                    this.direction2 = "down";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac2_front < this.block_location[i][1] && this.pac2_back + 1.5 > this.block_location[i][1] && this.pac2_right + 1 > this.block_location[i][0] && this.pac2_left - 1 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac2_back < -1.5) {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, -0.03));
                        this.pac2_front = this.pac2_front + 0.03;
                        this.pac2_back = this.pac2_back + 0.03;
                    }
                }
            }
            if (this.left2) {
                if (this.i < 10 && this.rotate2 === false) {
                    if (this.direction2 === "up") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "down") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "right") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "left") {
                        this.i = this.i + 10;
                    }
                } else {
                    this.direction2 = "left";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac2_front - 1 < this.block_location[i][1] && this.pac2_back + 1 > this.block_location[i][1] && this.pac2_right > this.block_location[i][0] && this.pac2_left - 1.5 < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac2_left > -24.5) {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, -0.03));
                        this.pac2_left = this.pac2_left - 0.03;
                        this.pac2_right = this.pac2_right - 0.03;
                    }
                }
            }
            if (this.right2) {
                if (this.i < 10 && this.rotate2 === false) {
                    if (this.direction2 === "up") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(-Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "down") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.05, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "left") {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.rotation(Math.PI * 0.1, 0, 1, 0));
                        this.i = this.i + 1;
                    }
                    if (this.direction2 === "right") {
                        this.i = this.i + 10;
                    }
                } else {
                    this.direction2 = "right";
                    let i = 0;
                    let judge = true;
                    while (i < this.block_location.length) {
                        if (this.pac2_front - 1 < this.block_location[i][1] && this.pac2_back + 1 > this.block_location[i][1] && this.pac2_right + 1.5 > this.block_location[i][0] && this.pac2_left < this.block_location[i][0]) {
                            judge = false;
                            break;
                        }
                        i = i + 1;
                    }
                    if (judge && this.pac2_right < 24.5) {
                        this.pacman_transform2 = this.pacman_transform2.times(Mat4.translation(0, 0, -0.03));
                        this.pac2_left = this.pac2_left + 0.03;
                        this.pac2_right = this.pac2_right + 0.03;
                    }
                }
            }
        }

        let TrPacman2Eye1 = Mat4.translation(-0.2, 1, 0.05);
        let TrPacman2Eye2 = Mat4.translation(-0.2, -1, 0.05);
        let ScPacman2Eye = Mat4.scale(.2, .2, .2);

        // This if and else if is for the animation of the Pacman.
        if (timeMod2 == 0){
            this.shapes.pacmanMouthClose.draw(context, program_state, this.pacman_transform2, this.materials.pacman2);
        }
        else if (timeMod2 == 1){
            this.shapes.pacman.draw(context, program_state, this.pacman_transform2, this.materials.pacman2);
        }
        this.shapes.pacmanEyes.draw(context, program_state,
            this.pacman_transform2.times(TrPacman2Eye1).times(ScPacman2Eye),
            this.materials.pacmanEyes);
        this.shapes.pacmanEyes.draw(context, program_state,
            this.pacman_transform2.times(TrPacman2Eye2).times(ScPacman2Eye),
            this.materials.pacmanEyes);

        let bean_count = 56;  // Put the number of beans generated
        let poison_count = 3;
        let RtBean = Mat4.rotation(6 * t * Math.PI / 4, 0, 0, 1);
        let ScBean = Mat4.scale(.75, .75, .75);
        model_transform = Mat4.identity();


        let cherry_count = 6;  // Put the number of cherries generated
        //let TrCherryStem = Mat4.translation(-23, 0, -6.2);
        //let TrCherrySphere = Mat4.translation(-23, 0, -5);
        let RtCherry = Mat4.rotation(6 * t * Math.PI / 4, 0, 0, 1);
        let ScCherry = Mat4.scale(.75, .75, .75);
        //this.shapes.cherryStem.draw(context, program_state, TrCherryStem.times(RtCherry).times(ScCherry), this.materials.cherryStem);
        //this.shapes.cherrySphere.draw(context, program_state, TrCherrySphere.times(RtCherry).times(ScCherry), this.materials.cherrySphere);
        model_transform = Mat4.identity();

        // ----------------- START STORING LOCATIONS (in arrays) --------------------
        if(this.creation) {
            let i = 0;
            let x = -23;  // right in the middle of gaps
            let z = -3;
            let u = -15;
            let v = -9;

            // Store beans
            if (this.status === "PLAY") {
                while (i < 5) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z - 6;
                    i = i + 1;
                }
                z = -35;
                while (i < 9) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z - 6;
                    i = i + 1;
                }
                x = -19;
                while (i < 12) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 6;
                while (i < 14) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                x = -15;
                z = -50;
                while (i < 18) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 2;
                while (i < 20) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                x = -9;
                z = -53;
                while (i < 22) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 6;
                while (i < 25) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 2;
                while (i < 27) {
                    this.pac1_bean_location[i] = [x, z];
                    this.pac1_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }

                // Draw right side symmetrically
                i = 0
                x = 23;
                z = -3;
                while (i < 5) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z - 6;
                    i = i + 1;
                }
                z = -35;
                while (i < 9) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z - 6;
                    i = i + 1;
                }
                x = 19;
                while (i < 12) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 6;
                while (i < 14) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                x = 15;
                z = -50;
                while (i < 18) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 2;
                while (i < 20) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                x = 9;
                z = -53;
                while (i < 22) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 6;
                while (i < 25) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }
                z += 2;
                while (i < 27) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z + 6;
                    i = i + 1;
                }


                x = 23;
                z = -40;
                while (i < 29) {
                    this.pac2_bean_location[i] = [x, z];
                    this.pac2_bean_status[i] = true;
                    z = z - 3;
                    i = i + 1;
                }

                i = 0;
                while (i<poison_count){
                    this.poison_location[i] = [u, v];
                    this.poison_status[i] = true;
                    v = v - 3;
                    i = i + 1;
                }
            }
            else if (this.status === "PLAY2") {
            }

            // Store cherries (same for both modes)
            i = 0;
            x = -23;  // cherry stem
            z = -6.2;
            let x0 = -23;  // cherry sphere
            let z0 = -5;
            while (i < 1) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }
            x = -15;
            z = -41.2;
            x0 = -15;
            z0 = -40;
            while (i < 2) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }
            x = -3;
            z = -41.2;
            x0 = -3;
            z0 = -40;
            while (i < 3) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }

            // Symmetrically draw the right side
            x = 23;
            z = -6.2;
            x0 = 23;
            z0 = -5;
            while (i < 4) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }
            x = 15;
            z = -41.2;
            x0 = 15;
            z0 = -40;
            while (i < 5) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }
            x = 3;
            z = -41.2;
            x0 = 3;
            z0 = -40;
            while (i < cherry_count) {
                this.cherry_stem_location[i] = [x, z];
                this.cherry_sphere_location[i] = [x0, z0];
                this.cherry_status[i] = true;
                z = z - 6;
                z0 = z0 - 6;
                i = i + 1;
            }

            // Store walls
            i = 0;
            x = 0;
            z = -2;
            while (i<3) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }
            z += 2;
            x -= 6;
            while (i<7) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            x -= 4;
            while (i<9) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z -= 6;
            x += 2;
            while (i<11) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z -= 6;
            x -= 2;
            while (i<15) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z -= 6;
            x += 2;
            while (i<19) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x += 4;
            while (i<26) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z + 2;
            }
            z -= 8;
            x += 2;
            while (i<29) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z += 6;
            x -= 2;
            while (i<36) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z -= 2;
            x -= 8;
            while (i<39) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }

            // Lower right quadrant
            x = 6;
            z = -6;
            while (i<43) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x += 4;
            while (i<45) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z -= 6;
            x -= 2;
            while (i<47) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z -= 6;
            x += 2;
            while (i<51) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z -= 6;
            x -= 2;
            while (i<55) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            x -= 4;
            while (i<62) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z + 2;
            }
            z -= 8;
            x -= 2;
            while (i<65) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }


            // Upper left quadrant
            x = 0;
            z = -54;
            while (i<68) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z + 2;
            }
            z -= 2;
            x -= 6;
            while (i<72) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            x -= 4;
            while (i<74) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z += 6;
            x += 2;
            while (i<76) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z += 6;
            x -= 2;
            while (i<80) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z += 6;
            x += 2;
            while (i<84) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x += 4;
            while (i<91) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }
            z += 8;
            x += 2;
            while (i<94) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z -= 6;
            x -= 2;
            while (i<101) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z += 2;
            x -= 8;
            while (i<104) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z + 2;
            }

            // Upper right quadrant
            x = 6;
            z = -50;
            while (i<108) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x += 4;
            while (i<110) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z += 6;
            x -= 2;
            while (i<112) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            z += 6;
            x += 2;
            while (i<116) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            z += 6;
            x -= 2;
            while (i<120) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            x -= 4;
            while (i<127) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }
            z += 8;
            x -= 2;
            while (i<130) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }

            // Middle part
            z = -24;
            x = 0;
            while (i<134) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x -= 2;
            z -= 2;
            while (i<137) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }
            z = -24;
            x = -2;
            while (i<140) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x - 2;
            }
            x += 2;
            z -= 2;
            while (i<143) {
                this.block_location[i] = [x,z];
                i = i + 1;
                z = z - 2;
            }
            z += 2;
            x += 1;
            while (i<145) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            x += 4;
            while (i<147) {
                this.block_location[i] = [x,z];
                i = i + 1;
                x = x + 2;
            }
            // ----------------- END STORING LOCATIONS (Total: # blocks inside) --------------------
            this.creation = false;
        }

        // ----------------- START DRAWING BLOCKS --------------------
        let i = 0;
        let x = 0;
        let z = -2;
        while (i<3) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }
        z += 2;
        x -= 6;
        while (i<7) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        x -= 4;
        while (i<9) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z -= 6;
        x += 2;
        while (i<11) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z -= 6;
        x -= 2;
        while (i<15) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z -= 6;
        x += 2;
        while (i<19) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x += 4;
        while (i<26) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z + 2;
        }
        z -= 8;
        x += 2;
        while (i<29) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z += 6;
        x -= 2;
        while (i<36) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z -= 2;
        x -= 8;
        while (i<39) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }

        // Lower right quadrant
        x = 6;
        z = -6;
        while (i<43) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x += 4;
        while (i<45) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z -= 6;
        x -= 2;
        while (i<47) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z -= 6;
        x += 2;
        while (i<51) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z -= 6;
        x -= 2;
        while (i<55) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        x -= 4;
        while (i<62) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z + 2;
        }
        z -= 8;
        x -= 2;
        while (i<65) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }


        // Upper left quadrant
        x = 0;
        z = -54;
        while (i<68) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z + 2;
        }
        z -= 2;
        x -= 6;
        while (i<72) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        x -= 4;
        while (i<74) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z += 6;
        x += 2;
        while (i<76) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z += 6;
        x -= 2;
        while (i<80) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z += 6;
        x += 2;
        while (i<84) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x += 4;
        while (i<91) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }
        z += 8;
        x += 2;
        while (i<94) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z -= 6;
        x -= 2;
        while (i<101) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z += 2;
        x -= 8;
        while (i<104) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z + 2;
        }

        // Upper right quadrant
        x = 6;
        z = -50;
        while (i<108) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x += 4;
        while (i<110) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z += 6;
        x -= 2;
        while (i<112) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        z += 6;
        x += 2;
        while (i<116) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        z += 6;
        x -= 2;
        while (i<120) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        x -= 4;
        while (i<127) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }
        z += 8;
        x -= 2;
        while (i<130) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }

        // Middle part
        z = -24;
        x = 0;
        while (i<134) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x -= 2;
        z -= 2;
        while (i<137) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }
        z = -24;
        x = -2;
        while (i<140) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x - 2;
        }
        x += 2;
        z -= 2;
        while (i<143) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            z = z - 2;
        }
        z += 2;
        x += 1;
        while (i<145) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }
        x += 4;
        while (i<147) {
            model_transform = model_transform.times(Mat4.translation(x, 0, z));
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override(this.color[0]));
            model_transform = Mat4.identity();
            i = i + 1;
            x = x + 2;
        }


        // ----------------- END DRAWING BLOCKS --------------------
        // Draw cherries
        if (this.status === "PLAY") {
            let w = 0;
            let TrCherryStem = Mat4.identity();
            let TrCherrySphere = Mat4.identity();
            while (w < cherry_count) {
                if (this.pac1_front < this.cherry_sphere_location[w][1] && this.pac1_back > this.cherry_sphere_location[w][1] && this.pac1_right > this.cherry_sphere_location[w][0] && this.pac1_left < this.cherry_sphere_location[w][0]) {
                    this.cherry_status[w] = 0;
                }
                if (this.pac2_front < this.cherry_sphere_location[w][1] && this.pac2_back > this.cherry_sphere_location[w][1] && this.pac2_right > this.cherry_sphere_location[w][0] && this.pac2_left < this.cherry_sphere_location[w][0]) {
                    this.cherry_status[w] = 2;
                }
                if (this.cherry_status[w] === true) {
                    TrCherryStem = Mat4.identity();
                    TrCherrySphere = Mat4.identity();
                    TrCherryStem = TrCherryStem.times(Mat4.translation(this.cherry_stem_location[w][0], 0, this.cherry_stem_location[w][1]));
                    TrCherrySphere = TrCherrySphere.times(Mat4.translation(this.cherry_sphere_location[w][0], 0, this.cherry_sphere_location[w][1]));
                    this.shapes.cherryStem.draw(context, program_state, TrCherryStem.times(RtCherry).times(ScCherry), this.materials.cherryStem);
                    this.shapes.cherrySphere.draw(context, program_state, TrCherrySphere.times(RtCherry).times(ScCherry), this.materials.cherrySphere);
                }
                w += 1;
            }
        }

        // Draw beans (collab mode)
        if (this.status === "PLAY") {
            let w = 0;
            while (w < 27) {
                if (this.pac1_front < this.pac1_bean_location[w][1] && this.pac1_back > this.pac1_bean_location[w][1] && this.pac1_right > this.pac1_bean_location[w][0] && this.pac1_left < this.pac1_bean_location[w][0]) {
                    this.pac1_bean_status[w] = false;
                }
                if (this.pac2_front < this.pac2_bean_location[w][1] && this.pac2_back > this.pac2_bean_location[w][1] && this.pac2_right > this.pac2_bean_location[w][0] && this.pac2_left < this.pac2_bean_location[w][0]) {
                    this.pac2_bean_status[w] = false;
                }
                if (this.pac1_bean_status[w] === true) {
                    model_transform = Mat4.identity();
                    model_transform = model_transform.times(Mat4.translation(this.pac1_bean_location[w][0], 0, this.pac1_bean_location[w][1]));
                    this.shapes.bean.draw(context, program_state, model_transform.times(RtBean).times(ScBean), this.materials.bean.override(hex_color("#FFFF00")));
                }
                if (this.pac2_bean_status[w] === true) {
                    model_transform = Mat4.identity();
                    model_transform = model_transform.times(Mat4.translation(this.pac2_bean_location[w][0], 0, this.pac2_bean_location[w][1]));
                    this.shapes.bean.draw(context, program_state, model_transform.times(RtBean).times(ScBean), this.materials.bean.override(hex_color("#FFC0CB")));
                }
                w += 1;
            }

            w = 0
            while (w<poison_count){
                if (this.pac1_front < this.poison_location[w][1] && this.pac1_back > this.poison_location[w][1] && this.pac1_right > this.poison_location[w][0] && this.pac1_left < this.poison_location[w][0]) {
                    this.poison_status[w] = false;
                    if(!this.pac1_poison.includes(w)&&!this.pac2_poison.includes(w)) {
                        this.pac1_poison.push(w);
                    }
                }
                if (this.pac2_front < this.poison_location[w][1] && this.pac2_back > this.poison_location[w][1] && this.pac2_right > this.poison_location[w][0] && this.pac2_left < this.poison_location[w][0]) {
                    this.poison_status[w] = false;
                    if(!this.pac2_poison.includes(w)&&!this.pac1_poison.includes(w)) {
                        this.pac2_poison.push(w);
                    }
                }
                if (this.poison_status[w]) {
                    model_transform = Mat4.identity();
                    model_transform = model_transform.times(Mat4.translation(this.poison_location[w][0], 0, this.poison_location[w][1]));
                    this.shapes.bean.draw(context, program_state, model_transform.times(RtBean).times(ScBean), this.materials.bean.override(blue));
                }
                w += 1;
            }
        }

        // Update player scores (collab mode)
        if (this.status === "PLAY") {
            this.score1 = 0;
            this.score2 = 0;
            for (let i = 0; i < bean_count/2; i++) {
                if (this.pac1_bean_status[i] === false) {
                    this.score1 += 1;
                }
                if (this.pac2_bean_status[i] === false) {
                    this.score2 += 1;
                }
            }
            for (let i = 0; i < cherry_count; i++) {
                if (this.cherry_status[i] === 0) {
                    this.score1 += 3;
                }
                if (this.cherry_status[i] === 2) {
                    this.score2 += 3;
                }
            }
        }
        this.total_score = this.score1 + this.score2;

        return model_transform;
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();
        this.draw_box(context,program_state,model_transform);
    }
}
