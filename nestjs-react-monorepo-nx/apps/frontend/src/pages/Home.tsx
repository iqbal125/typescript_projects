import React from 'react';
import { utils } from '@org/shared-utils';

const Home: React.FC = () => {
    console.log(utils())
    return (
        <div className="mx-auto p-6 space-y-6">
            <h2>Home Text</h2>
        </div>
    );
};

export default Home;

