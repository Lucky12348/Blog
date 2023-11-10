/* eslint-disable */
import { AnimatePresence, motion } from 'framer-motion'

function Modal({ isOpen, onClose, children }) {
	return (
		<AnimatePresence mode='wait'>
			{isOpen ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'
				>
					<motion.div
						initial={{ scale: 0.7 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.7 }}
						className='mx-auto flex w-full flex-col rounded-lg bg-slate-800 bg-opacity-100  shadow md:w-1/3'
					>
						<button
							onClick={onClose}
							type='button'
							className='rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
						>
							Close
						</button>
						{children}
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

export default Modal
