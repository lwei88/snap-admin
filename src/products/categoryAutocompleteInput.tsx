import {
  AutocompleteInput,
  ListContextProvider,
  ResourceContextProvider,
  useGetList,
  useList,
} from "react-admin";

const CategoryAutocompleteInput = () => {
  // fetch full list of ingredients
  const {
    data: categories = [],
    error: categoriesError,
    isPending: categoriesIsPending,
  } = useGetList("categories", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
  });
  const categoriesListContext = useList({
    data: categories,
    error: categoriesError,
    isPending: categoriesIsPending,
  });

  const optionRenderer = (choice: any) => `${choice.id} - ${choice.name}`;
  if (categoriesIsPending) return null;
  return (
    <ResourceContextProvider value="categories">
      <ListContextProvider value={categoriesListContext}>
        <AutocompleteInput
          source="category_id"
          choices={categories}
          noOptionsText="Type to search categories"
          optionText={optionRenderer}
          optionValue="id"
          debounce={800}
          isPending={categoriesIsPending}
          shouldRenderSuggestions={(val: string) => {
            return val.trim().length > 3;
          }}
        />
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export { CategoryAutocompleteInput };
