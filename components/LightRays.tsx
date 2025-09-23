import { useRef, useEffect, useState, useCallback } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
  // New responsive props
  adaptiveQuality?: boolean;
  minDpr?: number;
  maxDpr?: number;
  mobileOptimized?: boolean;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP)))/i.test(userAgent);
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

const getOptimalDpr = (deviceType: string, adaptiveQuality: boolean, minDpr: number, maxDpr: number) => {
  if (!adaptiveQuality) return Math.min(window.devicePixelRatio, maxDpr);
  
  const baseDpr = window.devicePixelRatio;
  
  switch (deviceType) {
    case 'mobile':
      // Lower DPR for mobile to improve performance
      return Math.min(Math.max(baseDpr * 0.75, minDpr), maxDpr * 0.8);
    case 'tablet':
      // Moderate DPR for tablets
      return Math.min(Math.max(baseDpr * 0.85, minDpr), maxDpr * 0.9);
    default:
      // Full DPR for desktop
      return Math.min(Math.max(baseDpr, minDpr), maxDpr);
  }
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number,
  deviceType: string
): { anchor: [number, number]; dir: [number, number] } => {
  // Reduce outside distance significantly for small screens to ensure rays are visible
  const baseOutside = deviceType === 'mobile' ? 0.05 : 0.1;
  // Scale outside distance based on screen size to prevent rays from being too far off-screen
  const minDimension = Math.min(w, h);
  const scaleFactor = Math.max(0.5, Math.min(1.0, minDimension / 500));
  const outside = baseOutside * scaleFactor;
  
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const useDebounce = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = '',
  adaptiveQuality = true,
  minDpr = 0.5,
  maxDpr = 2,
  mobileOptimized = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<any>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [deviceType, setDeviceType] = useState<string>('desktop');
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // Device type detection
  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  // Intersection observer for performance optimization
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.05, // Reduced threshold for better mobile performance
        rootMargin: '10px' // Start loading slightly before fully visible
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Debounced resize handler
  const debouncedUpdatePlacement = useDebounce(() => {
    if (!containerRef.current || !rendererRef.current || !uniformsRef.current) return;

    const renderer = rendererRef.current;
    const uniforms = uniformsRef.current;

    // Update DPR based on device type and adaptive quality
    const optimalDpr = getOptimalDpr(deviceType, adaptiveQuality, minDpr, maxDpr);
    renderer.dpr = optimalDpr;

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    
    // Ensure minimum size for mobile devices and better ray visibility
    const minWidth = deviceType === 'mobile' ? 280 : 480;
    const minHeight = deviceType === 'mobile' ? 180 : 300;
    
    const finalWidth = Math.max(wCSS, minWidth);
    const finalHeight = Math.max(hCSS, minHeight);
    
    renderer.setSize(finalWidth, finalHeight);

    const w = finalWidth * renderer.dpr;
    const h = finalHeight * renderer.dpr;

    uniforms.iResolution.value = [w, h];

    const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h, deviceType);
    uniforms.rayPos.value = anchor;
    uniforms.rayDir.value = dir;
  }, 100);

  // WebGL initialization with responsive optimizations
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const optimalDpr = getOptimalDpr(deviceType, adaptiveQuality, minDpr, maxDpr);
      
      const renderer = new Renderer({
        dpr: optimalDpr,
        alpha: true,
        // Mobile optimizations
        antialias: deviceType === 'desktop', // Disable antialiasing on mobile
        powerPreference: deviceType === 'mobile' ? 'low-power' : 'high-performance'
      });
      
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block'; // Prevent inline spacing issues

      // Clear container and add canvas
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      // Optimized fragment shader with mobile considerations
      const frag = `precision ${deviceType === 'mobile' ? 'mediump' : 'highp'} float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float deviceOptimization;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float distance = length(sourceToCoord);
  
  // Early exit if too far away to improve performance
  float maxDistance = min(iResolution.x, iResolution.y) * rayLength * 1.5;
  if (distance > maxDistance) return 0.0;
  
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + distance * 0.01) * 0.2;
  
  // Adjust spread calculation for better visibility on small screens
  float adjustedSpread = lightSpread * (1.0 + deviceOptimization * 0.3);
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(adjustedSpread, 0.001));

  // Use smaller dimension for consistent scaling across screen sizes
  float referenceDimension = min(iResolution.x, iResolution.y);
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((referenceDimension * fadeDistance - distance) / (referenceDimension * fadeDistance), 0.3, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  // Enhanced base strength for better visibility on mobile
  float baseStrength;
  if (deviceOptimization > 0.5) {
    baseStrength = clamp(
      0.6 + 0.25 * sin(distortedAngle * seedA + iTime * speed),
      0.0, 1.0
    );
  } else {
    baseStrength = clamp(
      (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
      (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
      0.0, 1.0
    );
  }

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  
  // Always calculate at least one ray layer, add second layer based on device optimization
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  // On mobile, blend differently for better visibility
  if (deviceOptimization > 0.5) {
    fragColor = rays1 * 0.8 + rays2 * 0.3;
  } else {
    fragColor = rays1 * 0.5 + rays2 * 0.4;
  }

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },

        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },

        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: mobileOptimized && deviceType === 'mobile' ? raysSpeed * 1.2 : raysSpeed },
        lightSpread: { value: mobileOptimized && deviceType === 'mobile' ? Math.max(lightSpread * 0.7, 0.3) : lightSpread },
        rayLength: { value: mobileOptimized && deviceType === 'mobile' ? Math.max(rayLength * 1.5, 1.0) : rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mobileOptimized && deviceType === 'mobile' ? mouseInfluence * 0.5 : mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
        deviceOptimization: { value: mobileOptimized && deviceType === 'mobile' ? 1.0 : 0.0 }
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }

        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0.0) {
          // Adjust smoothing based on device type
          const smoothing = deviceType === 'mobile' ? 0.88 : 0.92;

          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);

          uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
        }

        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn('WebGL rendering error:', error);
          return;
        }
      };

      window.addEventListener('resize', debouncedUpdatePlacement);
      debouncedUpdatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        window.removeEventListener('resize', debouncedUpdatePlacement);

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context');
            if (loseContextExt) {
              loseContextExt.loseContext();
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error);
          }
        }

        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    deviceType,
    adaptiveQuality,
    minDpr,
    maxDpr,
    mobileOptimized
  ]);

  // Update uniforms when props change
  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;

    const u = uniformsRef.current;
    const renderer = rendererRef.current;

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = mobileOptimized && deviceType === 'mobile' ? raysSpeed * 1.2 : raysSpeed;
    u.lightSpread.value = mobileOptimized && deviceType === 'mobile' ? Math.max(lightSpread * 0.7, 0.3) : lightSpread;
    u.rayLength.value = mobileOptimized && deviceType === 'mobile' ? Math.max(rayLength * 1.5, 1.0) : rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mobileOptimized && deviceType === 'mobile' ? mouseInfluence * 0.5 : mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;
    u.deviceOptimization.value = mobileOptimized && deviceType === 'mobile' ? 1.0 : 0.0;

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr, deviceType);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
    deviceType,
    mobileOptimized
  ]);

  // Enhanced mouse tracking with touch support - FIXED VERSION
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      
      // Only prevent default if the touch is directly on our element
      // and not part of a scroll gesture
      if (e.target && containerRef.current.contains(e.target as Node)) {
        // Check if this is a single-finger touch (likely interaction, not scroll)
        if (e.touches.length === 1) {
          // Don't prevent default to allow scrolling
          // e.preventDefault();
        }
      }
      
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      if (deviceType === 'mobile' || deviceType === 'tablet') {
        // Make touch events passive to allow scrolling
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
      }
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [followMouse, deviceType]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
      style={{
        // Ensure proper sizing on different devices
        minHeight: deviceType === 'mobile' ? '400px' : '300px',
        // Improve performance on mobile
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        // Prevent content jumping during resize
        contain: 'layout style paint',
        // Ensure rays are visible by preventing overflow clipping
        position: 'relative',
        // IMPORTANT: Ensure touch events don't interfere with scrolling
        touchAction: 'auto'
      }}
    />
  );
};

export default LightRays;