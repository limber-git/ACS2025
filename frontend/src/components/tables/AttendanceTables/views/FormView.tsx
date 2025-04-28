import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../ui/button/Button';
import { FormViewProps } from '../../../../utils/attendance/constants';

export const FormView: React.FC<FormViewProps> = ({
  record,
  reason,
  setReason,
  file,
  setFile,
  imagePreview,
  setImagePreview,
  handleSubmit,
  isSubmitting,
  onTakePhoto,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [setFile, setImagePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const clearImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Record Details
        </label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><span className="font-medium">Date:</span> {record.date}</p>
          <p><span className="font-medium">Time:</span> {record.onDuty}</p>
          <p><span className="font-medium">Issue:</span> {record.situation}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          rows={4}
          placeholder="Please provide a detailed explanation..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Supporting Document
        </label>
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                Drag and drop an image here, or click to select
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">or</span>
            </div>
            <Button
              type="button"
              onClick={onTakePhoto}
              variant="outline"
              className="w-full"
            >
              Take Photo
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};
