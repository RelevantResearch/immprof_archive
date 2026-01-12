import { formatDateToInput } from "@/lib/utils/helpers";

interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onApply: () => void;
  onClear: () => void;
  minDate?: string | null;
  maxDate?: string | null;
}

export default function DateFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
  minDate,
  maxDate,
}: DateFilterProps) {
  return (
    <div className="mb-8 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Filter by Date
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="dateFrom"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            From
          </label>
          <input
            type="date"
            id="dateFrom"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            min={minDate ? formatDateToInput(minDate) : undefined}
            max={dateTo || (maxDate ? formatDateToInput(maxDate) : undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="dateTo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            To
          </label>
          <input
            type="date"
            id="dateTo"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            min={dateFrom || (minDate ? formatDateToInput(minDate) : undefined)}
            max={maxDate ? formatDateToInput(maxDate) : undefined}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Apply
          </button>
          {(dateFrom || dateTo) && (
            <button
              onClick={onClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
