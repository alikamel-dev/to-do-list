// Functions for formatting code

const markAsCode = (singleLineCode) => {
  return `\`${singleLineCode}\``;
}

// (1) Functions for formatting and marking up data type identifiers

const formatDataTypeIdentifier = (dataTypeIdentifier) => (dataTypeIdentifier.charAt(0).toUpperCase() + dataTypeIdentifier.slice(1).toLowerCase());
const markDataTypeIdentifierAsCode = (dataTypeIdentifier) => markAsCode(formatDataTypeIdentifier(dataTypeIdentifier));

export {
  markAsCode,

  formatDataTypeIdentifier,
  markDataTypeIdentifierAsCode,
}
