import { markAsCode, markDataTypeIdentifierAsCode } from "./formatCode";

const generateTypeError = (dataName, actualDataType, expectedDataTypes) => {
  const expectedDataTypesMarkedAsCode = expectedDataTypes.map(expectedDataType => markDataTypeIdentifierAsCode(expectedDataType));
  const expectedDataTypesMarkedAsCodeString = expectedDataTypesMarkedAsCode.join(', ');

  const errorMessage = `${markAsCode(dataName)} is expected to be of the following type(s): ${expectedDataTypesMarkedAsCodeString} (actual type: ${markDataTypeIdentifierAsCode(actualDataType)}).`;

  return new TypeError(errorMessage);
}

export { generateTypeError };
