import { generateTypeError } from "./generateError";

const getDataTypeOf = (data) => {
  // Refer to https://javascript.info/instanceof#bonus-object-prototype-tostring-for-the-type

  let actualDataType = '';

  actualDataType = Object.prototype.toString.call(data);
  actualDataType = actualDataType.slice(actualDataType.indexOf(' ') + 1, -1);

  return actualDataType;
}

const validateDataType = (data, dataName, expectedDataTypes) => {
  let actualDataType = getDataTypeOf(data);

  const isOfExpectedDataType = expectedDataTypes.some(expectedDataType => expectedDataType.toLowerCase() === actualDataType.toLowerCase());

  if (!isOfExpectedDataType)
    throw generateTypeError(dataName, actualDataType, expectedDataTypes);

  return data;
}

export { getDataTypeOf, validateDataType };
