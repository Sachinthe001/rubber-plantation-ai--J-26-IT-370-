import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-8 text-center">
        <h1 className="text-xl font-semibold text-stone-800">RubberSentry</h1>
        <p className="text-sm text-stone-500 mt-2 mb-8">
          Risk-Aware Decision Support for Rubber Plantations
        </p>
        <Link to="/login" className="block w-full bg-emerald-700 text-white text-sm font-medium py-2.5 rounded hover:bg-emerald-800 transition-colors mb-3">
          Log in
        </Link>
        <Link to="/register" className="block w-full border border-emerald-700 text-emerald-700 text-sm font-medium py-2.5 rounded hover:bg-emerald-50 transition-colors">
          Register
        </Link>
      </div>
    </div>
  )
}