// PLACEHOLDER — replace with real model inference

export type QualityAlert = 'GOOD' | 'BLUR' | 'TOO_DARK' | 'NO_SCALE_MARKER' | 'CUT_NOT_VISIBLE';
export type WorkmanshipGrade = 'ACCEPTABLE' | 'CORRECTION' | 'DAMAGING' | 'RETAKE';

export interface AnalysisResult {
  id: string;
  quality: QualityAlert;
  cutLengthCm: number;
  cutSlopeDeg: number;
  barkStripWidthMm: number;
  wound: boolean;
  confidence: number;
  grade: WorkmanshipGrade;
}

export const analyzeTappingCut = async (photoUri: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mocked result
      resolve({
        id: `mock-scan-${Date.now()}`,
        quality: 'GOOD',
        cutLengthCm: 38, // Standard 35-42
        cutSlopeDeg: 38, // Standard 30-35 (OUT OF RANGE)
        barkStripWidthMm: 2.4, // Standard 1.5-2.5
        wound: false,
        confidence: 89,
        grade: 'CORRECTION',
      });
    }, 1500);
  });
};
