
import React from 'react';
import { calculateIVA, calculateTotal } from '../utils/notaryCalculations';

interface NotaryCalculatorResultProps {
  notaryFee: number;
  documentType: string;
  foliosCost: number;
  folios: number;
  simpleCopiesCost: number;
  simpleCopies: number;
  authorizedCopiesCost: number;
  authorizedCopies: number;
}

const NotaryCalculatorResult = ({ 
  notaryFee, 
  documentType, 
  foliosCost, 
  folios,
  simpleCopiesCost, 
  simpleCopies,
  authorizedCopiesCost, 
  authorizedCopies
}: NotaryCalculatorResultProps) => {
  const subtotal = notaryFee + foliosCost + simpleCopiesCost + authorizedCopiesCost;
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(notaryFee, foliosCost, simpleCopiesCost, authorizedCopiesCost);
  
  // Solo mostrar el resultado si hay un honorario calculado
  if (notaryFee === 0 && foliosCost === 0 && simpleCopiesCost === 0 && authorizedCopiesCost === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Resultado - {documentType}
      </h2>
      
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Honorarios notariales:</span>
          <span className="font-semibold">{notaryFee.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between">
          <span>Folios ({folios}):</span>
          <span className="font-semibold">{foliosCost.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between">
          <span>Copias simples ({simpleCopies}):</span>
          <span className="font-semibold">{simpleCopiesCost.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between">
          <span>Copias autorizadas ({authorizedCopies}):</span>
          <span className="font-semibold">{authorizedCopiesCost.toFixed(2)} €</span>
        </div>
        
        <div className="border-t border-blue-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">{subtotal.toFixed(2)} €</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span>IVA (21%):</span>
          <span className="font-semibold">{iva.toFixed(2)} €</span>
        </div>
        
        <div className="border-t border-blue-200 pt-2 mt-3">
          <div className="flex justify-between text-lg font-bold text-blue-900">
            <span>Total:</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 italic">
        *Esta calculadora proporciona estimaciones basadas en la normativa vigente.
        Los honorarios finales pueden variar. Consulte con su notario.
      </div>
    </div>
  );
};

export default NotaryCalculatorResult;

