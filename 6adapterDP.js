// // Target Interface for Data Processing
// class DataProcessor {
//     processData(data) {
//         throw new Error('processData method must be implemented');
//     }
// }

// // Existing Legacy Data Source with Incompatible Interface
// class LegacyDataSource {
//     extractRawData() {
//         return {
//             user_id: 'USR_001',
//             raw_customer_data: {
//                 name: 'john doe',
//                 age: 30,
//                 registration_date: '2023-01-15T10:30:00Z'
//             },
//             transaction_history: [
//                 { amount: 100.50, date: '2023-02-01' },
//                 { amount: 250.75, date: '2023-02-15' }
//             ]
//         };
//     }
// }

// // Data Transformation Adapter
// class CustomerDataAdapter extends DataProcessor {
//     constructor(legacyDataSource) {
//         super();
//         this.legacyDataSource = legacyDataSource;
//     }

//     processData() {
//         const rawData = this.legacyDataSource.extractRawData();
        
//         // Transform legacy data to a standardized, clean format
//         return {
//             id: rawData.user_id,
//             personalInfo: {
//                 fullName: this.formatName(rawData.raw_customer_data.name),
//                 age: rawData.raw_customer_data.age,
//                 registrationDate: new Date(rawData.raw_customer_data.registration_date)
//             },
//             financials: {
//                 totalTransactions: rawData.transaction_history.length,
//                 totalSpent: this.calculateTotalSpent(rawData.transaction_history),
//                 averageTransactionValue: this.calculateAverageTransactionValue(rawData.transaction_history)
//             }
//         };
//     }

//     // Helper methods for data transformation
//     formatName(name) {
//         return name.split(' ')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//             .join(' ');
//     }

//     calculateTotalSpent(transactions) {
//         return transactions.reduce((total, transaction) => total + transaction.amount, 0);
//     }

//     calculateAverageTransactionValue(transactions) {
//         if (transactions.length === 0) return 0;
//         return this.calculateTotalSpent(transactions) / transactions.length;
//     }
// }

// // Client code to demonstrate the adapter
// function demonstrateDataTransformationAdapter() {
//     console.log('Data Transformation Adapter Demo:');
    
//     // Create legacy data source
//     const legacyDataSource = new LegacyDataSource();
    
//     // Use adapter to transform data
//     const dataAdapter = new CustomerDataAdapter(legacyDataSource);
    
//     // Process and display transformed data
//     const processedData = dataAdapter.processData();
//     console.log(JSON.stringify(processedData, null, 2));
// }

// // Run the demonstration
// demonstrateDataTransformationAdapter();







// Target Interface (US Electrical Standard)
class USElectricalSocket {
    connect(device) {
        throw new Error('Must implement connect method');
    }
}

// Adaptee (European Electrical Standard)
class EuropeanPowerOutlet {
    supplyPower(voltage, frequency) {
        return `Supplying ${voltage}V at ${frequency}Hz (European Standard)`;
    }
}

// Voltage Conversion Utility
class VoltageConverter {
    static convertVoltage(inputVoltage, inputFrequency) {
        // Simulate voltage and frequency conversion
        const convertedVoltage = inputVoltage * 0.8; // Simulate conversion
        const convertedFrequency = inputFrequency === 50 ? 60 : 50;
        
        return {
            voltage: Math.round(convertedVoltage),
            frequency: convertedFrequency
        };
    }
}

// Electrical Plug Adapter
class InternationalTravelAdapter extends USElectricalSocket {
    constructor(europeanOutlet) {
        super();
        this.europeanOutlet = europeanOutlet;
    }

    connect(device) {
        // Device specifications (example)
        const deviceRequirements = {
            voltage: 120,
            frequency: 60,
            maxWattage: 1000
        };

        // Convert voltage and frequency
        const convertedPower = VoltageConverter.convertVoltage(
            deviceRequirements.voltage, 
            deviceRequirements.frequency
        );

        // Use European outlet with converted standards
        const powerSupply = this.europeanOutlet.supplyPower(
            convertedPower.voltage, 
            convertedPower.frequency
        );

        return `Adapter connected: ${powerSupply} - Device: ${device}`;
    }
}

// Devices to demonstrate the adapter
class Laptop {
    constructor(name, voltage, frequency) {
        this.name = name;
        this.voltage = voltage;
        this.frequency = frequency;
    }

    toString() {
        return `${this.name} (${this.voltage}V, ${this.frequency}Hz)`;
    }
}

// Demonstration function
function demonstrateElectricalAdapter() {
    console.log('Electrical Plug Adapter Demo:');
    
    // Create European power outlet
    const europeanOutlet = new EuropeanPowerOutlet();
    
    // Create international travel adapter
    const travelAdapter = new InternationalTravelAdapter(europeanOutlet);
    
    // Create devices
    const macbook = new Laptop('MacBook Pro', 120, 60);
    const thinkpad = new Laptop('Lenovo ThinkPad', 230, 50);
    
    // Demonstrate connecting devices using the adapter
    console.log(travelAdapter.connect(macbook));
    console.log(travelAdapter.connect(thinkpad));
}

// Run the demonstration
demonstrateElectricalAdapter();