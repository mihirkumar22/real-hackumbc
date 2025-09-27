import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { usePostingsContext } from '../contexts/PostingsContext'
import { useUserContext } from '../contexts/UserContext'

function FiltersDisplay({ showStatusFilters }) {
    const { setSelectedFilters, selectedFilters, tags } = usePostingsContext();
    const { userData } = useUserContext();
    const [margin, setMargin] = useState('2px');

    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setMargin('2px'); // Smaller padding on mobile
            } else {
                setMargin('0px'); // Default padding on larger screens
            }
        };

        // Add resize event listener
        window.addEventListener('resize', handleResize);
        // Call on initial render
        handleResize();

        // Clean up event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    let statusFilters;
    if (userData.role == 'employer') {
        statusFilters = ['approved', 'pending', 'rejected', 'draft'];
    } else if (userData.role == 'admin') {
        statusFilters = ['approved', 'pending'];
    } else {
        statusFilters=['approved', 'pending'];
    }

    useEffect(() => {
        setSelectedFilters((prev) => ({
            ...prev,
            status: statusFilters
        }))
    }, [location.pathname])

    function handleTagChange(tag) {
        setSelectedFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag]
        }))
    }

    function handleStatusChange(status) {
        setSelectedFilters((prev) => ({
            ...prev,
            status: prev.status.includes(status)
                ? prev.status.filter((s) => s !== status)
                : [...prev.status, status]
        }))
    }
    
    return (
        <div style={{ maxWidth: '75vw', marginBottom: '1em' }}>
            <ButtonGroup style={{display: 'inline-block', flexWrap: 'wrap'}}>
                {tags.map((tag) => (
                    <Button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        variant={selectedFilters.tags.includes(tag) ? "success" : "secondary"}
                        style={{ margin: margin }}
                    >
                        {tag}
                    </Button>
                ))}
            </ButtonGroup>
            <br />
            {showStatusFilters &&
                <ButtonGroup style={{ maxWidth: '75vw'}}>
                    {statusFilters.map((f) => (
                        <Button
                            key={f}
                            onClick={() => handleStatusChange(f)}
                            variant={selectedFilters.status.includes(f) ? "success" : "secondary"}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)} posts
                        </Button>
                    ))}
                </ButtonGroup>
            }
        </div>
    )

}

export default FiltersDisplay;