const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);
  if (isType(type)) return type;
};

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;
    const parsedType = parseType(contactType);

    return {
        contactType: parsedType,
        isFavourite,
    };
};
