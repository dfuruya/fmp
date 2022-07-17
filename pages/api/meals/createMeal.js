import { supabase } from "../../../lib/initSupabase";

const createMeal = async (params) => {
  const item = {
    name: params.name.trim(),
    ingredients: params.ingredients,
    description: params.description,
  }
  if (item.name) {
    const { data } = await supabase
      .from("meals")
      .insert([item])
      .single();
      // .select("id, name, created, modified, description, tags, ingredients");
  
    return data
  }

  return null
}

export default createMeal
