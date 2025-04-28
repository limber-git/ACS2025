import React from 'react';
import Button from '../../../ui/button/Button';
import { PreviewViewProps } from '../../../../utils/attendance/constants';



export const PreviewView: React.FC<PreviewViewProps> = ({ imageSrc, onConfirm, onRetake, onCancel }) => {
  return (
    <div className="flex flex-col h-[500px] sm:h-[400px]">
      <div className="flex-1 relative bg-gray-900 p-4">
        <div className="relative h-full rounded-lg overflow-hidden bg-white/10">
          <img
            src={imageSrc}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        <div className="absolute top-4 left-4">
          <h3 className="text-white text-lg font-semibold">Preview</h3>
          <p className="text-white/70 text-sm">
            Check if the image is clear and readable
          </p>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 flex justify-center space-x-4">
        <Button
          type="button"
          onClick={onConfirm}
          variant="primary"
          className="w-32"
        >
          Confirm
        </Button>
        <Button
          type="button"
          onClick={onRetake}
          variant="outline"
          className="w-32"
        >
          Retake
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="w-32"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PreviewView;