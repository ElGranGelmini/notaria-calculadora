
import React, { useState } from 'react';
import { DocumentType, DOCUMENT_TYPE_NAMES, calculateNotaryFee } from '../utils/notaryCalculations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import NotaryCalculatorResult from './NotaryCalculatorResult';

const NotaryCalculatorForm = () => {
  const [documentType, setDocumentType] = useState<DocumentType>('compraventa');
  const [amount, setAmount] = useState<string>('');
  const [notaryFee, setNotaryFee] = useState<number>(0);
  const [selectedDocumentName, setSelectedDocumentName] = useState<string>(DOCUMENT_TYPE_NAMES.compraventa);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números y punto decimal
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limitar a dos decimales
    if (parts.length === 2 && parts[1].length > 2) {
      return;
    }
    
    setAmount(value);
  };

  const handleDocumentTypeChange = (value: string) => {
    const docType = value as DocumentType;
    setDocumentType(docType);
    setSelectedDocumentName(DOCUMENT_TYPE_NAMES[docType]);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    
    if (!amount || isNaN(amountValue)) {
      toast.error('Por favor, introduzca un valor válido');
      return;
    }
    
    if (amountValue <= 0) {
      toast.error('El valor debe ser mayor que cero');
      return;
    }
    
    const fee = calculateNotaryFee(documentType, amountValue);
    setNotaryFee(fee);
    setHasCalculated(true);
  };

  return (
    <div>
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de documento
          </label>
          <Select value={documentType} onValueChange={handleDocumentTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPE_NAMES).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {documentType !== 'poderes' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor de la transacción (€)
            </label>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Ej: 150000"
              className="w-full"
            />
          </div>
        )}
        
        <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">
          Calcular honorarios
        </Button>
      </form>

      {hasCalculated && (
        <NotaryCalculatorResult 
          notaryFee={notaryFee}
          documentType={selectedDocumentName}
        />
      )}
    </div>
  );
};

export default NotaryCalculatorForm;
