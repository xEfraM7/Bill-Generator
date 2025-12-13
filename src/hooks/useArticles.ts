import { Article, DataForm } from "@/types/FormTypes";
import { useCallback } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

const useArticles = (
  watch: UseFormWatch<DataForm>,
  setValue: UseFormSetValue<DataForm>
) => {
  const handleChangeArticle = useCallback(
    (article: Article) => {
      const currentArticles = watch("articles");
      const articleExist = currentArticles.find((e) => e.id === article.id) !== undefined;
      
      if (articleExist) {
        setValue(
          "articles",
          currentArticles.map((e) => (e.id === article.id ? article : e))
        );
      } else {
        setValue("articles", [...currentArticles, article]);
      }
    },
    [watch, setValue]
  );

  const handleRemoveArticle = useCallback(
    (article: Article) => {
      const currentArticles = watch("articles");
      setValue(
        "articles",
        currentArticles.filter((e) => e.id !== article.id)
      );
    },
    [watch, setValue]
  );

  return { handleChangeArticle, handleRemoveArticle };
};

export default useArticles;
