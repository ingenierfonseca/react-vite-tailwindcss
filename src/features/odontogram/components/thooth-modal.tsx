import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { X } from 'lucide-react';

interface Props {
    type: string;
    isOpen: boolean;
    onClose: () => void;
    toothId: number;
}

export default function ToothModal({ type, isOpen, onClose, toothId }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    // 1. Configuración de la Escena
    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Iluminación y Controles
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    scene.add(light);
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1, 4);

    // 3. Carga del Modelo 3D
    const loader = new GLTFLoader();
    
    let model3d = getModelByType(type, toothId);
    loader.load(`/src/assets/${model3d}.glb`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      scene.add(model);
    });

    // 4. Animación
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 5. LIMPIEZA (Crucial en React)
    return () => {
      cancelAnimationFrame(frameId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isOpen, toothId]); // Se reinicia si cambia el ID o se abre/cierra

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Contenedor del Modal */}
      <div className="relative w-full h-screen bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 flex justify-between items-center border-b border-white/5">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm">Visualizador 3D: Diente {toothId}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        <div className="p-4 bg-white/5 text-[20px] text-slate-400">
          Usa el mouse para rotar y hacer zoom en el modelo médico.
        </div>

        {/* El visor 3D (Reemplaza a viewer3d) */}
        <div 
          ref={mountRef} 
          className="w-full h-full flex justify-center cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
}

function getModelByType(type:string, id:number) {
  console.log("type, id", type, id)
  if (type === 'incisor' || type === 'canine') {
    if (id === 41) {
      return `incisor${id}`
    }
    return 'teeth'
  } else {
    if (id === 14)
      return `premolar${id}`
  }
  return 'teeth'
}