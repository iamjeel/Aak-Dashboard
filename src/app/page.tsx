import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* Logo (you can replace with an <img /> if you have a logo file) */}
        <Image className='flex mx-auto '
          src="/images/AAk.png"
          alt="AAK Deliveries Logo"
          width='100'
          height='100' />
        <div className="text-4xl font-bold text-red-500 mb-4 tracking-wide">
          AAK Deliveries Inc.
        </div>

        {/* Tagline / Info */}
        <p className="text-lg text-gray-300 mb-6">
          Reliable, timely, and flexible pharmacy delivery solutions.
          We offer subscription and punch card plans tailored for modern healthcare.
        </p>

        {/* CTA Button */}
        <a
          href="/login"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded transition"
        >
          Login to Dashboard
        </a>
      </div>
    </main>
  )
}
