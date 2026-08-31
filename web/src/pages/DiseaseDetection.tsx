import { useState } from 'react'

type Verdict = 'result' | 'retake' | 'refer'

type DiagnosisResult = {
  verdict: Verdict
  disease?: string
  severity?: string
  confidence?: number
  message: string
}

const verdictStyles: Record<Verdict, string> = {
  result: 'bg-emerald-50 text-emerald-700 border-emerald-600',
  retake: 'bg-amber-50 text-amber-700 border-amber-600',
  refer: 'bg-red-50 text-red-700 border-red-600',
}

export default function DiseaseDetection() {
  const [preview, setPreview] = useState<string | null>(null)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)
    setDiagnosis(null)
  }

  function handleAnalyze() {
    // Placeholder result — will call the real disease-classification model later.
    setDiagnosis({
      verdict: 'result',
      disease: 'Corynespora leaf fall',
      severity: 'Moderate (18% leaf area affected)',
      confidence: 0.87,
      message: 'Lesion pattern matches Corynespora with high confidence.',
    })
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Disease detection &amp; severity</h1>
        <p className="text-stone-500 mt-1 max-w-2xl">
          Upload a leaf photo to classify disease, segment the affected area, and estimate severity.
          Low-quality or unrecognised images are flagged for a plant pathologist.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="bg-white border border-stone-200 rounded-lg p-5 h-fit">
          <h2 className="font-semibold text-stone-800 mb-4">Leaf photo</h2>

          <label
            htmlFor="leaf-photo"
            className="block border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Uploaded leaf" className="max-h-48 mx-auto rounded" />
            ) : (
              <div className="text-stone-400 text-sm">
                <p className="font-medium text-stone-500">Click to upload a photo</p>
                <p className="mt-1">JPG or PNG, clear single-leaf shot</p>
              </div>
            )}
          </label>
          <input
            id="leaf-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleAnalyze}
            disabled={!preview}
            className="w-full mt-4 bg-emerald-700 text-white text-sm font-medium py-2 rounded hover:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            Analyze photo
          </button>
        </section>

        <section>
          {!diagnosis && (
            <div className="border border-dashed border-stone-300 rounded-lg p-10 text-center text-stone-400">
              Upload a leaf photo and click "Analyze photo" to see a diagnosis.
            </div>
          )}

          {diagnosis && (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-stone-500">Diagnosis</p>
                  <p className="text-xl font-semibold text-stone-800 mt-1">{diagnosis.disease}</p>
                  <p className="text-sm text-stone-500 mt-1">{diagnosis.severity}</p>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1.5 rounded-full border whitespace-nowrap ${verdictStyles[diagnosis.verdict]}`}
                >
                  {diagnosis.confidence ? `${Math.round(diagnosis.confidence * 100)}% confidence` : 'Flagged'}
                </span>
              </div>

              <p className="text-sm text-stone-600 mt-4">{diagnosis.message}</p>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Low-confidence or unsupported cases are automatically referred to a plant pathologist.
                </p>
                <button className="text-sm text-emerald-700 font-medium hover:underline whitespace-nowrap">
                  Refer to expert
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}