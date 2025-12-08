import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from 'three';

const Point = (props)=>{
    const ref=useRef();
    const ref2 = useRef();
   const clock = useRef(new THREE.Clock())
const colors = [new THREE.Color(0x812321), new THREE.Color(0x20a99e), new THREE.Color(0xaeb021), new THREE.Color(0x22b251)]

useFrame(() => {
const t = clock.current.getElapsedTime()
const x = Math.cos(t) * 5 // oscillate between -5 and 5
const cycle = (t % 6) / 6 // 0 → 1 over 6 seconds
const colorIndex = Math.floor(cycle * 4)
const nextColorIndex = (colorIndex + 1) % 4
const blend = (cycle * 4) % 1
const currentColor = colors[colorIndex].clone().lerp(colors[nextColorIndex], blend)
if (ref.current || ref2.current) {
ref.current.position.set(x+0.5, 8, 0)
ref2.current.color.copy(currentColor)
ref2.current.position.set(x,8,x)
ref.current.color.copy(currentColor)
}
})
    return(
        <>
        <pointLight color={props.color} ref={ref} intensity={90}/>
        <pointLight color={'red'} ref={ref2} intensity={props.intensity} castShadow/>
        </>
    )
}

export default Point;