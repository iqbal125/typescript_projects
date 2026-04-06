import React from 'react';
import Hero from '@/components/Hero';
import { utils } from '@org/utils';

const Home: React.FC = () => {
    console.log(utils())
    return (
        <div className="mx-auto p-6 space-y-6">
            <Hero />
        </div>
    );
};

export default Home;

