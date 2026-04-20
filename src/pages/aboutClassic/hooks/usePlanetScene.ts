import { useEffect, type RefObject } from "react";
import * as THREE from "three";

const hasUsableWebGLPrecision = () => {
  try {
    const probeCanvas = document.createElement("canvas");
    const context =
      probeCanvas.getContext("webgl2") ??
      probeCanvas.getContext("webgl") ??
      probeCanvas.getContext("experimental-webgl");

    if (!context) {
      return false;
    }

    const gl = context as WebGLRenderingContext;
    const highFloatPrecision = gl.getShaderPrecisionFormat(
      gl.VERTEX_SHADER,
      gl.HIGH_FLOAT,
    );

    return Boolean(highFloatPrecision);
  } catch {
    return false;
  }
};

const usePlanetScene = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    let frameId = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let handleResize: (() => void) | null = null;
    let handleContextLost: ((event: Event) => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let dotGeo: THREE.BufferGeometry | null = null;
    let dotMat: THREE.PointsMaterial | null = null;
    let isSceneVisible = true;

    const init = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const prefersLightRenderer =
        window.innerWidth <= 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      if (!hasUsableWebGLPrecision()) {
        return;
      }

      // === Rendu / scène / caméra =============================================
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: !prefersLightRenderer,
          alpha: false,
          powerPreference: prefersLightRenderer
            ? "low-power"
            : "high-performance",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, prefersLightRenderer ? 1.25 : 2),
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      const rect = canvas.getBoundingClientRect();
      const initialWidth = Math.max(1, Math.round(rect.width));
      const initialHeight = Math.max(1, Math.round(rect.height));
      renderer.setSize(initialWidth, initialHeight, false);

      const camera = new THREE.PerspectiveCamera(
        45,
        initialWidth / initialHeight,
        0.1,
        2000,
      );

      // === Planète en points ==================================================
      dotGeo = new THREE.BufferGeometry();
      const COUNT = 1800;
      const radius = 1.2;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = radius + (Math.random() - 0.5) * 0.03;
        positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi);
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      dotMat = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        color: 0x111111,
      });
      const dots = new THREE.Points(dotGeo, dotMat);
      scene.add(dots);

      // === Animation ==========================================================
      const clock = new THREE.Clock();

      const fitCameraToSphere = (width: number, height: number) => {
        const aspect = width / height;
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
        const minFov = Math.min(vFov, hFov);
        const distance = (radius * 1.2) / Math.tan(minFov / 2);
        camera.position.set(0, 0, distance);
      };

      const updateRendererSize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(width));
        const nextHeight = Math.max(1, Math.round(height));
        renderer?.setSize(nextWidth, nextHeight, false);
        camera.aspect = nextWidth / nextHeight;
        fitCameraToSphere(nextWidth, nextHeight);
        camera.updateProjectionMatrix();
      };

      handleResize = () => {
        updateRendererSize();
      };
      window.addEventListener("resize", handleResize);
      updateRendererSize();

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => updateRendererSize());
        resizeObserver.observe(canvas);
      }

      handleContextLost = (event: Event) => {
        event.preventDefault();
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      };
      canvas.addEventListener("webglcontextlost", handleContextLost, false);

      const scheduleTick = () => {
        if (!frameId && isSceneVisible) {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      const tick = () => {
        frameId = 0;
        if (!isSceneVisible) {
          return;
        }

        const t = clock.getDelta();
        dots.rotation.y += 0.12 * t;
        dots.rotation.x += 0.05 * t;
        renderer?.render(scene, camera);
        scheduleTick();
      };

      if (typeof IntersectionObserver !== "undefined") {
        visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            isSceneVisible = entry.isIntersecting;
            if (isSceneVisible) {
              scheduleTick();
            } else if (frameId) {
              window.cancelAnimationFrame(frameId);
              frameId = 0;
            }
          },
          { threshold: 0.02 },
        );
        visibilityObserver.observe(canvas);
      }

      scheduleTick();
    };

    init();

    return () => {
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (visibilityObserver) {
        visibilityObserver.disconnect();
      }
      if (handleContextLost && canvasRef.current) {
        canvasRef.current.removeEventListener(
          "webglcontextlost",
          handleContextLost,
          false,
        );
      }
      renderer?.dispose();
      // renderer?.forceContextLoss();
      dotGeo?.dispose();
      dotMat?.dispose();
    };
  }, [canvasRef]);
};

export default usePlanetScene;
