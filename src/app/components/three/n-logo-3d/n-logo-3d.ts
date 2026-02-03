import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-n-logo-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="n-logo-container" #container>
      <canvas #canvas class="n-logo-canvas"></canvas>
    </div>
  `,
  styles: [`
    .n-logo-container {
      width: 300px;
      height: 300px;
      position: relative;
    }

    .n-logo-canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class NLogo3D implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private isBrowser: boolean;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private nGroup!: THREE.Group;
  private animationId!: number;
  private time = 0;
  private assemblyProgress = 0;
  private isAssembled = false;
  private parts: THREE.Mesh[] = [];
  private targetPositions: THREE.Vector3[] = [];
  private targetRotations: THREE.Euler[] = [];
  private startPositions: THREE.Vector3[] = [];
  private startRotations: THREE.Euler[] = [];
  private glowLights: THREE.PointLight[] = [];

  // Couleurs vibrantes style N64
  private colors = {
    blue: 0x3b82f6,
    cyan: 0x06b6d4,
    purple: 0x8b5cf6,
    magenta: 0xd946ef
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initScene();
      this.createN();
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationId);
      this.renderer?.dispose();
      this.scene?.clear();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.z = 4;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    this.scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x8b5cf6, 0.6);
    backLight.position.set(-3, -3, -3);
    this.scene.add(backLight);

    const sideLight = new THREE.DirectionalLight(0x3b82f6, 0.4);
    sideLight.position.set(-5, 2, 3);
    this.scene.add(sideLight);
  }

  private createN(): void {
    this.nGroup = new THREE.Group();

    // Dimensions du N
    const height = 2;
    const width = 0.35;
    const depth = 0.35;
    const spacing = 1.2; // Espace entre les barres verticales

    // === BARRE GAUCHE ===
    const leftBar = this.createBar(width, height, depth, this.colors.blue, this.colors.cyan);
    this.targetPositions.push(new THREE.Vector3(-spacing / 2, 0, 0));
    this.targetRotations.push(new THREE.Euler(0, 0, 0));
    this.parts.push(leftBar);
    this.nGroup.add(leftBar);

    // === BARRE DROITE ===
    const rightBar = this.createBar(width, height, depth, this.colors.purple, this.colors.magenta);
    this.targetPositions.push(new THREE.Vector3(spacing / 2, 0, 0));
    this.targetRotations.push(new THREE.Euler(0, 0, 0));
    this.parts.push(rightBar);
    this.nGroup.add(rightBar);

    // === BARRE DIAGONALE (du haut gauche vers le bas droit) ===
    const diagonalLength = Math.sqrt(Math.pow(spacing, 2) + Math.pow(height, 2)) * 0.92;
    const diagonalAngle = Math.atan2(spacing, height); // Angle pour aller de haut-gauche à bas-droit
    const diagonalBar = this.createBar(width * 0.9, diagonalLength, depth, this.colors.cyan, this.colors.purple);
    this.targetPositions.push(new THREE.Vector3(0, 0, 0));
    this.targetRotations.push(new THREE.Euler(0, 0, diagonalAngle)); // Angle positif pour la bonne direction
    this.parts.push(diagonalBar);
    this.nGroup.add(diagonalBar);

    // === GLOW GLOBAL autour du N ===
    this.createGlobalGlow();

    // Positions de départ (dispersées) pour l'animation d'assemblage
    for (let i = 0; i < this.parts.length; i++) {
      const angle = (i / this.parts.length) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 3 + Math.random() * 2;
      this.startPositions.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 3
      ));
      this.startRotations.push(new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ));

      // Initialiser aux positions de départ
      this.parts[i].position.copy(this.startPositions[i]);
      this.parts[i].rotation.copy(this.startRotations[i]);
    }

    this.scene.add(this.nGroup);
  }

  private createGlobalGlow(): void {
    // Point lights autour du N pour créer un halo lumineux
    const glowPositions = [
      { x: -0.8, y: 0.8, z: 1, color: this.colors.blue },
      { x: 0.8, y: -0.8, z: 1, color: this.colors.purple },
      { x: 0, y: 0, z: 1.5, color: this.colors.cyan },
      { x: -0.8, y: -0.8, z: 0.5, color: this.colors.cyan },
      { x: 0.8, y: 0.8, z: 0.5, color: this.colors.magenta },
    ];

    for (const pos of glowPositions) {
      const light = new THREE.PointLight(pos.color, 2, 4);
      light.position.set(pos.x, pos.y, pos.z);
      this.nGroup.add(light);
      this.glowLights.push(light);
    }

    // Sprite glow derrière le N pour un effet halo
    const glowTexture = this.createGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(4, 4, 1);
    glowSprite.position.z = -0.5;
    this.nGroup.add(glowSprite);
  }

  private createGlowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Gradient radial pour le glow
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.4)');
    gradient.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  private createBar(width: number, height: number, depth: number, color1: number, color2: number): THREE.Mesh {
    // Géométrie avec bords arrondis pour un look plus moderne
    const geometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);

    // Matériau avec dégradé simulé via vertex colors
    const material = new THREE.MeshPhongMaterial({
      color: color1,
      shininess: 80,
      specular: 0x444444,
      emissive: color1,
      emissiveIntensity: 0.15
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Ajouter un contour lumineux (glow effect)
    const glowGeometry = new THREE.BoxGeometry(width * 1.1, height * 1.02, depth * 1.1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color2,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);

    return mesh;
  }

  private easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 :
      Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  private easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.016;

    // Animation d'assemblage (plus lente pour bien voir la construction)
    if (!this.isAssembled) {
      this.assemblyProgress = Math.min(this.assemblyProgress + 0.004, 1);

      for (let i = 0; i < this.parts.length; i++) {
        const part = this.parts[i];
        const delay = i * 0.15;
        const adjustedProgress = Math.max(0, Math.min(1, (this.assemblyProgress - delay) / (1 - delay * (this.parts.length - 1) / this.parts.length)));
        const easedProgress = this.easeOutBack(adjustedProgress);

        // Interpoler position
        part.position.lerpVectors(
          this.startPositions[i],
          this.targetPositions[i],
          easedProgress
        );

        // Interpoler rotation
        part.rotation.x = this.startRotations[i].x * (1 - easedProgress) + this.targetRotations[i].x * easedProgress;
        part.rotation.y = this.startRotations[i].y * (1 - easedProgress) + this.targetRotations[i].y * easedProgress;
        part.rotation.z = this.startRotations[i].z * (1 - easedProgress) + this.targetRotations[i].z * easedProgress;
      }

      if (this.assemblyProgress >= 1) {
        this.isAssembled = true;
      }
    }

    // Rotation continue style N64/GameCube après assemblage
    if (this.isAssembled) {
      // Rotation principale sur Y (comme le logo GameCube)
      this.nGroup.rotation.y = Math.sin(this.time * 0.5) * 0.5 + this.time * 0.1;

      // Légère inclinaison sur X
      this.nGroup.rotation.x = Math.sin(this.time * 0.3) * 0.1;

      // Effet de flottement
      this.nGroup.position.y = Math.sin(this.time * 0.8) * 0.05;

      // Pulsation lumineuse
      const pulse = 0.12 + Math.sin(this.time * 2) * 0.08;
      for (const part of this.parts) {
        (part.material as THREE.MeshPhongMaterial).emissiveIntensity = pulse;
        // Pulsation du glow aussi
        if (part.children[0]) {
          ((part.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(this.time * 2) * 0.15;
        }
      }

      // Pulsation des lumières de glow
      const glowPulse = 1.5 + Math.sin(this.time * 1.5) * 1;
      for (const light of this.glowLights) {
        light.intensity = glowPulse;
      }
    } else {
      // Rotation lente pendant l'assemblage
      this.nGroup.rotation.y = this.time * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
