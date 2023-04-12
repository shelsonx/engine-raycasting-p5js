const gamemap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
  const game_width = 320;
  const game_height = 200;
  
  let pos;
  let dir;
  let camera_plan;
  
  function setup() {
    createCanvas(game_width, game_height);
    noStroke();
    
    pos = createVector(5, 5);
    dir = createVector(0, -1);
    camera_plan = createVector(0.66, 0);
    
  } 
  
  function draw() {
    background(190, 190, 255);
    fill(130);
    rect(0, height/2, width, height/2);
    
    dir.rotate(0.03);
    camera_plan.rotate(0.03);
    
    for (let pixel = 0; pixel < width; pixel++)
    {
      const multiplier = 2*(pixel/width) -1;
      const camera_pixel = p5.Vector.mult(camera_plan, multiplier);
  
      const ray_dir = p5.Vector.add(dir, camera_pixel);
  
      const delta_dist_x = abs(1 / ray_dir.x);
      const delta_dist_y = abs(1 / ray_dir.y);
  
      const map_pos = createVector(floor(pos.x), floor(pos.y));
  
      let dist_to_side_x;
      let dist_to_side_y;
  
      let step_x;
      let step_y;
      
      let perpendicular_dist;
  
      if (ray_dir.x < 0)
      {
        dist_to_side_x = (pos.x - map_pos.x) * delta_dist_x;
        step_x = -1;
      }
      else
      {
        dist_to_side_x = (map_pos.x + 1 - pos.x) * delta_dist_x;
        step_x = 1;
      }
  
      if (ray_dir.y < 0)
      {
        dist_to_side_y = (pos.y - map_pos.y) * delta_dist_y;
        step_y = -1;
      }
  
      else
      {
        dist_to_side_y = (map_pos.y + 1 - pos.y) * delta_dist_y;
        step_y = 1;
      }
      
      //calculo dos raios e desenho
      let hit = false;
      let hit_side;
      
      let dda_line_size_x = dist_to_side_x;
      let dda_line_size_y = dist_to_side_y;
      
      let wall_map_pos = map_pos.copy();
      while (hit == false)
      {
        if (dda_line_size_x < dda_line_size_y)
        {
          wall_map_pos.x += step_x;
          dda_line_size_x += delta_dist_x;
          hid_side = 0;
        }
        else
        {
          wall_map_pos.y += step_y;
          dda_line_size_y += delta_dist_y;
          hid_side = 1;
        }
        if (gamemap[wall_map_pos.x][wall_map_pos.y] > 0)
          hit = true;
      }
      
      if (hid_side == 0)
      {
          perpendicular_dist = abs(wall_map_pos.x - pos.x + ((1 - step_x)/2))/ray_dir.x;
      }
      else
      {
         perpendicular_dist = abs(wall_map_pos.y - pos.y + ((1 - step_y)/2))/ray_dir.y;
      }
      
      let wall_line_height = height/perpendicular_dist;
      let line_start_y = height / 2 - wall_line_height / 2;
      let line_end_y = height / 2 + wall_line_height / 2;
      
      let color = hid_side ? 255 : 128;
      
      stroke(color, 0, 0);
      line(pixel, line_start_y, pixel, line_end_y);
    }
  }