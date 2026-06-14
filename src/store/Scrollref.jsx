// Ref partagée entre le Canvas Three.js et les composants UI React
// Évite les re-renders React en passant par une ref mutable
export const scrollRef = { current: 0 }

export default scrollRef