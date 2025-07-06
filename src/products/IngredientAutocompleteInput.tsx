import { useEffect, useState } from "react";
import {
  AutocompleteArrayInput,
  ListContextProvider,
  ResourceContextProvider,
  useGetList,
  useGetMany,
  useList,
} from "react-admin";
import { useDebounce } from "../utils/useDebounce";
import { useFormContext } from "react-hook-form";

interface IngredientAutocompleteInputProps {
  defaultIngredientIds?: number[];
}

const IngredientAutocompleteInput = ({
  defaultIngredientIds = [],
}: IngredientAutocompleteInputProps) => {
  const { setValue } = useFormContext();
  const [searchIngredient, setSearchIngredient] = useState("");
  const debouncedSearchIngredient = useDebounce(searchIngredient, 800);

  const [currentSelectedIngredientIds, setCurrentSelectedIngredientIds] =
    useState<number[]>([]);

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
  } = useGetMany("ingredients", { ids: currentSelectedIngredientIds });

  const combinedChoices = [
    ...productIngredients.filter(
      (ingredient) => !ingredients?.find((c) => c.id === ingredient.id),
    ),
    ...ingredients,
  ];

  useEffect(() => {
    if (
      combinedChoices &&
      combinedChoices.length > 0 &&
      defaultIngredientIds &&
      defaultIngredientIds.length > 0
    ) {
      console.log("Setting default ingredient ids:", defaultIngredientIds);
      console.log("Current selected ingredient ids:", productIngredients);
      setValue("ingredient_ids", defaultIngredientIds);
      setCurrentSelectedIngredientIds(defaultIngredientIds);
    }
  }, [defaultIngredientIds, setValue, combinedChoices]);

  return (
    <ResourceContextProvider value="ingredients">
      <ListContextProvider value={ingredientsListContext}>
        <AutocompleteArrayInput
          source="ingredient_ids"
          choices={combinedChoices}
          optionText="title"
          optionValue="id"
          onInputChange={(_event, value) => {
            setSearchIngredient(value);
          }}
          onChange={(value: any) => {
            setCurrentSelectedIngredientIds(value);
          }}
          isPending={ingredientsIsPending || productIngredientsIsPending}
        />
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export { IngredientAutocompleteInput };
