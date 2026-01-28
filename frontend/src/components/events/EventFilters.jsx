import React from 'react';
import { Search, Filter, Calendar, Globe } from 'lucide-react';
import './EventFilters.css';

import CustomSelect from '../ui/CustomSelect';

const EventFilters = ({ filters, onFilterChange }) => {

    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'launch', label: 'Launches' },
        { value: 'industry', label: 'Industry' },
        { value: 'community', label: 'Community' }
    ];

    const timeOptions = [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'past', label: 'Past Events' },
        { value: 'live', label: 'Live Now' }
    ];

    const regionOptions = [
        { value: '', label: 'Global / All Regions' },
        { value: 'India', label: 'India' },
        { value: 'USA', label: 'USA' },
        { value: 'Europe', label: 'Europe' }
    ];

    return (
        <div className="event-filters-container">
            {/* Search */}
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search missions, rockets, agencies..."
                    className="filter-search-input"
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>

            {/* Filters Group */}
            <div className="filter-group">
                <CustomSelect
                    options={categoryOptions}
                    value={filters.category}
                    onChange={(val) => handleChange('category', val)}
                    icon={Filter}
                />
                <CustomSelect
                    options={timeOptions}
                    value={filters.time}
                    onChange={(val) => handleChange('time', val)}
                    icon={Calendar}
                />
                <CustomSelect
                    options={regionOptions}
                    value={filters.region}
                    onChange={(val) => handleChange('region', val)}
                    icon={Globe}
                />
            </div>
        </div>
    );
};

export default EventFilters;
