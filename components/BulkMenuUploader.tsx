import React, { useRef, useContext } from 'react';
import type { MenuItem, OrderContextType } from '../types';
import { OrderContext } from '../App';
import UploadIcon from './icons/UploadIcon';

// This script is loaded from a CDN in index.html
declare const XLSX: any;

const BulkMenuUploader: React.FC = () => {
    const context = useContext(OrderContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!context) return null;
    const { bulkAddMenuItems } = context as OrderContextType;

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    alert('The selected file is empty or in an incorrect format.');
                    return;
                }

                // FIX: Add an explicit return type to the map callback. This helps TypeScript correctly
                // infer the type of `item` in the subsequent `.filter()` call, resolving the type predicate error.
                const newMenuItems: Omit<MenuItem, 'id'>[] = json.map((row, index): Omit<MenuItem, 'id'> | null => {
                    if (!row.name || !row.category || row.price === undefined || row.price === null) {
                        console.warn(`Skipping invalid row ${index + 2}: Missing required fields (name, category, price). Data:`, row);
                        return null;
                    }
                    const price = parseFloat(row.price);
                    if (isNaN(price)) {
                         console.warn(`Skipping invalid row ${index + 2}: Price is not a valid number. Data:`, row);
                        return null;
                    }
                    
                    // Coerce 'isAvailable' from various possible formats (TRUE, true, 'true', 1, '1')
                    const availabilityStr = String(row.isAvailable).toLowerCase().trim();
                    const isAvailable = availabilityStr === 'true' || availabilityStr === '1';

                    return {
                        name: String(row.name),
                        description: String(row.description || ''),
                        price: price,
                        category: String(row.category),
                        image: String(row.image || 'https://i.ibb.co/9yL6w3b/placeholder.png'),
                        isAvailable: row.isAvailable !== undefined ? isAvailable : true, // Default to true if column is missing
                        modifiers: [] // Modifiers are not supported in bulk upload
                    };
                }).filter((item): item is Omit<MenuItem, 'id'> => item !== null);

                if (newMenuItems.length > 0) {
                    if (window.confirm(`Found ${newMenuItems.length} valid items to import. Do you want to add them to the menu? This will not replace existing items.`)) {
                        bulkAddMenuItems(newMenuItems);
                        alert('Menu items imported successfully!');
                    }
                } else {
                    alert('No valid menu items could be read from the file. Please check the file format and column headers (name, category, price are required).');
                }

            } catch (error) {
                console.error("Error processing file:", error);
                alert(`Failed to import file. Make sure it's a valid .xlsx or .csv file. Error: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                if(event.target) event.target.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="border-b pb-6 mb-2">
             <h4 className="text-lg font-semibold text-gray-700 mb-2">Bulk Management</h4>
            <p className="text-sm text-gray-600 mb-3">
                Quickly add multiple items by uploading a <code>.xlsx</code> or <code>.csv</code> file.
                Required columns: <strong>name</strong>, <strong>price</strong>, <strong>category</strong>.
                Optional columns: <strong>description</strong>, <strong>image</strong> (URL), <strong>isAvailable</strong> (true/false).
            </p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <button
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2 rounded-lg hover:opacity-90"
            >
                <UploadIcon />
                Import from Sheet
            </button>
        </div>
    );
};

export default BulkMenuUploader;