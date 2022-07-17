import { supabase } from "../../../lib/initSupabase";

const deleteIngredient = async (id) => {
  const { error } = await supabase
    .from("ingredients")
    .delete({ returning: "minimal" })
    .match({ id });

  if (!error) {
    return {};
  }

  return null
}

export default deleteIngredient
