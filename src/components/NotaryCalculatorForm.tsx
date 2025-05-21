
import React, { useState } from 'react';
import { 
  DocumentType, 
  DOCUMENT_TYPE_NAMES, 
  calculateNotaryFee,
  calculateFoliosCost,
  calculateSimpleCopiesCost,
  calculateAuthorizedCopiesCost
} from '../utils/notaryCalculations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import NotaryCalculatorResult from './NotaryCalculatorResult';

const NotaryCalculatorForm = () => {
  const [documentType, setDocumentType] = useState<DocumentType>('compraventa');
  const [amount, setAmount] = useState<string>('');
  const [folios, setFolios] = useState<number>(10);
  const [simpleCopies, setSimpleCopies] = useState<number>(1);
  const [authorizedCopies, setAuthorizedCopies] = useState<number>(1);
  
  const [notaryFee, setNotaryFee] = useState<number>(0);
  const [foliosCost, setFoliosCost] = useState<number>(0);
  const [simpleCopiesCost, setSimpleCopiesCost] = useState<number>(0);
  const [authorizedCopiesCost, setAuthorizedCopiesCost] = useState<number>(0);
  
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

  const handleFoliosChange = (value: number[]) => {
    setFolios(value[0]);
  };

  const handleSimpleCopiesChange = (value: number[]) => {
    setSimpleCopies(value[0]);
  };

  const handleAuthorizedCopiesChange = (value: number[]) => {
    setAuthorizedCopies(value[0]);
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    } else if (e.target.value === '') {
      setter(0);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    
    if (documentType !== 'poderes' && (!amount || isNaN(amountValue))) {
      toast.error('Por favor, introduzca un valor válido');
      return;
    }
    
    if (documentType !== 'poderes' && amountValue <= 0) {
      toast.error('El valor debe ser mayor que cero');
      return;
    }
    
    const fee = calculateNotaryFee(documentType, documentType === 'poderes' ? 0 : amountValue);
    const foliosCost = calculateFoliosCost(folios);
    const simpleCopiesCost = calculateSimpleCopiesCost(simpleCopies);
    const authorizedCopiesCost = calculateAuthorizedCopiesCost(authorizedCopies);
    
    setNotaryFee(fee);
    setFoliosCost(foliosCost);
    setSimpleCopiesCost(simpleCopiesCost);
    setAuthorizedCopiesCost(authorizedCopiesCost);
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Folios ({folios})
          </label>
          <div className="flex items-center gap-4">
            <Slider
              defaultValue={[10]}
              max={100}
              step={1}
              value={[folios]}
              onValueChange={handleFoliosChange}
              className="flex-grow"
            />
            <Input
              type="number"
              value={folios}
              onChange={(e) => handleNumericInputChange(e, setFolios)}
              className="w-20"
              min={1}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Copias simples ({simpleCopies})
          </label>
          <div className="flex items-center gap-4">
            <Slider
              defaultValue={[1]}
              max={10}
              step={1}
              value={[simpleCopies]}
              onValueChange={handleSimpleCopiesChange}
              className="flex-grow"
            />
            <Input
              type="number"
              value={simpleCopies}
              onChange={(e) => handleNumericInputChange(e, setSimpleCopies)}
              className="w-20"
              min={0}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Copias autorizadas ({authorizedCopies})
          </label>
          <div className="flex items-center gap-4">
            <Slider
              defaultValue={[1]}
              max={10}
              step={1}
              value={[authorizedCopies]}
              onValueChange={handleAuthorizedCopiesChange}
              className="flex-grow"
            />
            <Input
              type="number"
              value={authorizedCopies}
              onChange={(e) => handleNumericInputChange(e, setAuthorizedCopies)}
              className="w-20"
              min={0}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900">
          Calcular honorarios
        </Button>
      </form>

      {hasCalculated && (
        <NotaryCalculatorResult 
          notaryFee={notaryFee}
          documentType={selectedDocumentName}
          foliosCost={foliosCost}
          folios={folios}
          simpleCopiesCost={simpleCopiesCost}
          simpleCopies={simpleCopies}
          authorizedCopiesCost={authorizedCopiesCost}
          authorizedCopies={authorizedCopies}
        />
      )}
    </div>
  );
};

export default NotaryCalculatorForm;

