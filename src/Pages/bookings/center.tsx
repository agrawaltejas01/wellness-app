import { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";

import FilterBar from "./filter-bar";
import { errorToast } from "../../components/Toast";
import { useMutation } from "@tanstack/react-query";
import { getBookingsForCenter } from "../../apis/bookings/center";
import BookingResultsCenter from "./bookings-center";

// Define the filter state interface
interface FilterState {
    activity: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
}

const BookingInfoCenter: React.FC<RouteComponentProps> = () => {
    // Filter state management
    const [filters, setFilters] = useState<FilterState>({
        activity: 'ALL',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        fromTime: '06:00',
        toTime: '23:59'
    });

    // Loading state for API calls
    const [isLoading, setIsLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
    
    // Define the booking interface to match API response
    interface Booking {
        id: number;
        bookingId: string;
        activity: string;
        court: string;
        date: string;
        startTime: string;
        duration: number;
        status: string;
        name: string;
        phone: string;
        noOfGuests: number;
    }

    const [bookings, setBookings] = useState<Booking[]>([]);

    const { mutate: _getBookingsForCenter } = useMutation({
        mutationFn: getBookingsForCenter,
        onError: () => {
            errorToast("Error in getting bookings for center");
        },
        onSuccess: (result) => {
            console.log("bookings gotten - ", result);
            // Handle the nested structure: result.bookings.bookings
            setBookings(result.bookings?.bookings || []);
            setLastRefreshed(new Date());
        },
        onSettled: () => {
            setIsLoading(false);
        },  
    });

    // Function to fetch bookings with current filters
    const fetchBookings = () => {
        setIsLoading(true);
        _getBookingsForCenter({
            gymId: '6',
            activity: filters.activity,
            startDate: filters.fromDate,
            endDate: filters.toDate,
            startTime: filters.fromTime,
            endTime: filters.toTime
        });
    };

    // Auto-refresh every 5 minutes
    useEffect(() => {
        // Initial fetch
        fetchBookings();

        // Set up interval for auto-refresh every 5 minutes (300000 ms)
        const interval = setInterval(() => {
            console.log('Auto-refreshing bookings...');
            fetchBookings();
        }, 5 * 60 * 1000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(interval);
        };
    }, [filters]); // Re-run when filters change

    // Manual refresh function
    const handleManualRefresh = () => {
        console.log('Manual refresh triggered');
        fetchBookings();
    };

    // Filter change handlers
    const handleActivityChange = (value: string) => {
        setFilters(prev => ({ ...prev, activity: value }));
    };

    const handleFromDateChange = (value: string) => {
        setFilters(prev => ({ ...prev, fromDate: value }));
    };

    const handleToDateChange = (value: string) => {
        setFilters(prev => ({ ...prev, toDate: value }));
    };

    const handleFromTimeChange = (value: string) => {
        setFilters(prev => ({ ...prev, fromTime: value }));
    };

    const handleToTimeChange = (value: string) => {
        setFilters(prev => ({ ...prev, toTime: value }));
    };

    // Apply filters - trigger API call
    const handleApplyFilters = () => {
        fetchBookings();
    };

    // Clear all filters to defaults
    const handleClearAllFilters = () => {
        const defaultFilters: FilterState = {
            activity: 'ALL',
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            fromTime: '06:00',
            toTime: '23:59'
        };
        
        setFilters(defaultFilters);
    };

    // Format last refreshed time
    const formatLastRefreshed = (date: Date) => {
        return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
    };

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden">
            {/* Header with refresh button - Fixed */}
            <div className="flex items-center justify-between mx-4 mt-4 mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold font-sans">ZenfitX Bookings</h1>
                
                <div className="flex items-center space-x-4">
                    {/* Last refreshed info */}
                    <div className="text-sm text-gray-500">
                        Last updated: {formatLastRefreshed(lastRefreshed)}
                    </div>
                    
                    {/* Manual refresh button */}
                    <button
                        onClick={handleManualRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        title="Refresh bookings data"
                    >
                        <svg 
                            className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>
            
            <hr className="border-gray-100 flex-shrink-0" />
            
            {/* Filter Bar - Fixed */}
            <div className="flex-shrink-0">
                <FilterBar 
                    // Pass filter values
                    activity={filters.activity}
                    fromDate={filters.fromDate}
                    toDate={filters.toDate}
                    fromTime={filters.fromTime}
                    toTime={filters.toTime}
                    
                    // Pass callback handlers
                    onActivityChange={handleActivityChange}
                    onFromDateChange={handleFromDateChange}
                    onToDateChange={handleToDateChange}
                    onFromTimeChange={handleFromTimeChange}
                    onToTimeChange={handleToTimeChange}
                    onApplyFilters={handleApplyFilters}
                    onClearAllFilters={handleClearAllFilters}
                    
                    // Pass loading state
                    isLoading={isLoading}
                />
            </div>
            
            {/* Scrollable Booking Results */}
            <div className="flex-1 overflow-hidden p-4 pt-0">
                <BookingResultsCenter bookings={bookings} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default BookingInfoCenter;