import { useEffect, useState } from "react";
import {
  AutocompleteArrayInput,
  ListContextProvider,
  ReferenceArrayInput,
  ResourceContextProvider,
  useGetList,
  useGetMany,
  useList,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "../utils/useDebounce";

const IngredientAutocompleteInput = () => {
  const [searchIngredient, setSearchIngredient] = useState("");
  const debouncedSearchIngredient = useDebounce(searchIngredient, 1000);
  const { watch } = useFormContext();

  // fetch full list of ingredients
  const {
    data: ingredients = [],
    error: ingredientsError,
    isPending: ingredientsIsPending,
  } = useGetList("ingredients", {
    pagination: { page: 1, perPage: 20 },
    sort: { field: "id", order: "ASC" },
    filter: { "title@ilike": `%${debouncedSearchIngredient}%` },
  });
  const ingredientsListContext = useList({
    data: ingredients,
    error: ingredientsError,
    isPending: ingredientsIsPending,
  });

  // fetch selected product ingredients from ingredients
  const {
    data: productIngredients = [],
    isPending: productIngredientsIsPending,
  } = useGetMany("ingredients", { ids: watch("ingredient_ids") });

  const allChoices = [
    ...productIngredients.filter(
      (ingredient) => !ingredients?.find((c) => c.id === ingredient.id),
    ),
    ...ingredients,
  ];

  return (
    <ResourceContextProvider value="ingredients">
      <ListContextProvider value={ingredientsListContext}>
        <AutocompleteArrayInput
          source="ingredient_ids"
          choices={allChoices}
          optionText="title"
          optionValue="id"
          inputValue={searchIngredient}
          onInputChange={(_event, value) => {
            setSearchIngredient(value);
          }}
          isPending={ingredientsIsPending || productIngredientsIsPending}
        />
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export { IngredientAutocompleteInput };
