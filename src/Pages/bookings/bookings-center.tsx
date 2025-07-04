import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

// Define the booking interface based on API response
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

interface BookingResultsCenterProps {
    bookings: Booking[];
    isLoading: boolean;
    isScrolled: boolean;
    handleScrollParent: (scrollTop: number) => void;
}

type SortField = keyof Booking;
type SortDirection = 'asc' | 'desc';

const BookingResultsCenter: React.FC<BookingResultsCenterProps> = ({ bookings, isLoading, isScrolled, handleScrollParent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle scroll detection
    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (scrollContainerRef.current) {
    //             const scrollTop = scrollContainerRef.current.scrollTop;
    //             handleScrollParent(scrollTop);
    //         }
    //     };

    //     const scrollContainer = scrollContainerRef.current;
    //     if (scrollContainer) {
    //         scrollContainer.addEventListener('scroll', handleScroll);
    //         return () => scrollContainer.removeEventListener('scroll', handleScroll);
    //     }
    // }, [handleScrollParent]);

    // Throttled scroll handler for better performance
    const throttledScrollHandler = useCallback((scrollTop: number) => {
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }
        
        throttleTimeoutRef.current = setTimeout(() => {
            handleScrollParent(scrollTop);
        }, 16); // ~60fps throttling
    }, [handleScrollParent]);

    // Handle scroll detection with proper dependency
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollTop = scrollContainerRef.current.scrollTop;
                throttledScrollHandler(scrollTop);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
                // Clean up throttle timeout
                if (throttleTimeoutRef.current) {
                    clearTimeout(throttleTimeoutRef.current);
                }
            };
        }
    }, [throttledScrollHandler]); // Now includes the dependency

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            // weekday: 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Format time for display
    const formatTime = (timeString: string) => {
        if(timeString.length === 3) {
            timeString = "0" + timeString;
        }
        if (timeString.length === 4) {
            const hours = timeString.substring(0, 2);
            const minutes = timeString.substring(2, 4);
            const time = new Date();
            time.setHours(parseInt(hours), parseInt(minutes));
            return time.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }
        return timeString;
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        const getStatusConfig = (status: string) => {
            switch (status.toUpperCase()) {
                case 'SUCCESS':
                    return {
                        color: 'bg-green-100 text-green-700',
                        label: 'Confirmed'
                    };
                case 'PENDING':
                    return {
                        color: 'bg-yellow-100 text-yellow-700',
                        label: 'Pending'
                    };
                case 'CANCELLED':
                    return {
                        color: 'bg-yellow-100 text-yellow-700',
                        label: 'Cancelled'
                    };
                case 'FAILED':
                    return {
                        color: 'bg-red-100 text-red-700',
                        label: 'Failed'
                    };
                default:
                    return {
                        color: 'bg-gray-100 text-gray-700',
                        label: status
                    };
            }
        };

        const config = getStatusConfig(status);

        return (
            <div className="flex items-center justify-between w-full">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${config.color}`}>
                    {config.label}
                </span>
                {/* <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button> */}
            </div>
        );
    };

    // Mobile booking card component
    const BookingCard = ({ booking }: { booking: Booking }) => {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 text-sm">{booking.name}</h3>
                        <p className="text-xs text-gray-500">{booking.phone}</p>
                    </div>
                    <div className="flex flex-col">
                        <StatusBadge status={booking.status} />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-gray-500">Activity:</span>
                        <p className="font-medium text-gray-900">{booking.activity}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium text-gray-900">{formatDate(booking.date)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Time:</span>
                        <p className="font-medium text-gray-900">{formatTime(booking.startTime)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium text-gray-900">{booking.duration} min</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Guests:</span>
                        <p className="font-medium text-gray-900">{booking.noOfGuests}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">ID:</span>
                        <p className="font-medium text-gray-900 font-mono text-xs">{booking.bookingId}</p>
                    </div>
                </div>
            </div>
        );
    };

    // Handle sorting
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort icon component
    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
        );
    };

    // Filtered and sorted bookings
    const processedBookings = useMemo(() => {
        let filtered = bookings.filter(booking =>
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm)
        );

        return filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Special handling for date sorting
            if (sortField === 'date') {
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [bookings, searchTerm, sortField, sortDirection]);

    if (isLoading && bookings.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
                    <div className="p-6 flex-1 flex items-center justify-center">
                        <div className="animate-pulse w-full">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-8 bg-gray-200 rounded w-48"></div>
                                <div className="h-10 bg-gray-200 rounded w-80"></div>
                            </div>
                            <div className="space-y-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="hidden md:grid grid-cols-8 gap-4">
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <div key={j} className="h-12 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                ))}
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="md:hidden h-32 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full transition-all duration-300 ${isScrolled ? 'mt-2' : ''}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
                {/* Header - Fixed with dynamic sizing */}
                <div className={`border-b border-gray-200 flex-shrink-0 transition-all duration-300 ${
                    isScrolled ? 'px-4 py-2' : 'px-6 py-4'
                }`}>
                    <div className={`flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? 'gap-2' : 'flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
                    }`}>
                        <div className={`flex flex-row items-start transition-all duration-300 ${
                            isScrolled ? 'flex-shrink-0' : ''
                        }`}>
                            <h2 className={`font-semibold text-gray-900 transition-all duration-300 ${
                                isScrolled ? 'text-sm' : 'text-lg'
                            }`}>
                                {isScrolled ? 'Bookings' : 'Booking Results'}
                            </h2>
                            <h2 className={`text-gray-500 px-2 items-center justify-center transition-all duration-300 ${
                                isScrolled ? 'text-xs' : 'text-sm mt-1'
                            }`}>
                                ({processedBookings.length})
                            </h2>
                        </div>
                        
                        {/* Search */}
                        <div className={`relative transition-all duration-300 ${
                            isScrolled ? 'w-64' : 'max-w-md w-full sm:w-auto'
                        }`}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className={`text-gray-400 transition-all duration-300 ${
                                    isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder={isScrolled ? "Search..." : "Search bookings..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                                    isScrolled ? 'py-1 text-sm' : 'py-2'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-hidden">
                    {processedBookings.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'No bookings match the current filters.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div ref={scrollContainerRef} className="h-full overflow-auto">
                            {/* Mobile Card Layout */}
                            <div className="md:hidden space-y-3 p-4">
                                {processedBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-200">
                                    {/* Fixed Table Header */}
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            {[
                                                { key: 'name' as SortField, label: 'Customer' },
                                                { key: 'activity' as SortField, label: 'Activity' },
                                                { key: 'date' as SortField, label: 'Date' },
                                                { key: 'startTime' as SortField, label: 'Time' },
                                                { key: 'duration' as SortField, label: 'Duration' },
                                                { key: 'noOfGuests' as SortField, label: 'Guests' },
                                                { key: 'status' as SortField, label: 'Status' },
                                                { key: 'bookingId' as SortField, label: 'Booking ID' },
                                            ].map((column) => (
                                                <th
                                                    key={column.key}
                                                    onClick={() => handleSort(column.key)}
                                                    className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                                                >
                                                    <div className="flex items-center space-x-1">
                                                        <span>{column.label}</span>
                                                        <SortIcon field={column.key} />
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    
                                    {/* Scrollable Table Body */}
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {processedBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{booking.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate" title={booking.activity}>
                                                        {booking.activity}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatTime(booking.startTime)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.duration} min</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.noOfGuests}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={booking.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-gray-900">{booking.bookingId}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingResultsCenter;