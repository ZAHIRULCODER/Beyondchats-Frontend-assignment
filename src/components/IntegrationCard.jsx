import { motion } from "framer-motion";

export default function IntegrationCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-3 md:p-6 border rounded-xl hover:border-indigo-500 cursor-pointer"
      onClick={onClick}>
      <Icon className="w-8 h-8 text-indigo-600 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
