'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface MetallicPaintProps {
  imageSrc?: string;
  seed?: number;
  scale?: number;
  patternSharpness?: number;
  noiseScale?: number;
  speed?: number;
  liquid?: number;
  mouseAnimation?: boolean;
  brightness?: number;
  contrast?: number;
  refraction?: number;
  blur?: number;
  chromaticSpread?: number;
  fresnel?: number;
  angle?: number;
  waveAmplitude?: number;
  distortion?: number;
  contour?: number;
  lightColor?: string;
  darkColor?: string;
  tintColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Convert hex color to normalized RGB [r, g, b]
function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VS_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    vUv.y = 1.0 - vUv.y; // Flip Y for WebGL texture orientation
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FS_SOURCE = `
  precision highp float;
  varying vec2 vUv;
  
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uSeed;
  uniform float uScale;
  uniform float uPatternSharpness;
  uniform float uNoiseScale;
  uniform float uLiquid;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uRefraction;
  uniform float uChromaticSpread;
  uniform float uFresnel;
  uniform float uAngle;
  uniform float uWaveAmplitude;
  uniform float uDistortion;
  uniform float uContour;
  uniform vec3 uLightColor;
  uniform vec3 uDarkColor;
  uniform vec3 uTintColor;
  uniform bool uHasTexture;

  // Simplex-style 2D Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal Brownian Motion for liquid distortion
  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      val += amp * snoise(p * freq + uSeed);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;
    
    // Calculate liquid fluid coordinates
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect * uScale;
    
    float t = uTime * 0.8;
    vec2 flow = vec2(
      snoise(p * uNoiseScale + vec2(t * 0.3, 0.0)),
      snoise(p * uNoiseScale + vec2(0.0, t * 0.3))
    ) * uLiquid;

    // Mouse influence
    vec2 mouseOffset = (uMouse - 0.5) * 0.4;
    flow += mouseOffset * uDistortion;

    vec2 distortedUv = uv + flow * (0.05 * uWaveAmplitude);

    // Sample mask from logo texture
    float mask = 1.0;
    if (uHasTexture) {
      // Chromatic aberration on logo texture sampling
      float r = texture2D(uTexture, distortedUv + vec2(uChromaticSpread * 0.003, 0.0)).r;
      float g = texture2D(uTexture, distortedUv).g;
      float b = texture2D(uTexture, distortedUv - vec2(uChromaticSpread * 0.003, 0.0)).b;
      float a = texture2D(uTexture, distortedUv).a;
      mask = a > 0.05 ? (1.0 - (r + g + b) / 3.0) : 0.0;
    }

    // Liquid metal normal generation via finite differences
    float eps = 0.01;
    float n1 = fbm(p + flow + vec2(eps, 0.0));
    float n2 = fbm(p + flow - vec2(eps, 0.0));
    float n3 = fbm(p + flow + vec2(0.0, eps));
    float n4 = fbm(p + flow - vec2(0.0, eps));

    vec3 normal = normalize(vec3((n1 - n2) * uPatternSharpness, (n3 - n4) * uPatternSharpness, 1.0));

    // Light direction rotated by uAngle
    float rad = radians(uAngle);
    vec3 lightDir = normalize(vec3(cos(rad) * 0.7, sin(rad) * 0.7, 0.8));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Specular lighting & Fresnel
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 32.0 * uPatternSharpness);

    float fresnelVal = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5) * uFresnel;

    // Liquid chrome / gold color blending
    vec3 baseColor = mix(uDarkColor, uLightColor, diff);
    vec3 metal = baseColor + (uTintColor * fresnelVal * 1.5) + (uLightColor * spec * 2.0);

    // Apply brightness and contrast
    metal = (metal - 0.5) * uContrast + 0.5;
    metal *= uBrightness;

    // Contour edge highlights
    float contourEdge = smoothstep(0.4, 0.6, abs(fract(n1 * uContour * 3.0) - 0.5));
    metal += uTintColor * contourEdge * 0.25;

    // Apply logo mask if present
    if (uHasTexture) {
      if (mask <= 0.01) {
        discard;
      }
      gl_FragColor = vec4(metal, mask);
    } else {
      gl_FragColor = vec4(metal, 1.0);
    }
  }
`;

