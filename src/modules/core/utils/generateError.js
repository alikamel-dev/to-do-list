import { markAsCode, markDataTypeIdentifierAsCode } from "./formatCode";

// Function to return an error (Object of type `Error` or of subtypes of `Error`)

const generateError = (errorMessage, errorType = Error) => {
  return new errorType(errorMessage);
}

// Functions to generate specific types of errors (Objects of subtypes of `Error`)

const generateTypeError = (dataName, actualDataType, expectedDataTypes) => {
  const expectedDataTypesMarkedAsCode = expectedDataTypes.map(expectedDataType => markDataTypeIdentifierAsCode(expectedDataType));
  const expectedDataTypesMarkedAsCodeString = expectedDataTypesMarkedAsCode.join(', ');

  const errorMessage = `${markAsCode(dataName)} is expected to be of the following type(s): ${expectedDataTypesMarkedAsCodeString} (actual type: ${markDataTypeIdentifierAsCode(actualDataType)}).`;

  return generateError(errorMessage, TypeError);
}

export { 
  generateError,

  generateTypeError,
};
