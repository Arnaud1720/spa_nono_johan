import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="three-container">
      <canvas #canvas class="three-canvas"></canvas>
      <div class="gradient-overlay"></div>
    </div>
  `,
  styles: [`
    .three-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      background: radial-gradient(ellipse at center, #0a0a1a 0%, #050508 100%);
    }

    .three-canvas {
      width: 100%;
      height: 100%;
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(0, 245, 255, 0.08), transparent 50%),
        radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 0, 255, 0.06), transparent 50%);
      pointer-events: none;
    }
  `]
})
export class ThreeBackground implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() particleCount = 3000;
  @Input() enableShapes = true;

  private isBrowser: boolean;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private torusKnot!: THREE.Mesh;
  private torusKnot2!: THREE.Mesh;
  private animationId!: number;
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private scrollProgress = 0;
  private time = 0;

  // Neon colors from theme
  private neonCyan = 0x00f5ff;
  private neonMagenta = 0xff00ff;
  private neonGreen = 0x00ff41;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initScene();
      this.createParticles();
      if (this.enableShapes) {
        this.createTorusKnots();
      }
      this.addEventListeners();
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationId);
      this.removeEventListeners();
      this.renderer?.dispose();
      this.scene?.clear();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
  }

  private createParticles(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    const cyanColor = new THREE.Color(this.neonCyan);
    const magentaColor = new THREE.Color(this.neonMagenta);
    const greenColor = new THREE.Color(this.neonGreen);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Spread particles in a sphere
      const radius = 8 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Gradient colors: cyan to magenta with some green
      const t = Math.random();
      let color: THREE.Color;
      if (t < 0.4) {
        color = cyanColor.clone().lerp(magentaColor, t / 0.4);
      } else if (t < 0.7) {
        color = magentaColor.clone();
      } else {
        color = greenColor.clone().lerp(cyanColor, (t - 0.7) / 0.3);
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createTorusKnots(): void {
    // Main Torus Knot - Cyan
    const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: this.neonCyan,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    this.scene.add(this.torusKnot);

    // Second Torus Knot - Magenta (different shape)
    const torus2Geometry = new THREE.TorusKnotGeometry(1.8, 0.2, 150, 24, 3, 5);
    const torus2Material = new THREE.MeshBasicMaterial({
      color: this.neonMagenta,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    this.torusKnot2 = new THREE.Mesh(torus2Geometry, torus2Material);
    this.scene.add(this.torusKnot2);

    // Third shape - Green icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: this.neonGreen,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(0, 0, 0);
    this.scene.add(icosahedron);
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private removeEventListeners(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);
  }

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  private onMouseMove = (event: MouseEvent): void => {
    this.mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  private onScroll = (): void => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
  };

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.005;

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Particles animation
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.1 + this.scrollProgress * Math.PI;
      this.particles.rotation.x = this.time * 0.05 + this.scrollProgress * 0.5;
      this.particles.rotation.z = this.scrollProgress * 0.3;
    }

    // Torus Knot animations with scroll
    if (this.torusKnot) {
      this.torusKnot.rotation.x = this.time * 0.3 + this.scrollProgress * 2;
      this.torusKnot.rotation.y = this.time * 0.2 + this.scrollProgress * 1.5;
      // Scale based on scroll
      const scale = 1 + this.scrollProgress * 0.8;
      this.torusKnot.scale.setScalar(scale);
      // Opacity based on scroll (more visible as you scroll)
      (this.torusKnot.material as THREE.MeshBasicMaterial).opacity = 0.3 + this.scrollProgress * 0.3;
    }

    if (this.torusKnot2) {
      this.torusKnot2.rotation.x = -this.time * 0.2 + this.scrollProgress;
      this.torusKnot2.rotation.z = this.time * 0.1 - this.scrollProgress * 0.5;
      const scale2 = 1 + this.scrollProgress * 0.5;
      this.torusKnot2.scale.setScalar(scale2);
    }

    // Camera movement based on scroll
    this.camera.position.z = 5 - this.scrollProgress * 2;
    this.camera.position.y = this.scrollProgress * 1.5;
    this.camera.position.x = this.mouse.x * 0.5;
    this.camera.rotation.z = this.scrollProgress * 0.3;

    // Camera follows mouse slightly
    this.camera.lookAt(
      this.mouse.x * 0.3,
      this.mouse.y * 0.3,
      0
    );

    this.renderer.render(this.scene, this.camera);
  };
}
