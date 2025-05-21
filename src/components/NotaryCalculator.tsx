
import React from 'react';
import NotaryCalculatorHeader from './NotaryCalculatorHeader';
import NotaryCalculatorForm from './NotaryCalculatorForm';

const NotaryCalculator = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full" style={{ maxWidth: '100%' }}>
      <NotaryCalculatorHeader />
      <div className="p-4 sm:p-6">
        <NotaryCalculatorForm />
      </div>
    </div>
  );
};

export default NotaryCalculator;
