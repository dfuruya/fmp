import { supabase } from "../../../lib/initSupabase";

const getIngredient = async (ingredientId) => {
  const { data } = await supabase
    .from("ingredients")
    .select("id, name, ndb_no, in_stock, tags")
    .eq("id", ingredientId)
    .single();
    // .select("id, name, created, modified, description, tags, ingredients");

    return data
}

export default getIngredient
