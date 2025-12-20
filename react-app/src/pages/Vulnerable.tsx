import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Vulnerable: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div style={{ padding: '20px' }}>
            <h2>Search Results</h2>
            <p>You searched for:</p>
            {/* VULNERABILITY: Rendering user input directly as HTML */}
            <div dangerouslySetInnerHTML={{ __html: query }} />
        </div>
    );
};

export default Vulnerable;
