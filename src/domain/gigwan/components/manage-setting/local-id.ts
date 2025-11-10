let localIdCounter = 0;

export const createLocalId = () => {
  localIdCounter += 1;
  return `local-${Date.now()}-${localIdCounter}`;
};
