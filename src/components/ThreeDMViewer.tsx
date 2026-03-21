import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  Environment,
  //   OrbitControls,
  TrackballControls,
} from "@react-three/drei";
import { useAppSelector } from "../hooks/auth";
import { AppAlert } from "./ui/AppAlert";

function useRhino3dm(url: string | null) {
  const token = useAppSelector((state) => state.auth.accessToken);

  const [meshes, setMeshes] = useState<THREE.BufferGeometry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const loadRhinoScript = (): Promise<void> => {
      if ((window as any).rhino3dm) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src*="rhino3dm"]');

        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/rhino3dm.min.js";

        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load rhino3dm"));

        document.head.appendChild(script);
      });
    };

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadRhinoScript();

        const rhinoInit = (window as any).rhino3dm;
        const rhino = await rhinoInit();

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/octet-stream",
          },
        });
        if (!response.ok)
          AppAlert({ icon: "error", title: "Failed to fetch 3D file" });

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application")) {
          const text = await response.text();
          console.error("Server returned:", text.slice(0, 200));
          AppAlert({
            icon: "error",
            title: "Server did not return a 3DM file",
          });
        }

        const buffer = await response.arrayBuffer();
        const arr = new Uint8Array(buffer);

        const doc = rhino.File3dm.fromByteArray(arr);
        if (!doc) throw new Error("Failed to parse .3dm");

        const geometries: THREE.BufferGeometry[] = [];
        const objects = doc.objects();

        for (let i = 0; i < objects.count; i++) {
          const obj = objects.get(i);
          const geo = obj.geometry() as any;

          if (geo.objectType === rhino.ObjectType.Mesh) {
            const verts = geo.vertices();
            const faces = geo.faces();

            const positions: number[] = [];
            for (let v = 0; v < verts.count; v++) {
              const pt = verts.get(v);
              positions.push(pt[0], pt[1], pt[2]);
            }

            const indices: number[] = [];
            for (let f = 0; f < faces.count; f++) {
              const face = faces.get(f);

              if (face.length === 3) indices.push(face[0], face[1], face[2]);
              else if (face.length === 4) {
                indices.push(face[0], face[1], face[2]);
                indices.push(face[0], face[2], face[3]);
              }
            }

            const bufGeo = new THREE.BufferGeometry();
            bufGeo.setAttribute(
              "position",
              new THREE.Float32BufferAttribute(positions, 3),
            );
            bufGeo.setIndex(indices);
            bufGeo.computeVertexNormals();

            geometries.push(bufGeo);
          }
        }

        if (!cancelled) setMeshes(geometries);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { meshes, loading, error };
}

function Scene({ geometries }: { geometries: THREE.BufferGeometry[] }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const fitted = useRef(false);

  useFrame(() => {
    if (fitted.current || !groupRef.current || !geometries.length) return;

    const group = groupRef.current;

    // SET HƯỚNG MODEL BAN ĐẦU
    // group.rotation.set(
    //   -Math.PI / 2, // rotate X
    //   0, // rotate Y
    //   0, // rotate Z
    // );

    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const cam = camera as THREE.PerspectiveCamera;
    const fov = cam.fov * (Math.PI / 180);
    const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.8;

    camera.position.set(
      center.x + distance,
      center.y + distance * 0.5,
      center.z + distance,
    );
    camera.lookAt(center);

    fitted.current = true;
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#a0b4c8"
            roughness={0.4}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

interface ThreeDMViewerProps {
  url: string;
}

export default function ThreeDMViewer({ url }: ThreeDMViewerProps) {
  const { meshes, loading, error } = useRhino3dm(url);

  useEffect(() => {
    return () => {
      meshes.forEach((geo) => geo.dispose());
    };
  }, [meshes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3" />
          <p>Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!meshes.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No geometry found in file</p>
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ fov: 45, near: 0.1, far: 100000 }}
      style={{ background: "#636363" }}
      onCreated={({ gl }) => {
        return () => {
          gl.dispose();
        };
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -5, -5]} intensity={0.3} />
      <Environment preset="studio" />
      {/* <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableRotate
        enableZoom
        enablePan
        minPolarAngle={-Math.PI}
        maxPolarAngle={Math.PI * 2}
        minDistance={0}
        maxDistance={Infinity}
      /> */}
      <TrackballControls
        rotateSpeed={6}
        zoomSpeed={0.3}
        panSpeed={0.8}
        noZoom={false}
        noPan={false}
        staticMoving={false}
        dynamicDampingFactor={0.05}
      />
      <Center>
        <Scene geometries={meshes} />
      </Center>
    </Canvas>
  );
}

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three-stdlib";
// import { Rhino3dmLoader } from "three-stdlib";

// interface Props {
//   url: string;
// }

// export default function ThreeDMViewer({ url }: Props) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const container = containerRef.current;

//     // scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf5f5f5);

//     // camera
//     const camera = new THREE.PerspectiveCamera(
//       60,
//       container.clientWidth / container.clientHeight,
//       0.1,
//       10000,
//     );
//     camera.position.set(10, 10, 10);

//     // renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     container.appendChild(renderer.domElement);

//     // controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     // light
//     scene.add(new THREE.AmbientLight(0xffffff, 0.8));

//     const dirLight = new THREE.DirectionalLight(0xffffff, 1);
//     dirLight.position.set(10, 20, 10);
//     scene.add(dirLight);

//     // loader
//     const loader = new Rhino3dmLoader();

//     // 👇 VERY IMPORTANT
//     loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0/");

//     loader.load(url, (object) => {
//       scene.add(object);
//     });

//     // render loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // cleanup
//     return () => {
//       renderer.dispose();
//       container.innerHTML = "";
//     };
//   }, [url]);

//   return <div ref={containerRef} className="w-full h-full" />;
// }