export function MetallicPaint({
  imageSrc,
  seed = 42,
  scale = 4,
  patternSharpness = 1,
  noiseScale = 0.5,
  speed = 0.3,
  liquid = 0.75,
  mouseAnimation = false,
  brightness = 2,
  contrast = 0.5,
  refraction = 0.01,
  blur = 0.015,
  chromaticSpread = 2,
  fresnel = 1,
  angle = 0,
  waveAmplitude = 1,
  distortion = 1,
  contour = 0.2,
  lightColor = '#ffffff',
  darkColor = '#000000',
  tintColor = '#feb3ff',
  className = '',
  style = {},
}: MetallicPaintProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) {
      setIsSupported(false);
      return;
    }

    // Helper: Compile Shader
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry covering [-1, 1]
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uSeedLoc = gl.getUniformLocation(program, 'uSeed');
    const uScaleLoc = gl.getUniformLocation(program, 'uScale');
    const uSharpLoc = gl.getUniformLocation(program, 'uPatternSharpness');
    const uNoiseLoc = gl.getUniformLocation(program, 'uNoiseScale');
    const uLiquidLoc = gl.getUniformLocation(program, 'uLiquid');
    const uBrightLoc = gl.getUniformLocation(program, 'uBrightness');
    const uContrastLoc = gl.getUniformLocation(program, 'uContrast');
    const uRefractLoc = gl.getUniformLocation(program, 'uRefraction');
    const uChromLoc = gl.getUniformLocation(program, 'uChromaticSpread');
    const uFresnelLoc = gl.getUniformLocation(program, 'uFresnel');
    const uAngleLoc = gl.getUniformLocation(program, 'uAngle');
    const uWaveLoc = gl.getUniformLocation(program, 'uWaveAmplitude');
    const uDistortLoc = gl.getUniformLocation(program, 'uDistortion');
    const uContourLoc = gl.getUniformLocation(program, 'uContour');
    const uLightColorLoc = gl.getUniformLocation(program, 'uLightColor');
    const uDarkColorLoc = gl.getUniformLocation(program, 'uDarkColor');
    const uTintColorLoc = gl.getUniformLocation(program, 'uTintColor');
    const uHasTextureLoc = gl.getUniformLocation(program, 'uHasTexture');

    // Texture handling
    const texture = gl.createTexture();
    let hasTexture = false;

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        if (!gl || !texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        hasTexture = true;
      };
    }

    // Resize canvas
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(100, Math.floor(rect.width * dpr));
      canvas.height = Math.max(100, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseAnimation || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * speed;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uSeedLoc, seed);
      gl.uniform1f(uScaleLoc, scale);
      gl.uniform1f(uSharpLoc, patternSharpness);
      gl.uniform1f(uNoiseLoc, noiseScale);
      gl.uniform1f(uLiquidLoc, liquid);
      gl.uniform1f(uBrightLoc, brightness);
      gl.uniform1f(uContrastLoc, contrast);
      gl.uniform1f(uRefractLoc, refraction);
      gl.uniform1f(uChromLoc, chromaticSpread);
      gl.uniform1f(uFresnelLoc, fresnel);
      gl.uniform1f(uAngleLoc, angle);
      gl.uniform1f(uWaveLoc, waveAmplitude);
      gl.uniform1f(uDistortLoc, distortion);
      gl.uniform1f(uContourLoc, contour);

      const lightRgb = hexToRgb(lightColor);
      const darkRgb = hexToRgb(darkColor);
      const tintRgb = hexToRgb(tintColor);

      gl.uniform3f(uLightColorLoc, lightRgb[0], lightRgb[1], lightRgb[2]);
      gl.uniform3f(uDarkColorLoc, darkRgb[0], darkRgb[1], darkRgb[2]);
      gl.uniform3f(uTintColorLoc, tintRgb[0], tintRgb[1], tintRgb[2]);

      gl.uniform1i(uHasTextureLoc, hasTexture ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    imageSrc,
    seed,
    scale,
    patternSharpness,
    noiseScale,
    speed,
    liquid,
    mouseAnimation,
    brightness,
    contrast,
    refraction,
    blur,
    chromaticSpread,
    fresnel,
    angle,
    waveAmplitude,
    distortion,
    contour,
    lightColor,
    darkColor,
    tintColor,
  ]);

  if (!isSupported) {
    return (
      <div className={`flex items-center justify-center text-zinc-500 text-xs ${className}`}>
        [Efecto Metálico no soportado en este navegador]
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`} style={style}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default MetallicPaint;
