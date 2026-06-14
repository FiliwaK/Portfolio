import { motion } from "framer-motion"
import { staggerContainer } from "../utils/motion.jsx"

const SectionWrapper = (Component, idName) =>
  function HOC(props) {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        id={idName}
      >
        <Component {...props} />
      </motion.section>
    )
  }

export default SectionWrapper
