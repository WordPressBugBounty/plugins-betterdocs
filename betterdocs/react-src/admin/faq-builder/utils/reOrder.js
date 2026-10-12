export const categoryOrdering = (result, sortableCategories, currentPage, perPage) => {
    const cats = sortableCategories.map((cat) => ({
        id: cat?.id,
        current_position: cat?.meta?.order[0],
    }));
    let reOrderedCats = [];
    let startIndex    = currentPage != 1 ? ((( perPage * currentPage ) + 1) - 10) : currentPage;
    cats?.splice(result?.destination?.index, 0, ...cats?.splice(result?.source?.index, 1));
    for( let i = 0; i < cats?.length; i++ ) {
        reOrderedCats.push({
            ...cats[i],
            updated_position: (startIndex).toString(),
        });
        startIndex++;
    }
    return reOrderedCats;
}

export const faqOrdering = (result, sortedFaqList) => {
  const startIndex = result.source.index;
  const endIndex = result.destination.index;

  let data = [...sortedFaqList];
  let [removed] = data.splice(startIndex, 1);
  data.splice(endIndex, 0, removed);
  return data;
};
