const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
    const isBoolean = typeof isFavourite === 'boolean';
    if (!isBoolean) return;
}

export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;
    const parsedType = parseType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};
