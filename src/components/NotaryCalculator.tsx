
import React from 'react';
import NotaryCalculatorHeader from './NotaryCalculatorHeader';
import NotaryCalculatorForm from './NotaryCalculatorForm';

const NotaryCalculator = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <NotaryCalculatorHeader />
      <div className="p-6">
        <NotaryCalculatorForm />
      </div>
    </div>
  );
};

export default NotaryCalculator;
