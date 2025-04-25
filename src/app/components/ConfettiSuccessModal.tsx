'use client'

import Modal from 'react-modal'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ConfettiSuccessModal = ({ isOpen, onClose }: Props) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    Modal.setAppElement(document.body)
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-md mx-auto mt-32 bg-black border border-red-500 rounded-lg p-6 text-white text-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-start z-50"
    >
      <Confetti width={dimensions.width} height={dimensions.height} />
      <h2 className="text-2xl font-bold mb-4">🎉 Delivery Request Sent!</h2>
      <p className="mb-6 text-gray-300">Your delivery data has been submitted successfully.</p>
      <button
        onClick={onClose}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
      >
        Close
      </button>
    </Modal>
  )
}

export default ConfettiSuccessModal
