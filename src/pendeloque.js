import * as THREE from 'three';

const buildPendeloque = function() {
  const geometry = new THREE.BufferGeometry();

  const count = 6;
  const radius = { x: 1.0, y: 2.0 };

  var positions = [];
  var normals   = [];
  var indices   = [];
  var uvs       = [];
  var colors    = [];

  // center
  positions.push([0, 0, 0]);

  /// Inner diamond
  const step = Math.PI * 2.0 / count;
  for (var i = 0; i < count; i++) {
    const x = radius.x * Math.sin(i * step);
    const y = radius.y * Math.cos(i * step);
    if (i === 0.0 || i === Math.PI)
      y += 0.25;
    positions.push([x, y, 0]);
  }
  /// Outer diamond
  for (var o = 0; o < count; o++) {
    const x = 2.5 * radius.x * Math.sin(o * step);
    const y = 1.5 * radius.y * Math.cos(o * step);
    if (o === 0.0 || o === Math.PI)
      y += 1.75;
    positions.push([x, y, -1]);
  }
  /// Center diamond ring
  for (var i = 1; i <= count; i++) {
    const x1 = positions[i][0];
    const x2 = positions[i + 1][0];
    const x3 = positions[i + count][0];
    const x4 = positions[i + count + 1][0];
    const y1 = positions[i][1];
    const y2 = positions[i + 1][1];
    const y3 = positions[i + count][1];
    const y4 = positions[i + count + 1][1];
    const z1 = positions[i][2];
    const z2 = positions[i + 1][2];
    const z3 = positions[i + count][2];
    const z4 = positions[i + count + 1][2];
    const x = (x1 + x2 + x3 + x4) / 4;
    const y = (y1 + y2 + y3 + y4) / 4;
    const z = (z1 + z2 + z3 + z4) / 4;
    positions.push([x, y * 1.25, z / 2]);
  }

  /// Indices: center face
  let offset = 0;
  for (var i = 1; i <= count; i++) {
    const curr = offset + (i % (count + 1));
    const next = offset + ((i + 1) % (count + 1)) + (i === count ? 1 : 0);
    indices.push(0);
    indices.push(curr);
    indices.push(next);
  }

  offset = count;
  for (var i = 1; i <= count; i++) {
    const currInner = offset + (i % (count + 1));
    const nextInner = offset + ((i + 1) % (count + 1)) + (i === count ? 1 : 0);
    const curr = (offset * 2) + (i % (count + 1));
    const next = (offset * 2) + ((i + 1) % (count + 1)) + (i === count ? 1 : 0);
    indices.push(currInner);
    indices.push(nextInner);
    indices.push(curr);

    indices.push(nextInner);
    indices.push(curr);
    indices.push(next);
  }

  /// Indices: outer face
  offset = count * 2;
  for (var i = 1; i <= count; i++) {
    const currInner = (i % (count + 1));
    const nextInner = ((i + 1) % (count + 1)) + (i === count ? 1 : 0);
    const curr = offset + (i % (count + 1));
    const next = offset + ((i + 1) % (count + 1)) + (i === count ? 1 : 0);
    indices.push(currInner);
    indices.push(nextInner);
    indices.push(curr);

    indices.push(nextInner);
    indices.push(curr);
    indices.push(next);
  }

  let vertexCount = positions.length;
  const backSide = [];
  positions.forEach(p => {
    const point = [p[0], p[1], -2.0 + p[2] * -1.0];
    backSide.push(point);
  });
  positions = positions.concat(backSide);
  const backSideIndices = [];
  indices.forEach(i => backSideIndices.push(i + vertexCount));
  indices = indices.concat(backSideIndices);

  geometry.setIndex(indices);
  geometry.setAttribute(
    `position`,
    new THREE.Float32BufferAttribute(positions.reduce((arr, e) => arr.concat(e), []), 3)
  );
  return {
    positions, 
    normals,   
    indices,   
    uvs,       
    colors,
    geometry,
  };
};

export  {
  buildPendeloque
};
