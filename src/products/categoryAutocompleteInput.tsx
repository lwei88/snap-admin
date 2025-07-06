import { useEffect } from "react";
import {
  AutocompleteInput,
  ListContextProvider,
  ResourceContextProvider,
  useGetList,
  useList,
} from "react-admin";
import { useFormContext } from "react-hook-form";

const CategoryAutocompleteInput = ({ defaultCategoryId = 0 }) => {
  const { setValue } = useFormContext();

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

  useEffect(() => {
    if (categories && categories.length > 0 && defaultCategoryId > 0) {
      console.log("defaultCategoryId:", defaultCategoryId);
      setValue("category_id", defaultCategoryId);
    }
  }, [defaultCategoryId, setValue, categories]);

  useEffect(() => {
    console.log("Categories fetched:", categories);
    console.log("defaultCategoryId:", defaultCategoryId);
  }, []);

  const optionRenderer = (choice: any) => `${choice.id} - ${choice.name}`;
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
