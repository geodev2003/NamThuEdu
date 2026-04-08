import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { teacherApi } from '@/services/teacherApi';

interface ValidationResult {
  valid: boolean;
  total_questions: number;
  total_points: number;
  issues: string[];
  warnings: string[];
  exam_info: {
    title: string;
    type: string;
    skill: string;
    duration: number;
  };
}

export const ImportExam: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'validate' | 'preview' | 'success'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.json')) {
        setError('Vui lòng chọn file JSON');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setJsonData(json);
          setStep('validate');
        } catch (err) {
          setError('File JSON không hợp lệ');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleValidate = async () => {
    if (!jsonData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await teacherApi.validateExamImport(jsonData);
      setValidation(response.data);
      
      if (response.data.valid) {
        setStep('preview');
      } else {
        setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi validate dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!jsonData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await teacherApi.importExam(jsonData);
      setStep('success');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/teacher/exams/${response.data.examId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi import đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJsonData(null);
    setValidation(null);
    setError(null);
    setStep('upload');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Import Đề Thi từ JSON</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${step === 'upload' ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'upload' ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>1</div>
            <span className="ml-2">Upload File</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${step !== 'upload' ? 'bg-orange-600' : ''}`} />
          </div>
          
          <div className={`flex items-center ${step === 'validate' || step === 'preview' ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'validate' || step === 'preview' ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>2</div>
            <span className="ml-2">Validate</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${step === 'preview' || step === 'success' ? 'bg-orange-600' : ''}`} />
          </div>
          
          <div className={`flex items-center ${step === 'preview' || step === 'success' ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'preview' || step === 'success' ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}>3</div>
            <span className="ml-2">Import</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-600 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Click để chọn file JSON
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  hoặc kéo thả file vào đây
                </p>
              </label>
              
              {file && (
                <div className="mt-4 text-sm text-gray-600">
                  Đã chọn: <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Hướng dẫn:</h3>
              <ol className="list-decimal list-inside text-sm text-orange-800 space-y-1">
                <li>Upload file PDF/DOCX đề thi lên Gemini AI</li>
                <li>Sử dụng prompt từ hệ thống để parse đề thi</li>
                <li>Copy JSON output từ Gemini</li>
                <li>Chạy script convert: <code className="bg-orange-100 px-1 rounded">node convert-gemini-to-system-format.js input.json output.json</code></li>
                <li>Upload file output.json vào đây</li>
              </ol>
            </div>
          </div>
        )}

        {/* Step 2: Validate */}
        {step === 'validate' && jsonData && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin đề thi</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Tên đề thi:</span>
                  <p className="font-medium">{jsonData.eTitle}</p>
                </div>
                <div>
                  <span className="text-gray-600">Loại đề:</span>
                  <p className="font-medium">{jsonData.eType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Kỹ năng:</span>
                  <p className="font-medium">{jsonData.eSkill}</p>
                </div>
                <div>
                  <span className="text-gray-600">Thời gian:</span>
                  <p className="font-medium">{jsonData.eDuration_minutes} phút</p>
                </div>
                <div>
                  <span className="text-gray-600">Số câu hỏi:</span>
                  <p className="font-medium">{jsonData.questions?.length || 0}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tổng điểm:</span>
                  <p className="font-medium">
                    {jsonData.questions?.reduce((sum: number, q: any) => sum + (q.qPoints || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleValidate}
                disabled={loading}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Đang kiểm tra...' : 'Kiểm tra dữ liệu'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && validation && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Kết quả kiểm tra</h2>
              
              {validation.valid ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
                  ✓ Dữ liệu hợp lệ, sẵn sàng import
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                  ✗ Dữ liệu không hợp lệ
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Tổng số câu hỏi:</span>
                  <p className="text-2xl font-bold">{validation.total_questions}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Tổng điểm:</span>
                  <p className="text-2xl font-bold">{validation.total_points}</p>
                </div>
              </div>
              
              {validation.issues.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-red-700 mb-2">Lỗi cần sửa:</h3>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-yellow-700 mb-2">Cảnh báo:</h3>
                  <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleImport}
                disabled={loading || !validation.valid}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Đang import...' : 'Import đề thi'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-green-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Import thành công!
            </h2>
            <p className="text-gray-600">
              Đang chuyển hướng đến trang chi tiết đề thi...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};



