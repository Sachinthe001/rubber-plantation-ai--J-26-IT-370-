export type TappingQualityStackParamList = {
  HomeDashboard: undefined;
  TreeSelection: undefined;
  CameraCapture: { treeId?: string; blockId?: string };
  Processing: { imageUri: string; treeId?: string; blockId?: string };
  Result: { 
    imageUri: string;
    grade: string;
    confidence: number;
    metrics: { length: number; slope: number; width: number };
    wounds: any[];
  };
  Action: { grade: string };
  History: undefined;
  BarkTrend: undefined;
};
