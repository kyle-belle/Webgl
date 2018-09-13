var init_demo = function(){
	load_text_resource('./Shaders/vertex-shader.txt', function(vs_error, vs_text){

		if (vs_error) {

			alert("Fatal error getting vertex shader (see console)");
			console.error(vs_error);
		}else{

			load_text_resource('./Shaders/fragment-shader.txt', function(fs_error, fs_text){
				
				if (fs_error) {

					alert("Fatal error getting fragment shader (see console)");
					console,error(fs_error);
				}else{

					load_json_resource('./objects/monkey.json', function(model_err, model_obj){
						
						if (model_err) {
							
							alert('Fatal error getting monkey model (see console)');
							console.error(model_err);
						}else{
							
							load_image('./textures/white_army.jpg', function(img_err, img){
								
								if(img_err){
									
									alert('Fatal error getting army texture (see console)');
									console.error(img_err);
								}else{
									
									run_demo(vs_text, fs_text, model_obj, img);
								}
							});
	
						}
					});
					
				}
			});
		}
	});
}

var run_demo = function(vertex_shader, fragment_shader, model, texture_img){
	console.log("This works!!");

	var canvas = document.getElementById("surface");
	var gl = canvas.getContext("webgl");

	if (!gl) {
		console.log("WebGL  not supported falling back on experiment");
		gl = canvas.getContext("experimental-webgl");
	}

	if (!gl) {
		alert("you browser does not support WebGL!!!");
	}

	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);


	gl.clearColor(0.07,0.07,0.07,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vs = gl.createShader(gl.VERTEX_SHADER);
	var fs = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vs, vertex_shader);
	gl.shaderSource(fs, fragment_shader);

	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
		console.error("ERROR compiling vertex shader!!!", gl.getShaderInfoLog(vs));
		return;
	}

	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
		console.error("ERROR compiling fragment shader!!!", gl.getShaderInfoLog(fs));
		return;
	}


	var program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("ERROR link shaders/program!!!", gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error("ERROR validating shaders/program!!!", gl.getProgramInfoLog(program));
		return;
	}

	gl.useProgram(program);

	//
	//create buffer
	//

	// var vertices = 
	// [//	 r 	  g    b
	// 	0.0, 0.5, 0.0,		1.0, 1.0, 0.0,
	// 	0.5, -0.5, 0.0,		1.0, 0.0, 1.0,
	// 	-0.5, -0.5, 0.0,	0.0, 1.0, 0.0
	// ];

// 	var cube_vertices = 
// 	[ // X, Y, Z           u, z
// 		// Top
// 		-1.0, 1.0, -1.0,   0.0, 0.0,
// 		-1.0, 1.0, 1.0,    0.0, 1.0,
// 		1.0, 1.0, 1.0,     1.0, 1.0,
// 		1.0, 1.0, -1.0,    1.0, 0.0,

// 		// Left
// 		-1.0, 1.0, 1.0,    0.0, 0.0,
// 		-1.0, -1.0, 1.0,   1.0, 0.0,
// 		-1.0, -1.0, -1.0,  1.0, 1.0,
// 		-1.0, 1.0, -1.0,   0.0, 1.0,

// 		// Right
// 		1.0, 1.0, 1.0,    1.0, 1.0,
// 		1.0, -1.0, 1.0,   0.0, 1.0,
// 		1.0, -1.0, -1.0,  0.0, 0.0,
// 		1.0, 1.0, -1.0,   1.0, 0.0,

// 		// Front
// 		1.0, 1.0, 1.0,     1.0, 1.0,
// 		1.0, -1.0, 1.0,    1.0, 0.0,
// 		-1.0, -1.0, 1.0,   0.0, 0.0,
// 		-1.0, 1.0, 1.0,    0.0, 1.0,

// 		// Back
// 		1.0, 1.0, -1.0,     0.0, 0.0,
// 		1.0, -1.0, -1.0,    0.0, 1.0,
// 		-1.0, -1.0, -1.0,   1.0, 1.0,
// 		-1.0, 1.0, -1.0,    1.0, 0.0,

// 		// Bottom
// 		-1.0, -1.0, -1.0,   1.0, 1.0,
// 		-1.0, -1.0, 1.0,    1.0, 0.0,
// 		1.0, -1.0, 1.0,     0.0, 0.0,
// 		1.0, -1.0, -1.0,    0.0, 1.0,
// 	];

// 	var cube_indices =
// 	[
// 		// Top
// 		0, 1, 2,
// 		0, 2, 3,

// 		// Left
// 		5, 4, 6,
// 		6, 4, 7,

// 		// Right
// 		8, 9, 10,
// 		8, 10, 11,

// 		// Front
// 		13, 12, 14,
// 		15, 14, 12,

// 		// Back
// 		16, 17, 18,
// 		16, 18, 19,

// 		// Bottom
// 		21, 20, 22,
// 		22, 20, 23
// ];

	var monkey_vertices = model.meshes[0].vertices;

	var monkey_indices = [].concat.apply([],model.meshes[0].faces);

	var monkey_texcoords = model.meshes[0].texturecoords[0];

	var monkey_normals = model.meshes[0].normals;


	var vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(monkey_vertices), gl.STATIC_DRAW);

	var index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(monkey_indices), gl.STATIC_DRAW);

	var tex_coords_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tex_coords_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(monkey_texcoords), gl.STATIC_DRAW);

	var vertex_normals = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_normals);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(monkey_normals), gl.STATIC_DRAW);

	var vertices_attribute_location = gl.getAttribLocation(program, "vertices");
	var tex_coords_attribute_location = gl.getAttribLocation(program, "tex_coords");
	var normals_attribute_location = gl.getAttribLocation(program, "normals");

	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.vertexAttribPointer(vertices_attribute_location, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, tex_coords_buffer);
	gl.vertexAttribPointer(tex_coords_attribute_location, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_normals);
	gl.vertexAttribPointer(normals_attribute_location, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);


	gl.enableVertexAttribArray(vertices_attribute_location);
	gl.enableVertexAttribArray(tex_coords_attribute_location);
	gl.enableVertexAttribArray(normals_attribute_location);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture_img);

	gl.bindTexture(gl.TEXTURE_2D, null);

	var uniform_world = gl.getUniformLocation(program, "world");
	var uniform_view = gl.getUniformLocation(program, "view");
	var uniform_projection = gl.getUniformLocation(program, "projection");

	var world_matrix = new Float32Array(16);
	var view_matrix = new Float32Array(16);
	var projection_matrix = new Float32Array(16);

	mat4.identity(world_matrix);
	mat4.lookAt(view_matrix, [0, 0, -3], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projection_matrix, glMatrix.toRadian(70), canvas.width/canvas.height, 0.1, 1000.0);

	gl.uniformMatrix4fv(uniform_world, gl.FALSE, world_matrix);
	gl.uniformMatrix4fv(uniform_view, gl.FALSE, view_matrix);
	gl.uniformMatrix4fv(uniform_projection, gl.FALSE, projection_matrix);


	var identity_matrix = new Float32Array(16);
	mat4.identity(identity_matrix);

	var angle = 0;

	var loop = function(){
		angle = performance.now() / 1000 / 3 * Math.PI;
		mat4.rotate(world_matrix, identity_matrix, angle, [1, 2, 0]);
		gl.uniformMatrix4fv(uniform_world, gl.FALSE, world_matrix);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, monkey_indices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

};