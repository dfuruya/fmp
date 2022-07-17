import { supabase } from "../../../lib/initSupabase";

const updateMeal = async ({id, name, description, ingredients}) => {
  const { error } = await supabase
    .from("meals")
    .update({ name, description, ingredients })
    .eq('id', id);

  if (!error) {
    return {};
  }

  return null
}

export default updateMeal
