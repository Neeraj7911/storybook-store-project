import { useRef, useEffect } from "react"
import * as THREE from "three"

const Background3D = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    camera.position.z = 10

    const animate = () => {
      requestAnimationFrame(animate)
      sphere.rotation.x += 0.01
      sphere.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />
}

export default Background3D

