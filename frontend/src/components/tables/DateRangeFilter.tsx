import { useState } from "react";
import Button from "../ui/button/Button";

type PresetFilter = {
  label: string;
  getDates: () => { startDate: string; endDate: string };
};

interface DateRangeFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
  onReset: () => void;
}

export default function DateRangeFilter({ onFilterChange, onReset }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const presetFilters: PresetFilter[] = [
    {
      label: "Today",
      getDates: () => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        return { startDate: dateStr, endDate: dateStr };
      }
    },
    {
      label: "This week",
      getDates: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Sábado
        return {
          startDate: startOfWeek.toISOString().split('T')[0],
          endDate: endOfWeek.toISOString().split('T')[0]
        };
      }
    },
    {
      label: "This month",
      getDates: () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0]
        };
      }
    }
  ];

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onReset();
  };

  const applyPresetFilter = (preset: PresetFilter) => {
    const { startDate: start, endDate: end } = preset.getDates();
    setStartDate(start);
    setEndDate(end);
    onFilterChange(start, end);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
      <div className="flex flex-wrap gap-2">
        {presetFilters.map((preset) => (
          <Button
            key={preset.label}
            size="sm"
            className="text-gray-500 text-start text-theme-xs dark:text-gray-400"
            onClick={() => applyPresetFilter(preset)}
            variant="outline"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex items-end gap-2 sm:w-auto w-full">
          <Button
            size="sm"
            variant="primary"
            onClick={handleFilter}
            disabled={!startDate || !endDate}
          >
            Filter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}