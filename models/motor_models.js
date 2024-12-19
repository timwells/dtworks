const STATION_PUMP_MOTOR_MODEL_NAME = "PumpStationMotorModel";
const STATION_PUMP_MOTOR_MODEL_DESCRIPTION = "Model for monitoring rotating pump machinery with predictive maintenance.";

// Define the properties for the asset model
const STATION_PUMP_MOTOR_MODEL_PROPERTIES = [
    { name: "Name", dataType: "STRING", type: { attribute: { defaultValue: "Generic Motor" } } },
    { name: "Type", dataType: "STRING", type: { attribute: { defaultValue: "AC Induction" } } },
    { name: "Output Rating", dataType: "STRING", type: { attribute: { defaultValue: "30 kW" } } },
    { name: "Voltage Rating", dataType: "STRING", type: { attribute: { defaultValue: "400V" } } },
    { name: "Current Rating", dataType: "STRING", type: { attribute: { defaultValue: "45 A" } } },
    { name: "Frequency Rating", dataType: "STRING", type: { attribute: { defaultValue: "50 Hz" } } },
    { name: "Speed Rating", dataType: "STRING", type: { attribute: { defaultValue: "1500 RPM" } } },
    { name: "Efficiency", dataType: "STRING", type: { attribute: { defaultValue: "IE3" } } },
    { name: "FrameSize", dataType: "STRING", type: { attribute: { defaultValue: "IEC 180M" } } },
    { name: "Mounting Type", dataType: "STRING", type: { attribute: { defaultValue: "B3 Foot-mounted" } } },
    { name: "Ingress", dataType: "STRING", type: { attribute: { defaultValue: "IP55" } } },
    { name: "Insulation Class", dataType: "STRING", type: { attribute: { defaultValue: "Class F" } } },
    { name: "Ambient Temperature", dataType: "STRING", type: { attribute: { defaultValue: "-20°C to 40°C" } } },
    { name: "Weight", dataType: "STRING", type: { attribute: { defaultValue: "250 kg" } } },
    { name: "Serial", dataType: "STRING", type: { attribute: { defaultValue: "SN12345678" } } },
    { name: "Vendor", dataType: "STRING", type: { attribute: { defaultValue: "Industrial Motors Inc." } } },
    { name: "Installed", dataType: "STRING", type: { attribute: { defaultValue: "2023-01-15" } } },
    { name: "Installer", dataType: "STRING", type: { attribute: { defaultValue: "XYZ Installation Co." } } },
    { name: "Last Inspection", dataType: "STRING", type: { attribute: { defaultValue: "2024-12-10" } } },
    { name: "Last Inspector", dataType: "STRING", type: { attribute: { defaultValue: "Inspector Joe Doe" } } },
    { name: "Comments", dataType: "STRING", type: { attribute: { defaultValue: "No issues detected" } } },
    {
        name: "Temperature",
        dataType: "DOUBLE",
        unit: "°C",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Vibration",
        dataType: "DOUBLE",
        unit: "mm/s",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Speed",
        dataType: "DOUBLE",
        unit: "RPM",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Noise",
        dataType: "DOUBLE",
        unit: "dB",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Torque",
        dataType: "DOUBLE",
        unit: "Nm",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Current",
        dataType: "DOUBLE",
        unit: "A",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Voltage",
        dataType: "DOUBLE",
        unit: "V",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Oil Lubrication",
        dataType: "DOUBLE",
        unit: "ppm",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
    {
        name: "Pressure",
        dataType: "DOUBLE",
        unit: "Bar",
        type: { measurement: { processingConfig: { forwardingConfig: { state: "ENABLED" } } } }
    },
];


module.exports = { 
    STATION_PUMP_MOTOR_MODEL_NAME,
    STATION_PUMP_MOTOR_MODEL_DESCRIPTION,
    STATION_PUMP_MOTOR_MODEL_PROPERTIES,
}