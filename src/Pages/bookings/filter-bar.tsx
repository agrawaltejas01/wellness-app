import { useState } from 'react';

interface FilterBarProps {
    // Filter values
    activity: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
    
    // Callbacks
    onActivityChange: (value: string) => void;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onFromTimeChange: (value: string) => void;
    onToTimeChange: (value: string) => void;
    onApplyFilters: () => void;
    onClearAllFilters: () => void;
    
    // Optional loading state
    isLoading?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
    activity,
    fromDate,
    toDate,
    fromTime,
    toTime,
    onActivityChange,
    onFromDateChange,
    onToDateChange,
    onFromTimeChange,
    onToTimeChange,
    onApplyFilters,
    onClearAllFilters,
    isLoading = false
}) => {
    // Only keep UI state in this component
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Get current filter values for display when collapsed
    const getCurrentFilters = () => {
        const filters = [];
        const today = new Date().toISOString().split('T')[0];
        
        // Always show activity
        const activityLabel = activity === 'ALL' ? 'All Activities' : activity;
        filters.push({ 
            type: 'activity', 
            label: activityLabel, 
            value: activity,
            isDefault: activity === 'ALL'
        });
        
        // Always show date range
        if (fromDate === toDate) {
            const isDefaultDate = fromDate === today;
            filters.push({ 
                type: 'date', 
                label: isDefaultDate ? `Today (${fromDate})` : fromDate, 
                value: fromDate,
                isDefault: isDefaultDate
            });
        } else {
            const isDefaultDate = fromDate === today && toDate === today;
            filters.push({ 
                type: 'dateRange', 
                label: `${fromDate} - ${toDate}`, 
                value: `${fromDate}-${toDate}`,
                isDefault: isDefaultDate
            });
        }
        
        // Always show time range
        const isDefaultTime = fromTime === '06:00' && toTime === '23:59';
        const timeLabel = isDefaultTime ? 'All Day (06:00 - 23:59)' : `${fromTime} - ${toTime}`;
        filters.push({ 
            type: 'timeRange', 
            label: timeLabel, 
            value: `${fromTime}-${toTime}`,
            isDefault: isDefaultTime
        });
        
        return filters;
    };

    const clearFilter = (filterType: string, filterValue: string) => {
        const today = new Date().toISOString().split('T')[0];
        
        switch (filterType) {
            case 'activity':
                onActivityChange('ALL');
                break;
            case 'date':
            case 'dateRange':
                onFromDateChange(today);
                onToDateChange(today);
                break;
            case 'timeRange':
                onFromTimeChange('06:00');
                onToTimeChange('23:59');
                break;
        }
    };

    const currentFilters = getCurrentFilters();

    return (
        <div className="flex flex-col w-full bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="p-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200/50 p-4">
                    {/* Clickable Header */}
                    <div 
                        className="flex items-center justify-between cursor-pointer mb-4 hover:bg-gray-50 -m-2 p-2 rounded-md transition-colors duration-200"
                        onClick={toggleExpanded}
                    >
                        <h3 className="text-base font-semibold text-gray-900">Filter Bookings</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                                {isExpanded ? 'Hide' : 'Show'} Filters
                            </span>
                            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Current Filters Display (when collapsed) */}
                    {!isExpanded && (
                        <div className="mb-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Filters</span>
                                <button 
                                    onClick={onClearAllFilters}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    Reset to Defaults
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentFilters.map((filter: {type: string, label: string, value: string, isDefault: boolean}, index: number) => (
                                    <div
                                        key={`${filter.type}-${index}`}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 ${
                                            filter.isDefault 
                                                ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 text-gray-700'
                                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800'
                                        }`}
                                    >
                                        <span>{filter.label}</span>
                                        {!filter.isDefault && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearFilter(filter.type, filter.value);
                                                }}
                                                className={`ml-1 rounded-full p-0.5 transition-colors duration-200 ${
                                                    filter.isDefault ? 'hover:bg-gray-200' : 'hover:bg-blue-200'
                                                }`}
                                                disabled={isLoading}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Collapsible Content */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <div className="space-y-4">
                            {/* Activity Filter */}
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Activity</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={activity}
                                        onChange={(e) => onActivityChange(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="ALL">All Activities</option>
                                        <option value="BADMINTON">Badminton</option>
                                        <option value="PICKLEBALL">Pickleball</option>
                                        <option value="FOOTBALL">Football</option>
                                        <option value="ONE MONTH PLAN">One Month Plan</option>
                                        <option value="TWO MONTHS PLAN">Two Months Plan</option>
                                        <option value="THREE MONTHS PLAN">Three Months Plan</option>
                                        <option value="YOGA">Yoga</option>
                                        <option value="GYM">Gym</option>
                                        <option value="SWIMMING">Swimming</option>
                                        <option value="DANCE">Dance</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time Range - Combined Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">From Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={fromDate}
                                        onChange={(e) => onFromDateChange(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">To Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={toDate}
                                        onChange={(e) => onToDateChange(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">From Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={fromTime}
                                        onChange={(e) => onFromTimeChange(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">To Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        value={toTime}
                                        onChange={(e) => onToTimeChange(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                                <button 
                                    onClick={onApplyFilters}
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-3 text-sm rounded-md transition-colors duration-200 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Applying...
                                        </>
                                    ) : (
                                        'Apply Filters'
                                    )}
                                </button>
                                {/* <button 
                                    onClick={onClearAllFilters}
                                    disabled={isLoading}
                                    className="px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 font-medium py-2 text-sm rounded-md transition-colors duration-200 focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed"
                                >
                                    Clear
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBar;